import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCirclesStore } from '../hooks/useCirclesStore';
import { useMidnightWallet } from '../context/MidnightWalletContext';
import { ExpenseForm } from './ExpenseForm';
import { MemberList } from './MemberList';
import { EmptyState } from './EmptyState';
import { SettlementBoard } from './SettlementBoard';
import { RecurringPacts } from './RecurringPacts';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { ArrowLeft, ExternalLink, Activity, Users, Shield, Zap } from 'lucide-react';

interface CircleDetailProps {
  contractAddress: string;
  onBack: () => void;
}

type Tab = 'expenses' | 'members' | 'settlement' | 'pacts' | 'analytics';

export const CircleDetail: React.FC<CircleDetailProps> = ({ contractAddress, onBack }) => {
  const { address } = useMidnightWallet();
  const { circles } = useCirclesStore(address);
  const circle = circles.find((c) => c.contractAddress === contractAddress);

  const [activeTab, setActiveTab] = useState<Tab>('expenses');

  // Mock members and expenses for now (Opencode will wire real ones later)
  const mockMembers = [
    { id: '1', name: 'You', address: address || 'mn_addr_preprod1...', isCreator: true },
    { id: '2', name: 'Alice (Encrypted)', address: 'mn_addr_preprod1xyz...', isCreator: false },
  ];

  const mockExpenses = [
    { id: 'e1', label: 'Dinner at Dorsia', amount: 250, paidBy: 'You', splitWith: ['Alice'] },
  ];

  if (!circle) return null;

  const handleAddExpense = async (label: string, amount: number, splitType: 'equal' | 'custom') => {
    // Mock for now
    console.log('[Mock] Adding expense:', label, amount, splitType);
    await new Promise(res => setTimeout(res, 2000));
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
            href={`https://explorer.preprod.midnight.network/transactions/${circle.txHash}`}
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
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#fff' }}>$250.00</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.2em' }}>YOUR BALANCE</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#34d399' }}>+$125.00</div>
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
                {mockExpenses.length === 0 ? (
                  <EmptyState 
                    title="Clean Slate"
                    description="No expenses have been logged in this circle yet. Use the panel on the right to log the first confidential expense."
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {mockExpenses.map((e) => (
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
                            {e.paidBy} paid for
                          </div>
                          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#fff' }}>
                            {e.label}
                          </div>
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                          ${e.amount.toFixed(2)}
                        </div>
                      </div>
                    ))}
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
              <MemberList members={mockMembers} inviteSecret={circle.inviteSecret} />
            </div>
          )}

          {activeTab === 'settlement' && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#fff', marginBottom: '2rem' }}>Optimal Settlement Graph</h3>
              <SettlementBoard
                members={mockMembers}
                expenses={mockExpenses}
                onSettle={async () => { console.log('settle'); }}
              />
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
              <AnalyticsDashboard
                expenses={[]}
                balances={new Map()}
                currentMemberId="1"
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
