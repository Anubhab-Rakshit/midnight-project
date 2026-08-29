import { describe, it, expect } from 'vitest';
import { localPremonition, localSalt } from './witnesses';
import type { PremonitionPrivateState } from './private-state';

function makeState(premonition: string, salt = new Uint8Array(32)): PremonitionPrivateState {
  return {
    premonition,
    salt,
    sealedAt: '2026-08-29T00:00:00.000Z',
    commitmentHash: '',
  };
}

describe('localPremonition witness', () => {
  it('pads a short premonition to exactly 32 bytes with trailing zeros', () => {
    const state = makeState('moon');
    const [, padded] = localPremonition({ privateState: state });
    expect(padded).toHaveLength(32);
    expect(Array.from(padded.slice(0, 4))).toEqual([109, 111, 111, 110]); // "moon"
    expect(Array.from(padded.slice(4))).toEqual(new Array(28).fill(0));
  });

  it('truncates a premonition longer than 32 bytes', () => {
    const longText = 'x'.repeat(64);
    const [, padded] = localPremonition({ privateState: makeState(longText) });
    expect(padded).toHaveLength(32);
    expect(Array.from(padded)).toEqual(new Array(32).fill(120)); // 'x' = 120
  });

  it('keeps an exact 32-byte premonition unchanged', () => {
    const exactText = 'y'.repeat(32);
    const [, padded] = localPremonition({ privateState: makeState(exactText) });
    expect(padded).toHaveLength(32);
    expect(Array.from(padded)).toEqual(new Array(32).fill(121)); // 'y' = 121
  });

  it('returns the same private state reference unchanged', () => {
    const state = makeState('hello');
    const [resultState] = localPremonition({ privateState: state });
    expect(resultState).toBe(state);
  });
});

describe('localSalt witness', () => {
  it('returns a valid 32-byte salt unchanged', () => {
    const salt = new Uint8Array(32).fill(7);
    const [, result] = localSalt({ privateState: makeState('x', salt) });
    expect(result).toHaveLength(32);
    expect(Array.from(result)).toEqual(new Array(32).fill(7));
  });

  it('throws when the salt is not exactly 32 bytes', () => {
    const badSalt = new Uint8Array(16);
    expect(() => localSalt({ privateState: makeState('x', badSalt) })).toThrow(
      /salt must be 32 bytes/,
    );
  });
});
