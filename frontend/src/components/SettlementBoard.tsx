import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { computeMinimumTransfers, verifySettlementPlan } from '@meridian/netting';
import type { SettlementPlan } from '@meridian/netting';

interface Member {
  id: string;
  name: string;
}

interface Expense {
  label: string;
  amount: number;
  paidBy: string;
  splitWith: string[];
}

interface SettlementBoardProps {
  members: Member[];
  expenses: Expense[];
  onSettle?: (plan: SettlementPlan) => Promise<void>;
}

export const SettlementBoard = ({ members, expenses, onSettle }: SettlementBoardProps) => {
  const [isSettling, setIsSettling] = useState(false);
  const [settlementComplete, setSettlementComplete] = useState(false);

  // Compute net balances from expenses
  const balances = useMemo(() => {
    const balanceMap = new Map<string, number>();

    // Initialize all members with zero balance
    for (const member of members) {
      balanceMap.set(member.id, 0);
    }

    // Process each expense
    for (const expense of expenses) {
      const payer = members.find((m) => m.name === expense.paidBy || m.id === expense.paidBy);
      if (!payer) continue;

      // Payer gets credited for the full amount
      const currentPayerBalance = balanceMap.get(payer.id) ?? 0;
      balanceMap.set(payer.id, currentPayerBalance + expense.amount);

      // Each person in splitWith owes their share
      const splitCount = expense.splitWith.length || members.length;
      const share = expense.amount / splitCount;

      const splitMembers = expense.splitWith.length > 0
        ? expense.splitWith.map((name) => members.find((m) => m.name === name || m.id === name)).filter(Boolean)
        : members;

      for (const member of splitMembers) {
        if (!member) continue;
        const currentBalance = balanceMap.get(member.id) ?? 0;
        balanceMap.set(member.id, currentBalance - share);
      }
    }

    return balanceMap;
  }, [members, expenses]);

  // Compute minimum transfer plan
  const settlementPlan = useMemo(() => {
    return computeMinimumTransfers(balances);
  }, [balances]);

  // Verify the plan
  const verification = useMemo(() => {
    return verifySettlementPlan(balances, settlementPlan);
  }, [balances, settlementPlan]);

  const handleSettle = async () => {
    if (!onSettle || !verification.valid) return;

    setIsSettling(true);
    try {
      await onSettle(settlementPlan);
      setSettlementComplete(true);
    } catch (err) {
      console.error('[Meridian] Settlement failed:', err);
    } finally {
      setIsSettling(false);
    }
  };

  const getMemberName = (id: string) => {
    return members.find((m) => m.id === id)?.name ?? id;
  };

  const formatAmount = (amount: number) => {
    return `$${Math.abs(amount).toFixed(2)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        padding: '1.5rem',
        border: '1px solid rgba(212,175,55,0.2)',
        borderRadius: '8px',
        background: 'rgba(212,175,55,0.05)',
      }}
    >
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '9px',
        color: 'var(--accent-gold)',
        letterSpacing: '0.2em',
        marginBottom: '1rem',
      }}>
        SETTLEMENT PLAN
      </div>

      {/* Net Balances */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          color: 'var(--text-muted)',
          letterSpacing: '0.1em',
          marginBottom: '0.5rem',
        }}>
          NET BALANCES
        </div>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {Array.from(balances.entries()).map(([id, balance]) => (
            <div
              key={id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 0.75rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '4px',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: '#fff',
              }}>
                {getMemberName(id)}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: balance > 0 ? '#34d399' : balance < 0 ? '#ff5050' : 'var(--text-muted)',
                }}
              >
                {balance > 0 ? '+' : ''}{formatAmount(balance)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Settlement Transfers */}
      {settlementPlan.transfers.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
            marginBottom: '0.5rem',
          }}>
            MINIMUM TRANSFERS ({settlementPlan.transfers.length})
          </div>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {settlementPlan.transfers.map((transfer, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem 0.75rem',
                  background: 'rgba(52,211,153,0.05)',
                  borderRadius: '4px',
                  border: '1px solid rgba(52,211,153,0.1)',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: '#fff',
                }}>
                  <span style={{ color: '#ff5050' }}>{getMemberName(transfer.from)}</span>
                  {' → '}
                  <span style={{ color: '#34d399' }}>{getMemberName(transfer.to)}</span>
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--accent-gold)',
                }}>
                  {formatAmount(transfer.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verification Status */}
      <div style={{
        padding: '0.75rem',
        background: verification.valid ? 'rgba(52,211,153,0.05)' : 'rgba(255,80,80,0.05)',
        borderRadius: '4px',
        marginBottom: '1rem',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: verification.valid ? '#34d399' : '#ff5050',
        }}>
          {verification.valid ? (
            <>
              ✓ Plan is valid (zero-sum, {verification.optimal ? 'optimal' : 'sub-optimal'})
            </>
          ) : (
            <>
              ✗ {verification.reason ?? 'Invalid plan'}
            </>
          )}
        </div>
      </div>

      {/* Settle Button */}
      {verification.valid && onSettle && !settlementComplete && (
        <button
          onClick={handleSettle}
          disabled={isSettling}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            background: isSettling ? 'rgba(52,211,153,0.1)' : 'transparent',
            border: '1px solid rgba(52,211,153,0.3)',
            color: '#34d399',
            cursor: isSettling ? 'wait' : 'pointer',
            letterSpacing: '0.1em',
            borderRadius: '4px',
          }}
        >
          {isSettling ? 'SETTLING...' : 'SETTLE NOW'}
        </button>
      )}

      {settlementComplete && (
        <div style={{
          textAlign: 'center',
          padding: '1rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: '#34d399',
        }}>
          Settlement complete!
        </div>
      )}

      {settlementPlan.transfers.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '1rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--text-muted)',
        }}>
          All settled — no transfers needed.
        </div>
      )}
    </motion.div>
  );
};
