import { describe, it, expect } from 'vitest';
import {
  createInitialPrivateState,
  serializePrivateState,
  deserializePrivateState,
} from './private-state';

describe('createInitialPrivateState', () => {
  it('creates state with the given invite secret', () => {
    const state = createInitialPrivateState('my-circle-secret');
    expect(state.inviteSecret).toBe('my-circle-secret');
    expect(state.salt).toHaveLength(32);
    expect(state.createdAt).toBeTruthy();
    expect(state.inviteRoot).toBe('');
  });

  it('generates unique salts each time', () => {
    const a = createInitialPrivateState('same');
    const b = createInitialPrivateState('same');
    expect(Array.from(a.salt)).not.toEqual(Array.from(b.salt));
  });
});

describe('serialize/deserialize round-trip', () => {
  it('round-trips a state through JSON', () => {
    const original = createInitialPrivateState('test-secret');
    const json = serializePrivateState(original);
    const restored = deserializePrivateState(json);

    expect(restored.inviteSecret).toBe(original.inviteSecret);
    expect(restored.createdAt).toBe(original.createdAt);
    expect(restored.inviteRoot).toBe(original.inviteRoot);
    expect(Array.from(restored.salt)).toEqual(Array.from(original.salt));
  });

  it('encodes salt as hex in serialization', () => {
    const state = createInitialPrivateState('x');
    const json = serializePrivateState(state);
    const parsed = JSON.parse(json);
    expect(typeof parsed.salt).toBe('string');
    expect(parsed.salt).toHaveLength(64); // 32 bytes = 64 hex chars
  });
});
