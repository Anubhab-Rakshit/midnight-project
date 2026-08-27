import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';

export const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [hash, setHash] = useState('');

  useEffect(() => {
    // Generate random hashes rapidly
    const hashInterval = setInterval(() => {
      let newHash = '';
      for (let i = 0; i < 32; i++) {
        newHash += CHARS[Math.floor(Math.random() * CHARS.length)];
      }
      setHash(newHash);
    }, 50);

    // Progress counter
    let current = 0;
    const progressInterval = setInterval(() => {
      current += Math.floor(Math.random() * 5) + 1;
      if (current >= 100) {
        current = 100;
        clearInterval(progressInterval);
        clearInterval(hashInterval);
        setTimeout(onComplete, 500); // Small delay at 100% before firing complete
      }
      setProgress(current);
    }, 80);

    return () => {
      clearInterval(hashInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <motion.div 
      className="preloader"
      exit={{ opacity: 0, transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: '#020203',
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
      }}
    >
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.2em', marginBottom: '2rem' }}>
        INITIALIZING SECURE ENCLAVE
      </div>
      
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '8rem', fontStyle: 'italic', fontWeight: 300, lineHeight: 1 }}>
        {progress}%
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', marginTop: '2rem', width: '280px', wordBreak: 'break-all', textAlign: 'center', opacity: 0.5 }}>
        {hash}
      </div>
    </motion.div>
  );
};
