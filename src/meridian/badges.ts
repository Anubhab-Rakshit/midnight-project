/**
 * Meridian — Percentile Badges
 *
 * Gamification badges based on spending behavior within a circle.
 * All badge computations are local (never on-chain) and return only
 * the badge type — never the underlying data.
 *
 * Privacy: badges are earned based on relative standing, not absolute
 * amounts. An observer cannot learn a member's spending from their badges.
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export type BadgeType =
  | 'top_contributor'    // Paid the most in the circle
  | 'fair_splitter'      // Expenses are close to average
  | 'big_spender'        // Logged the largest single expense
  | 'frequent_spender'   // Logged the most expenses
  | 'settler'            // Has settled up with the circle
  | 'newcomer';          // First expense in the circle

export interface Badge {
  type: BadgeType;
  label: string;
  description: string;
  earnedAt: string;
}

export interface MemberBadges {
  memberId: string;
  badges: Badge[];
  totalBadges: number;
}

// ─── Badge Definitions ──────────────────────────────────────────────────────

const BADGE_DEFINITIONS: Record<BadgeType, { label: string; description: string }> = {
  top_contributor: {
    label: 'Top Contributor',
    description: 'Paid the most in this circle',
  },
  fair_splitter: {
    label: 'Fair Splitter',
    description: 'Expenses are close to the group average',
  },
  big_spender: {
    label: 'Big Spender',
    description: 'Logged the largest single expense',
  },
  frequent_spender: {
    label: 'Frequent Spender',
    description: 'Logged the most expenses',
  },
  settler: {
    label: 'Settler',
    description: 'Has settled up with the circle',
  },
  newcomer: {
    label: 'Newcomer',
    description: 'First expense in the circle',
  },
};

// ─── Badge Engine ───────────────────────────────────────────────────────────

/**
 * Compute all badges for a member in a circle.
 *
 * Badges are computed locally from expense data. The member receives
 * badges based on their relative standing — never on absolute amounts.
 *
 * @param memberId - The member to compute badges for
 * @param expenses - All expenses in the circle
 * @param balances - Net balances map
 * @param settledMembers - Set of member IDs who have settled
 * @returns All badges earned by this member
 */
export function computeMemberBadges(
  memberId: string,
  expenses: Array<{ memberId: string; amount: number; timestamp: string }>,
  _balances: Map<string, number>,
  settledMembers: Set<string>,
): MemberBadges {
  const badges: Badge[] = [];
  const now = new Date().toISOString();

  if (expenses.length === 0) {
    return { memberId, badges: [], totalBadges: 0 };
  }

  // Group by member
  const memberTotals = new Map<string, number>();
  const memberCounts = new Map<string, number>();
  const memberMaxExpense = new Map<string, number>();

  for (const e of expenses) {
    memberTotals.set(e.memberId, (memberTotals.get(e.memberId) ?? 0) + e.amount);
    memberCounts.set(e.memberId, (memberCounts.get(e.memberId) ?? 0) + 1);
    const currentMax = memberMaxExpense.get(e.memberId) ?? 0;
    if (e.amount > currentMax) {
      memberMaxExpense.set(e.memberId, e.amount);
    }
  }

  const memberTotal = memberTotals.get(memberId) ?? 0;
  const memberCount = memberCounts.get(memberId) ?? 0;
  const memberMax = memberMaxExpense.get(memberId) ?? 0;

  // Top Contributor: paid the most
  const maxTotal = Math.max(...Array.from(memberTotals.values()));
  if (memberTotal === maxTotal && memberTotal > 0) {
    badges.push({ type: 'top_contributor', ...BADGE_DEFINITIONS.top_contributor, earnedAt: now });
  }

  // Big Spender: logged the largest single expense
  const maxExpense = Math.max(...Array.from(memberMaxExpense.values()));
  if (memberMax === maxExpense && memberMax > 0) {
    badges.push({ type: 'big_spender', ...BADGE_DEFINITIONS.big_spender, earnedAt: now });
  }

  // Frequent Spender: logged the most expenses
  const maxCount = Math.max(...Array.from(memberCounts.values()));
  if (memberCount === maxCount && memberCount > 0) {
    badges.push({ type: 'frequent_spender', ...BADGE_DEFINITIONS.frequent_spender, earnedAt: now });
  }

  // Fair Splitter: expenses are close to average
  const avgTotal = Array.from(memberTotals.values()).reduce((s, t) => s + t, 0) / memberTotals.size;
  if (Math.abs(memberTotal - avgTotal) < avgTotal * 0.2) {
    badges.push({ type: 'fair_splitter', ...BADGE_DEFINITIONS.fair_splitter, earnedAt: now });
  }

  // Settler: has settled up
  if (settledMembers.has(memberId)) {
    badges.push({ type: 'settler', ...BADGE_DEFINITIONS.settler, earnedAt: now });
  }

  // Newcomer: first expense in the circle
  const memberExpenses = expenses.filter((e) => e.memberId === memberId);
  if (memberExpenses.length === 1) {
    badges.push({ type: 'newcomer', ...BADGE_DEFINITIONS.newcomer, earnedAt: now });
  }

  return { memberId, badges, totalBadges: badges.length };
}

/**
 * Compute badges for all members in a circle.
 *
 * @param expenses - All expenses in the circle
 * @param balances - Net balances map
 * @param settledMembers - Set of member IDs who have settled
 * @returns Badges for all members
 */
export function computeAllBadges(
  expenses: Array<{ memberId: string; amount: number; timestamp: string }>,
  balances: Map<string, number>,
  settledMembers: Set<string>,
): MemberBadges[] {
  const memberIds = new Set(expenses.map((e) => e.memberId));
  return Array.from(memberIds).map((memberId) =>
    computeMemberBadges(memberId, expenses, balances, settledMembers),
  );
}
