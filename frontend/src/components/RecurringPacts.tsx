import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, RefreshCw, Power } from 'lucide-react';

interface RecurringPactsProps {
  walletAddress: string;
  circleAddress: string;
}

export const RecurringPacts: React.FC<RecurringPactsProps> = ({ walletAddress, circleAddress }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
      
      {/* Create New Pact Card */}
      <div style={{
        padding: '2rem',
        border: '1px dashed rgba(255,255,255,0.2)',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)' }}>
          <RefreshCw size={20} />
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-gold)', letterSpacing: '0.1em' }}>
          NEW RECURRING PACT
        </div>
      </div>

      {/* Mock Active Pact */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#fff', margin: '0 0 0.5rem 0' }}>Spotify Family</h4>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>$16.99 / Month</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '9px', color: '#34d399', letterSpacing: '0.1em', background: 'rgba(52,211,153,0.1)', padding: '0.25rem 0.75rem', borderRadius: '999px' }}>
            <Power size={10} /> ACTIVE
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
          <Calendar size={16} style={{ color: 'var(--accent-gold)' }} />
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent-gold)', letterSpacing: '0.1em' }}>NEXT BILLING</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#fff', marginTop: '0.25rem' }}>In 12 days (Sept 24)</div>
          </div>
        </div>

        <button style={{
          width: '100%',
          padding: '0.75rem',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          borderRadius: '8px',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.1em',
          cursor: 'pointer'
        }}>
          MANAGE PACT
        </button>
      </motion.div>
    </div>
  );
};
