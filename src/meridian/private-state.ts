/**
 * Meridian — Private State Types & Storage Schema
 *
 * The circle's invite secret and salt are NEVER put on-chain.
 * They live exclusively in the browser's local state, managed
 * by the Midnight SDK's level-private-state-provider.
 */

import { Buffer } from 'node:buffer';

// ─── Private State Shape ────────────────────────────────────────────────────

export interface CirclePrivateState {
  /** The shared invite secret — stays in browser memory only */
  inviteSecret: string;
  /** Random salt used for commitment — never reused */
  salt: Uint8Array;
  /** ISO timestamp of when this circle was created */
  createdAt: string;
  /** The on-chain invite root commitment hash (for cross-reference) */
  inviteRoot: string;
}

// ─── Initial State Factory ──────────────────────────────────────────────────

export function createInitialPrivateState(
  inviteSecret: string,
): CirclePrivateState {
  // Generate 32 bytes of cryptographic randomness for the salt
  const salt = new Uint8Array(32);
  crypto.getRandomValues(salt);

  return {
    inviteSecret,
    salt,
    createdAt: new Date().toISOString(),
    inviteRoot: '', // filled after deployment
  };
}

// ─── Serialization Helpers ──────────────────────────────────────────────────

export function serializePrivateState(
  state: CirclePrivateState,
): string {
  return JSON.stringify({
    ...state,
    salt: Buffer.from(state.salt).toString('hex'),
  });
}

export function deserializePrivateState(
  json: string,
): CirclePrivateState {
  const raw = JSON.parse(json);
  return {
    ...raw,
    salt: Uint8Array.from(Buffer.from(raw.salt, 'hex')),
  };
}

// ─── Local Storage Keys ────────────────────────────────────────────────────

export const PRIVATE_STATE_KEY = 'meridian:circle:private-state';
export const CONTRACT_ADDRESS_KEY = 'meridian:circle:contract-address';

export function savePrivateState(state: CirclePrivateState): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(
      PRIVATE_STATE_KEY,
      serializePrivateState(state),
    );
  }
}

export function loadPrivateState(): CirclePrivateState | null {
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
