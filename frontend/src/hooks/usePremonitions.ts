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
  commitmentHash: string;
  timestamp: string;
  blockHeight: number;
  txHash: string;
  status: string;
}

interface LedgerField {
  name: string;
  value: string;
}

interface ContractStateResponse {
  ledgerState: {
    fields: LedgerField[];
  } | null;
}

interface Transaction {
  id: string;
  block: {
    height: number;
    hash: string;
    timestamp: string;
  };
  status: string;
}

interface TransactionsResponse {
  transactions: Transaction[];
}

async function queryIndexer<T>(query: string, variables: Record<string, unknown>): Promise<T> {
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
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  return json.data as T;
}

export function usePremonitions() {
  const [premonitions, setPremonitions] = useState<PremonitionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contractState, setContractState] = useState<LedgerField[]>([]);

  const fetchPremonitions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch contract ledger state (premonitionHash, sealedCount)
      const stateData = await queryIndexer<ContractStateResponse>(
        `query GetContractState($addr: String!) {
          ledgerState(contractAddress: $addr) {
            fields { name value }
          }
        }`,
        { addr: CONTRACT_ADDRESS },
      );

      const fields = stateData.ledgerState?.fields ?? [];
      setContractState(fields);

      // Fetch transactions for this contract
      const txData = await queryIndexer<TransactionsResponse>(
        `query GetTxs($addr: String!, $limit: Int) {
          transactions(
            where: { contractAddress: { equals: $addr } }
            orderBy: { block: { height: desc } }
            limit: $limit
          ) {
            id
            block { height hash timestamp }
            status
          }
        }`,
        { addr: CONTRACT_ADDRESS, limit: 20 },
      );

      const records: PremonitionRecord[] = (txData.transactions || []).map((tx) => ({
        id: tx.id,
        commitmentHash: fields.find((f) => f.name === 'premonitionHash')?.value || '0x...',
        timestamp: tx.block.timestamp,
        blockHeight: tx.block.height,
        txHash: tx.id,
        status: tx.status,
      }));

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
    contractState,
    isLoading,
    error,
    refetch: fetchPremonitions,
    contractAddress: CONTRACT_ADDRESS,
  };
}
