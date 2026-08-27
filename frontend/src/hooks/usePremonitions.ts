/**
 * usePremonitions Hook
 *
 * Fetches premonition data from the Midnight Preprod indexer.
 * Provides both live data and fallback mock data.
 */

import { useState, useEffect, useCallback } from 'react';

/** A premonition record from the indexer */
export interface PremonitionRecord {
  id: string;
  commitmentHash: string;
  timestamp: string;
  blockHeight: number;
  txHash: string;
  title: string;
}

/** Mock data for when indexer is unavailable */
const MOCK_PREMONITIONS: PremonitionRecord[] = [
  {
    id: '1',
    commitmentHash: '0x7e8b9f2d1a4c5e6f7890abcdef1234567890abcdef1234567890abcdef123456',
    timestamp: '2025-10-14T00:00:00Z',
    blockHeight: 1234567,
    txHash: '0xabc123...',
    title: 'The Great AI Alignment',
  },
  {
    id: '2',
    commitmentHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef12345678',
    timestamp: '2026-03-21T00:00:00Z',
    blockHeight: 2345678,
    txHash: '0xdef456...',
    title: 'Quantum Leap Simulation',
  },
];

/** Preprod indexer URL */
const PREPROD_INDEXER_URL = 'https://indexer.preprod.midnight.network/graphql';

export function usePremonitions() {
  const [premonitions, setPremonitions] = useState<PremonitionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingMock, setIsUsingMock] = useState(false);

  const fetchPremonitions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Try to fetch from real indexer
      const response = await fetch(PREPROD_INDEXER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query GetPremonitions {
              transactions(limit: 10, orderBy: { blockHeight: desc }) {
                edges {
                  node {
                    txHash
                    blockHeight
                    block {
                      timestamp
                    }
                    ledgerEvents {
                      ... on ContractStateEvent {
                        contractAddress
                        fields {
                          name
                          value
                        }
                      }
                    }
                  }
                }
              }
            }
          `,
        }),
      });

      if (!response.ok) {
        throw new Error(`Indexer returned ${response.status}`);
      }

      const data = await response.json();
      
      // Transform indexer data to PremonitionRecord format
      const records: PremonitionRecord[] = data.data?.transactions?.edges?.map(
        (edge: { node: Record<string, unknown> }, index: number) => {
          const node = edge.node;
          const fields = (node.ledgerEvents as Array<{ fields: Array<{ name: string; value: string }> }>)?.[0]?.fields || [];
          const commitmentField = fields.find((f) => f.name === 'premonition_commitment');
          
          return {
            id: String(index + 1),
            commitmentHash: commitmentField?.value || '0x' + '0'.repeat(64),
            timestamp: (node.block as { timestamp: string })?.timestamp || new Date().toISOString(),
            blockHeight: (node.blockHeight as number) || 0,
            txHash: (node.txHash as string) || '0x...',
            title: `Premonition #${index + 1}`,
          };
        }
      ) || [];

      if (records.length > 0) {
        setPremonitions(records);
        setIsUsingMock(false);
      } else {
        // No records found, use mock data
        setPremonitions(MOCK_PREMONITIONS);
        setIsUsingMock(true);
      }
    } catch (err) {
      console.warn('[usePremonitions] Indexer unavailable, using mock data:', err);
      setPremonitions(MOCK_PREMONITIONS);
      setIsUsingMock(true);
      setError(err instanceof Error ? err.message : 'Failed to fetch premonitions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchPremonitions();
  }, [fetchPremonitions]);

  // Refetch function for manual refresh
  const refetch = useCallback(() => {
    fetchPremonitions();
  }, [fetchPremonitions]);

  return {
    premonitions,
    isLoading,
    error,
    isUsingMock,
    refetch,
  };
}
