import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, PieChart } from 'lucide-react';
import type { CircleAnalytics } from '@meridian/analytics';

interface AnalyticsDashboardProps {
  analytics: CircleAnalytics;
  currentMemberId: string;
  expenses: { memberId: string; amount: number; label: string; timestamp: string }[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  analytics,
  currentMemberId,
  expenses,
}) => {

  // Compute per-member totals
  const memberTotals = useMemo(() => {
    const totals = new Map<string, number>();
    for (const e of expenses) {
      totals.set(e.memberId, (totals.get(e.memberId) ?? 0) + e.amount);
    }
    return totals;
  }, [expenses]);

  // Find top payer
  const topPayer = useMemo(() => {
    let bestId = '';
    let bestAmount = 0;
    for (const [id, total] of memberTotals) {
      if (total > bestAmount) {
        bestAmount = total;
        bestId = id;
      }
    }
    return { id: bestId, total: bestAmount };
  }, [memberTotals]);

  // Category breakdown (from labels)
  const categories = useMemo(() => {
    const cats = new Map<string, number>();
    for (const e of expenses) {
      const cat = e.label.toLowerCase().includes('dinner') ? 'Dining'
        : e.label.toLowerCase().includes('uber') || e.label.toLowerCase().includes('travel') ? 'Travel'
        : e.label.toLowerCase().includes('rent') ? 'Rent'
        : 'Other';
      cats.set(cat, (cats.get(cat) ?? 0) + e.amount);
    }
    return Array.from(cats.entries()).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  const yourShare = topPayer.total > 0 ? Math.round(((memberTotals.get(currentMemberId) ?? 0) / topPayer.total) * 100) : 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
      {/* Total Volume */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '16px',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent-gold)' }}>
          <TrendingUp size={18} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em' }}>TOTAL VOLUME</span>
        </div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: '#fff' }}>
          ${analytics.totalSpent.toFixed(2)}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#34d399' }}>
          {analytics.expenseCount} expense{analytics.expenseCount !== 1 ? 's' : ''} logged
        </div>
      </motion.div>

      {/* Most Active Payer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '16px',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent-gold)' }}>
          <BarChart3 size={18} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em' }}>MOST ACTIVE PAYER</span>
        </div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#fff', marginTop: 'auto' }}>
          {topPayer.id === currentMemberId ? 'You' : `Member ${topPayer.id.slice(0, 8)}...`} ({yourShare}%)
        </div>
      </motion.div>

      {/* Spending Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '16px',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          gridColumn: '1 / -1',
          marginTop: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent-gold)', marginBottom: '1rem' }}>
          <PieChart size={18} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em' }}>SPENDING DISTRIBUTION</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {categories.map(([cat, total]) => {
            const pct = analytics.totalSpent > 0 ? Math.round((total / analytics.totalSpent) * 100) : 0;
            return (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '100px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>{cat}</div>
                <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent-gold)' }} />
                </div>
                <div style={{ width: '50px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#fff' }}>{pct}%</div>
              </div>
            );
          })}
          {categories.length === 0 && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
              No expenses yet.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
