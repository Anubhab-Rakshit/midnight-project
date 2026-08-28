/**
 * Browser Midnight providers backed by the Lace wallet's ConnectedAPI.
 *
 * In the browser we never touch private keys directly — the wallet does:
 *   - proving  via `getProvingProvider(keyMaterialProvider)`
 *   - balancing via `balanceUnsealedTransaction(serializedTx)`
 *   - submitting via `submitTransaction(serializedTx)`
 *
 * Transactions cross the wallet boundary as base64-encoded Ledger serializations.
 */

import {
  type ConnectedAPI,
  type ProvingProvider,
} from '@midnight-ntwrk/dapp-connector-api';
import { createProverKey, createVerifierKey, createZKIR, ZKConfigProvider } from '@midnight-ntwrk/midnight-js-types';
import { Transaction } from '@midnight-ntwrk/ledger-v8';

export type OmenCircuitId = 'seal' | 'verify';

interface AssetUrls {
  prover: string;
  verifier: string;
  zkir: string;
}

const sealProverUrl = new URL('../midnight/keys/seal.prover', import.meta.url).href;
const sealVerifierUrl = new URL('../midnight/keys/seal.verifier', import.meta.url).href;
const sealZkirUrl = new URL('../midnight/zkir/seal.zkir', import.meta.url).href;
const verifyProverUrl = new URL('../midnight/keys/verify.prover', import.meta.url).href;
const verifyVerifierUrl = new URL('../midnight/keys/verify.verifier', import.meta.url).href;
const verifyZkirUrl = new URL('../midnight/zkir/verify.zkir', import.meta.url).href;

const ASSETS: Record<OmenCircuitId, AssetUrls> = {
  seal: { prover: sealProverUrl, verifier: sealVerifierUrl, zkir: sealZkirUrl },
  verify: { prover: verifyProverUrl, verifier: verifyVerifierUrl, zkir: verifyZkirUrl },
};

function stripExt(location: string): OmenCircuitId {
  const base = location.replace(/\.(zkir|prover|verifier)$/, '') as OmenCircuitId;
  if (!(base in ASSETS)) throw new Error(`Unknown circuit key location: ${location}`);
  return base;
}

async function fetchAsset(url: string): Promise<Uint8Array> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ZK asset ${url}: ${res.status}`);
  return new Uint8Array(await res.arrayBuffer());
}

/**
 * ZKConfigProvider that fetches the compiled contract artifacts from the
 * bundled frontend assets.
 */
export class BrowserZkConfigProvider extends ZKConfigProvider<OmenCircuitId> {
  async getZKIR(circuitId: OmenCircuitId): Promise<any> {
    return createZKIR(await fetchAsset(ASSETS[circuitId].zkir));
  }
  async getProverKey(circuitId: OmenCircuitId): Promise<any> {
    return createProverKey(await fetchAsset(ASSETS[circuitId].prover));
  }
  async getVerifierKey(circuitId: OmenCircuitId): Promise<any> {
    return createVerifierKey(await fetchAsset(ASSETS[circuitId].verifier));
  }

  /** KeyMaterialProvider adapter to hand to the wallet's getProvingProvider. */
  asKeyMaterial(): ProvingKeyMaterialLike {
    return {
      getZKIR: (loc: string) => fetchAsset(ASSETS[stripExt(loc)].zkir),
      getProverKey: (loc: string) => fetchAsset(ASSETS[stripExt(loc)].prover),
      getVerifierKey: (loc: string) => fetchAsset(ASSETS[stripExt(loc)].verifier),
    };
  }
}

interface ProvingKeyMaterialLike {
  getZKIR(loc: string): Promise<Uint8Array>;
  getProverKey(loc: string): Promise<Uint8Array>;
  getVerifierKey(loc: string): Promise<Uint8Array>;
}

const base64ToBytes = (b64: string) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
const bytesToBase64 = (bytes: Uint8Array) => {
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
};

const bytesToHex = (bytes: Uint8Array) =>
  Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

/**
 * Normalize the wallet's raw public key into a hex string. The wallet API
 * type claims a string, but in practice may hand us hex, bech32, or bytes —
 * and the SDK's parse helper throws "input: string expected" on non-strings,
 * so bytes must be hex-encoded first.
 */
function normalizeKeyToHex(value: unknown, label: string): string {
  if (typeof value === 'string') {
    const v = value.replace(/^0x/, '');
    // 64 hex chars = 32-byte key. If bech32 form, let the SDK decode it.
    return /^[0-9a-fA-F]{64}$/.test(v) ? v.toLowerCase() : value;
  }
  if (value instanceof Uint8Array) {
    console.log(`[Omen] ${label} was a byte array (${value.length} bytes) — encoding to hex`);
    return bytesToHex(value);
  }
  if (value && typeof (value as any).toBytes === 'function') {
    return bytesToHex(new Uint8Array((value as any).toBytes()));
  }
  console.warn(`[Omen] ${label} was unexpected type:`, typeof value);
  throw new Error(`${label} returned an unexpected value from the wallet`);
}

/**
 * WalletProvider + MidnightProvider that route balances and submissions
 * through the Lace wallet's ConnectedAPI.
 */
export class BrowserWalletProvider {
  private config: { indexerUri: string; indexerWsUri: string; networkId: string } | null = null;
  private readonly connectedApi: ConnectedAPI;

  constructor(connectedApi: ConnectedAPI) {
    this.connectedApi = connectedApi;
  }

  private async configuration() {
    if (!this.config) {
      const c = await this.connectedApi.getConfiguration();
      this.config = {
        indexerUri: c.indexerUri,
        indexerWsUri: c.indexerWsUri,
        networkId: c.networkId,
      };
    }
    return this.config;
  }

  networkId = async (): Promise<string> => (await this.configuration()).networkId;
  indexerUri = async (): Promise<string> => (await this.configuration()).indexerUri;
  indexerWsUri = async (): Promise<string> => (await this.configuration()).indexerWsUri;

  /** Best-effort coin public key from the wallet, normalized to hex. */
  getCoinPublicKey = async (): Promise<unknown> => {
    const addrs = await this.connectedApi.getShieldedAddresses();
    return normalizeKeyToHex(addrs.shieldedCoinPublicKey, 'coin public key');
  };

  /** Best-effort encryption public key from the wallet, normalized to hex. */
  getEncryptionPublicKey = async (): Promise<unknown> => {
    const addrs = await this.connectedApi.getShieldedAddresses();
    return normalizeKeyToHex(addrs.shieldedEncryptionPublicKey, 'encryption public key');
  };

  async balanceTx(tx: any): Promise<any> {
    const serialized = bytesToBase64(tx.serialize());
    const result = await this.connectedApi.balanceUnsealedTransaction(serialized);
    return Transaction.deserialize('signature', 'proof', 'binding', base64ToBytes(result.tx));
  }

  async submitTx(tx: any): Promise<string> {
    const serialized = bytesToBase64(tx.serialize());
    await this.connectedApi.submitTransaction(serialized);
    return tx.transactionHash();
  }
}

export async function getWalletProvingProvider(connectedApi: ConnectedAPI, zkConfig: BrowserZkConfigProvider): Promise<ProvingProvider> {
  return connectedApi.getProvingProvider(zkConfig.asKeyMaterial());
}
