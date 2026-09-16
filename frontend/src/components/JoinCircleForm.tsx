import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Hash, Loader2 } from 'lucide-react';
import { useToast } from './TransactionToast';
import { useMidnightWallet } from '../context/MidnightWalletContext';
import { saveCircle } from '../hooks/useCirclesStore';

interface JoinCircleFormProps {
  onClose: () => void;
}

export const JoinCircleForm: React.FC<JoinCircleFormProps> = ({ onClose }) => {
  const [contractAddress, setContractAddress] = useState('');
  const [inviteSecret, setInviteSecret] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  
  const { addToast, updateToast } = useToast();
  const { address } = useMidnightWallet();

  const handleJoin = async () => {
    if (!contractAddress.trim() || !inviteSecret.trim() || !address) return;
    
    setIsJoining(true);
    const toastId = addToast({ type: 'pending', title: 'Joining Circle', message: 'Generating ZK proof of membership...' });

    try {
      // In Phase 2, this will call `service.joinCircle`
      // For now, we mock the ZK proof delay and save it locally so the UI updates
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      await saveCircle({
        walletAddress: address,
        circleName: 'Joined Circle (Syncing...)',
        contractAddress,
        inviteSecret,
      });

      updateToast(toastId, { type: 'success', title: 'Circle Joined', message: 'You have successfully verified membership.' });
      onClose();
    } catch (err) {
      updateToast(toastId, { type: 'error', title: 'Join Failed', message: err instanceof Error ? err.message : 'Invalid invite secret' });
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        style={{
          background: 'rgba(15,15,18,0.95)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '3rem',
          width: '100%',
          maxWidth: '500px',
          position: 'relative',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
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
              CONTRACT ADDRESS
            </label>
            <div style={{ position: 'relative' }}>
              <Hash size={14} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
              <input
                type="text"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                placeholder="mn_addr_preprod..."
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
    </div>
  );
};
