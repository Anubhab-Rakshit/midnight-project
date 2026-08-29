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
    console.warn(`[Omen] value "${value.slice(0, 32)}…" truncated to 32 bytes`);
  }
  const out = new Uint8Array(32);
  out.set(bytes.slice(0, 32));
  return out;
}
