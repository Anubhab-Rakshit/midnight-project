/**
 * Encode a string as a fixed 32-byte value.
 *
 * The contract's `localPremonition()` witness returns Bytes<32> and the
 * runtime rejects any other length, so short strings must be zero-padded
 * (not just sliced) and long strings truncated to 32 bytes.
 */

export function toBytes32(value: string): Uint8Array {
  const bytes = new TextEncoder().encode(value);
  if (bytes.length > 32) {
    console.warn(`[Meridian] value "${value.slice(0, 32)}…" truncated to 32 bytes`);
  }
  const out = new Uint8Array(32);
  out.set(bytes.slice(0, 32));
  return out;
}

/**
 * Deterministically derive a 32-byte salt from the invite secret.
 * Both the deploy script and the frontend MUST use the same derivation
 * so that commitSecret(secret, salt) matches the on-chain inviteRoot.
 */
export async function deriveSalt(inviteSecret: string): Promise<Uint8Array> {
  const data = new TextEncoder().encode(`meridian-salt:${inviteSecret}`);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(hash);
}
