/**
 * Meridian — Preprod Indexer GraphQL Queries
 *
 * Queries the Midnight Preprod GraphQL indexer to fetch
 * on-chain circle state and transactions.
 */

// ─── Endpoints ──────────────────────────────────────────────────────────────

export const PREPROD_INDEXER_URL =
  'https://indexer.preprod.midnight.network/api/v4/graphql';

export const PREPROD_EXPLORER_URL = 'https://explorer.preprod.midnight.network';

// ─── GraphQL Queries ────────────────────────────────────────────────────────

/**
 * Fetch the current ledger state for a circle contract.
 * Returns the on-chain inviteRoot, memberCount, expenseCount, settlementCount.
 */
export const GET_CIRCLE_STATE = `
  query GetCircleState($contractAddress: String!) {
    ledgerState(contractAddress: $contractAddress) {
      fields {
        name
        value
      }
    }
  }
`;

/**
 * Fetch recent transactions for a contract address.
 * Used to build the circle activity feed.
 */
export const GET_CIRCLE_TRANSACTIONS = `
  query GetCircleTransactions(
    $contractAddress: String!
    $limit: Int
    $offset: Int
  ) {
    transactions(
      where: { contractAddress: { equals: $contractAddress } }
      orderBy: { block: { height: desc } }
      limit: $limit
      skip: $offset
    ) {
      id
      block {
        height
        hash
        timestamp
      }
      status
      type
    }
  }
`;

/**
 * Fetch block height for network telemetry display.
 */
export const GET_LATEST_BLOCK = `
  query GetLatestBlock {
    blocks(orderBy: { height: desc }, limit: 1) {
      height
      hash
      timestamp
    }
  }
`;

// ─── Query Executor ─────────────────────────────────────────────────────────

export async function queryIndexer<T>(
  query: string,
  variables: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(PREPROD_INDEXER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Indexer query failed: ${response.statusText}`);
  }

  const json = await response.json();

  if (json.errors?.length > 0) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  return json.data as T;
}

// ─── Typed Response Shapes ──────────────────────────────────────────────────

export interface LedgerFieldValue {
  name: string;
  value: string;
}

export interface CircleStateResponse {
  ledgerState: {
    fields: LedgerFieldValue[];
  } | null;
}

export interface Transaction {
  id: string;
  block: {
    height: number;
    hash: string;
    timestamp: string;
  };
  status: string;
  type: string;
}

export interface TransactionsResponse {
  transactions: Transaction[];
}

export interface LatestBlockResponse {
  blocks: Array<{
    height: number;
    hash: string;
    timestamp: string;
  }>;
}

// ─── Convenience Functions ──────────────────────────────────────────────────

export async function fetchCircleState(
  contractAddress: string,
): Promise<LedgerFieldValue[]> {
  const data = await queryIndexer<CircleStateResponse>(GET_CIRCLE_STATE, {
    contractAddress,
  });
  return data.ledgerState?.fields ?? [];
}

export async function fetchCircleTransactions(
  contractAddress: string,
  limit = 20,
  offset = 0,
): Promise<Transaction[]> {
  const data = await queryIndexer<TransactionsResponse>(
    GET_CIRCLE_TRANSACTIONS,
    { contractAddress, limit, offset },
  );
  return data.transactions;
}

export async function fetchLatestBlock() {
  const data = await queryIndexer<LatestBlockResponse>(GET_LATEST_BLOCK, {});
  return data.blocks[0] ?? null;
}
