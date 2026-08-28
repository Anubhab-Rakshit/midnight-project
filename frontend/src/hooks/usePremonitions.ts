/**
 * usePremonitions Hook
 *
 * Fetches real data from the Midnight Preprod indexer for the
 * deployed premonition contract.
 */

import { useState, useEffect, useCallback } from 'react';

const PREPROD_INDEXER_URL = 'https://indexer.preprod.midnight.network/api/v4/graphql';
const CONTRACT_ADDRESS = '5b7dcd349113b6dc0a11caa89b9245dc701d43e1cf114fc99bd10acf8e930f6c';

export interface PremonitionRecord {
  id: string;
  txHash: string;
  timestamp: string;
  blockHeight: number;
  actionType: string;
}

async function queryIndexer<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(PREPROD_INDEXER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Indexer returned ${response.status}`);
  }

  const json = await response.json();
  if (json.errors?.length > 0) {
    throw new Error(`GraphQL: ${json.errors[0].message}`);
  }

  return json.data as T;
}

interface ContractActionResponse {
  contractAction: {
    __typename: string;
    address: string;
    transaction: {
      hash: string;
      id: number;
      block: {
        height: number;
        timestamp: number;
      };
    };
  } | null;
}

interface BlockTransactionsResponse {
  block: {
    hash: string;
    height: number;
    timestamp: number;
    transactions: Array<{
      id: number;
      hash: string;
      contractActions: Array<{
        __typename: string;
        address?: string;
      }>;
    }>;
  } | null;
}

interface LatestBlockResponse {
  block: {
    height: number;
    timestamp: number;
  } | null;
}

export function usePremonitions() {
  const [premonitions, setPremonitions] = useState<PremonitionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPremonitions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const records: PremonitionRecord[] = [];

      // 1. Get the contract deploy action
      const deployData = await queryIndexer<ContractActionResponse>(
        `query GetContractAction($addr: String!) {
          contractAction(address: $addr) {
            __typename
            address
            transaction {
              hash
              id
              block { height timestamp }
            }
          }
        }`,
        { addr: CONTRACT_ADDRESS },
      );

      if (deployData.contractAction?.transaction) {
        const tx = deployData.contractAction.transaction;
        records.push({
          id: `deploy-${tx.id}`,
          txHash: tx.hash,
          timestamp: new Date(tx.block.timestamp).toISOString(),
          blockHeight: tx.block.height,
          actionType: 'Contract Deploy',
        });
      }

      // 2. Scan recent blocks for contract interactions
      const latestData = await queryIndexer<LatestBlockResponse>(
        `query { block(offset: {}) { height timestamp } }`,
      );

      const latestHeight = latestData.block?.height ?? 0;
      const scanRange = Math.min(100, latestHeight);
      const startHeight = Math.max(0, latestHeight - scanRange);

      for (let h = latestHeight; h >= startHeight; h--) {
        try {
          const blockData = await queryIndexer<BlockTransactionsResponse>(
            `query GetBlock($height: Int!) {
              block(offset: { height: $height }) {
                height timestamp
                transactions {
                  id hash
                  contractActions {
                    __typename
                    ... on ContractCall { address }
                    ... on ContractUpdate { address }
                  }
                }
              }
            }`,
            { height: h },
          );

          if (blockData.block?.transactions) {
            for (const tx of blockData.block.transactions) {
              const hasContractAction = tx.contractActions.some(
                (a) => a.address === CONTRACT_ADDRESS && a.__typename !== 'ContractDeploy',
              );
              if (hasContractAction) {
                records.push({
                  id: `call-${tx.id}`,
                  txHash: tx.hash,
                  timestamp: new Date(blockData.block.timestamp).toISOString(),
                  blockHeight: h,
                  actionType: 'Contract Call',
                });
              }
            }
          }
        } catch {
          // Skip blocks that fail to load
        }
      }

      // Sort by block height descending
      records.sort((a, b) => b.blockHeight - a.blockHeight);
      setPremonitions(records);
    } catch (err) {
      console.warn('[usePremonitions] Indexer query failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPremonitions();
  }, [fetchPremonitions]);

  return {
    premonitions,
    isLoading,
    error,
    refetch: fetchPremonitions,
    contractAddress: CONTRACT_ADDRESS,
  };
}
