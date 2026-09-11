import { describe, it, expect } from 'vitest';
import { computeMinimumTransfers, verifySettlementPlan } from './netting';

describe('computeMinimumTransfers', () => {
  it('returns empty plan for no balances', () => {
    const balances = new Map<string, number>();
    const plan = computeMinimumTransfers(balances);
    expect(plan.transfers).toHaveLength(0);
    expect(plan.nonZeroCount).toBe(0);
    expect(plan.totalSettled).toBe(0);
  });

  it('settles a simple 2-person split', () => {
    const balances = new Map([
      ['alice', 50],
      ['bob', -50],
    ]);
    const plan = computeMinimumTransfers(balances);
    expect(plan.transfers).toHaveLength(1);
    expect(plan.transfers[0]).toEqual({ from: 'bob', to: 'alice', amount: 50 });
    expect(plan.nonZeroCount).toBe(2);
  });

  it('settles a 3-person cycle with minimum transfers', () => {
    // Alice paid 100, Bob paid 50, Charlie paid 25
    // Total = 175, each should pay 58.33
    // Alice is owed 41.67, Bob is owed -8.33, Charlie owes -33.33
    const balances = new Map([
      ['alice', 41.67],
      ['bob', -8.33],
      ['charlie', -33.33],
    ]);
    const plan = computeMinimumTransfers(balances);
    // Minimum transfers = nonZeroCount - 1 = 2
    expect(plan.transfers.length).toBeLessThanOrEqual(2);
    expect(plan.nonZeroCount).toBe(3);

    // Verify zero-sum
    const verification = verifySettlementPlan(balances, plan);
    expect(verification.valid).toBe(true);
    expect(verification.optimal).toBe(true);
  });

  it('settles a complex 5-person scenario', () => {
    const balances = new Map([
      ['alice', 120],
      ['bob', 45],
      ['charlie', -80],
      ['diana', -60],
      ['eve', -25],
    ]);
    const plan = computeMinimumTransfers(balances);
    expect(plan.nonZeroCount).toBe(5);
    // Minimum = 4 transfers
    expect(plan.transfers.length).toBeLessThanOrEqual(4);

    const verification = verifySettlementPlan(balances, plan);
    expect(verification.valid).toBe(true);
    expect(verification.optimal).toBe(true);
  });

  it('ignores dust balances', () => {
    const balances = new Map([
      ['alice', 50],
      ['bob', -49.998], // dust
    ]);
    const plan = computeMinimumTransfers(balances);
    // Bob's tiny balance is effectively zero
    expect(plan.transfers.length).toBeLessThanOrEqual(1);
  });
});

describe('verifySettlementPlan', () => {
  it('validates a correct plan', () => {
    const balances = new Map([
      ['alice', 100],
      ['bob', -40],
      ['charlie', -60],
    ]);
    const plan = computeMinimumTransfers(balances);
    const result = verifySettlementPlan(balances, plan);
    expect(result.valid).toBe(true);
    expect(result.optimal).toBe(true);
  });

  it('rejects a plan that does not net to zero', () => {
    const balances = new Map([
      ['alice', 100],
      ['bob', -100],
    ]);
    const badPlan = {
      transfers: [{ from: 'bob', to: 'alice', amount: 50 }],
      nonZeroCount: 2,
      totalSettled: 50,
    };
    const result = verifySettlementPlan(balances, badPlan);
    expect(result.valid).toBe(false);
  });

  it('detects non-optimal plan', () => {
    const balances = new Map([
      ['alice', 100],
      ['bob', -40],
      ['charlie', -60],
    ]);
    // Sub-optimal: 3 transfers instead of 2 (charlie splits into two payments)
    const subOptimal = {
      transfers: [
        { from: 'bob', to: 'alice', amount: 40 },
        { from: 'charlie', to: 'alice', amount: 30 },
        { from: 'charlie', to: 'alice', amount: 30 }, // unnecessary split
      ],
      nonZeroCount: 3,
      totalSettled: 100,
    };
    const result = verifySettlementPlan(balances, subOptimal);
    expect(result.valid).toBe(true);
    expect(result.optimal).toBe(false);
  });
});
