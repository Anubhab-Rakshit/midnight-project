import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useToast } from './TransactionToast';

interface SettlementBoardProps {
  members: { id: string; name: string }[];
  expenses: { paidBy: string; amount: number; splitWith: string[] }[];
  onSettle: (plan: any) => Promise<void>;
}

export const SettlementBoard: React.FC<SettlementBoardProps> = ({ members, onSettle }) => {
  const [isSettling, setIsSettling] = React.useState(false);
  const { addToast, updateToast } = useToast();

  const handleSettle = async () => {
    setIsSettling(true);
    const toastId = addToast({ type: 'pending', title: 'Verifying Settlement', message: 'Generating ZK proof for the settlement plan...' });
    try {
      await onSettle({});
      updateToast(toastId, { type: 'success', title: 'Settlement Verified', message: 'The optimal settlement graph has been recorded on-chain.' });
    } catch (err) {
      updateToast(toastId, { type: 'error', title: 'Settlement Failed', message: 'Could not verify the settlement plan.' });
    } finally {
      setIsSettling(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{
        padding: '2rem',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent-gold)', letterSpacing: '0.2em', margin: '0 0 0.5rem 0' }}>
              CURRENT BALANCES
            </h4>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#fff', opacity: 0.5 }}>
              (Mocked for Phase 2)
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '9px', color: '#34d399', letterSpacing: '0.1em', background: 'rgba(52,211,153,0.1)', padding: '0.5rem 1rem', borderRadius: '999px' }}>
            <ShieldCheck size={12} /> ZK OPTIMAL PLAN
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {members.map((m, i) => (
            <div key={m.id} style={{
              flex: '1 1 200px',
              padding: '1.25rem',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: '#fff' }}>{m.name}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', color: i === 0 ? '#34d399' : '#ff5050', fontWeight: 600 }}>
                {i === 0 ? '+$125.00' : '-$125.00'}
              </span>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
          <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.2em', marginBottom: '1.5rem' }}>
            SUGGESTED TRANSFERS
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem',
              background: 'rgba(212,175,55,0.05)',
              border: '1px solid rgba(212,175,55,0.2)',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: '#fff' }}>
                <span>Alice</span>
                <ArrowRight size={16} style={{ color: 'var(--accent-gold)' }} />
                <span>You</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                $125.00
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSettle}
          disabled={isSettling}
          style={{
            marginTop: '1rem',
            width: '100%',
            padding: '1.25rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            background: isSettling ? 'transparent' : 'var(--accent-gold)',
            color: isSettling ? 'var(--accent-gold)' : '#000',
            border: isSettling ? '1px solid var(--accent-gold)' : 'none',
            fontWeight: 600,
            cursor: isSettling ? 'wait' : 'pointer',
            letterSpacing: '0.1em',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s ease'
          }}
        >
          {isSettling ? 'PROVING SETTLEMENT...' : 'SETTLE BALANCES NOW'}
        </button>
      </div>
    </div>
  );
};
