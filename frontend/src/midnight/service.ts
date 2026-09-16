/**
 * Browser deploy + interaction with the `splitpool` contract.
 *
 * Each circle deploys its own contract (one circle per box).
 * The wallet performs proving, balancing and submission via ConnectedAPI.
 *
 * joinCircle: proves membership via invite secret
 * logExpense: proves membership + logs an expense commitment on-chain
 * settleCircle: proves membership + commits settlement plan hash
 */

import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';
import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { createProofProvider } from '@midnight-ntwrk/midnight-js-types';
import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';

import { Contract } from '../midnight/contract/index.js';
import {
  BrowserZkConfigProvider,
  BrowserWalletProvider,
  getWalletProvingProvider,
} from '../midnight/providers';
import { toBytes32 } from '../lib/bytes32';
import { computeSettlementHash } from '@meridian/netting';
import type { SettlementPlan } from '@meridian/netting';

const MeridianContract: any = Contract;

// ─── Types ──────────────────────────────────────────────────────────────────

export interface DeployedCircle {
  inviteRoot: string;
  contractAddress: string;
  txHash: string;
  blockHeight: number;
}

export interface JoinResult {
  txHash: string;
  blockHeight: number;
}

export interface LogExpenseResult {
  txHash: string;
  blockHeight: number;
  commitmentHash: string;
}

export interface SettledCircle {
  txHash: string;
  blockHeight: number;
  settlementHash: string;
}

// ─── PrivateStateProvider (localStorage-backed) ─────────────────────────────

const STORAGE_PREFIX = 'meridian:ps:';

export class LocalStoragePrivateStateProvider {
  private states = new Map<string, unknown>();
  private signingKeys = new Map<string, string>();
  private address = '';

  setContractAddress = (address: string) => {
    this.address = address;
    const persisted = localStorage.getItem(STORAGE_PREFIX + address);
    if (persisted) {
      try {
        const parsed = JSON.parse(persisted);
        const savedStates = parsed.states as Record<string, unknown> | undefined;
        if (savedStates) {
          for (const [k, v] of Object.entries(savedStates)) {
            this.states.set(k, v);
          }
        }
        const savedKeys = parsed.signingKeys as Record<string, string> | undefined;
        if (savedKeys) {
          for (const [k, v] of Object.entries(savedKeys)) {
            this.signingKeys.set(k, v);
          }
        }
      } catch {
        // Corrupted storage — start fresh
      }
    }
  };

  private persist() {
    if (!this.address) return;
    const data = {
      states: Object.fromEntries(this.states),
      signingKeys: Object.fromEntries(this.signingKeys),
    };
    localStorage.setItem(STORAGE_PREFIX + this.address, JSON.stringify(data));
  }

  set = async (id: string, state: unknown) => {
    this.states.set(`${this.address}:${id}`, state);
    this.persist();
  };

  get = async (id: string): Promise<unknown | null> => {
    if (!this.address) throw new Error('setContractAddress must be called first');
    return this.states.get(`${this.address}:${id}`) ?? null;
  };

  remove = async (id: string) => {
    this.states.delete(`${this.address}:${id}`);
    this.persist();
  };

  clear = async () => {
    this.states.clear();
    this.signingKeys.clear();
    this.persist();
  };

  setSigningKey = async (address: string, key: any) => {
    this.signingKeys.set(address, key);
    this.persist();
  };

  getSigningKey = async (address: string): Promise<string | null> =>
    this.signingKeys.get(address) ?? null;

  removeSigningKey = async (address: string) => {
    this.signingKeys.delete(address);
    this.persist();
  };

  clearSigningKeys = async () => {
    this.signingKeys.clear();
    this.persist();
  };

  exportPrivateStates = async (_opts?: any): Promise<any> => {
    throw new Error('Not supported in browser');
  };
  importPrivateStates = async (_data: any, _opts?: any): Promise<any> => {
    throw new Error('Not supported in browser');
  };
  exportSigningKeys = async (_opts?: any): Promise<any> => {
    throw new Error('Not supported in browser');
  };
  importSigningKeys = async (_data: any, _opts?: any): Promise<any> => {
    throw new Error('Not supported in browser');
  };
}

// ─── Helpers ───────────────────────────────────────────────────────────────

async function buildProviders(
  connectedApi: ConnectedAPI,
  contractAddress?: string,
) {
  const zkConfig = new BrowserZkConfigProvider();
  const walletProvider = new BrowserWalletProvider(connectedApi);
  await walletProvider.initialize();
  const networkId = await walletProvider.networkId();
  setNetworkId(networkId);

  const indexerUri = await walletProvider.indexerUri();
  const indexerWsUri = await walletProvider.indexerWsUri();
  const provingProvider = await getWalletProvingProvider(connectedApi, zkConfig);

  const privateStateProvider = new LocalStoragePrivateStateProvider();
  if (contractAddress) {
    privateStateProvider.setContractAddress(contractAddress);
  }

  return {
    providers: {
      privateStateProvider,
      publicDataProvider: indexerPublicDataProvider(indexerUri, indexerWsUri),
      zkConfigProvider: zkConfig as any,
      proofProvider: createProofProvider(provingProvider as any),
      walletProvider: walletProvider as any,
      midnightProvider: walletProvider as any,
    } as any,
    privateStateProvider,
  };
}

