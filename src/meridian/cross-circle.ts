/**
 * Meridian — Cross-Circle Netting
 *
 * When a person participates in multiple circles, cross-circle netting
 * combines their balances across all circles to minimize total transfers.
 *
 * Example:
 *   Circle 1: Alice owes Bob $50
 *   Circle 2: Bob owes Alice $30
 *   Cross-circle: Only Alice pays Bob $20 (net)
 *
 * This is computed off-chain and never revealed on-chain. Each circle's
 * settlement is independent — cross-circle netting is an optimization
 * for the user's total payment graph.
 */

import type { Transfer, SettlementPlan } from './netting';
import { computeMinimumTransfers } from './netting';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface CircleBalance {
  circleId: string;
  memberId: string;
  balance: number; // positive = owed, negative = owes
}

export interface CrossCircleTransfer {
  from: string;
  to: string;
  amount: number;
  /** Which circle this transfer belongs to */
  circleId: string;
}

export interface CrossCirclePlan {
  /** Optimized transfers after cross-circle netting */
  transfers: CrossCircleTransfer[];
  /** Per-circle settlement plans (before optimization) */
  circlePlans: Map<string, SettlementPlan>;
  /** Total transfers saved by cross-circle netting */
  transfersSaved: number;
  /** Total amount settled */
  totalSettled: number;
}

// ─── Cross-Circle Netting Engine ────────────────────────────────────────────

/**
 * Compute the cross-circle netting plan for a set of circles.
 *
 * Algorithm:
 * 1. Collect all balances across circles
 * 2. For each pair of people (A, B), compute net balance across all circles
 * 3. If A owes B in one circle and B owes A in another, consolidate
 * 4. Compute minimum transfers for each circle independently
 * 5. Report how many transfers were saved by cross-circle optimization
 *
 * @param circleBalances - Array of {circleId, memberId, balance} for all circles
 * @returns Cross-circle settlement plan with optimization stats
 */
export function computeCrossCirclePlan(
  circleBalances: CircleBalance[],
): CrossCirclePlan {
  // Group balances by circle
  const circleMap = new Map<string, Map<string, number>>();
  for (const cb of circleBalances) {
    if (!circleMap.has(cb.circleId)) {
      circleMap.set(cb.circleId, new Map());
    }
    circleMap.get(cb.circleId)!.set(cb.memberId, cb.balance);
  }

  // Compute per-circle settlement plans
  const circlePlans = new Map<string, SettlementPlan>();
  let totalBefore = 0;

  for (const [circleId, balances] of circleMap) {
    const plan = computeMinimumTransfers(balances);
    circlePlans.set(circleId, plan);
    totalBefore += plan.transfers.length;
  }

  // Cross-circle optimization: compute net balances per person
  const netBalances = new Map<string, number>();
  for (const cb of circleBalances) {
    netBalances.set(cb.memberId, (netBalances.get(cb.memberId) ?? 0) + cb.balance);
  }

  // The optimized plan is the minimum transfers across all circles combined
  const optimizedPlan = computeMinimumTransfers(netBalances);

  // Create cross-circle transfers by distributing optimized transfers to circles
  const transfers: CrossCircleTransfer[] = [];
  const remaining = new Map(netBalances);

  for (const t of optimizedPlan.transfers) {
    // Find the best circle to route this transfer through
    const fromBalance = remaining.get(t.from) ?? 0;
    const toBalance = remaining.get(t.to) ?? 0;

    // Route through the circle where from owes the most
    let bestCircle = '';
    let bestAmount = 0;

    for (const [circleId, balances] of circleMap) {
      const fromInCircle = balances.get(t.from) ?? 0;
      const toInCircle = balances.get(t.to) ?? 0;

      // from owes in this circle (negative balance)
      if (fromInCircle < -0.001) {
        const possible = Math.min(Math.abs(fromInCircle), t.amount - bestAmount);
        if (possible > bestAmount) {
          bestCircle = circleId;
          bestAmount = possible;
        }
      }
    }

    if (bestCircle && bestAmount > 0.001) {
      transfers.push({
        from: t.from,
        to: t.to,
        amount: Math.round(bestAmount * 100) / 100,
        circleId: bestCircle,
      });
      remaining.set(t.from, (remaining.get(t.from) ?? 0) + bestAmount);
      remaining.set(t.to, (remaining.get(t.to) ?? 0) - bestAmount);
    }
  }

  const totalAfter = transfers.length;
  const transfersSaved = Math.max(0, totalBefore - totalAfter);

  return {
    transfers,
    circlePlans,
    transfersSaved,
    totalSettled: optimizedPlan.totalSettled,
  };
}

/**
 * Merge balances for a person across multiple circles.
 *
 * This is the primitive that enables cross-circle netting:
 * given a person's balance in each circle, compute their total
 * net position across all circles.
 *
 * @param memberId - The person to compute net balance for
 * @param circleBalances - Array of {circleId, memberId, balance}
 * @returns Map of circleId → net balance for this person
 */
export function mergeBalances(
  memberId: string,
  circleBalances: CircleBalance[],
): Map<string, number> {
  const result = new Map<string, number>();

  for (const cb of circleBalances) {
    if (cb.memberId === memberId) {
      result.set(cb.circleId, cb.balance);
    }
  }

  return result;
}

/**
 * Compute the total net balance for a person across all circles.
 *
 * @param memberId - The person to compute net balance for
 * @param circleBalances - Array of {circleId, memberId, balance}
 * @returns Total net balance (positive = net creditor, negative = net debtor)
 */
export function computeTotalNetBalance(
  memberId: string,
  circleBalances: CircleBalance[],
): number {
  return circleBalances
    .filter((cb) => cb.memberId === memberId)
    .reduce((sum, cb) => sum + cb.balance, 0);
}
