import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, RefreshCw, Power } from 'lucide-react';
import { fetchRecurringPacts, saveRecurringPact } from '../hooks/useCirclesStore';

interface RecurringPactsProps {
  walletAddress: string;
  circleAddress: string;
}

export const RecurringPacts: React.FC<RecurringPactsProps> = ({ walletAddress, circleAddress }) => {
  const [pacts, setPacts] = useState<{ id: string; pactName: string; frequency: string; isActive: boolean; nextSettlementAt: string | null }[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newPact, setNewPact] = useState({ label: '', frequency: 'monthly' as 'weekly' | 'biweekly' | 'monthly' });

  useEffect(() => {
    loadPacts();
  }, [circleAddress]);

  async function loadPacts() {
    try {
      const records = await fetchRecurringPacts(circleAddress);
      setPacts(records);
    } catch (err) {
      console.warn('[RecurringPacts] Failed to load pacts:', err);
    }
  }

  async function handleCreatePact() {
    if (!newPact.label) return;
    try {
      await saveRecurringPact({
        walletAddress,
        circleAddress,
        pactName: newPact.label,
        frequency: newPact.frequency,
      });
      setShowCreate(false);
      setNewPact({ label: '', frequency: 'monthly' });
      await loadPacts();
    } catch (err) {
      console.warn('[RecurringPacts] Failed to create pact:', err);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    color: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
      {!showCreate ? (
        <div
          style={{
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
          onClick={() => setShowCreate(true)}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)' }}>
            <RefreshCw size={20} />
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-gold)', letterSpacing: '0.1em' }}>
            NEW RECURRING PACT
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: '16px',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#fff', margin: 0 }}>Create Pact</h4>
          <input
            style={inputStyle}
            placeholder="Pact name (e.g. Netflix Family)"
            value={newPact.label}
            onChange={(e) => setNewPact({ ...newPact, label: e.target.value })}
          />
          <select
            style={inputStyle}
            value={newPact.frequency}
            onChange={(e) => setNewPact({ ...newPact, frequency: e.target.value as any })}
          >
            <option value="weekly">Weekly</option>
            <option value="biweekly">Biweekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              onClick={handleCreatePact}
              disabled={!newPact.label}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: 'var(--accent-gold)',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                cursor: 'pointer',
              }}
            >
              CREATE
            </button>
            <button
              onClick={() => { setShowCreate(false); setNewPact({ label: '', frequency: 'monthly' }); }}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.1em',
                cursor: 'pointer',
              }}
            >
              CANCEL
            </button>
          </div>
        </motion.div>
      )}

      {pacts.map((pact) => (
        <motion.div
          key={pact.id}
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
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#fff', margin: '0 0 0.5rem 0' }}>{pact.pactName}</h4>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                {pact.frequency}
              </div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              fontFamily: 'var(--font-mono)', fontSize: '9px',
              color: pact.isActive ? '#34d399' : '#ff5050',
              letterSpacing: '0.1em',
              background: pact.isActive ? 'rgba(52,211,153,0.1)' : 'rgba(255,80,80,0.1)',
              padding: '0.25rem 0.75rem', borderRadius: '999px'
            }}>
              <Power size={10} /> {pact.isActive ? 'ACTIVE' : 'PAUSED'}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
            <Calendar size={16} style={{ color: 'var(--accent-gold)' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent-gold)', letterSpacing: '0.1em' }}>NEXT SETTLEMENT</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#fff', marginTop: '0.25rem' }}>
                {pact.nextSettlementAt ? new Date(pact.nextSettlementAt).toLocaleDateString() : 'Not scheduled'}
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {pacts.length === 0 && !showCreate && (
        <div style={{
          gridColumn: '1 / -1',
          padding: '3rem',
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}>
          No recurring pacts yet. Create one to automate shared subscriptions.
        </div>
      )}
    </div>
  );
};
