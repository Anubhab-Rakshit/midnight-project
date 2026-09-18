import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Hash, Loader2, Circle } from 'lucide-react';
import { useToast } from './TransactionToast';
import { useMidnightWallet } from '../context/MidnightWalletContext';
import { saveCircle } from '../hooks/useCirclesStore';

interface JoinCircleFormProps {
  onClose: () => void;
}

export const JoinCircleForm: React.FC<JoinCircleFormProps> = ({ onClose }) => {
  const [contractAddress, setContractAddress] = useState('');
  const [inviteSecret, setInviteSecret] = useState('');
  const [circleName, setCircleName] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const { addToast, updateToast } = useToast();
  const { address } = useMidnightWallet();

  const handleJoin = async () => {
    if (!contractAddress.trim() || !inviteSecret.trim() || !address) return;

    setIsJoining(true);
    const toastId = addToast({ type: 'pending', title: 'Joining Circle', message: 'Generating ZK proof of membership...' });

    try {
      await saveCircle({
        walletAddress: address,
        circleName: circleName.trim() || `Circle ${contractAddress.slice(0, 8)}...`,
        contractAddress: contractAddress.trim(),
        inviteSecret: inviteSecret.trim(),
      });

      updateToast(toastId, { type: 'success', title: 'Circle Joined', message: 'You have successfully verified membership.' });
      onClose();
    } catch (err) {
      updateToast(toastId, { type: 'error', title: 'Join Failed', message: err instanceof Error ? err.message : 'Invalid invite secret' });
    } finally {
      setIsJoining(false);
    }
  };

  return createPortal(
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(4,4,7,0.78)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: 'linear-gradient(180deg, rgba(22, 22, 28, 0.96) 0%, rgba(12, 12, 16, 0.98) 100%)',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          borderRadius: '24px',
          padding: '2.5rem',
          width: '100%',
          maxWidth: '480px',
          position: 'relative',
          boxShadow: '0 30px 70px -10px rgba(0,0,0,0.9), 0 0 40px -5px rgba(212,175,55,0.12)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: '#fff', margin: '0 0 0.5rem 0' }}>Join Circle</h3>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.5 }}>
          Enter the contract address and the secret invite phrase provided by the circle creator.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent-gold)', letterSpacing: '0.2em', display: 'block', marginBottom: '0.75rem' }}>
              CIRCLE NAME
            </label>
            <div style={{ position: 'relative' }}>
              <Circle size={14} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
              <input
                type="text"
                value={circleName}
                onChange={(e) => setCircleName(e.target.value)}
                placeholder="e.g. Weekend Squad (optional)"
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 2.5rem',
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
              CONTRACT ADDRESS
            </label>
            <div style={{ position: 'relative' }}>
              <Hash size={14} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
              <input
                type="text"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                placeholder="0x... or mn_addr..."
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 2.5rem',
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
              INVITE SECRET
            </label>
            <input
              type="password"
              value={inviteSecret}
              onChange={(e) => setInviteSecret(e.target.value)}
              placeholder="Enter the secret phrase..."
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

          <button
            onClick={handleJoin}
            disabled={isJoining || !contractAddress.trim() || !inviteSecret.trim()}
            style={{
              marginTop: '1rem',
              width: '100%',
              padding: '1.25rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              background: isJoining ? 'rgba(212,175,55,0.1)' : 'var(--accent-gold)',
              color: isJoining ? 'var(--accent-gold)' : '#000',
              border: 'none',
              fontWeight: 600,
              cursor: isJoining ? 'wait' : 'pointer',
              letterSpacing: '0.1em',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              opacity: (!contractAddress.trim() || !inviteSecret.trim()) ? 0.5 : 1,
            }}
          >
            {isJoining ? (
              <>
                <Loader2 size={14} className="animate-spin" /> PROVING MEMBERSHIP...
              </>
            ) : (
              'JOIN CIRCLE'
            )}
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};
