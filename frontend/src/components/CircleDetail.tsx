import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCirclesStore, useCircleExpenses, saveExpense, saveSettlement, markCircleExpensesSettled } from '../hooks/useCirclesStore';
import { useMidnightWallet } from '../context/MidnightWalletContext';
import { useMeridianContract } from '../hooks/useMeridianContract';
import { ExpenseForm } from './ExpenseForm';
import { MemberList } from './MemberList';
import { EmptyState } from './EmptyState';
import { SettlementBoard } from './SettlementBoard';
import { RecurringPacts } from './RecurringPacts';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { ArrowLeft, ExternalLink, Activity, Users, Shield, Zap } from 'lucide-react';
import { computeMinimumTransfers } from '@meridian/netting';
import { computeCircleAnalytics } from '@meridian/analytics';

interface CircleDetailProps {
  contractAddress: string;
  onBack: () => void;
}

type Tab = 'expenses' | 'members' | 'settlement' | 'pacts' | 'analytics';

export const CircleDetail: React.FC<CircleDetailProps> = ({ contractAddress, onBack }) => {
  const { address } = useMidnightWallet();
  const { circles } = useCirclesStore(address);
  const { expenses, refetch: refetchExpenses } = useCircleExpenses(contractAddress);
  const circle = circles.find((c) => c.contractAddress === contractAddress);
  const { settle } = useMeridianContract();

  const [activeTab, setActiveTab] = useState<Tab>('expenses');

  // Expenses still open in the current round (settled ones are history)
  const unsettledExpenses = useMemo(() => expenses.filter((e) => !e.settledAt), [expenses]);

  // Compute real members from all expenses (history)
  const members = useMemo(() => {
    const memberMap = new Map<string, { id: string; name: string; address: string; isCreator: boolean }>();

    // Add the current user as creator
    if (address) {
      memberMap.set(address, {
        id: address,
        name: 'You',
        address,
        isCreator: true,
      });
    }

    // Add unique payers from expenses
    for (const exp of expenses) {
      if (!memberMap.has(exp.walletAddress)) {
        const isYou = exp.walletAddress === address;
        memberMap.set(exp.walletAddress, {
          id: exp.walletAddress,
          name: isYou ? 'You' : `Member ${exp.walletAddress.slice(0, 8)}...`,
          address: exp.walletAddress,
          isCreator: false,
        });
      }
    }

    return Array.from(memberMap.values());
  }, [expenses, address]);

  // Compute real balances using netting engine (open expenses only)
  const balances = useMemo(() => {
    const open = unsettledExpenses;
    if (open.length === 0 || members.length === 0) return new Map<string, number>();

    const balanceMap = new Map<string, number>();
    for (const m of members) {
      balanceMap.set(m.id, 0);
    }

    // Each expense: payer is owed (amount / members.length) by each non-payer
    const sharePerMember = members.length;
    for (const exp of open) {
      const share = exp.amount / sharePerMember;
      const currentBalance = balanceMap.get(exp.walletAddress) || 0;
      balanceMap.set(exp.walletAddress, currentBalance + exp.amount - share);

      for (const m of members) {
        if (m.id !== exp.walletAddress) {
          const mb = balanceMap.get(m.id) || 0;
          balanceMap.set(m.id, mb - share);
        }
      }
    }

    return balanceMap;
  }, [unsettledExpenses, members]);

  // Compute settlement plan
  const settlementPlan = useMemo(() => {
    if (balances.size === 0) return null;
    return computeMinimumTransfers(balances);
  }, [balances]);

  // Compute analytics for the current open round
  const analytics = useMemo(() => {
    if (unsettledExpenses.length === 0) return null;
    return computeCircleAnalytics(
      unsettledExpenses.map((e) => ({
        memberId: e.walletAddress,
        amount: e.amount,
        label: e.expenseLabel,
        timestamp: e.createdAt,
      }))
    );
  }, [unsettledExpenses]);

  // Real totals (open round only)
  const totalSpent = useMemo(
    () => unsettledExpenses.reduce((sum, e) => sum + e.amount, 0),
    [unsettledExpenses]
  );
  const yourBalance = address ? (balances.get(address) ?? 0) : 0;

  if (!circle) return null;

  const handleAddExpense = async (label: string, amount: number, splitType: 'equal' | 'custom') => {
    if (!address) throw new Error('Wallet not connected');

    const commitmentHash = Array.from(
      crypto.getRandomValues(new Uint8Array(32))
    )
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    await saveExpense({
      walletAddress: address,
      circleAddress: contractAddress,
      expenseLabel: label,
      amount,
      expenseType: splitType,
      commitmentHash,
    });

    await refetchExpenses();
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'expenses', label: 'Ledger', icon: <Activity size={14} /> },
    { id: 'members', label: 'Members', icon: <Users size={14} /> },
    { id: 'settlement', label: 'Settlement', icon: <Zap size={14} /> },
    { id: 'pacts', label: 'Pacts', icon: <Shield size={14} /> },
    { id: 'analytics', label: 'Analytics', icon: <Activity size={14} /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', paddingBottom: '6rem' }}
    >
      <motion.button
        whileHover={{ x: -5, color: 'var(--accent-gold)' }}
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '2rem',
          background: 'transparent',
          border: 'none',
          padding: 0,
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--text-muted)',
          letterSpacing: '0.1em',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
      >
        <ArrowLeft size={16} /> BACK TO CIRCLES
      </motion.button>

      {/* Circle Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingBottom: '2rem',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        marginBottom: '2rem',
      }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '3.5rem', color: '#fff', margin: '0 0 0.5rem 0', lineHeight: 1.1 }}>
            {circle.circleName}
          </h2>
          <a
            href={`https://explorer.preprod.midnight.network/address/${circle.contractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              letterSpacing: '0.05em',
            }}
          >
            Contract: {circle.contractAddress.slice(0, 16)}...{circle.contractAddress.slice(-8)}
            <ExternalLink size={12} style={{ color: 'var(--accent-gold)' }} />
          </a>
        </div>

        <div style={{ display: 'flex', gap: '2rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.2em' }}>TOTAL SPENT</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#fff' }}>${totalSpent.toFixed(2)}</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.2em' }}>YOUR BALANCE</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: yourBalance >= 0 ? '#34d399' : '#ff5050' }}>
              {yourBalance >= 0 ? '+' : ''}${yourBalance.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              background: activeTab === tab.id ? 'rgba(255,255,255,0.05)' : 'transparent',
              border: `1px solid ${activeTab === tab.id ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
              borderRadius: '999px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: activeTab === tab.id ? 'var(--accent-gold)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              letterSpacing: '0.1em'
            }}
          >
            {tab.icon} {tab.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'expenses' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#fff', marginBottom: '2rem' }}>Ledger</h3>
                {expenses.length === 0 ? (
                  <EmptyState
                    title="Clean Slate"
                    description="No expenses have been logged in this circle yet. Use the panel on the right to log the first confidential expense."
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {expenses.map((e) => {
                      const payerName = e.walletAddress === address ? 'You' : `Member ${e.walletAddress.slice(0, 8)}...`;
                      return (
                        <div key={e.id} style={{
                          padding: '1.5rem',
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.05)',
                          borderRadius: '12px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                              {payerName} paid for
                            </div>
                            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#fff' }}>
                              {e.expenseLabel}
                            </div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                              {e.expenseType} split · {new Date(e.createdAt).toLocaleDateString()}
                              {e.settledAt && (
                                <span style={{ color: '#34d399', marginLeft: '0.75rem' }}>✓ SETTLED {new Date(e.settledAt).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                            ${e.amount.toFixed(2)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div>
                <ExpenseForm onAddExpense={handleAddExpense} />
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div style={{ maxWidth: '600px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#fff', marginBottom: '2rem' }}>Circle Members</h3>
              <MemberList members={members} inviteSecret={circle.inviteSecret} />
            </div>
          )}

          {activeTab === 'settlement' && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#fff', marginBottom: '2rem' }}>Optimal Settlement Graph</h3>
              {settlementPlan && settlementPlan.transfers.length > 0 ? (
                <SettlementBoard
                  members={members}
                  expenses={unsettledExpenses.map((e) => ({
                    paidBy: e.walletAddress,
                    amount: e.amount,
                    splitWith: members.map((m) => m.id),
                  }))}
                  settlementPlan={settlementPlan}
                  onSettle={async () => {
                    if (!circle || !settlementPlan || !address) return;
                    const result = await settle(circle.contractAddress, circle.inviteSecret, settlementPlan);
                    try {
                      await Promise.all([
                        saveSettlement({
                          circleAddress: circle.contractAddress,
                          transferCount: settlementPlan.transfers.length,
                          settlementHash: result.settlementHash,
                          txHash: result.txHash,
                          blockHeight: result.blockHeight,
                        }),
                        markCircleExpensesSettled(circle.contractAddress),
                      ]);
                    } catch (err) {
                      console.warn('[Meridian] Settlement recorded on-chain but failed to update local ledger:', err);
                    }
                    await refetchExpenses();
                  }}
                />
              ) : (
                <EmptyState
                  title="Nothing to Settle"
                  description={expenses.length === 0
                    ? "Log some expenses first, then come back to settle."
                    : "All balances are even. No transfers needed."}
                />
              )}
            </div>
          )}

          {activeTab === 'pacts' && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#fff', marginBottom: '2rem' }}>Recurring Pacts</h3>
              {address ? (
                <RecurringPacts walletAddress={address} circleAddress={circle.contractAddress} />
              ) : null}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#fff', marginBottom: '2rem' }}>Private Analytics</h3>
              {analytics ? (
                <AnalyticsDashboard
                  analytics={analytics}
                  currentMemberId={address || ''}
                  expenses={unsettledExpenses.map((e) => ({
                    memberId: e.walletAddress,
                    amount: e.amount,
                    label: e.expenseLabel,
                    timestamp: e.createdAt,
                  }))}
                />
              ) : (
                <EmptyState
                  title="No Analytics Yet"
                  description="Log some expenses to see your circle's analytics."
                />
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
