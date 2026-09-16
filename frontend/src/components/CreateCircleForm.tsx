import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useMidnightWallet } from '../context/MidnightWalletContext';
import { useMeridianContract } from '../hooks/useMeridianContract';
import { saveCircle } from '../hooks/useCirclesStore';
import { useToast } from './TransactionToast';

interface CreateCircleFormProps {
  onBack: () => void;
  onCreated: (contractAddress: string) => void;
}

export const CreateCircleForm: React.FC<CreateCircleFormProps> = ({ onBack, onCreated }) => {
  const { address, isConnected, connect } = useMidnightWallet();
  const { createCircle } = useMeridianContract();
  const [circleName, setCircleName] = useState('');
  const [inviteSecret, setInviteSecret] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const { addToast, updateToast } = useToast();

  const handleCreateCircle = async () => {
    if (!circleName.trim() || !address) return;

    setIsExecuting(true);
    const secret = inviteSecret.trim() || crypto.randomUUID().slice(0, 16);

    const toastId = addToast({ type: 'pending', title: 'Deploying Contract', message: 'Deploying new Meridian vault to Midnight Preprod...' });

    try {
      const deployed = await createCircle(secret);

      await saveCircle({
        walletAddress: address,
        circleName,
        contractAddress: deployed.contractAddress,
        inviteSecret: secret,
        txHash: deployed.txHash,
        blockHeight: deployed.blockHeight,
      });

      updateToast(toastId, { type: 'success', title: 'Vault Deployed', message: 'Your confidential circle has been created.', txHash: deployed.txHash });
      onCreated(deployed.contractAddress);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to deploy contract';
      updateToast(toastId, { type: 'error', title: 'Deployment Failed', message });
    } finally {
      setIsExecuting(false);
    }
  };

  if (!isConnected) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Connect your wallet to deploy a new confidential circle.
        </p>
        <button onClick={() => connect()} className="omen-btn-primary">
          CONNECT WALLET
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '2rem' }}
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
        <ArrowLeft size={16} /> BACK
      </motion.button>

      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', color: '#fff', marginBottom: '2rem', textAlign: 'center' }}>
        Deploy Vault
      </h2>

      <div style={{
        padding: '2rem',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(20px)',
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent-gold)', letterSpacing: '0.2em', display: 'block', marginBottom: '0.75rem' }}>
            CIRCLE NAME
          </label>
          <input
            type="text"
            value={circleName}
            onChange={(e) => setCircleName(e.target.value)}
            placeholder="e.g. Weekend Squad"
            style={{
              width: '100%',
              padding: '1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#fff',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent-gold)', letterSpacing: '0.2em', display: 'block', marginBottom: '0.75rem' }}>
            INVITE SECRET <span style={{ opacity: 0.5 }}>(optional — auto-generated if empty)</span>
          </label>
          <input
            type="text"
            value={inviteSecret}
            onChange={(e) => setInviteSecret(e.target.value)}
            placeholder="leave empty for auto-generate"
            style={{
              width: '100%',
              padding: '1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
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
            padding: '1.25rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            background: isExecuting ? 'transparent' : 'var(--accent-gold)',
            color: isExecuting ? 'var(--accent-gold)' : '#000',
            border: isExecuting ? '1px solid var(--accent-gold)' : 'none',
            fontWeight: 600,
            cursor: isExecuting ? 'wait' : 'pointer',
            letterSpacing: '0.1em',
            borderRadius: '8px',
            opacity: !circleName.trim() ? 0.4 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          {isExecuting ? (
            <>
              <Loader2 size={14} className="animate-spin" /> DEPLOYING SMART CONTRACT...
            </>
          ) : (
            'CREATE CIRCLE'
          )}
        </button>
      </div>
    </motion.div>
  );
};
