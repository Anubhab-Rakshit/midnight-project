import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMidnightWallet } from '../context/MidnightWalletContext';
import { Wallet, LogOut, Loader2, Zap } from 'lucide-react';

export const WalletConnect: React.FC = () => {
  const { isConnected, isConnecting, address, balance, connect, disconnect } = useMidnightWallet();

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="wallet-connect-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <AnimatePresence mode="wait">
        {!isConnected ? (
          <motion.button
            key="connect-btn"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={connect}
            disabled={isConnecting}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              padding: '0.5rem 1.25rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--accent-gold)',
              cursor: isConnecting ? 'wait' : 'pointer',
              letterSpacing: '0.1em',
              borderRadius: '999px',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
            }}
            whileHover={{ background: 'rgba(212,175,55,0.1)', borderColor: 'rgba(212,175,55,0.3)' }}
          >
            {isConnecting ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                CONNECTING...
              </>
            ) : (
              <>
                <Wallet size={12} />
                CONNECT LACE
              </>
            )}
          </motion.button>
        ) : (
          <motion.div
            key="wallet-profile"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '999px',
              padding: '0.25rem 0.25rem 0.25rem 1rem',
              gap: '1rem',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Balance & Network */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Zap size={10} style={{ color: '#34d399' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: '#34d399', letterSpacing: '0.1em' }}>PREPROD</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 600 }}>
                {balance !== null ? `${balance.toFixed(2)} tNIGHT` : '0.00 tNIGHT'}
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />

            {/* Address & Disconnect */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#fff', letterSpacing: '0.05em' }}>
                {formatAddress(address || '')}
              </span>
              <button
                onClick={disconnect}
                title="Disconnect"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(255,80,80,0.1)',
                  border: '1px solid rgba(255,80,80,0.2)',
                  color: '#ff5050',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <LogOut size={12} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
