/**
 * Midnight Wallet Context
 *
 * Uses the official @midnight-ntwrk/dapp-connector-api types.
 * Wallets inject InitialAPI at window.midnight[walletId].
 * Each wallet has .connect(networkId) → ConnectedAPI.
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import '@midnight-ntwrk/dapp-connector-api';
import type { InitialAPI, ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';

interface MidnightWalletState {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  provider: MidnightProvider | null;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
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
  if (typeof window === 'undefined' || !window.midnight) return [];
  return Object.values(window.midnight).filter(Boolean) as InitialAPI[];
}

export function MidnightWalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<MidnightProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const wallets = findAllWallets();
      console.log('[Midnight] Found wallets:', wallets.map(w => `${w.name} (${w.rdns}, v${w.apiVersion})`));

      if (wallets.length === 0) {
        // Demo mode
        console.log('[Midnight] No wallets found, using demo mode');
        const DEMO_ADDRESS = 'mn_addr_preprod13zlyk4cr9qqygx3h5swk6xl2lk80vv0ut874ze66fhx3xda0umtqdt24za';

        // Create a minimal mock for demo
        const mockProvider: MidnightProvider = {
          connectedApi: null as any,
          getAddress: async () => DEMO_ADDRESS,
        };

        setProvider(mockProvider);
        setAddress(DEMO_ADDRESS);
        setIsConnected(true);
        return;
      }

      // Pick the first available wallet (or the one named Lace)
      const wallet = wallets.find(w => w.name.toLowerCase().includes('lace')) || wallets[0];
      console.log('[Midnight] Connecting to:', wallet.name);

      const connectedApi = await wallet.connect('preprod');
      console.log('[Midnight] Connected to', wallet.name);

      // Get address
      let walletAddress: string;
      try {
        const shielded = await connectedApi.getShieldedAddresses();
        walletAddress = shielded.shieldedAddress;
      } catch {
        const unshielded = await connectedApi.getUnshieldedAddress();
        walletAddress = unshielded.unshieldedAddress;
      }

      console.log('[Midnight] Wallet address:', walletAddress);

      const realProvider: MidnightProvider = {
        connectedApi,
        getAddress: async () => walletAddress,
      };

      setProvider(realProvider);
      setAddress(walletAddress);
      setIsConnected(true);
    } catch (err) {
      console.error('[Midnight] Connection failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setProvider(null);
    setAddress(null);
    setIsConnected(false);
    setError(null);
  }, []);

  const value: MidnightWalletState = {
    isConnected,
    isConnecting,
    address,
    provider,
    error,
    connect,
    disconnect,
  };

  return (
    <MidnightWalletContext.Provider value={value}>
      {children}
    </MidnightWalletContext.Provider>
  );
}
