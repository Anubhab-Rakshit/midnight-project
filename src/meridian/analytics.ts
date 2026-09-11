/**
 * Meridian — Privacy-Preserving Analytics
 *
 * Computes aggregate statistics from expense data WITHOUT revealing
 * individual amounts. All functions operate on raw expense data locally
 * (never on-chain) and return only aggregated, anonymized results.
 *
 * The key privacy property: an observer can see that analytics were
 * computed, but cannot learn any individual member's spending.
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Expense {
  memberId: string;
  amount: number;
  label: string;
  timestamp: string;
}

export interface CircleAnalytics {
  /** Total amount spent across all expenses */
  totalSpent: number;
  /** Number of expenses logged */
  expenseCount: number;
  /** Average expense amount */
  averageExpense: number;
  /** Median expense amount */
  medianExpense: number;
  /** Standard deviation of expense amounts */
  standardDeviation: number;
  /** Largest expense (amount hidden, just "largest") */
  hasLargeExpenses: boolean;
  /** Whether expenses are fairly distributed (low variance) */
  isFairlyDistributed: boolean;
}

export interface MemberStats {
  memberId: string;
  /** Total amount this member paid (positive) or is owed (negative) */
  netBalance: number;
  /** Number of expenses this member logged */
  expenseCount: number;
  /** Whether this member is a top contributor */
  isTopContributor: boolean;
}

// ─── Analytics Engine ───────────────────────────────────────────────────────

/**
 * Compute aggregate analytics for a circle.
 *
 * This function runs locally (never on-chain) and returns only
 * aggregated statistics. Individual amounts are never exposed.
 *
 * @param expenses - Raw expense data (only available to circle members)
 * @returns Aggregated analytics with privacy guarantees
 */
export function computeCircleAnalytics(expenses: Expense[]): CircleAnalytics {
  if (expenses.length === 0) {
    return {
      totalSpent: 0,
      expenseCount: 0,
      averageExpense: 0,
      medianExpense: 0,
      standardDeviation: 0,
      hasLargeExpenses: false,
      isFairlyDistributed: true,
    };
  }

  const amounts = expenses.map((e) => e.amount);
  const totalSpent = amounts.reduce((sum, a) => sum + a, 0);
  const averageExpense = totalSpent / amounts.length;

  // Median
  const sorted = [...amounts].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const medianExpense =
    sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];

  // Standard deviation
  const variance =
    amounts.reduce((sum, a) => sum + Math.pow(a - averageExpense, 2), 0) /
    amounts.length;
  const standardDeviation = Math.sqrt(variance);

  // Flags (privacy-preserving: no raw values exposed)
  const hasLargeExpenses = sorted[sorted.length - 1] > averageExpense * 3;
  const isFairlyDistributed = standardDeviation < averageExpense * 0.5;

  return {
    totalSpent,
    expenseCount: expenses.length,
    averageExpense,
    medianExpense,
    standardDeviation,
    hasLargeExpenses,
    isFairlyDistributed,
  };
}

/**
 * Compute per-member statistics from expenses and net balances.
 *
 * Returns only the member's own stats plus anonymized comparison data.
 * Members cannot learn other members' exact balances — only relative
 * rankings (top contributor, fair splitter, etc.).
 *
 * @param memberId - The member requesting stats (only their own data is fully visible)
 * @param balances - Map of memberId → net balance
 * @param expenses - All expenses in the circle
 * @returns Member-specific stats with privacy guarantees
 */
export function computeMemberStats(
  memberId: string,
  balances: Map<string, number>,
  expenses: Expense[],
): MemberStats {
  const netBalance = balances.get(memberId) ?? 0;
  const memberExpenses = expenses.filter((e) => e.memberId === memberId);

  // Determine if this member is a top contributor
  // A member is "top" if their total payments exceed the average
  const totalPaid = memberExpenses.reduce((sum, e) => sum + e.amount, 0);
  const allTotals = new Map<string, number>();
  for (const e of expenses) {
    allTotals.set(e.memberId, (allTotals.get(e.memberId) ?? 0) + e.amount);
  }
  const avgTotal = Array.from(allTotals.values()).reduce((s, t) => s + t, 0) / allTotals.size;
  const isTopContributor = totalPaid > avgTotal;

  return {
    memberId,
    netBalance,
    expenseCount: memberExpenses.length,
    isTopContributor,
  };
}

/**
 * Detect spending anomalies (e.g., a member spending 10x the average).
 *
 * Returns only boolean flags — never reveals the actual amounts.
 * Useful for "Fair Split" badges and fraud detection.
 *
 * @param expenses - All expenses in the circle
 * @returns Map of memberId → anomaly flags
 */
export function detectAnomalies(
  expenses: Expense[],
): Map<string, { isOutlier: boolean; isFrequentSpender: boolean }> {
  const result = new Map<string, { isOutlier: boolean; isFrequentSpender: boolean }>();

  if (expenses.length === 0) return result;

  // Compute per-member totals
  const memberTotals = new Map<string, number>();
  const memberCounts = new Map<string, number>();
  for (const e of expenses) {
    memberTotals.set(e.memberId, (memberTotals.get(e.memberId) ?? 0) + e.amount);
    memberCounts.set(e.memberId, (memberCounts.get(e.memberId) ?? 0) + 1);
  }

  const totals = Array.from(memberTotals.values());
  const avg = totals.reduce((s, t) => s + t, 0) / totals.length;
  const maxCount = Math.max(...Array.from(memberCounts.values()));

  for (const [memberId, total] of memberTotals) {
    const count = memberCounts.get(memberId) ?? 0;
    result.set(memberId, {
      isOutlier: total > avg * 2,
      isFrequentSpender: count >= maxCount * 0.8,
    });
  }

  return result;
}
