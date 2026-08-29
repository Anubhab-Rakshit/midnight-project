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
import { toHex, fromHex } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';

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
  console.warn(`[Omen] ${label} was unexpected type: ${describe(value)}`);
  throw new Error(`${label} returned an unexpected value from the wallet`);
}

/**
 * WalletProvider + MidnightProvider that route balances and submissions
 * through the Lace wallet's ConnectedAPI.
 */
function describe(value: unknown): string {
  if (typeof value === 'string') return `string(${value.length})="${value.slice(0, 32)}${value.length > 32 ? '…' : ''}"`;
  if (value instanceof Uint8Array) return `Uint8Array(${value.length})${bytesToHex(value).slice(0, 32)}…`;
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return `Array(${value.length})`;
  return `${typeof value}::${String(value).slice(0, 40)}`;
}

export class BrowserWalletProvider {
  private config: { indexerUri: string; indexerWsUri: string; networkId: string } | null = null;
  private addresses: { coinPublicKey: string; encryptionPublicKey: string } | null = null;
  private readonly connectedApi: ConnectedAPI;

  constructor(connectedApi: ConnectedAPI) {
    this.connectedApi = connectedApi;
  }

  /**
   * Loads wallet config + shielded addresses once. Must be awaited before any
   * deploy because the SDK calls `getCoinPublicKey()`/`getEncryptionPublicKey()`
   * SYNCHRONOUSLY (see midnight-js-contracts createUnprovenDeployTx).
   */
  async initialize(): Promise<void> {
    const [c, addrs] = await Promise.all([
      this.connectedApi.getConfiguration(),
      this.connectedApi.getShieldedAddresses(),
    ]);
    console.log('[Omen][cfg] getConfiguration() =', JSON.stringify(c, (_k, v) => (typeof v === 'bigint' ? v.toString() : v)));
    console.log('[Omen][addr] raw getShieldedAddresses() =', JSON.stringify(addrs));
    this.config = {
      indexerUri: c.indexerUri,
      indexerWsUri: c.indexerWsUri,
      networkId: c.networkId,
    };
    this.addresses = {
      coinPublicKey: normalizeKeyToHex(addrs.shieldedCoinPublicKey, 'coin public key'),
      encryptionPublicKey: normalizeKeyToHex(addrs.shieldedEncryptionPublicKey, 'encryption public key'),
    };
    console.log('[Omen][addr] → coin public key normalized =', describe(this.addresses.coinPublicKey));
    console.log('[Omen][addr] → encryption public key normalized =', describe(this.addresses.encryptionPublicKey));
  }

  private ensureInitialized() {
    if (!this.config || !this.addresses) {
      throw new Error('BrowserWalletProvider: initialize() must be called before use');
    }
    return this;
  }

  networkId = async (): Promise<string> => this.ensureInitialized().config!.networkId;
  indexerUri = async (): Promise<string> => this.ensureInitialized().config!.indexerUri;
  indexerWsUri = async (): Promise<string> => this.ensureInitialized().config!.indexerWsUri;

  /** Coin public key from the wallet, normalized. SYNCHRONOUS (SDK contract). */
  getCoinPublicKey = (): string => this.ensureInitialized().addresses!.coinPublicKey;

  /** Encryption public key from the wallet, normalized. SYNCHRONOUS (SDK contract). */
  getEncryptionPublicKey = (): string => this.ensureInitialized().addresses!.encryptionPublicKey;

  async balanceTx(tx: any): Promise<any> {
    const hex = toHex(tx.serialize());
    console.log(`[Omen][balanceTx] sending hex len=${hex.length} bytes=${hex.length / 2} head=${hex.slice(0, 80)}`);
    const result = await this.connectedApi.balanceUnsealedTransaction(hex);
    const outHex = result.tx;
    console.log(`[Omen][balanceTx] wallet returned hex len=${outHex.length} bytes=${outHex.length / 2} head=${outHex.slice(0, 80)}`);
    return Transaction.deserialize('signature', 'proof', 'binding', fromHex(outHex));
  }

  async submitTx(tx: any): Promise<string> {
    const hex = toHex(tx.serialize());
    console.log(`[Omen][submitTx] sending hex len=${hex.length} bytes=${hex.length / 2} head=${hex.slice(0, 80)}`);
    await this.connectedApi.submitTransaction(hex);
    return tx.identifiers()[0];
  }
}

export async function getWalletProvingProvider(connectedApi: ConnectedAPI, zkConfig: BrowserZkConfigProvider): Promise<ProvingProvider> {
  return connectedApi.getProvingProvider(zkConfig.asKeyMaterial());
}
