import { describe, it, expect } from 'vitest';
import { localSecret, localSalt } from './witnesses';
import type { CirclePrivateState } from './private-state';

function makeState(inviteSecret: string, salt = new Uint8Array(32)): CirclePrivateState {
  return {
    inviteSecret,
    salt,
    createdAt: '2026-09-11T00:00:00.000Z',
    inviteRoot: '',
  };
}

describe('localSecret witness', () => {
  it('pads a short secret to exactly 32 bytes with trailing zeros', () => {
    const state = makeState('circle123');
    const [, padded] = localSecret({ privateState: state });
    expect(padded).toHaveLength(32);
    // "circle123" = c(99) i(105) r(114) c(99) l(108) e(101) 1(49) 2(50) 3(51)
    expect(Array.from(padded.slice(0, 9))).toEqual([99, 105, 114, 99, 108, 101, 49, 50, 51]);
    // Rest should be zeros
    expect(Array.from(padded.slice(9))).toEqual(new Array(23).fill(0));
  });

  it('truncates a secret longer than 32 bytes', () => {
    const longText = 'x'.repeat(64);
    const [, padded] = localSecret({ privateState: makeState(longText) });
    expect(padded).toHaveLength(32);
    expect(Array.from(padded)).toEqual(new Array(32).fill(120)); // 'x' = 120
  });

  it('keeps an exact 32-byte secret unchanged', () => {
    const exactText = 'y'.repeat(32);
    const [, padded] = localSecret({ privateState: makeState(exactText) });
    expect(padded).toHaveLength(32);
    expect(Array.from(padded)).toEqual(new Array(32).fill(121)); // 'y' = 121
  });

  it('returns the same private state reference unchanged', () => {
    const state = makeState('hello');
    const [resultState] = localSecret({ privateState: state });
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
