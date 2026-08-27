/**
 * Omen — Midnight ZK Integration Module
 *
 * Complete backend for the Cryptographic Premonition Registry.
 * Exports private state management, witness providers, contract
 * bindings, and indexer queries.
 */

// Private state management
export {
  type PremonitionPrivateState,
  createInitialPrivateState,
  savePrivateState,
  loadPrivateState,
  saveContractAddress,
  loadContractAddress,
  PRIVATE_STATE_KEY,
  CONTRACT_ADDRESS_KEY,
} from './private-state';

// Witness providers (bridge private state to circuits)
export {
  witnesses,
  localPremonition,
  localSalt,
  type PremonitionWitnessContext,
} from './witnesses';

// Contract bindings and circuit runners
export {
  loadContractModule,
  getContractInfo,
  sealPremonition,
  ZK_CONFIG_PATH,
  type ContractInfo,
  type CircuitInfo,
  type LedgerField,
} from './contract';

// Preprod Indexer GraphQL queries
export {
  queryIndexer,
  fetchContractState,
  fetchContractTransactions,
  fetchLatestBlock,
  PREPROD_INDEXER_URL,
  PREPROD_EXPLORER_URL,
  GET_CONTRACT_STATE,
  GET_CONTRACT_TRANSACTIONS,
  GET_LATEST_BLOCK,
  GET_ALL_PREMONITIONS,
  type ContractStateResponse,
  type TransactionsResponse,
  type Transaction,
  type LedgerField as IndexerLedgerField,
} from './indexer';
