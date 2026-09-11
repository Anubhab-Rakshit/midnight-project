/**
 * Meridian — Contract Bindings & Circuit Runners
 *
 * Clean TypeScript interface for the splitpool.compact contract.
 * Handles contract loading, proof generation, and transaction submission.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

// ─── Compiled Contract Artifacts ────────────────────────────────────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ZK_CONFIG_PATH = path.resolve(
  __dirname,
  '..',
  'contracts',
  'managed',
  'splitpool',
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

// ─── ZK Config Path Export ──────────────────────────────────────────────────

export { ZK_CONFIG_PATH };
