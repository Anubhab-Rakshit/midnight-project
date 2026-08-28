/**
 * useOmenContract Hook
 *
 * Provides contract interaction functions using the Midnight SDK.
 * Bridges the wallet provider to the Omen contract circuits.
 */

import { useState, useCallback } from 'react';
import { useMidnightWallet } from '../context/MidnightWalletContext';
import { deployPremonition } from '../midnight/seal';

export interface SealResult {
  commitmentHash: string;
  contractAddress: string;
  txHash: string;
  blockHeight: number;
  proof: unknown;
}

export function useOmenContract() {
  const { provider, isConnected } = useMidnightWallet();
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sealPremonition = useCallback(
    async (premonition: string, _salt: string): Promise<SealResult> => {
      if (!provider || !isConnected) {
        throw new Error('Wallet not connected');
      }
      if (!provider.connectedApi) {
        throw new Error('Connected API unavailable — a real wallet is required for on-chain sealing');
      }

      setIsExecuting(true);
      setError(null);

      try {
        // Deploy a fresh premonition contract instance with the user's note.
        // The wallet proves, balances and submits the deployment transaction.
        const sealed = await deployPremonition(provider.connectedApi, premonition);

        console.log('[Omen] Premonition deployed on-chain');
        console.log('[Omen] Contract address (commitment):', sealed.contractAddress);
        console.log('[Omen] Tx hash:', sealed.txHash);

        return {
          commitmentHash: sealed.commitmentHash,
          contractAddress: sealed.contractAddress,
          txHash: sealed.txHash,
          blockHeight: sealed.blockHeight,
          proof: { status: 'deployed', wallet: provider.getAddress(), txHash: sealed.txHash },
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Seal failed';
        console.error('[Omen] Seal failed:', err);
        setError(message);
        throw new Error(message);
      } finally {
        setIsExecuting(false);
      }
    },
    [provider, isConnected]
  );

  return {
    sealPremonition,
    isExecuting,
    error,
  };
}
