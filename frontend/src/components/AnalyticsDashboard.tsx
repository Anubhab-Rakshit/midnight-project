import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, PieChart } from 'lucide-react';

interface AnalyticsProps {
  expenses: any[];
  balances: Map<string, number>;
  currentMemberId: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsProps> = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
      
      {/* Stat Card 1 */}
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
          $250.00
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#34d399' }}>
          +12% vs last month
        </div>
      </motion.div>

      {/* Stat Card 2 */}
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
          You (100%)
        </div>
      </motion.div>

      {/* Stat Card 3 */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '100px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>Dining</div>
            <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: 'var(--accent-gold)' }} />
            </div>
            <div style={{ width: '50px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#fff' }}>100%</div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '100px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>Travel</div>
            <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: '0%', height: '100%', background: '#34d399' }} />
            </div>
            <div style={{ width: '50px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#fff' }}>0%</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
