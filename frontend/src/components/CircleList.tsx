import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCirclesStore } from '../hooks/useCirclesStore';
import { useMidnightWallet } from '../context/MidnightWalletContext';
import { Plus, Users, Hash, Clock, ArrowRight } from 'lucide-react';
import { JoinCircleForm } from './JoinCircleForm';
import { EmptyState } from './EmptyState';

interface CircleListProps {
  onSelectCircle: (circleAddress: string) => void;
  onCreateNew: () => void;
}

export const CircleList: React.FC<CircleListProps> = ({ onSelectCircle, onCreateNew }) => {
  const { address } = useMidnightWallet();
  const { circles, isLoading } = useCirclesStore(address);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  if (!address) return null;

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h2 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '4rem', 
            fontStyle: 'italic', 
            margin: 0,
            background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.3) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Your Circles
          </h2>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', marginTop: '0.5rem', letterSpacing: '0.05em' }}>
            Confidential ledgers synchronized on Midnight.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <motion.button
            whileHover={{ background: 'rgba(212,175,55,0.1)', borderColor: 'rgba(212,175,55,0.3)' }}
            onClick={() => setIsJoinModalOpen(true)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'rgba(255,255,255,0.03)',
              color: 'var(--accent-gold)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '999px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
          >
            <Hash size={14} /> JOIN CIRCLE
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateNew}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'var(--accent-gold)',
              color: '#000',
              border: 'none',
              borderRadius: '999px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <Plus size={14} /> NEW CIRCLE
          </motion.button>
        </div>
      </div>

      {isLoading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
          Syncing ledgers...
        </div>
      ) : circles.length === 0 ? (
        <EmptyState 
          title="No Confidential Circles Found"
          description="You haven't joined any circles with this wallet yet. Create a new circle to start splitting expenses privately, or join an existing one using an invite secret."
          actionLabel="CREATE NEW CIRCLE"
          onAction={onCreateNew}
        />
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}
        >
          {circles.map(circle => (
            <motion.div
              key={circle.contractAddress}
              variants={item}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => onSelectCircle(circle.contractAddress)}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '2rem',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '220px',
                backdropFilter: 'blur(20px)',
              }}
            >
              {/* Glossy gradient orb */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />

              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: '#fff', margin: '0 0 1rem 0' }}>
                  {circle.circleName}
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                    <Hash size={12} /> {circle.contractAddress.slice(0, 12)}...{circle.contractAddress.slice(-8)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                    <Users size={12} /> Unknown (Encrypted)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                    <Clock size={12} /> Created {new Date(circle.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '11px', 
                  color: 'var(--accent-gold)',
                  letterSpacing: '0.1em'
                }}>
                  ENTER VAULT <ArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {isJoinModalOpen && (
          <JoinCircleForm onClose={() => setIsJoinModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};
