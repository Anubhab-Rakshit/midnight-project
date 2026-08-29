import { describe, it, expect } from 'vitest';
import {
  serializePrivateState,
  deserializePrivateState,
  createInitialPrivateState,
  type PremonitionPrivateState,
} from './private-state';

describe('private state serialization', () => {
  it('round-trips a private state through JSON without data loss', () => {
    const state: PremonitionPrivateState = {
      premonition: 'The moon will rise twice',
      salt: Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]),
      sealedAt: '2026-08-29T00:00:00.000Z',
      commitmentHash: '0xabcd',
    };

    const restored = deserializePrivateState(serializePrivateState(state));

    expect(restored.premonition).toBe(state.premonition);
    expect(restored.sealedAt).toBe(state.sealedAt);
    expect(restored.commitmentHash).toBe(state.commitmentHash);
    // Salt comes back as a 32-byte Uint8Array
    expect(restored.salt).toBeInstanceOf(Uint8Array);
    expect(restored.salt).toHaveLength(32);
    expect(Array.from(restored.salt)).toEqual(Array.from(state.salt));
  });

  it('serializes salt as lowercase hex', () => {
    const state: PremonitionPrivateState = {
      premonition: 'x',
      salt: Uint8Array.from([0, 15, 255]),
      sealedAt: '2026-08-29T00:00:00.000Z',
      commitmentHash: '',
    };
    const json = serializePrivateState(state);
    const parsed = JSON.parse(json);
    expect(parsed.salt).toBe('000fff');
    expect(parsed.salt).toMatch(/^[0-9a-f]+$/);
  });

  it('createInitialPrivateState produces a 32-byte salt and iso timestamp', () => {
    const state = createInitialPrivateState('a prophecy');
    expect(state.premonition).toBe('a prophecy');
    expect(state.salt).toHaveLength(32);
    expect(state.commitmentHash).toBe('');
    expect(new Date(state.sealedAt).toString()).not.toBe('Invalid Date');
  });
});
