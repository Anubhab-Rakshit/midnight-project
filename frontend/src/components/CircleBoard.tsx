import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMidnightWallet } from '../context/MidnightWalletContext';
import { useMeridianContract } from '../hooks/useMeridianContract';
import { saveCircle, saveExpense, saveSettlement } from '../hooks/useCirclesStore';
import { SettlementBoard } from './SettlementBoard';
import { RecurringPacts } from './RecurringPacts';
import { computeMinimumTransfers } from '../../src/meridian/netting';

interface CircleState {
  contractAddress: string;
  inviteSecret: string;
  txHash: string;
  expenses: ExpenseEntry[];
}

interface ExpenseEntry {
  label: string;
  amount: number;
  paidBy: string;
  splitWith: string[];
}

export const CircleBoard = () => {
  const { isConnected, address, connect, isConnecting } = useMidnightWallet();
  const { createCircle, isExecuting } = useMeridianContract();

  const [circleName, setCircleName] = useState('');
  const [inviteSecret, setInviteSecret] = useState('');
  const [circle, setCircle] = useState<CircleState | null>(null);
  const [expenseLabel, setExpenseLabel] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [joinMode, setJoinMode] = useState(false);

  const handleCreateCircle = async () => {
    if (!circleName.trim()) return;
    setCreateError(null);

    // Generate a random invite secret if not provided
    const secret = inviteSecret.trim() || crypto.randomUUID().slice(0, 16);

    try {
      const result = await createCircle(secret);
      setCircle({
        contractAddress: result.contractAddress,
        inviteSecret: secret,
        txHash: result.txHash,
        expenses: [],
      });

      // Persist to Supabase
      if (address) {
        try {
          await saveCircle({
            walletAddress: address,
            circleName,
            contractAddress: result.contractAddress,
            inviteSecret: secret,
            txHash: result.txHash,
            blockHeight: result.blockHeight,
          });
        } catch (saveErr) {
          console.warn('[Meridian] Failed to save circle to Supabase:', saveErr);
        }
      }
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create circle');
    }
  };

  const handleAddExpense = async () => {
    if (!expenseLabel.trim() || !expenseAmount.trim() || !circle) return;
    const amount = parseFloat(expenseAmount);
    if (isNaN(amount) || amount <= 0) return;

    const entry: ExpenseEntry = {
      label: expenseLabel,
      amount,
      paidBy: 'You',
      splitWith: ['All members'],
    };

    setCircle((prev) =>
      prev ? { ...prev, expenses: [...prev.expenses, entry] } : null,
    );

    setExpenseLabel('');
    setExpenseAmount('');
  };

  const handleSettle = async (plan: any) => {
    if (!circle) return;

    // Save settlement to Supabase
    if (address) {
      try {
        await saveSettlement({
          circleAddress: circle.contractAddress,
          transferCount: plan.transfers.length,
        });
      } catch (saveErr) {
        console.warn('[Meridian] Failed to save settlement to Supabase:', saveErr);
      }
    }

    // In Phase 2, this would call the settle circuit on-chain
    console.log('[Meridian] Settlement plan:', plan);
  };

  const totalOwed = circle?.expenses.reduce((sum, e) => sum + e.amount, 0) ?? 0;
  const perPerson = circle && circle.expenses.length > 0
    ? totalOwed / Math.max(1, 2) // simplified: 2 members for demo
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '0 2rem' }}
    >
      <h2 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '4rem',
        fontStyle: 'italic',
        marginBottom: '2rem',
        textAlign: 'center',
        background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.3) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        {circle ? circleName || 'Your Circle' : 'Create a Circle'}
      </h2>

      {!isConnected ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Connect your Midnight wallet to create or join a circle.
          </p>
          <button
            onClick={connect}
            disabled={isConnecting}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              padding: '0.5rem 1.5rem',
              background: 'transparent',
              border: '1px solid var(--accent-gold)',
              color: 'var(--accent-gold)',
              cursor: 'pointer',
              letterSpacing: '0.1em',
            }}
          >
            {isConnecting ? 'CONNECTING...' : 'CONNECT WALLET'}
          </button>
        </div>
      ) : !circle ? (
        /* ─── Circle Creation / Join ──────────────────────────────────── */
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          {createError && (
            <div style={{
              padding: '1rem',
              border: '1px solid rgba(255, 80, 80, 0.3)',
              borderRadius: '8px',
              background: 'rgba(255, 80, 80, 0.05)',
              marginBottom: '1.5rem',
            }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#ff5050' }}>
                {createError}
              </p>
            </div>
          )}

          <div style={{
            padding: '2rem',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.02)',
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent-gold)', letterSpacing: '0.2em', display: 'block', marginBottom: '0.5rem' }}>
                CIRCLE NAME
              </label>
              <input
                type="text"
                value={circleName}
                onChange={(e) => setCircleName(e.target.value)}
                placeholder="e.g. Weekend Squad"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: '#fff',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent-gold)', letterSpacing: '0.2em', display: 'block', marginBottom: '0.5rem' }}>
                INVITE SECRET <span style={{ opacity: 0.5 }}>(optional — auto-generated if empty)</span>
              </label>
              <input
                type="text"
                value={inviteSecret}
                onChange={(e) => setInviteSecret(e.target.value)}
                placeholder="leave empty for auto-generate"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: '#fff',
                  outline: 'none',
                }}
              />
            </div>

            <button
              onClick={handleCreateCircle}
              disabled={isExecuting || !circleName.trim()}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                background: isExecuting ? 'rgba(212,175,55,0.1)' : 'transparent',
                border: '1px solid var(--accent-gold)',
                color: 'var(--accent-gold)',
                cursor: isExecuting ? 'wait' : 'pointer',
                letterSpacing: '0.1em',
                borderRadius: '4px',
                opacity: !circleName.trim() ? 0.4 : 1,
              }}
            >
              {isExecuting ? 'CREATING CIRCLE...' : 'CREATE CIRCLE'}
            </button>
          </div>
        </div>
      ) : (
        /* ─── Circle Dashboard ────────────────────────────────────────── */
        <div>
          {/* Circle Info */}
          <div style={{
            textAlign: 'center',
            marginBottom: '3rem',
            padding: '1.5rem',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.02)',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent-gold)', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>
              PRIVATE CIRCLE — AMOUNTS VISIBLE ONLY TO MEMBERS
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '0.5rem', wordBreak: 'break-all' }}>
              Contract: {circle.contractAddress.slice(0, 16)}...{circle.contractAddress.slice(-8)}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
              Tx: <a
                href={`https://explorer.preprod.midnight.network/transactions/${circle.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent-gold)', textDecoration: 'underline' }}
              >
                {circle.txHash.slice(0, 16)}...{circle.txHash.slice(-8)} ↗
              </a>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Invite: <span style={{ color: 'var(--accent-gold)' }}>{circle.inviteSecret}</span>
              <span style={{ fontSize: '9px', opacity: 0.5, marginLeft: '0.5rem' }}>(share with friends)</span>
            </div>
          </div>

          {/* Add Expense */}
          <div style={{
            padding: '1.5rem',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.02)',
            marginBottom: '2rem',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent-gold)', letterSpacing: '0.2em', marginBottom: '1rem' }}>
              LOG EXPENSE
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
              <input
                type="text"
                value={expenseLabel}
                onChange={(e) => setExpenseLabel(e.target.value)}
                placeholder="What was it for?"
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: '#fff',
                  outline: 'none',
                }}
              />
              <input
                type="number"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                placeholder="Amount"
                min="0"
                step="0.01"
                style={{
                  width: '120px',
                  padding: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: '#fff',
                  outline: 'none',
                }}
              />
            </div>
            <button
              onClick={handleAddExpense}
              disabled={!expenseLabel.trim() || !expenseAmount.trim()}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                background: 'transparent',
                border: '1px solid rgba(52,211,153,0.3)',
                color: '#34d399',
                cursor: 'pointer',
                letterSpacing: '0.1em',
                borderRadius: '4px',
                opacity: !expenseLabel.trim() || !expenseAmount.trim() ? 0.4 : 1,
              }}
            >
              + ADD EXPENSE
            </button>
          </div>

          {/* Expense List */}
          {circle.expenses.length > 0 ? (
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent-gold)', letterSpacing: '0.2em', marginBottom: '1rem' }}>
                EXPENSES ({circle.expenses.length})
              </div>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {circle.expenses.map((e, i) => (
                  <div key={i} style={{
                    padding: '1rem',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.02)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        {e.paidBy}
                      </div>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: '#fff' }}>
                        {e.label}
                      </div>
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '14px',
                      color: 'var(--accent-gold)',
                      fontWeight: 600,
                    }}>
                      ${e.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                border: '1px solid rgba(212,175,55,0.2)',
                borderRadius: '8px',
                background: 'rgba(212,175,55,0.05)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>Total</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: '#fff', fontWeight: 600 }}>${totalOwed.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>Per person (2 members)</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--accent-gold)', fontWeight: 600 }}>${perPerson.toFixed(2)}</span>
                </div>
              </div>

              {/* Settlement Board */}
              <div style={{ marginTop: '2rem' }}>
                <SettlementBoard
                  members={[
                    { id: 'you', name: 'You' },
                    { id: 'member2', name: 'Member 2' },
                  ]}
                  expenses={circle.expenses}
                  onSettle={handleSettle}
                />
              </div>

              {/* Recurring Pacts */}
              {address && (
                <div style={{ marginTop: '2rem' }}>
                  <RecurringPacts
                    walletAddress={address}
                    circleAddress={circle.contractAddress}
                  />
                </div>
              )}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--text-muted)',
            }}>
              No expenses yet.<br />
              <span style={{ opacity: 0.5 }}>Log your first expense above.</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