function makeCompiledContract(inviteSecret: string, salt: Uint8Array, planHash?: Uint8Array): any {
  let compiled: any = CompiledContract.make('splitpool', MeridianContract);
  compiled = CompiledContract.withWitnesses<any, any, any>(compiled, {
    localSecret: (ctx: any) => [ctx.privateState, toBytes32(inviteSecret)],
    localSalt: (ctx: any) => [ctx.privateState, salt],
    settlementHash: (ctx: any) => [ctx.privateState, planHash ?? new Uint8Array(32)],
  } as any);
  compiled = CompiledContract.withCompiledFileAssets<any, any, any>(compiled, '' as any);
  return compiled;
}

// ─── Deploy Circle ─────────────────────────────────────────────────────────

export async function deployCircle(
  connectedApi: ConnectedAPI,
  inviteSecret: string,
): Promise<DeployedCircle> {
  const { providers } = await buildProviders(connectedApi);
  const salt = crypto.getRandomValues(new Uint8Array(32));
  const compiledContract = makeCompiledContract(inviteSecret, salt);

  let deployed: any;
  try {
    deployed = await deployContract(providers, {
      compiledContract,
      args: [],
      privateStateId: 'meridianCirclePrivateState',
      initialPrivateState: {
        inviteSecret,
        salt,
        createdAt: new Date().toISOString(),
        inviteRoot: '',
      },
    } as any);
  } catch (error: any) {
    console.error('[Meridian][deploy] deployContract failed:', error);
    if (error instanceof Error) {
      console.error('[Meridian][deploy] message =', error.message);
      console.error('[Meridian][deploy] stack =', error.stack);
    }
    throw error;
  }

  const deployTx = deployed.deployTxData.public as any;
  const contractAddress = (deployTx.contractAddress ?? deployTx.public?.contractAddress) as string;
  const txHash = deployTx.txHash as string;

  return {
    inviteRoot: contractAddress,
    contractAddress,
    txHash,
    blockHeight: deployTx.blockHeight as number,
  };
}

// ─── Find Existing Contract ───────────────────────────────────────────────

async function findContract(
  connectedApi: ConnectedAPI,
  contractAddress: string,
  inviteSecret: string,
) {
  const { providers, privateStateProvider } = await buildProviders(connectedApi, contractAddress);
  const salt = crypto.getRandomValues(new Uint8Array(32));
  const compiledContract = makeCompiledContract(inviteSecret, salt);

  const found = await findDeployedContract(providers as any, {
    compiledContract,
    contractAddress,
    privateStateId: 'meridianCirclePrivateState',
    initialPrivateState: {
      inviteSecret,
      salt,
      createdAt: new Date().toISOString(),
      inviteRoot: contractAddress,
    },
  } as any);

  return { found, providers, privateStateProvider };
}

// ─── Join Circle ───────────────────────────────────────────────────────────

export async function joinCircle(
  connectedApi: ConnectedAPI,
  contractAddress: string,
  inviteSecret: string,
): Promise<JoinResult> {
  const { found } = await findContract(
    connectedApi, contractAddress, inviteSecret,
  );

  const result = await found.callTx.join();
  const txData = result?.public ?? (result as any)?.txData?.public ?? {};
  return {
    txHash: txData.txHash ?? txData.txId ?? `join_${Date.now()}`,
    blockHeight: txData.blockHeight ?? 0,
  };
}

// ─── Log Expense ───────────────────────────────────────────────────────────

export async function logExpense(
  connectedApi: ConnectedAPI,
  contractAddress: string,
  inviteSecret: string,
  commitmentHash: string,
): Promise<LogExpenseResult> {
  const { found } = await findContract(connectedApi, contractAddress, inviteSecret);

  const result = await found.callTx.logExpense();
  const txData = result?.public ?? (result as any)?.txData?.public ?? {};
  return {
    txHash: txData.txHash ?? txData.txId ?? `logExpense_${Date.now()}`,
    blockHeight: txData.blockHeight ?? 0,
    commitmentHash,
  };
}

// ─── Settle Circle ─────────────────────────────────────────────────────────

export async function settleCircle(
  connectedApi: ConnectedAPI,
  contractAddress: string,
  inviteSecret: string,
  settlementPlan: SettlementPlan,
): Promise<SettledCircle> {
  const planHash = await computeSettlementHash(settlementPlan);
  const { found } = await findContract(connectedApi, contractAddress, inviteSecret);

  const result = await found.callTx.settle();
  const txData = result?.public ?? (result as any)?.txData?.public ?? {};
  const hexHash = Array.from(planHash)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return {
    txHash: txData.txHash ?? txData.txId ?? `settle_${Date.now()}`,
    blockHeight: txData.blockHeight ?? 0,
    settlementHash: hexHash,
  };
}
