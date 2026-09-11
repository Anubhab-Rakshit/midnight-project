import { describe, it, expect } from 'vitest';
import {
  computeCircleAnalytics,
  computeMemberStats,
  detectAnomalies,
} from './analytics';
import type { Expense } from './analytics';

describe('computeCircleAnalytics', () => {
  it('returns zero values for empty expenses', () => {
    const result = computeCircleAnalytics([]);
    expect(result.totalSpent).toBe(0);
    expect(result.expenseCount).toBe(0);
    expect(result.averageExpense).toBe(0);
    expect(result.medianExpense).toBe(0);
  });

  it('computes correct aggregate stats', () => {
    const expenses: Expense[] = [
      { memberId: 'alice', amount: 100, label: 'Dinner', timestamp: '2026-01-01' },
      { memberId: 'bob', amount: 50, label: 'Lunch', timestamp: '2026-01-02' },
      { memberId: 'charlie', amount: 75, label: 'Coffee', timestamp: '2026-01-03' },
    ];
    const result = computeCircleAnalytics(expenses);

    expect(result.totalSpent).toBe(225);
    expect(result.expenseCount).toBe(3);
    expect(result.averageExpense).toBe(75);
    expect(result.medianExpense).toBe(75);
  });

  it('computes correct median for even number of expenses', () => {
    const expenses: Expense[] = [
      { memberId: 'alice', amount: 10, label: 'A', timestamp: '2026-01-01' },
      { memberId: 'bob', amount: 20, label: 'B', timestamp: '2026-01-02' },
      { memberId: 'charlie', amount: 30, label: 'C', timestamp: '2026-01-03' },
      { memberId: 'diana', amount: 40, label: 'D', timestamp: '2026-01-04' },
    ];
    const result = computeCircleAnalytics(expenses);

    expect(result.medianExpense).toBe(25); // (20 + 30) / 2
  });

  it('detects large expenses', () => {
    const expenses: Expense[] = [
      { memberId: 'alice', amount: 10, label: 'A', timestamp: '2026-01-01' },
      { memberId: 'bob', amount: 100, label: 'B', timestamp: '2026-01-02' },
    ];
    const result = computeCircleAnalytics(expenses);

    // 100 > average(55) * 3? 55 * 3 = 165, so no
    expect(result.hasLargeExpenses).toBe(false);
  });

  it('detects fairly distributed expenses', () => {
    const expenses: Expense[] = [
      { memberId: 'alice', amount: 50, label: 'A', timestamp: '2026-01-01' },
      { memberId: 'bob', amount: 55, label: 'B', timestamp: '2026-01-02' },
      { memberId: 'charlie', amount: 45, label: 'C', timestamp: '2026-01-03' },
    ];
    const result = computeCircleAnalytics(expenses);

    expect(result.isFairlyDistributed).toBe(true);
  });
});

describe('computeMemberStats', () => {
  it('returns correct stats for a member', () => {
    const balances = new Map([
      ['alice', 50],
      ['bob', -50],
    ]);
    const expenses: Expense[] = [
      { memberId: 'alice', amount: 100, label: 'Dinner', timestamp: '2026-01-01' },
      { memberId: 'bob', amount: 50, label: 'Lunch', timestamp: '2026-01-02' },
    ];

    const result = computeMemberStats('alice', balances, expenses);
    expect(result.memberId).toBe('alice');
    expect(result.netBalance).toBe(50);
    expect(result.expenseCount).toBe(1);
  });

  it('identifies top contributor', () => {
    const balances = new Map([
      ['alice', 100],
      ['bob', -100],
    ]);
    const expenses: Expense[] = [
      { memberId: 'alice', amount: 200, label: 'Big', timestamp: '2026-01-01' },
      { memberId: 'bob', amount: 50, label: 'Small', timestamp: '2026-01-02' },
    ];

    const alice = computeMemberStats('alice', balances, expenses);
    const bob = computeMemberStats('bob', balances, expenses);

    expect(alice.isTopContributor).toBe(true);
    expect(bob.isTopContributor).toBe(false);
  });
});

describe('detectAnomalies', () => {
  it('returns empty map for empty expenses', () => {
    const result = detectAnomalies([]);
    expect(result.size).toBe(0);
  });

  it('detects outlier spending', () => {
    const expenses: Expense[] = [
      { memberId: 'alice', amount: 10, label: 'A', timestamp: '2026-01-01' },
      { memberId: 'bob', amount: 10, label: 'B', timestamp: '2026-01-02' },
      { memberId: 'charlie', amount: 100, label: 'C', timestamp: '2026-01-03' },
    ];
    const result = detectAnomalies(expenses);

    // avg = 40, threshold = 40*2 = 80, charlie = 100 > 80
    expect(result.get('charlie')?.isOutlier).toBe(true);
    expect(result.get('alice')?.isOutlier).toBe(false);
  });

  it('detects frequent spender', () => {
    const expenses: Expense[] = [
      { memberId: 'alice', amount: 10, label: 'A', timestamp: '2026-01-01' },
      { memberId: 'alice', amount: 10, label: 'B', timestamp: '2026-01-02' },
      { memberId: 'alice', amount: 10, label: 'C', timestamp: '2026-01-03' },
      { memberId: 'bob', amount: 10, label: 'D', timestamp: '2026-01-04' },
    ];
    const result = detectAnomalies(expenses);

    expect(result.get('alice')?.isFrequentSpender).toBe(true);
    expect(result.get('bob')?.isFrequentSpender).toBe(false);
  });
});
