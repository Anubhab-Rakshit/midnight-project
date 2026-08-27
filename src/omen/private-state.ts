/**
 * Omen — Private State Types & Storage Schema
 *
 * The user's premonition text and salt are NEVER put on-chain.
 * They live exclusively in the browser's local state, managed
 * by the Midnight SDK's level-private-state-provider.
 */

import { Buffer } from 'node:buffer';

// ─── Private State Shape ────────────────────────────────────────────────────

export interface PremonitionPrivateState {
  /** The raw premonition text — stays in browser memory only */
  premonition: string;
  /** Random salt used for commitment — never reused */
  salt: Uint8Array;
  /** ISO timestamp of when this premonition was sealed */
  sealedAt: string;
  /** The on-chain commitment hash (for cross-reference) */
  commitmentHash: string;
}

// ─── Initial State Factory ──────────────────────────────────────────────────

export function createInitialPrivateState(
  premonition: string,
): PremonitionPrivateState {
  // Generate 32 bytes of cryptographic randomness for the salt
  const salt = new Uint8Array(32);
  crypto.getRandomValues(salt);

  return {
    premonition,
    salt,
    sealedAt: new Date().toISOString(),
    commitmentHash: '', // filled after deployment
  };
}

// ─── Witness Context ────────────────────────────────────────────────────────

export interface PremonitionWitnessContext {
  privateState: PremonitionPrivateState;
}

// ─── Serialization Helpers ──────────────────────────────────────────────────

export function serializePrivateState(
  state: PremonitionPrivateState,
): string {
  return JSON.stringify({
    ...state,
    salt: Buffer.from(state.salt).toString('hex'),
  });
}

export function deserializePrivateState(
  json: string,
): PremonitionPrivateState {
  const raw = JSON.parse(json);
  return {
    ...raw,
    salt: Uint8Array.from(Buffer.from(raw.salt, 'hex')),
  };
}

// ─── Local Storage Keys ────────────────────────────────────────────────────

export const PRIVATE_STATE_KEY = 'omen:premonition:private-state';
export const CONTRACT_ADDRESS_KEY = 'omen:premonition:contract-address';

export function savePrivateState(state: PremonitionPrivateState): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(
      PRIVATE_STATE_KEY,
      serializePrivateState(state),
    );
  }
}

export function loadPrivateState(): PremonitionPrivateState | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    const raw = window.localStorage.getItem(PRIVATE_STATE_KEY);
    if (!raw) return null;
    return deserializePrivateState(raw);
  }
  return null;
}

export function saveContractAddress(address: string): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(CONTRACT_ADDRESS_KEY, address);
  }
}

export function loadContractAddress(): string | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.getItem(CONTRACT_ADDRESS_KEY);
  }
  return null;
}
