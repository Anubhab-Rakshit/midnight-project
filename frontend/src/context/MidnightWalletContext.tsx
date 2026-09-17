/**
 * Midnight Wallet Context
 *
 * Uses the official @midnight-ntwrk/dapp-connector-api types.
 * Wallets inject InitialAPI at window.midnight[walletId].
 * Each wallet has .connect(networkId) → ConnectedAPI.
 *
 * Supports multiple wallets (1 AM, Lace, etc.) with a premium picker UI.
 */

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import '@midnight-ntwrk/dapp-connector-api';
import type { InitialAPI, ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';

export interface WalletInfo {
  id: string;
  name: string;
  apiVersion: string;
  isDustFree?: boolean;
}

interface MidnightWalletState {
  isConnected: boolean;
  isConnecting: boolean;
  connectingWalletId: string | null;
  address: string | null;
  balance: number | null;
  isRefreshingBalance: boolean;
  provider: MidnightProvider | null;
  error: string | null;
  availableWallets: WalletInfo[];
  selectedWallet: WalletInfo | null;
  isWalletModalOpen: boolean;
  openWalletModal: () => void;
  closeWalletModal: () => void;
  scanWallets: () => WalletInfo[];
  connect: (walletId?: string) => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
}

export interface MidnightProvider {
  connectedApi: ConnectedAPI;
  getAddress: () => Promise<string>;
}

const MidnightWalletContext = createContext<MidnightWalletState | null>(null);

export function useMidnightWallet(): MidnightWalletState {
  const context = useContext(MidnightWalletContext);
  if (!context) {
    throw new Error('useMidnightWallet must be used within MidnightWalletProvider');
  }
  return context;
}

function findAllWallets(): InitialAPI[] {
  if (typeof window === 'undefined' || !(window as any).midnight) return [];
  const midnight = (window as any).midnight;
  return Object.values(midnight).filter((w): w is InitialAPI => Boolean(w && typeof w === 'object' && 'connect' in w));
}

function mapWallets(raw: InitialAPI[]): WalletInfo[] {
  return raw.map(w => {
    const is1am = w.name.toLowerCase().includes('1am') || w.name.toLowerCase().includes('1 am');
    return {
      id: w.rdns || w.name.toLowerCase().replace(/\s+/g, ''),
      name: w.name,
      apiVersion: w.apiVersion || '4.0.0',
      isDustFree: is1am,
    };
  });
}

export function MidnightWalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingWalletId, setConnectingWalletId] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);
  const [provider, setProvider] = useState<MidnightProvider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [availableWallets, setAvailableWallets] = useState<WalletInfo[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<WalletInfo | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const scanWallets = useCallback((): WalletInfo[] => {
    const rawWallets = findAllWallets();
    const wallets = mapWallets(rawWallets);
    setAvailableWallets(wallets);
    return wallets;
  }, []);

  // Proactively scan on mount and when window gets focus
  useEffect(() => {
    scanWallets();
    const timer = setTimeout(scanWallets, 500);
    const handleFocus = () => scanWallets();
    window.addEventListener('focus', handleFocus);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('focus', handleFocus);
    };
  }, [scanWallets]);

  const openWalletModal = useCallback(() => {
    scanWallets();
    setError(null);
    setIsWalletModalOpen(true);
  }, [scanWallets]);

  const closeWalletModal = useCallback(() => {
    setIsWalletModalOpen(false);
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!provider?.connectedApi) return;
    setIsRefreshingBalance(true);
    try {
      const unshielded = await provider.connectedApi.getUnshieldedBalances();
      const totalDust = Object.values(unshielded).reduce((sum, v) => sum + Number(v), 0);
      setBalance(totalDust / 1_000_000);
    } catch (err) {
      console.warn('[Midnight] Could not refresh balance:', err);
    } finally {
      setIsRefreshingBalance(false);
    }
  }, [provider]);

  const connect = useCallback(async (walletId?: string) => {
    setError(null);

    const rawWallets = findAllWallets();
    const wallets = mapWallets(rawWallets);
    setAvailableWallets(wallets);

    console.log('[Midnight] Found wallets:', wallets.map(w => `${w.name} (v${w.apiVersion})`));

    // If no wallet ID provided and either 0 or multiple wallets exist, open modal
    if (!walletId) {
      if (wallets.length === 1) {
        walletId = wallets[0].id;
      } else {
        setIsWalletModalOpen(true);
        return;
      }
    }

    setIsConnecting(true);
    setConnectingWalletId(walletId);

    try {
      const matched = rawWallets.find(w => {
        const id = w.rdns || w.name.toLowerCase().replace(/\s+/g, '');
        return id === walletId;
      });

      if (!matched) {
        throw new Error(`Wallet "${walletId}" not detected in browser extensions`);
      }

      const walletInfo = wallets.find(w => w.name === matched.name) || {
        id: matched.rdns || matched.name.toLowerCase().replace(/\s+/g, ''),
        name: matched.name,
        apiVersion: matched.apiVersion,
      };

      console.log('[Midnight] Connecting to:', matched.name);

      let connectedApi: ConnectedAPI;
      try {
        connectedApi = await matched.connect('preprod');
      } catch (connectErr: any) {
        if (connectErr?.message?.includes('RemoteApiShutdownError') || connectErr?.message?.includes('feature-flags')) {
          throw new Error(
            'Wallet connection expired. Please unlock your wallet and refresh the page.'
          );
        }
        throw connectErr;
      }
      console.log('[Midnight] Connected to', matched.name);

      // Get address — prefer unshielded (public, verifiable on-chain)
      let walletAddress: string;
      try {
        const unshielded = await connectedApi.getUnshieldedAddress();
        walletAddress = unshielded.unshieldedAddress;
      } catch {
        const shielded = await connectedApi.getShieldedAddresses();
        walletAddress = shielded.shieldedAddress;
      }

      console.log('[Midnight] Wallet address:', walletAddress);

      const realProvider: MidnightProvider = {
        connectedApi,
        getAddress: async () => walletAddress,
      };

      try {
        const unshielded = await connectedApi.getUnshieldedBalances();
        const totalDust = Object.values(unshielded).reduce((sum, v) => sum + Number(v), 0);
        setBalance(totalDust / 1_000_000);
      } catch (err) {
        console.warn('[Midnight] Could not fetch balance:', err);
        setBalance(0);
      }

      setSelectedWallet(walletInfo);
      setProvider(realProvider);
      setAddress(walletAddress);
      setIsConnected(true);
      setIsWalletModalOpen(false);
    } catch (err) {
      console.error('[Midnight] Connection failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
      setConnectingWalletId(null);
    }
  }, []);

  const disconnect = useCallback(() => {
    setProvider(null);
    setAddress(null);
    setBalance(null);
    setSelectedWallet(null);
    setIsConnected(false);
    setError(null);
  }, []);

  const value: MidnightWalletState = {
    isConnected,
    isConnecting,
    connectingWalletId,
    address,
    balance,
    isRefreshingBalance,
    provider,
    error,
    availableWallets,
    selectedWallet,
    isWalletModalOpen,
    openWalletModal,
    closeWalletModal,
    scanWallets,
    connect,
    disconnect,
    refreshBalance,
  };

  return (
    <MidnightWalletContext.Provider value={value}>
      {children}
    </MidnightWalletContext.Provider>
  );
}

