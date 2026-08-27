/**
 * Omen — Witness Provider Implementations
 *
 * These functions bridge the private state (stored locally in the browser)
 * to the Compact circuit's witness declarations. The circuit calls these
 * witnesses to obtain secret values; the SDK records the return values
 * as private inputs to the ZK proof.
 *
 * CRITICAL: The return values NEVER appear on-chain. They are only used
 * client-side to generate the zero-knowledge proof.
 */

import type { PremonitionPrivateState } from './private-state';

// ─── Witness Context ────────────────────────────────────────────────────────

export interface PremonitionWitnessContext {
  privateState: PremonitionPrivateState;
}

// ─── Witness Return Types ───────────────────────────────────────────────────

export type WitnessResult<T> = [PremonitionPrivateState, T];

// ─── Witness: localPremonition ──────────────────────────────────────────────

/**
 * Returns the premonition text as Bytes<32> to the circuit.
 * The string is UTF-8 encoded and padded/truncated to exactly 32 bytes.
 *
 * TypeScript: string → Compact: Bytes<32>
 * Private state is unchanged.
 */
export function localPremonition({
  privateState,
}: PremonitionWitnessContext): WitnessResult<Uint8Array> {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(privateState.premonition);

  // Pad or truncate to 32 bytes
  const padded = new Uint8Array(32);
  padded.set(bytes.slice(0, 32));

  return [privateState, padded];
}

// ─── Witness: localSalt ─────────────────────────────────────────────────────

/**
 * Returns the random salt as Bytes<32> to the circuit.
 * This salt was generated when the premonition was created and ensures
 * that identical premonitions produce different commitment hashes.
 *
 * TypeScript: Uint8Array → Compact: Bytes<32>
 * Private state is unchanged.
 */
export function localSalt({
  privateState,
}: PremonitionWitnessContext): WitnessResult<Uint8Array> {
  if (privateState.salt.length !== 32) {
    throw new Error(
      `Corrupted private state: salt must be 32 bytes, got ${privateState.salt.length}`,
    );
  }
  return [privateState, privateState.salt];
}

// ─── Witness Map (for SDK registration) ────────────────────────────────────

export const witnesses = {
  localPremonition,
  localSalt,
};
