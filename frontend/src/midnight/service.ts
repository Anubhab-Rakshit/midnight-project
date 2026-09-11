/**
 * Browser deploy of a fresh `splitpool` contract instance.
 *
 * Each circle deploys its own contract (one circle per box),
 * so the deploy transaction itself is the on-chain record. The wallet
 * performs proving, balancing and submission via the Lace ConnectedAPI.
 */

import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';
import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
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

const MeridianContract: any = Contract;

export interface DeployedCircle {
  inviteRoot: string;
  contractAddress: string;
  txHash: string;
  blockHeight: number;
}

const PRIVATE_STATE_ID = 'meridianCirclePrivateState';

export async function deployCircle(
  connectedApi: ConnectedAPI,
  inviteSecret: string,
): Promise<DeployedCircle> {
  const zkConfig = new BrowserZkConfigProvider();

  const walletProvider = new BrowserWalletProvider(connectedApi);
  await walletProvider.initialize();
  const networkId = await walletProvider.networkId();
  setNetworkId(networkId);

  const indexerUri = await walletProvider.indexerUri();
  const indexerWsUri = await walletProvider.indexerWsUri();

  const salt = crypto.getRandomValues(new Uint8Array(32));

  let compiledContract: any = CompiledContract.make('splitpool', MeridianContract);
  compiledContract = CompiledContract.withWitnesses<any, any, any>(compiledContract as any, {
    localSecret: (ctx: any) => [ctx.privateState, toBytes32(inviteSecret)],
    localSalt: (ctx: any) => [ctx.privateState, salt],
  } as any);
  compiledContract = CompiledContract.withCompiledFileAssets<any, any, any>(compiledContract as any, '' as any);

  const provingProvider = await getWalletProvingProvider(connectedApi, zkConfig);

  const providers = {
    privateStateProvider: new MemoryPrivateStateProvider(),
    publicDataProvider: indexerPublicDataProvider(indexerUri, indexerWsUri),
    zkConfigProvider: zkConfig as any,
    proofProvider: createProofProvider(provingProvider as any),
    walletProvider: walletProvider as any,
    midnightProvider: walletProvider as any,
  } as any;

  let deployed: any;
  try {
    deployed = await deployContract(providers, {
      compiledContract,
      args: [],
      privateStateId: PRIVATE_STATE_ID,
      initialPrivateState: {
        inviteSecret,
        salt,
        createdAt: new Date().toISOString(),
        inviteRoot: '',
      },
    } as any);
  } catch (error: any) {
    console.error('[Meridian][deploy] deployContract failed:', error);
    console.error('[Meridian][deploy] networkId =', networkId, '| indexerUri =', indexerUri);
    if (error instanceof Error) {
      console.error('[Meridian][deploy] message =', error.message);
      console.error('[Meridian][deploy] stack =', error.stack);
    }
    throw error;
  }

  const deployTx = deployed.deployTxData.public as any;
  const contractAddress = (deployTx.contractAddress ?? deployed.deployTxData.public.contractAddress) as string;
  // `FinalizedTxData.txHash` is the on-chain TRANSACTION hash.
  // Do NOT use `txId`/`identifiers[0]` — those are 33-byte action identifiers.
  const txHash = deployTx.txHash as string;

  return {
    inviteRoot: contractAddress,
    contractAddress,
    txHash,
    blockHeight: deployTx.blockHeight as number,
  };
}

// ─── Minimal in-memory PrivateStateProvider ────────────────────────────────────

class MemoryPrivateStateProvider {
  private states = new Map<string, unknown>();
  private signingKeys = new Map<string, string>();
  private address = '';

  setContractAddress = (address: string) => {
    this.address = address;
  };

  set = async (id: string, state: unknown) => {
    this.states.set(`${this.address}:${id}`, state);
  };

  get = async (id: string): Promise<unknown | null> => {
    if (!this.address) throw new Error('setContractAddress must be called first');
    return this.states.get(`${this.address}:${id}`) ?? null;
  };

  remove = async (id: string) => {
    this.states.delete(`${this.address}:${id}`);
  };

  clear = async () => {
    this.states.clear();
  };

  setSigningKey = async (address: string, key: any) => {
    this.signingKeys.set(address, key);
  };

  getSigningKey = async (address: string): Promise<string | null> =>
    this.signingKeys.get(address) ?? null;

  removeSigningKey = async (address: string) => {
    this.signingKeys.delete(address);
  };

  clearSigningKeys = async () => {
    this.signingKeys.clear();
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

export type { MemoryPrivateStateProvider };
