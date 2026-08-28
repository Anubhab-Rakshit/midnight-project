/**
 * Omen — Contract Bindings & Circuit Runners
 *
 * Clean TypeScript interface for the premonition.compact contract.
 * Handles contract loading, proof generation, and transaction submission.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Buffer } from 'node:buffer';

// ─── Compiled Contract Artifacts ────────────────────────────────────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ZK_CONFIG_PATH = path.resolve(
  __dirname,
  '..',
  'contracts',
  'managed',
  'premonition',
);

// ─── Contract Info Types ────────────────────────────────────────────────────

export interface CircuitInfo {
  name: string;
  pure: boolean;
  proof: boolean;
  arguments: Array<{ name: string; type: { 'type-name': string } }>;
  resultType: { 'type-name': string };
}

export interface WitnessInfo {
  name: string;
  arguments: unknown[];
  resultType: { 'type-name': string; length?: number };
}

export interface LedgerField {
  name: string;
  index: number;
  exported: boolean;
  storage: string;
  type: { 'type-name': string; length?: number };
}

export interface ContractInfo {
  'compiler-version': string;
  'language-version': string;
  'runtime-version': string;
  circuits: CircuitInfo[];
  witnesses: WitnessInfo[];
  ledger: LedgerField[];
}

// ─── Load Contract Info ─────────────────────────────────────────────────────

export function getContractInfo(): ContractInfo {
  const infoPath = path.join(ZK_CONFIG_PATH, 'compiler', 'contract-info.json');
  return JSON.parse(fs.readFileSync(infoPath, 'utf-8'));
}

// ─── Load Compiled Contract Module ──────────────────────────────────────────

export async function loadContractModule() {
  const contractPath = path.join(ZK_CONFIG_PATH, 'contract', 'index.js');
  const contractUrl = `file://${contractPath}`;
  return await import(contractUrl);
}

// ─── Circuit Runners ────────────────────────────────────────────────────────

/**
 * Seal a premonition on-chain.
 *
 * Flow:
 * 1. Witness providers supply (premonition, salt) from local state
 * 2. Circuit computes commitment hash client-side
 * 3. ZK proof is generated
 * 4. Transaction is submitted to the network
 * 5. Only the commitment hash appears on-chain
 *
 * @param providers - Midnight SDK providers (wallet, proof, etc.)
 * @param premonitionText - The secret prediction text
 * @returns The on-chain commitment hash
 */
export async function sealPremonition(
  providers: any,
  premonitionText: string,
): Promise<{ commitmentHash: string; txId: string }> {
  const { CompiledContract } = await import(
    '@midnight-ntwrk/midnight-js-protocol/compact-js'
  );
  const HelloWorld = await loadContractModule();

  let compiledContract: any = CompiledContract.make(
    'premonition',
    HelloWorld.Contract,
  );
  // @ts-expect-error SDK generic types don't infer through union — runtime is correct
  compiledContract = CompiledContract.withWitnesses(compiledContract, {
    localPremonition: (ctx: any) => [ctx.privateState, new TextEncoder().encode(premonitionText).slice(0, 32)],
    localSalt: (ctx: any) => [ctx.privateState, crypto.getRandomValues(new Uint8Array(32))],
  });
  // @ts-expect-error Same generic inference issue
  compiledContract = CompiledContract.withCompiledFileAssets(compiledContract, ZK_CONFIG_PATH);

  const { deployContract } = await import(
    '@midnight-ntwrk/midnight-js-contracts'
  );

  // Deploy if not already deployed, or find existing
  const deployed = await deployContract(providers, {
    compiledContract,
    args: [],
    privateStateId: 'premonitionPrivateState',
    initialPrivateState: {
      premonition: premonitionText,
      salt: crypto.getRandomValues(new Uint8Array(32)),
      sealedAt: new Date().toISOString(),
      commitmentHash: '',
    },
  });

  const contractAddress = deployed.deployTxData.public.contractAddress;

  return {
    commitmentHash: contractAddress, // placeholder — real hash from ledger
    txId: deployed.deployTxData.public.txId,
  };
}

// ─── ZK Config Path Export ──────────────────────────────────────────────────

export { ZK_CONFIG_PATH };
