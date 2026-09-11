import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { computeCircleAnalytics } from '@meridian/analytics';
import { computeAllBadges } from '@meridian/badges';

interface Expense {
  memberId: string;
  amount: number;
  label: string;
  timestamp: string;
}

interface AnalyticsDashboardProps {
  expenses: Expense[];
  balances: Map<string, number>;
  currentMemberId: string;
}

const BADGE_ICONS: Record<string, string> = {
  top_contributor: '🏆',
  fair_splitter: '⚖️',
  big_spender: '💰',
  frequent_spender: '🔄',
  settler: '✅',
  newcomer: '🌱',
};

export const AnalyticsDashboard = ({
  expenses,
  balances,
  currentMemberId,
}: AnalyticsDashboardProps) => {
  const analytics = useMemo(
    () => computeCircleAnalytics(expenses),
    [expenses],
  );

  const memberBadges = useMemo(
    () => computeAllBadges(expenses, balances, new Set()),
    [expenses, balances],
  );

  const myBadges = useMemo(
    () => memberBadges.find((b) => b.memberId === currentMemberId),
    [memberBadges, currentMemberId],
  );

  if (expenses.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          padding: '2rem',
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--text-muted)',
        }}
      >
        No expenses to analyze yet.
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        padding: '1.5rem',
        border: '1px solid rgba(251,191,36,0.2)',
        borderRadius: '8px',
        background: 'rgba(251,191,36,0.05)',
      }}
    >
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '9px',
        color: '#fbbf24',
        letterSpacing: '0.2em',
        marginBottom: '1rem',
      }}>
        CIRCLE ANALYTICS
      </div>

      {/* Overview Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        <StatCard
          label="Total Spent"
          value={`$${analytics.totalSpent.toFixed(2)}`}
          color="#34d399"
        />
        <StatCard
          label="Expenses"
          value={analytics.expenseCount.toString()}
          color="#fbbf24"
        />
        <StatCard
          label="Average"
          value={`$${analytics.averageExpense.toFixed(2)}`}
          color="#a78bfa"
        />
      </div>

      {/* Distribution */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          color: 'var(--text-muted)',
          letterSpacing: '0.1em',
          marginBottom: '0.5rem',
        }}>
          DISTRIBUTION
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Tag
            label="Fairly Distributed"
            active={analytics.isFairlyDistributed}
            color="#34d399"
          />
          <Tag
            label="Has Large Expenses"
            active={analytics.hasLargeExpenses}
            color="#fbbf24"
          />
          <Tag
            label="Low Variance"
            active={analytics.standardDeviation < analytics.averageExpense * 0.3}
            color="#a78bfa"
          />
        </div>
      </div>

      {/* My Badges */}
      {myBadges && myBadges.badges.length > 0 && (
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
            marginBottom: '0.5rem',
          }}>
            YOUR BADGES ({myBadges.totalBadges})
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {myBadges.badges.map((badge) => (
              <div
                key={badge.type}
                style={{
                  padding: '0.5rem 0.75rem',
                  background: 'rgba(251,191,36,0.1)',
                  borderRadius: '4px',
                  border: '1px solid rgba(251,191,36,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span style={{ fontSize: '14px' }}>
                  {BADGE_ICONS[badge.type] ?? '🏅'}
                </span>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: '#fbbf24',
                    fontWeight: 600,
                  }}>
                    {badge.label}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    color: 'var(--text-muted)',
                  }}>
                    {badge.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

// ─── Helper Components ──────────────────────────────────────────────────────

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{
      padding: '0.75rem',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '4px',
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '9px',
        color: 'var(--text-muted)',
        marginBottom: '0.25rem',
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '16px',
        color,
        fontWeight: 600,
      }}>
        {value}
      </div>
    </div>
  );
}

function Tag({ label, active, color }: { label: string; active: boolean; color: string }) {
  return (
    <span style={{
      padding: '0.25rem 0.5rem',
      fontFamily: 'var(--font-mono)',
      fontSize: '9px',
      borderRadius: '4px',
      background: active ? `${color}15` : 'rgba(255,255,255,0.03)',
      color: active ? color : 'var(--text-muted)',
      border: `1px solid ${active ? `${color}30` : 'rgba(255,255,255,0.05)'}`,
    }}>
      {active ? '✓' : '○'} {label}
    </span>
  );
}
