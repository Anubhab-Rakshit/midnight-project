import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Plus, Users } from 'lucide-react';
import { useToast } from './TransactionToast';

interface ExpenseFormProps {
  onAddExpense: (label: string, amount: number, splitType: 'equal' | 'custom') => Promise<void>;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense }) => {
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !amount.trim()) return;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    setIsSubmitting(true);
    const toastId = addToast({ type: 'pending', title: 'Logging Expense', message: 'Generating ZK proof for the expense commitment...' });

    try {
      await onAddExpense(label, parsedAmount, splitType);
      addToast({ type: 'success', title: 'Expense Logged', message: 'The commitment was successfully recorded on Midnight.' });
      setLabel('');
      setAmount('');
    } catch (err) {
      addToast({ type: 'error', title: 'Transaction Failed', message: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      style={{
        padding: '2rem',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        backdropFilter: 'blur(20px)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <div style={{ padding: '0.5rem', background: 'rgba(212,175,55,0.1)', borderRadius: '8px', color: 'var(--accent-gold)' }}>
          <Plus size={16} />
        </div>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#fff', margin: 0 }}>Log New Expense</h3>
      </div>

      <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
        <div style={{ flex: 2 }}>
          <label style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent-gold)', letterSpacing: '0.2em', display: 'block', marginBottom: '0.75rem' }}>
            DESCRIPTION
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Dinner at Dorsia"
            style={{
              width: '100%',
              padding: '1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#fff',
              outline: 'none',
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent-gold)', letterSpacing: '0.2em', display: 'block', marginBottom: '0.75rem' }}>
            AMOUNT ($)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            style={{
              width: '100%',
              padding: '1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#fff',
              outline: 'none',
            }}
          />
        </div>
      </div>

      <div>
        <label style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent-gold)', letterSpacing: '0.2em', display: 'block', marginBottom: '0.75rem' }}>
          SPLIT TYPE
        </label>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="button"
            onClick={() => setSplitType('equal')}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: splitType === 'equal' ? 'rgba(212,175,55,0.1)' : 'transparent',
              border: `1px solid ${splitType === 'equal' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'}`,
              color: splitType === 'equal' ? 'var(--accent-gold)' : 'var(--text-muted)',
              borderRadius: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <Users size={14} /> Split Equally
          </button>
          <button
            type="button"
            onClick={() => setSplitType('custom')}
            disabled
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'transparent',
              border: '1px dashed rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.3)',
              borderRadius: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              cursor: 'not-allowed'
            }}
          >
            Custom Shares (Coming Soon)
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !label.trim() || !amount.trim()}
        style={{
          marginTop: '1rem',
          width: '100%',
          padding: '1.25rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fontWeight: 600,
          background: isSubmitting ? 'transparent' : 'var(--accent-gold)',
          color: isSubmitting ? 'var(--accent-gold)' : '#000',
          border: isSubmitting ? '1px solid var(--accent-gold)' : 'none',
          borderRadius: '8px',
          cursor: isSubmitting ? 'wait' : 'pointer',
          letterSpacing: '0.1em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          opacity: (!label.trim() || !amount.trim()) ? 0.5 : 1
        }}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={14} className="animate-spin" /> PROVING ON-CHAIN...
          </>
        ) : (
          'LOG CONFIDENTIAL EXPENSE'
        )}
      </button>
    </motion.form>
  );
};
