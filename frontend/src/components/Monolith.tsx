import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Fingerprint, Check, Loader2 } from 'lucide-react';
import { Magnetic } from './Magnetic';

interface MonolithProps {
  onProve: (premonition: string) => Promise<void>;
  onReset: () => void;
  isProving: boolean;
  hasProven: boolean;
  commitmentHash?: string | null;
}

export const Monolith: React.FC<MonolithProps> = ({
  onProve,
  onReset,
  isProving,
  hasProven,
  commitmentHash
}) => {
  const [premonition, setPremonition] = useState('');

  // 3D Tilt Effect
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useTransform(mouseY, [0, 1], [5, -5]);
  const rotateY = useTransform(mouseX, [0, 1], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    animate(mouseX, 0.5, { type: "spring", stiffness: 100, damping: 20 });
    animate(mouseY, 0.5, { type: "spring", stiffness: 100, damping: 20 });
  };

  return (
    <div className="monolith-wrapper">
      <motion.div
        className="monolith"
        style={{ rotateX, rotateY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="monolith-title">The Oracle</h2>

        <div className="premonition-input-wrapper">
          <label className="premonition-label">Record your premonition</label>
          <input
            type="text"
            className="premonition-input"
            placeholder="I foresee that..."
            value={premonition}
            onChange={(e) => setPremonition(e.target.value)}
            disabled={isProving || hasProven}
          />
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Magnetic pull={0.2}>
            <button
              className="omen-btn"
              onClick={() => onProve(premonition)}
              disabled={isProving || hasProven || !premonition}
            >
              {isProving ? (
                <><Loader2 size={14} className="animate-spin text-gold" /> CRYPTOGRAPHIC BINDING...</>
              ) : hasProven ? (
                <><Check size={14} className="text-gold" /> SEALED ON-CHAIN</>
              ) : (
                <><Fingerprint size={14} className="text-gold" /> INSCRIBE TO MIDNIGHT</>
              )}
            </button>
          </Magnetic>

          <div className="crypto-details">
            {!hasProven && !isProving && (
              <>ZK Boundary: <span className="text-gold">Private Witness</span> &rarr; Public Commitment</>
            )}
            {isProving && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Synthesizing Zero-Knowledge Proof... <br/>
                <span style={{ opacity: 0.5 }}>This secret will never leave your browser.</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Success Overlay */}
        {hasProven && (
          <motion.div
            className="proof-success"
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="proof-seal"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
            >
              <Check size={32} className="text-gold" />
            </motion.div>
            <h3 className="monolith-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Sealed Forever</h3>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '280px' }}>
              Your premonition is cryptographically bound to the Midnight Preprod ledger.<br/><br/>
              <span className="text-gold">hash: {commitmentHash ? commitmentHash.slice(0, 16) + '...' + commitmentHash.slice(-4) : '0xe3b0c44298fc1...b855'}</span>
            </p>
            <Magnetic pull={0.2}>
              <button
                className="omen-btn"
                onClick={onReset}
                style={{ marginTop: '1.5rem' }}
              >
                <Fingerprint size={14} className="text-gold" /> NEW PREMONITION
              </button>
            </Magnetic>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
