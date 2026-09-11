/**
 * useMeridianContract Hook
 *
 * Provides contract interaction functions using the Midnight SDK.
 * Bridges the wallet provider to the Meridian splitpool contract circuits.
 */

import { useState, useCallback } from 'react';
import { useMidnightWallet } from '../context/MidnightWalletContext';
import { deployCircle, settleCircle } from '../midnight/service';
import type { SettlementPlan } from '@meridian/netting';

export interface CircleResult {
  inviteRoot: string;
  contractAddress: string;
  txHash: string;
  blockHeight: number;
  proof: unknown;
}

export interface SettleResult {
  txHash: string;
  blockHeight: number;
  settlementHash: string;
}

export function useMeridianContract() {
  const { provider, isConnected } = useMidnightWallet();
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCircle = useCallback(
    async (inviteSecret: string): Promise<CircleResult> => {
      if (!provider || !isConnected) {
        throw new Error('Wallet not connected');
      }
      if (!provider.connectedApi) {
        throw new Error('Connected API unavailable — a real wallet is required for on-chain circle creation');
      }

      setIsExecuting(true);
      setError(null);

      try {
        const deployed = await deployCircle(provider.connectedApi, inviteSecret);

        console.log('[Meridian] Circle deployed on-chain');
        console.log('[Meridian] Contract address:', deployed.contractAddress);
        console.log('[Meridian] Tx hash:', deployed.txHash);

        return {
          inviteRoot: deployed.inviteRoot,
          contractAddress: deployed.contractAddress,
          txHash: deployed.txHash,
          blockHeight: deployed.blockHeight,
          proof: { status: 'deployed', wallet: provider.getAddress(), txHash: deployed.txHash },
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Circle creation failed';
        console.error('[Meridian] Create circle failed:', err);
        setError(message);
        throw new Error(message);
      } finally {
        setIsExecuting(false);
      }
    },
    [provider, isConnected]
  );

  const settle = useCallback(
    async (
      contractAddress: string,
      inviteSecret: string,
      salt: Uint8Array,
      settlementPlan: SettlementPlan,
    ): Promise<SettleResult> => {
      if (!provider || !isConnected) {
        throw new Error('Wallet not connected');
      }
      if (!provider.connectedApi) {
        throw new Error('Connected API unavailable — a real wallet is required for on-chain settlement');
      }

      setIsExecuting(true);
      setError(null);

      try {
        const settled = await settleCircle(
          provider.connectedApi,
          contractAddress,
          inviteSecret,
          salt,
          settlementPlan,
        );

        console.log('[Meridian] Circle settled on-chain');
        console.log('[Meridian] Tx hash:', settled.txHash);
        console.log('[Meridian] Settlement hash:', settled.settlementHash);

        return {
          txHash: settled.txHash,
          blockHeight: settled.blockHeight,
          settlementHash: settled.settlementHash,
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Settlement failed';
        console.error('[Meridian] Settle circle failed:', err);
        setError(message);
        throw new Error(message);
      } finally {
        setIsExecuting(false);
      }
    },
    [provider, isConnected]
  );

  return {
    createCircle,
    settle,
    isExecuting,
    error,
  };
}
