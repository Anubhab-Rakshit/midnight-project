import { describe, it, expect } from 'vitest';
import { computeMemberBadges, computeAllBadges } from './badges';

describe('computeMemberBadges', () => {
  const expenses = [
    { memberId: 'alice', amount: 100, timestamp: '2026-01-01' },
    { memberId: 'alice', amount: 50, timestamp: '2026-01-02' },
    { memberId: 'bob', amount: 30, timestamp: '2026-01-03' },
    { memberId: 'charlie', amount: 20, timestamp: '2026-01-04' },
  ];
  const balances = new Map([
    ['alice', 100],
    ['bob', -30],
    ['charlie', -70],
  ]);

  it('awards top_contributor to highest spender', () => {
    const result = computeMemberBadges('alice', expenses, balances, new Set());
    expect(result.badges.some((b) => b.type === 'top_contributor')).toBe(true);
  });

  it('awards big_spender for largest single expense', () => {
    const result = computeMemberBadges('alice', expenses, balances, new Set());
    expect(result.badges.some((b) => b.type === 'big_spender')).toBe(true);
  });

  it('awards frequent_spender for most expenses', () => {
    const result = computeMemberBadges('alice', expenses, balances, new Set());
    expect(result.badges.some((b) => b.type === 'frequent_spender')).toBe(true);
  });

  it('awards settler badge when settled', () => {
    const result = computeMemberBadges('bob', expenses, balances, new Set(['bob']));
    expect(result.badges.some((b) => b.type === 'settler')).toBe(true);
  });

  it('does not award settler badge when not settled', () => {
    const result = computeMemberBadges('bob', expenses, balances, new Set());
    expect(result.badges.some((b) => b.type === 'settler')).toBe(false);
  });

  it('returns empty badges for member with no expenses', () => {
    const result = computeMemberBadges('unknown', expenses, balances, new Set());
    expect(result.badges).toHaveLength(0);
  });
});

describe('computeAllBadges', () => {
  const expenses = [
    { memberId: 'alice', amount: 100, timestamp: '2026-01-01' },
    { memberId: 'bob', amount: 50, timestamp: '2026-01-02' },
  ];
  const balances = new Map([
    ['alice', 50],
    ['bob', -50],
  ]);

  it('computes badges for all members', () => {
    const result = computeAllBadges(expenses, balances, new Set());
    expect(result).toHaveLength(2);
    expect(result.map((r) => r.memberId).sort()).toEqual(['alice', 'bob']);
  });

  it('each member has at least one badge', () => {
    const result = computeAllBadges(expenses, balances, new Set());
    for (const member of result) {
      expect(member.badges.length).toBeGreaterThan(0);
    }
  });
});
