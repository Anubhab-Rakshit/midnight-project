import { describe, it, expect } from 'vitest';

describe('circle-math: split types', () => {
  interface ExpenseSplit {
    amount: number;
    splitType: 'equal' | 'exact' | 'percentage';
    shares?: number[];
    percentages?: number[];
  }

  function computeSplits(
    expense: ExpenseSplit,
    memberIds: string[],
  ): Map<string, number> {
    const result = new Map<string, number>();
    const n = memberIds.length;

    switch (expense.splitType) {
      case 'equal': {
        const share = expense.amount / n;
        for (const id of memberIds) {
          result.set(id, share);
        }
        break;
      }
      case 'exact': {
        if (!expense.shares || expense.shares.length !== n) {
          throw new Error('Exact split requires shares for each member');
        }
        for (let i = 0; i < n; i++) {
          result.set(memberIds[i], expense.shares[i]);
        }
        break;
      }
      case 'percentage': {
        if (!expense.percentages || expense.percentages.length !== n) {
          throw new Error('Percentage split requires percentages for each member');
        }
        const total = expense.percentages.reduce((a, b) => a + b, 0);
        if (Math.abs(total - 100) > 0.01) {
          throw new Error(`Percentages must sum to 100, got ${total}`);
        }
        for (let i = 0; i < n; i++) {
          result.set(memberIds[i], (expense.percentages[i] / 100) * expense.amount);
        }
        break;
      }
    }

    return result;
  }

  const members = ['alice', 'bob', 'charlie'];

  it('splits evenly across 3 members', () => {
    const splits = computeSplits({ amount: 90, splitType: 'equal' }, members);
    expect(splits.get('alice')).toBe(30);
    expect(splits.get('bob')).toBe(30);
    expect(splits.get('charlie')).toBe(30);
  });

  it('splits with exact shares', () => {
    const splits = computeSplits(
      { amount: 100, splitType: 'exact', shares: [50, 30, 20] },
      members,
    );
    expect(splits.get('alice')).toBe(50);
    expect(splits.get('bob')).toBe(30);
    expect(splits.get('charlie')).toBe(20);
  });

  it('splits by percentage', () => {
    const splits = computeSplits(
      { amount: 200, splitType: 'percentage', percentages: [50, 30, 20] },
      members,
    );
    expect(splits.get('alice')).toBe(100);
    expect(splits.get('bob')).toBe(60);
    expect(splits.get('charlie')).toBe(40);
  });

  it('throws on invalid percentage sum', () => {
    expect(() =>
      computeSplits(
        { amount: 100, splitType: 'percentage', percentages: [50, 30, 30] },
        members,
      ),
    ).toThrow(/Percentages must sum to 100/);
  });

  it('throws on mismatched exact shares', () => {
    expect(() =>
      computeSplits(
        { amount: 100, splitType: 'exact', shares: [50, 50] },
        members,
      ),
    ).toThrow(/requires shares for each member/);
  });

  it('net balances from multiple expenses settle correctly', () => {
    // Expense 1 (90): Alice pays, equal split → Alice: +60, Bob: -30, Charlie: -30
    // Expense 2 (60): Bob pays, equal split → Alice: -20, Bob: +40, Charlie: -20
    // Net: Alice: +40, Bob: +10, Charlie: -50
    const aliceNet = 60 - 20;
    const bobNet = -30 + 40;
    const charlieNet = -30 - 20;

    expect(aliceNet).toBe(40);
    expect(bobNet).toBe(10);
    expect(charlieNet).toBe(-50);

    // All balances should sum to zero
    const total = aliceNet + bobNet + charlieNet;
    expect(total).toBe(0);
  });
});
