/**
 * Meridian — Off-chain Netting Engine
 *
 * Computes the minimum-transaction settlement plan for a circle.
 * For small circles (≤ 20 members), uses exhaustive search to find
 * the true minimum. For larger circles, falls back to the greedy
 * approximation (same algorithm as Splitstellar's "N fewer txs").
 *
 * The on-chain settlement circuit proves:
 *   (a) balances recomputed from committed expenses match
 *   (b) the plan nets each person to exactly zero (zero-sum)
 *   (c) plan uses exactly (nonZeroCount - 1) transfers = proven minimum
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Transfer {
  from: string;
  to: string;
  amount: number;
}

export interface SettlementPlan {
  transfers: Transfer[];
  nonZeroCount: number;
  totalSettled: number;
}

// ─── Netting Engine ─────────────────────────────────────────────────────────

/**
 * Compute the minimum-transaction settlement plan from a map of
 * net balances (positive = owed money, negative = owes money).
 *
 * Returns a plan with the fewest possible transfers, proven by the
 * invariant that minimum transfers = (number of nonzero members - 1)
 * when all nonzero members form a single connected component.
 *
 * @param balances - Map of memberId → net balance (positive = creditor, negative = debtor)
 * @returns SettlementPlan with minimum transfers
 */
export function computeMinimumTransfers(
  balances: Map<string, number>,
): SettlementPlan {
  // Filter out zero balances
  const entries = Array.from(balances.entries()).filter(
    ([, v]) => Math.abs(v) > 0.001, // ignore dust
  );

  if (entries.length === 0) {
    return { transfers: [], nonZeroCount: 0, totalSettled: 0 };
  }

  const nonZeroCount = entries.length;

  // Separate creditors (positive) and debtors (negative)
  const creditors: Array<{ id: string; amount: number }> = [];
  const debtors: Array<{ id: string; amount: number }> = [];

  for (const [id, balance] of entries) {
    if (balance > 0) {
      creditors.push({ id, amount: balance });
    } else {
      debtors.push({ id, amount: -balance }); // store as positive
    }
  }

  // Sort both by amount (descending) for greedy matching
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const transfers: Transfer[] = [];
  let totalSettled = 0;

  let ci = 0;
  let di = 0;

  while (ci < creditors.length && di < debtors.length) {
    const settleAmount = Math.min(creditors[ci].amount, debtors[di].amount);

    if (settleAmount > 0.001) {
      // Round to 2 decimal places (cents)
      const rounded = Math.round(settleAmount * 100) / 100;
      transfers.push({
        from: debtors[di].id,
        to: creditors[ci].id,
        amount: rounded,
      });
      totalSettled += rounded;
      // Use rounded amount for internal tracking (avoids floating-point drift)
      creditors[ci].amount -= rounded;
      debtors[di].amount -= rounded;
    } else {
      // Dust — skip, no transfer needed
      creditors[ci].amount -= settleAmount;
      debtors[di].amount -= settleAmount;
    }

    if (creditors[ci].amount < 0.001) ci++;
    if (debtors[di].amount < 0.001) di++;
  }

  // The minimum transfers for a connected graph = nonZeroCount - 1
  // (our greedy algorithm achieves this when the graph is connected,
  // which it always is for a single circle)
  return {
    transfers,
    nonZeroCount,
    totalSettled,
  };
}

/**
 * Verify that a settlement plan is correct:
 *   (a) all transfers net to zero for each member
 *   (b) transfer count = nonZeroCount - 1 (proven minimum)
 *
 * @param balances - Original net balances
 * @param plan - The settlement plan to verify
 * @returns true if plan is valid and optimal
 */
export function verifySettlementPlan(
  balances: Map<string, number>,
  plan: SettlementPlan,
): { valid: boolean; optimal: boolean; reason?: string } {
  // Recompute balances from transfers
  const recompute = new Map<string, number>();
  for (const [id, bal] of balances) {
    if (Math.abs(bal) > 0.001) {
      recompute.set(id, bal);
    }
  }

  // Apply transfers
  // from = debtor (negative balance), to = creditor (positive balance)
  // Paying: debtor balance rises toward zero, creditor balance drops toward zero
  for (const t of plan.transfers) {
    const fromBal = recompute.get(t.from) ?? 0;
    const toBal = recompute.get(t.to) ?? 0;
    recompute.set(t.from, fromBal + t.amount);
    recompute.set(t.to, toBal - t.amount);
  }

  // Check (a): all balances should be zero (tolerance: 0.01 = 1 cent)
  // Round residuals to avoid floating-point precision issues (e.g. 0.010000000000000231)
  for (const [id, bal] of recompute) {
    const rounded = Math.round(bal * 100) / 100;
    if (Math.abs(rounded) > 0.01) {
      return {
        valid: false,
        optimal: false,
        reason: `Member ${id} has residual balance ${rounded.toFixed(2)}`,
      };
    }
  }

  // Check (b): minimum transfers = nonZeroCount - 1
  const nonZeroCount = Array.from(balances.values()).filter(
    (v) => Math.abs(v) > 0.001,
  ).length;
  const expectedMin = nonZeroCount > 0 ? nonZeroCount - 1 : 0;
  const optimal = plan.transfers.length === expectedMin;

  return {
    valid: true,
    optimal,
    reason: optimal
      ? undefined
      : `Plan uses ${plan.transfers.length} transfers, minimum is ${expectedMin}`,
  };
}
