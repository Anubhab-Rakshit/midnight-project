import { describe, it, expect } from 'vitest';
import { toBytes32 } from './bytes32';

describe('toBytes32 (premonition → Compact Bytes<32>)', () => {
  it('returns exactly 32 bytes', () => {
    expect(toBytes32('omen')).toHaveLength(32);
  });

  it('zero-pads a short string to the right', () => {
    const out = toBytes32('moon');
    expect(Array.from(out)).toEqual([
      ...Array.from(new TextEncoder().encode('moon')),
      ...new Array(28).fill(0),
    ]);
  });

  it('truncates strings longer than 32 bytes', () => {
    const out = toBytes32('z'.repeat(64));
    expect(out).toHaveLength(32);
    expect(Array.from(out)).toEqual(new Array(32).fill(122)); // 'z' = 122
  });

  it('handles multibyte UTF-8 by bytes, truncating at the 32nd byte', () => {
    // Each '☾' is 3 bytes UTF-8; 11 chars = 33 bytes → 10 full chars (30 bytes) + 2 bytes of the 11th
    const out = toBytes32('☾'.repeat(11));
    expect(out).toHaveLength(32);
    expect(Array.from(out.slice(0, 30))).toEqual(
      Array.from(new TextEncoder().encode('☾'.repeat(10))),
    );
  });
});
