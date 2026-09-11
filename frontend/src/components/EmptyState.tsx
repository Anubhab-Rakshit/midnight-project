import React from 'react';
import { motion } from 'framer-motion';
import { Ghost } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, actionLabel, onAction }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: '100%',
        padding: '6rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        background: 'rgba(255,255,255,0.01)',
        border: '1px dashed rgba(255,255,255,0.1)',
        borderRadius: '16px',
      }}
    >
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '2rem',
        boxShadow: 'inset 0 0 20px rgba(255,255,255,0.02)',
      }}>
        <Ghost size={32} style={{ color: 'var(--text-muted)' }} />
      </div>

      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#fff', margin: '0 0 1rem 0' }}>
        {title}
      </h3>
      
      <p style={{ 
        fontFamily: 'var(--font-mono)', 
        fontSize: '12px', 
        color: 'var(--text-muted)', 
        maxWidth: '400px', 
        lineHeight: 1.6,
        margin: '0 0 2.5rem 0' 
      }}>
        {description}
      </p>

      {actionLabel && onAction && (
        <motion.button
          whileHover={{ scale: 1.05, background: 'rgba(212,175,55,0.1)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          style={{
            padding: '0.75rem 2rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--accent-gold)',
            background: 'transparent',
            border: '1px solid var(--accent-gold)',
            borderRadius: '999px',
            letterSpacing: '0.1em',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
};
