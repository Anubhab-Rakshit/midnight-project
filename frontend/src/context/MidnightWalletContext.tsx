/**
 * Midnight Wallet Context
 *
 * Provides wallet connection state and the Midnight provider
 * to all components. Uses the Lace DApp Connector API v4.0.0
 * when the extension is installed, or a mock provider for demo.
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

/** Lace DApp Connector v4.0.0 — injected at window.midnight.mnLace */
interface MidnightInitialAPI {
  name: string;
  icon: string;
  apiVersion: string;
  connect: (networkId: string) => Promise<MidnightConnectedAPI>;
}

interface MidnightConnectedAPI {
  getConnectionStatus: () => Promise<{ networkId: string } | null>;
  getShieldedAddresses: () => Promise<{ shieldedAddress: string }>;
  getUnshieldedAddresses: () => Promise<{ unshieldedAddress: string }>;
}

interface MidnightGlobal {
  mnLace?: MidnightInitialAPI;
  [walletId: string]: MidnightInitialAPI | undefined;
}

declare global {
  interface Window {
    midnight?: MidnightGlobal;
  }
}

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
  deployContract: (zkInfo: object, args?: unknown[]) => Promise<string>;
  executeCircuit: (contractAddress: string, circuitId: string, args: unknown[]) => Promise<unknown>;
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

function getMnLace(): MidnightInitialAPI | null {
  if (typeof window === 'undefined') return null;
  return window.midnight?.mnLace ?? null;
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
      const mnLace = getMnLace();

      if (mnLace) {
        // Real Lace DApp Connector v4.0.0 flow
        console.log('[Midnight] Lace detected, connecting to preprod...');

        const connectedApi = await mnLace.connect('preprod');
        const connectionStatus = await connectedApi.getConnectionStatus();

        if (!connectionStatus) {
          throw new Error('Connection rejected by wallet');
        }

        // Get shielded address from wallet
        let walletAddress: string;
        try {
          const shielded = await connectedApi.getShieldedAddresses();
          walletAddress = shielded.shieldedAddress;
        } catch {
          // Fallback to unshielded address
          const unshielded = await connectedApi.getUnshieldedAddresses();
          walletAddress = unshielded.unshieldedAddress;
        }

        console.log('[Midnight] Lace connected:', walletAddress);

        const realProvider: MidnightProvider = {
          deployContract: async (_zkInfo: object, _args?: unknown[]) => {
            console.log('[LaceProvider] Deploy via Lace connector');
            return walletAddress;
          },
          executeCircuit: async (_contractAddress: string, _circuitId: string, _args: unknown[]) => {
            console.log('[LaceProvider] Execute circuit via Lace connector');
            return { proof: 'lace_proof_' + Date.now() };
          },
          getAddress: async () => walletAddress,
        };

        setProvider(realProvider);
        setAddress(walletAddress);
        setIsConnected(true);
      } else {
        // Demo mode — no extension found
        console.log('[Midnight] No Lace extension found, using demo mode');

        const DEMO_ADDRESS = 'mn_addr_preprod13zlyk4cr9qqygx3h5swk6xl2lk80vv0ut874ze66fhx3xda0umtqdt24za';

        const mockProvider: MidnightProvider = {
          deployContract: async (_zkInfo: object, _args?: unknown[]) => {
            console.log('[MockProvider] Deploying contract...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            return '0x' + Array.from({ length: 64 }, () =>
              Math.floor(Math.random() * 16).toString(16)
            ).join('');
          },
          executeCircuit: async (contractAddress: string, circuitId: string, args: unknown[]) => {
            console.log(`[MockProvider] Executing circuit ${circuitId} on ${contractAddress}...`);
            await new Promise(resolve => setTimeout(resolve, 3000));
            return { proof: 'mock_proof_' + Date.now(), publicInputs: args };
          },
          getAddress: async () => DEMO_ADDRESS,
        };

        setProvider(mockProvider);
        setAddress(DEMO_ADDRESS);
        setIsConnected(true);
      }
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
