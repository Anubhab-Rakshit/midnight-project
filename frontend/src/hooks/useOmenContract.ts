/**
 * useOmenContract Hook
 *
 * Provides contract interaction functions using the Midnight SDK.
 * Bridges the wallet provider to the Omen contract circuits.
 */

import { useState, useCallback } from 'react';
import { useMidnightWallet } from '../context/MidnightWalletContext';

/** Result of a seal operation */
export interface SealResult {
  commitmentHash: string;
  contractAddress: string;
  proof: unknown;
}

/** Result of a verify operation */
export interface VerifyResult {
  isValid: boolean;
  proof: unknown;
}

export function useOmenContract() {
  const { provider, isConnected } = useMidnightWallet();
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Seal a premonition (commit to chain)
   * 
   * This executes the ZK circuit that:
   * 1. Takes premonition text + salt as private witnesses
   * 2. Computes SHA-256 hash
   * 3. Returns only the commitment hash (private data stays local)
   */
  const sealPremonition = useCallback(
    async (premonition: string, salt: string): Promise<SealResult> => {
      if (!provider || !isConnected) {
        throw new Error('Wallet not connected');
      }

      setIsExecuting(true);
      setError(null);

      try {
        // Generate commitment hash locally (private data never leaves)
        const encoder = new TextEncoder();
        const data = encoder.encode(premonition + salt);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const commitmentHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        console.log('[Omen] Generated commitment hash:', commitmentHash.slice(0, 16) + '...');

        // Execute the seal circuit via provider
        // In production, this would call the real Midnight SDK:
        // const result = await provider.executeCircuit(contractAddress, 'seal', [premonition, salt]);
        
        // For demo, we simulate the circuit execution
        const result = await provider.executeCircuit(
          '0x' + '0'.repeat(64), // Contract address (would be real in production)
          'seal',
          [premonition, salt]
        );

        console.log('[Omen] Seal circuit executed successfully');

        return {
          commitmentHash,
          contractAddress: '0x' + '0'.repeat(64),
          proof: result,
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Seal failed';
        setError(message);
        throw new Error(message);
      } finally {
        setIsExecuting(false);
      }
    },
    [provider, isConnected]
  );

  /**
   * Verify a premonition (prove knowledge without revealing)
   * 
   * This executes the ZK circuit that:
   * 1. Takes premonition + salt as private witnesses
   * 2. Takes commitment hash as public input
   * 3. Proves the hash matches without revealing the inputs
   */
  const verifyPremonition = useCallback(
    async (premonition: string, salt: string, commitmentHash: string): Promise<VerifyResult> => {
      if (!provider || !isConnected) {
        throw new Error('Wallet not connected');
      }

      setIsExecuting(true);
      setError(null);

      try {
        // Execute the verify circuit via provider
        // In production, this would call the real Midnight SDK:
        // const result = await provider.executeCircuit(contractAddress, 'verify', [premonition, salt, commitmentHash]);
        
        // For demo, we simulate the circuit execution
        const result = await provider.executeCircuit(
          '0x' + '0'.repeat(64), // Contract address
          'verify',
          [premonition, salt, commitmentHash]
        );

        console.log('[Omen] Verify circuit executed successfully');

        return {
          isValid: true, // In production, check the proof result
          proof: result,
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Verify failed';
        setError(message);
        throw new Error(message);
      } finally {
        setIsExecuting(false);
      }
    },
    [provider, isConnected]
  );

  /**
   * Deploy the Omen contract
   * 
   * This deploys the premonition.compact contract to the network
   */
  const deployContract = useCallback(
    async (): Promise<string> => {
      if (!provider || !isConnected) {
        throw new Error('Wallet not connected');
      }

      setIsExecuting(true);
      setError(null);

      try {
        // Load contract ZK info
        // In production, this would load the compiled artifacts:
        // const contractInfo = await import('../contracts/managed/premonition/compiler/contract-info.json');
        
        const contractAddress = await provider.deployContract(
          {}, // ZK info (would be real in production)
          []  // Constructor args
        );

        console.log('[Omen] Contract deployed at:', contractAddress);

        return contractAddress;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Deploy failed';
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
    verifyPremonition,
    deployContract,
    isExecuting,
    error,
  };
}
