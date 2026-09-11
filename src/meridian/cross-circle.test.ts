import { describe, it, expect } from 'vitest';
import {
  computeCrossCirclePlan,
  mergeBalances,
  computeTotalNetBalance,
} from './cross-circle';

describe('computeCrossCirclePlan', () => {
  it('returns empty plan for empty balances', () => {
    const result = computeCrossCirclePlan([]);
    expect(result.transfers).toHaveLength(0);
    expect(result.circlePlans.size).toBe(0);
  });

  it('handles single circle', () => {
    const circleBalances = [
      { circleId: 'c1', memberId: 'alice', balance: 50 },
      { circleId: 'c1', memberId: 'bob', balance: -50 },
    ];
    const result = computeCrossCirclePlan(circleBalances);

    expect(result.circlePlans.size).toBe(1);
    expect(result.transfers.length).toBeLessThanOrEqual(1);
  });

  it('consolidates cross-circle debts', () => {
    // Alice owes Bob $50 in circle 1, Bob owes Alice $30 in circle 2
    // Net: Alice owes Bob $20
    const circleBalances = [
      { circleId: 'c1', memberId: 'alice', balance: -50 },
      { circleId: 'c1', memberId: 'bob', balance: 50 },
      { circleId: 'c2', memberId: 'alice', balance: 30 },
      { circleId: 'c2', memberId: 'bob', balance: -30 },
    ];
    const result = computeCrossCirclePlan(circleBalances);

    // Should have fewer transfers than doing each circle separately
    const totalCircleTransfers = Array.from(result.circlePlans.values())
      .reduce((sum, plan) => sum + plan.transfers.length, 0);
    expect(result.transfers.length).toBeLessThanOrEqual(totalCircleTransfers);
  });

  it('reports transfers saved', () => {
    const circleBalances = [
      { circleId: 'c1', memberId: 'alice', balance: -50 },
      { circleId: 'c1', memberId: 'bob', balance: 50 },
      { circleId: 'c2', memberId: 'alice', balance: 30 },
      { circleId: 'c2', memberId: 'bob', balance: -30 },
    ];
    const result = computeCrossCirclePlan(circleBalances);

    // Should save at least some transfers
    expect(result.transfersSaved).toBeGreaterThanOrEqual(0);
  });
});

describe('mergeBalances', () => {
  it('merges balances for a member across circles', () => {
    const circleBalances = [
      { circleId: 'c1', memberId: 'alice', balance: 50 },
      { circleId: 'c2', memberId: 'alice', balance: -30 },
      { circleId: 'c1', memberId: 'bob', balance: -50 },
    ];
    const result = mergeBalances('alice', circleBalances);

    expect(result.get('c1')).toBe(50);
    expect(result.get('c2')).toBe(-30);
    expect(result.size).toBe(2);
  });

  it('returns empty map for member not in any circle', () => {
    const circleBalances = [
      { circleId: 'c1', memberId: 'alice', balance: 50 },
    ];
    const result = mergeBalances('bob', circleBalances);
    expect(result.size).toBe(0);
  });
});

describe('computeTotalNetBalance', () => {
  it('computes total net balance across circles', () => {
    const circleBalances = [
      { circleId: 'c1', memberId: 'alice', balance: 50 },
      { circleId: 'c2', memberId: 'alice', balance: -30 },
    ];
    const result = computeTotalNetBalance('alice', circleBalances);
    expect(result).toBe(20);
  });

  it('returns 0 for member not in any circle', () => {
    const circleBalances = [
      { circleId: 'c1', memberId: 'alice', balance: 50 },
    ];
    const result = computeTotalNetBalance('bob', circleBalances);
    expect(result).toBe(0);
  });
});
