/**
 * Meridian — Witness Provider Implementations
 *
 * These functions bridge the private state (stored locally in the browser)
 * to the Compact circuit's witness declarations. The circuit calls these
 * witnesses to obtain secret values; the SDK records the return values
 * as private inputs to the ZK proof.
 *
 * CRITICAL: The return values NEVER appear on-chain. They are only used
 * client-side to generate the zero-knowledge proof.
 */

import type { CirclePrivateState } from './private-state';

// ─── Witness Context ────────────────────────────────────────────────────────

export interface CircleWitnessContext {
  privateState: CirclePrivateState;
  settlementPlanHash?: Uint8Array;
  expenseCommitmentHash?: Uint8Array;
}

// ─── Witness Return Types ───────────────────────────────────────────────────

export type WitnessResult<T> = [CirclePrivateState, T];

// ─── Witness: localSecret ──────────────────────────────────────────────────

/**
 * Returns the circle's shared invite secret as Bytes<32> to the circuit.
 * The string is UTF-8 encoded and padded/truncated to exactly 32 bytes.
 *
 * TypeScript: string → Compact: Bytes<32>
 * Private state is unchanged.
 */
export function localSecret({
  privateState,
}: CircleWitnessContext): WitnessResult<Uint8Array> {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(privateState.inviteSecret);

  // Pad or truncate to 32 bytes
  const padded = new Uint8Array(32);
  padded.set(bytes.slice(0, 32));

  return [privateState, padded];
}

// ─── Witness: localSalt ─────────────────────────────────────────────────────

/**
 * Returns the random salt as Bytes<32> to the circuit.
 * This salt was generated when the circle was created and ensures
 * that identical invite secrets produce different commitment hashes.
 *
 * TypeScript: Uint8Array → Compact: Bytes<32>
 * Private state is unchanged.
 */
export function localSalt({
  privateState,
}: CircleWitnessContext): WitnessResult<Uint8Array> {
  if (privateState.salt.length !== 32) {
    throw new Error(
      `Corrupted private state: salt must be 32 bytes, got ${privateState.salt.length}`,
    );
  }
  return [privateState, privateState.salt];
}

// ─── Witness: settlementHash ────────────────────────────────────────────────

/**
 * Returns the commitment hash of the settlement plan as Bytes<32>.
 * This is computed off-chain by hashing the transfer list.
 * The hash commits to the plan without revealing individual amounts.
 *
 * TypeScript: Uint8Array → Compact: Bytes<32>
 * Private state is unchanged.
 */
export function settlementHash({
  privateState,
  settlementPlanHash,
}: CircleWitnessContext): WitnessResult<Uint8Array> {
  if (!settlementPlanHash || settlementPlanHash.length !== 32) {
    throw new Error(
      'settlementHash witness requires a 32-byte plan hash',
    );
  }
  return [privateState, settlementPlanHash];
}

// ─── Witness: expenseCommitment ─────────────────────────────────────────────

/**
 * Returns the commitment hash of an expense as Bytes<32>.
 * This is computed off-chain by hashing the expense amount with a salt.
 * The hash commits to the expense without revealing the amount.
 *
 * TypeScript: Uint8Array → Compact: Bytes<32>
 * Private state is unchanged.
 */
export function expenseCommitment({
  privateState,
  expenseCommitmentHash,
}: CircleWitnessContext): WitnessResult<Uint8Array> {
  if (!expenseCommitmentHash || expenseCommitmentHash.length !== 32) {
    throw new Error(
      'expenseCommitment witness requires a 32-byte commitment hash',
    );
  }
  return [privateState, expenseCommitmentHash];
}

// ─── Witness Map (for SDK registration) ────────────────────────────────────

export const witnesses = {
  localSecret,
  localSalt,
  settlementHash,
  expenseCommitment,
};
