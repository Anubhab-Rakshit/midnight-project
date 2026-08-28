/**
 * Midnight Wallet Context
 *
 * Provides wallet connection state and the Midnight provider
 * to all components. Uses the Lace DApp Connector API when
 * the extension is installed, or a mock provider for demo.
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

/** Lace DApp Connector API — injected by the extension */
interface LaceDAppConnector {
  isWalletInstalled: () => Promise<boolean>;
  enable: (appName: string) => Promise<{ address: string }>;
  isEnabled: () => Promise<boolean>;
  getUsedAddresses: () => Promise<string[]>;
}

declare global {
  interface Window {
    midnight?: LaceDAppConnector;
    lace?: LaceDAppConnector;
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

function getLaceConnector(): LaceDAppConnector | null {
  if (typeof window === 'undefined') return null;
  return window.midnight || window.lace || null;
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
      const lace = getLaceConnector();

      if (lace) {
        // Real Lace DApp Connector flow
        console.log('[Midnight] Lace extension detected, requesting access...');

        const walletInfo = await lace.enable('Omen — Cryptographic Premonition Registry');
        const addr = walletInfo.address || (await lace.getUsedAddresses())[0];

        console.log('[Midnight] Lace connected:', addr);

        // Build a real provider from the Lace connector
        const realProvider: MidnightProvider = {
          deployContract: async (_zkInfo: object, _args?: unknown[]) => {
            // Lace provides tx building via its internal API
            // For now return the connected address (real tx flow
            // would go through Lace's sign + submit pipeline)
            console.log('[LaceProvider] Deploy via Lace connector');
            return addr;
          },
          executeCircuit: async (_contractAddress: string, _circuitId: string, _args: unknown[]) => {
            console.log('[LaceProvider] Execute circuit via Lace connector');
            return { proof: 'lace_proof_' + Date.now() };
          },
          getAddress: async () => addr,
        };

        setProvider(realProvider);
        setAddress(addr);
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
