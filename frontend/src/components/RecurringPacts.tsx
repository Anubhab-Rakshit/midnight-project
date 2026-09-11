import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  saveRecurringPact,
  fetchRecurringPacts,
} from '../hooks/useCirclesStore';
import type { RecurringPactRecord } from '../hooks/useCirclesStore';

interface RecurringPactsProps {
  walletAddress: string;
  circleAddress: string;
}

export const RecurringPacts = ({ walletAddress, circleAddress }: RecurringPactsProps) => {
  const [pacts, setPacts] = useState<RecurringPactRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [pactName, setPactName] = useState('');
  const [frequency, setFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [dayOfWeek, setDayOfWeek] = useState(1); // Monday
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadPacts();
  }, [walletAddress]);

  const loadPacts = async () => {
    try {
      setIsLoading(true);
      const records = await fetchRecurringPacts(walletAddress);
      setPacts(records);
    } catch (err) {
      console.error('[Meridian] Failed to load pacts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePact = async () => {
    if (!pactName.trim()) return;

    setIsCreating(true);
    try {
      await saveRecurringPact({
        walletAddress,
        circleAddress,
        pactName: pactName.trim(),
        frequency,
        dayOfWeek: frequency === 'monthly' ? undefined : dayOfWeek,
        dayOfMonth: frequency === 'monthly' ? dayOfMonth : undefined,
      });

      setPactName('');
      setShowCreate(false);
      await loadPacts();
    } catch (err) {
      console.error('[Meridian] Failed to create pact:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const formatNextSettlement = (dateStr: string | null) => {
    if (!dateStr) return 'Not scheduled';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getFrequencyLabel = (freq: string) => {
    switch (freq) {
      case 'weekly': return 'Weekly';
      case 'biweekly': return 'Bi-weekly';
      case 'monthly': return 'Monthly';
      default: return freq;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        padding: '1.5rem',
        border: '1px solid rgba(139,92,246,0.2)',
        borderRadius: '8px',
        background: 'rgba(139,92,246,0.05)',
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          color: '#8b5cf6',
          letterSpacing: '0.2em',
        }}>
          RECURRING PACTS
        </div>
        {!showCreate && (
          <button
            onClick={() => setShowCreate(true)}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              padding: '0.25rem 0.5rem',
              background: 'transparent',
              border: '1px solid rgba(139,92,246,0.3)',
              color: '#8b5cf6',
              cursor: 'pointer',
              borderRadius: '4px',
            }}
          >
            + NEW PACT
          </button>
        )}
      </div>

      {showCreate && (
        <div style={{
          padding: '1rem',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '4px',
          marginBottom: '1rem',
        }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              color: 'var(--text-muted)',
              display: 'block',
              marginBottom: '0.25rem',
            }}>
              PACT NAME
            </label>
            <input
              type="text"
              value={pactName}
              onChange={(e) => setPactName(e.target.value)}
              placeholder="e.g. Weekly Dinner"
              style={{
                width: '100%',
                padding: '0.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: '#fff',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              color: 'var(--text-muted)',
              display: 'block',
              marginBottom: '0.25rem',
            }}>
              FREQUENCY
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as any)}
              style={{
                width: '100%',
                padding: '0.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: '#fff',
                outline: 'none',
              }}
            >
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {frequency !== 'monthly' && (
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                color: 'var(--text-muted)',
                display: 'block',
                marginBottom: '0.25rem',
              }}>
                DAY OF WEEK
              </label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: '#fff',
                  outline: 'none',
                }}
              >
                <option value={0}>Sunday</option>
                <option value={1}>Monday</option>
                <option value={2}>Tuesday</option>
                <option value={3}>Wednesday</option>
                <option value={4}>Thursday</option>
                <option value={5}>Friday</option>
                <option value={6}>Saturday</option>
              </select>
            </div>
          )}

          {frequency === 'monthly' && (
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                color: 'var(--text-muted)',
                display: 'block',
                marginBottom: '0.25rem',
              }}>
                DAY OF MONTH
              </label>
              <input
                type="number"
                value={dayOfMonth}
                onChange={(e) => setDayOfMonth(parseInt(e.target.value) || 1)}
                min={1}
                max={31}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: '#fff',
                  outline: 'none',
                }}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setShowCreate(false)}
              style={{
                flex: 1,
                padding: '0.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                borderRadius: '4px',
              }}
            >
              CANCEL
            </button>
            <button
              onClick={handleCreatePact}
              disabled={isCreating || !pactName.trim()}
              style={{
                flex: 1,
                padding: '0.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                background: isCreating ? 'rgba(139,92,246,0.1)' : 'transparent',
                border: '1px solid rgba(139,92,246,0.3)',
                color: '#8b5cf6',
                cursor: isCreating ? 'wait' : 'pointer',
                borderRadius: '4px',
                opacity: !pactName.trim() ? 0.4 : 1,
              }}
            >
              {isCreating ? 'CREATING...' : 'CREATE'}
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--text-muted)',
        }}>
          Loading pacts...
        </div>
      ) : pacts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--text-muted)',
        }}>
          No recurring pacts yet.<br />
          <span style={{ opacity: 0.5 }}>Create one to auto-settle on a schedule.</span>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {pacts.map((pact) => (
            <div
              key={pact.id}
              style={{
                padding: '1rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '4px',
                border: '1px solid rgba(139,92,246,0.1)',
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem',
              }}>
                <span style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1rem',
                  color: '#fff',
                }}>
                  {pact.pactName}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  padding: '0.25rem 0.5rem',
                  background: 'rgba(139,92,246,0.1)',
                  borderRadius: '4px',
                  color: '#8b5cf6',
                }}>
                  {getFrequencyLabel(pact.frequency)}
                </span>
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--text-muted)',
              }}>
                <div>Next settlement: <span style={{ color: '#8b5cf6' }}>{formatNextSettlement(pact.nextSettlementAt)}</span></div>
                {pact.lastSettledAt && (
                  <div style={{ marginTop: '0.25rem', opacity: 0.7 }}>
                    Last settled: {new Date(pact.lastSettledAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
