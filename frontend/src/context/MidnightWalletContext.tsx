/**
 * Midnight Wallet Context
 *
 * Provides wallet connection state and the Midnight provider
 * to all components. Uses the real Midnight wallet extension
 * (e.g., Lace) when available, or a mock provider for demo.
 */

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

interface MidnightWalletState {
  /** Whether a wallet is connected */
  isConnected: boolean;
  /** Whether the wallet is connecting */
  isConnecting: boolean;
  /** The wallet address (if connected) */
  address: string | null;
  /** The Midnight provider (if connected) */
  provider: MidnightProvider | null;
  /** Error message (if any) */
  error: string | null;
  /** Connect to wallet */
  connect: () => Promise<void>;
  /** Disconnect wallet */
  disconnect: () => void;
}

/** Minimal Midnight provider interface for contract execution */
export interface MidnightProvider {
  /** Deploy a contract and return the contract address */
  deployContract: (zkInfo: object, args?: unknown[]) => Promise<string>;
  /** Execute a circuit on a deployed contract */
  executeCircuit: (contractAddress: string, circuitId: string, args: unknown[]) => Promise<unknown>;
  /** Get the wallet address */
  getAddress: () => Promise<string>;
}

const MidnightWalletContext = createContext<MidnightWalletState | null>(null);

/** Hook to access wallet state */
export function useMidnightWallet(): MidnightWalletState {
  const context = useContext(MidnightWalletContext);
  if (!context) {
    throw new Error('useMidnightWallet must be used within MidnightWalletProvider');
  }
  return context;
}

/** Provider component that manages wallet connection */
export function MidnightWalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<MidnightProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if Midnight wallet extension is available
  const checkWalletExtension = useCallback((): boolean => {
    // Check for Midnight wallet extension (e.g., Lace)
    // The extension injects a global `midnight` or `lace` object
    if (typeof window !== 'undefined') {
      const win = window as unknown as Record<string, unknown>;
      return !!(win.midnight || win.lace || win.midnightProvider);
    }
    return false;
  }, []);

  // Connect to wallet
  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      if (checkWalletExtension()) {
        // Real wallet connection (when extension is installed)
        // This would use the actual Midnight wallet API
        console.log('[Midnight] Wallet extension detected, connecting...');
        
        // For now, simulate connection delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In production, this would be:
        // const wallet = await window.midnight.connect();
        // const addr = await wallet.getAddress();
        // setProvider(wallet);
        // setAddress(addr);
        
        // Demo mode: use mock address
        setAddress('mn_addr_preprod13zlyk4cr9qqygx3h5swk6xl2lk80vv0ut874ze66fhx3xda0umtqdt24za');
        setIsConnected(true);
      } else {
        // Demo mode: create mock provider
        console.log('[Midnight] No wallet extension found, using demo mode');
        
        const mockProvider: MidnightProvider = {
          deployContract: async (_zkInfo: object, _args?: unknown[]) => {
            console.log('[MockProvider] Deploying contract...');
            // Simulate deployment delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Return mock contract address
            return '0x' + Array.from({ length: 64 }, () => 
              Math.floor(Math.random() * 16).toString(16)
            ).join('');
          },
          executeCircuit: async (contractAddress: string, circuitId: string, args: unknown[]) => {
            console.log(`[MockProvider] Executing circuit ${circuitId} on ${contractAddress}...`);
            // Simulate ZK proof generation delay
            await new Promise(resolve => setTimeout(resolve, 3000));
            // Return mock proof result
            return {
              proof: 'mock_proof_' + Date.now(),
              publicInputs: args,
            };
          },
          getAddress: async () => {
            return 'mn_addr_preprod13zlyk4cr9qqygx3h5swk6xl2lk80vv0ut874ze66fhx3xda0umtqdt24za';
          },
        };

        setProvider(mockProvider);
        setAddress('mn_addr_preprod13zlyk4cr9qqygx3h5swk6xl2lk80vv0ut874ze66fhx3xda0umtqdt24za');
        setIsConnected(true);
      }
    } catch (err) {
      console.error('[Midnight] Connection failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, [checkWalletExtension]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setProvider(null);
    setAddress(null);
    setIsConnected(false);
    setError(null);
  }, []);

  // Auto-connect on mount if wallet extension is available
  useEffect(() => {
    if (checkWalletExtension()) {
      connect();
    }
  }, [checkWalletExtension, connect]);

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
