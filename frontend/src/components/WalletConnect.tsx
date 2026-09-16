import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMidnightWallet } from '../context/MidnightWalletContext';
import { 
  Wallet, 
  LogOut, 
  Loader2, 
  Zap, 
  ShieldCheck, 
  ChevronDown, 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  RefreshCw, 
  AlertCircle, 
  ArrowRight, 
  Lock,
  Download
} from 'lucide-react';

export const WalletConnect: React.FC = () => {
  const {
    isConnected,
    isConnecting,
    connectingWalletId,
    address,
    balance,
    isRefreshingBalance,
    selectedWallet,
    availableWallets,
    isWalletModalOpen,
    openWalletModal,
    closeWalletModal,
    connect,
    disconnect,
    refreshBalance,
  } = useMidnightWallet();

  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close modals on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeWalletModal();
        setShowAccountMenu(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeWalletModal]);

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const is1am = (name: string) => name.toLowerCase().includes('1am') || name.toLowerCase().includes('1 am');
  const isLace = (name: string) => name.toLowerCase().includes('lace');

  // Renders the Wallet Connection Modal via Portal
  const renderWalletModal = () => {
    if (!mounted || !isWalletModalOpen) return null;

    return createPortal(
      <AnimatePresence>
        {isWalletModalOpen && (
          <motion.div
            key="wallet-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeWalletModal}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(4, 4, 7, 0.78)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem',
            }}
          >
            <motion.div
              key="wallet-modal-card"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '440px',
                maxHeight: '90vh',
                overflowY: 'auto',
                background: 'linear-gradient(180deg, rgba(22, 22, 28, 0.96) 0%, rgba(12, 12, 16, 0.98) 100%)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                borderRadius: '24px',
                boxShadow: '0 30px 70px -10px rgba(0, 0, 0, 0.9), 0 0 40px -5px rgba(212, 175, 55, 0.12), inset 0 1px 1px 0 rgba(255, 255, 255, 0.12)',
                position: 'relative',
                padding: '2rem 1.75rem',
              }}
            >
              {/* Ambient Top Glow */}
              <div
                style={{
                  position: 'absolute',
                  top: '-10%',
                  left: '20%',
                  right: '20%',
                  height: '100px',
                  background: 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.18), transparent 70%)',
                  pointerEvents: 'none',
                  filter: 'blur(25px)',
                }}
              />

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', position: 'relative', zIndex: 2 }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.65rem', borderRadius: '999px', background: 'rgba(212, 175, 55, 0.08)', border: '1px solid rgba(212, 175, 55, 0.25)', marginBottom: '0.75rem' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent-gold)', letterSpacing: '0.12em', fontWeight: 600 }}>
                      MIDNIGHT PREPROD
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', color: '#fff', margin: 0, fontWeight: 400, letterSpacing: '-0.02em', fontStyle: 'italic' }}>
                    Connect Wallet
                  </h3>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'rgba(240, 240, 240, 0.55)', margin: '0.4rem 0 0 0', lineHeight: 1.45 }}>
                    Select a zero-knowledge confidential wallet to authenticate on Midnight Network.
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeWalletModal}
                  aria-label="Close modal"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <X size={15} />
                </motion.button>
              </div>

              {/* Wallet Options List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', position: 'relative', zIndex: 2 }}>
                {availableWallets.length > 0 ? (
                  availableWallets.map((wallet) => {
                    const isWallet1AM = is1am(wallet.name);
                    const isWalletLace = isLace(wallet.name);
                    const isThisConnecting = isConnecting && connectingWalletId === wallet.id;

                    return (
                      <motion.button
                        key={wallet.id}
                        whileHover={{ scale: 1.015, x: 2 }}
                        whileTap={{ scale: 0.985 }}
                        onClick={() => connect(wallet.id)}
                        disabled={isConnecting}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          padding: '1.1rem 1.25rem',
                          background: isThisConnecting 
                            ? 'rgba(212, 175, 55, 0.08)' 
                            : 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                          border: isThisConnecting 
                            ? '1px solid rgba(212, 175, 55, 0.5)' 
                            : '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '16px',
                          cursor: isConnecting ? 'wait' : 'pointer',
                          transition: 'all 0.25s ease',
                          textAlign: 'left',
                          width: '100%',
                          position: 'relative',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                        }}
                        onMouseEnter={(e) => {
                          if (!isConnecting) {
                            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(255,255,255,0.02) 100%)';
                            e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.35)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isConnecting) {
                            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                          }
                        }}
                      >
                        {/* Custom Brand Icon Container */}
                        <div
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '14px',
                            background: isWallet1AM
                              ? 'linear-gradient(135deg, rgba(212,175,55,0.25) 0%, rgba(212,175,55,0.05) 100%)'
                              : isWalletLace
                              ? 'linear-gradient(135deg, rgba(139,92,246,0.25) 0%, rgba(99,102,241,0.05) 100%)'
                              : 'rgba(255, 255, 255, 0.05)',
                            border: isWallet1AM
                              ? '1px solid rgba(212, 175, 55, 0.4)'
                              : isWalletLace
                              ? '1px solid rgba(139, 92, 246, 0.35)'
                              : '1px solid rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: isWallet1AM 
                              ? '0 0 20px rgba(212,175,55,0.15)' 
                              : isWalletLace 
                              ? '0 0 20px rgba(139,92,246,0.15)' 
                              : 'none',
                          }}
                        >
                          {isWallet1AM ? (
                            <ShieldCheck size={22} style={{ color: 'var(--accent-gold)' }} />
                          ) : isWalletLace ? (
                            <Sparkles size={20} style={{ color: '#a78bfa' }} />
                          ) : (
                            <Wallet size={20} style={{ color: '#fff' }} />
                          )}
                        </div>

                        {/* Wallet Information */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#fff', fontWeight: 600, letterSpacing: '0.04em' }}>
                              {wallet.name}
                            </span>

                            {isWallet1AM && (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.2rem',
                                padding: '0.15rem 0.45rem',
                                borderRadius: '6px',
                                background: 'rgba(52, 211, 153, 0.1)',
                                border: '1px solid rgba(52, 211, 153, 0.25)',
                                color: '#34d399',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '8.5px',
                                fontWeight: 500,
                                letterSpacing: '0.05em',
                              }}>
                                <Zap size={8} /> DUST-FREE
                              </span>
                            )}

                            {isWalletLace && (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.2rem',
                                padding: '0.15rem 0.45rem',
                                borderRadius: '6px',
                                background: 'rgba(167, 139, 250, 0.1)',
                                border: '1px solid rgba(167, 139, 250, 0.25)',
                                color: '#c4b5fd',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '8.5px',
                                fontWeight: 500,
                                letterSpacing: '0.05em',
                              }}>
                                OFFICIAL
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.3rem' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(240, 240, 240, 0.4)' }}>
                              v{wallet.apiVersion}
                            </span>
                            <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', color: 'rgba(240, 240, 240, 0.5)' }}>
                              {isWallet1AM ? 'Observable State Prover' : isWalletLace ? 'Shielded ZK Connector' : 'Preprod Compatible'}
                            </span>
                          </div>
                        </div>

                        {/* Action / Spinner */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '0.5rem' }}>
                          {isThisConnecting ? (
                            <Loader2 size={16} className="animate-spin" style={{ color: 'var(--accent-gold)' }} />
                          ) : (
                            <ArrowRight size={15} style={{ color: 'rgba(255, 255, 255, 0.3)', transition: 'transform 0.2s ease' }} />
                          )}
                        </div>
                      </motion.button>
                    );
                  })
                ) : (
                  <div
                    style={{
                      padding: '1.5rem',
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px dashed rgba(255, 255, 255, 0.15)',
                      textAlign: 'center',
                    }}
                  >
                    <AlertCircle size={24} style={{ color: 'var(--accent-gold)', margin: '0 auto 0.75rem auto' }} />
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#fff', fontWeight: 600, margin: '0 0 0.35rem 0' }}>
                      No Midnight Wallets Detected
                    </p>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11.5px', color: 'var(--text-muted)', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
                      Install 1AM or Lace wallet extension to unlock real zero-knowledge contract interactions.
                    </p>

                    <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <a
                        href="https://chromewebstore.google.com/detail/1am-wallet/gkhkghbjckofpndlfcbkffjplkgcfomj"
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.45rem 0.9rem',
                          borderRadius: '8px',
                          background: 'rgba(212, 175, 55, 0.1)',
                          border: '1px solid rgba(212, 175, 55, 0.3)',
                          color: 'var(--accent-gold)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                          textDecoration: 'none',
                        }}
                      >
                        <Download size={11} /> Install 1AM
                      </a>
                      <a
                        href="https://chromewebstore.google.com/detail/midnight-lace/hgecmdngfehpkdehblpncmhkeoelaljg"
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.45rem 0.9rem',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#fff',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                          textDecoration: 'none',
                        }}
                      >
                        <Download size={11} /> Install Lace
                      </a>
                    </div>
                  </div>
                )}

              </div>

              {/* Security Badge & Privacy Guarantee */}
              <div
                style={{
                  marginTop: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  justifyContent: 'center',
                  color: 'rgba(240, 240, 240, 0.35)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9.5px',
                  letterSpacing: '0.03em',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                <Lock size={11} />
                <span>Zero-Knowledge Protected • Keys Never Leave Browser</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    );
  };

  // Renders the Connected Account Menu Modal via Portal
  const renderAccountMenu = () => {
    if (!mounted || !showAccountMenu || !isConnected) return null;

    return createPortal(
      <AnimatePresence>
        {showAccountMenu && (
          <motion.div
            key="account-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAccountMenu(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(4, 4, 7, 0.7)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem',
            }}
          >
            <motion.div
              key="account-menu-card"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '400px',
                background: 'linear-gradient(180deg, rgba(22, 22, 28, 0.96) 0%, rgba(12, 12, 16, 0.98) 100%)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                borderRadius: '24px',
                boxShadow: '0 30px 70px -10px rgba(0, 0, 0, 0.9), 0 0 40px -5px rgba(212, 175, 55, 0.1)',
                padding: '1.75rem',
                position: 'relative',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 10px #34d399' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#fff', fontWeight: 600, letterSpacing: '0.05em' }}>
                    {selectedWallet?.name || 'Midnight Wallet'}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: '#34d399', background: 'rgba(52,211,153,0.1)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                    PREPROD
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAccountMenu(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  <X size={14} />
                </motion.button>
              </div>

              {/* Balance Card */}
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                    UNSHIELDED BALANCE
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', color: 'var(--accent-gold)', fontWeight: 700, marginTop: '0.25rem' }}>
                    {balance !== null ? `${balance.toFixed(2)} tNIGHT` : '0.00 tNIGHT'}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={refreshBalance}
                  disabled={isRefreshingBalance}
                  title="Refresh Balance"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    background: 'rgba(212, 175, 55, 0.1)',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    color: 'var(--accent-gold)',
                    cursor: 'pointer',
                  }}
                >
                  <RefreshCw size={14} className={isRefreshingBalance ? 'animate-spin' : ''} />
                </motion.button>
              </div>

              {/* Address Card */}
              <div
                style={{
                  padding: '0.9rem 1rem',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)' }}>
                    ACCOUNT ADDRESS
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => copyToClipboard(address || '')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        background: 'transparent',
                        border: 'none',
                        color: copied ? '#34d399' : 'var(--accent-gold)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9.5px',
                        cursor: 'pointer',
                      }}
                    >
                      {copied ? <Check size={11} /> : <Copy size={11} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                    <a
                      href={`https://preprod.midnight.network/address/${address || ''}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9.5px',
                        textDecoration: 'none',
                      }}
                    >
                      <ExternalLink size={10} /> Explorer
                    </a>
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#fff', wordBreak: 'break-all', lineHeight: 1.4 }}>
                  {address}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <button
                  onClick={() => {
                    setShowAccountMenu(false);
                    openWalletModal();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
                >
                  <Wallet size={13} /> Switch Wallet
                </button>

                <button
                  onClick={() => {
                    disconnect();
                    setShowAccountMenu(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    color: '#f87171',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)')}
                >
                  <LogOut size={13} /> Disconnect
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    );
  };

  return (
    <div className="wallet-connect-container" style={{ display: 'inline-flex', alignItems: 'center' }}>
      <AnimatePresence mode="wait">
        {!isConnected ? (
          <motion.button
            key="btn-connect"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={openWalletModal}
            disabled={isConnecting}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 500,
              padding: '0.55rem 1.25rem',
              background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(255,255,255,0.03) 100%)',
              border: '1px solid rgba(212,175,55,0.35)',
              color: 'var(--accent-gold)',
              cursor: isConnecting ? 'wait' : 'pointer',
              letterSpacing: '0.08em',
              borderRadius: '999px',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.1)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            whileHover={{
              scale: 1.04,
              borderColor: 'rgba(212,175,55,0.7)',
              boxShadow: '0 0 20px rgba(212,175,55,0.25)',
            }}
            whileTap={{ scale: 0.96 }}
          >
            {isConnecting ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>CONNECTING...</span>
              </>
            ) : (
              <>
                <Wallet size={13} />
                <span>CONNECT WALLET</span>
                <ChevronDown size={11} style={{ opacity: 0.7 }} />
              </>
            )}
          </motion.button>
        ) : (
          <motion.button
            key="btn-connected-pill"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={() => setShowAccountMenu(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '999px',
              padding: '0.35rem 0.85rem 0.35rem 0.65rem',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              transition: 'all 0.25s ease',
            }}
            whileHover={{
              scale: 1.02,
              borderColor: 'rgba(212, 175, 55, 0.6)',
              boxShadow: '0 0 20px rgba(212, 175, 55, 0.15)',
            }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Live Status Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
              {selectedWallet && (
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  color: 'var(--accent-gold)',
                  background: 'rgba(212, 175, 55, 0.1)',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                }}>
                  {selectedWallet.name.toUpperCase()}
                </span>
              )}
            </div>

            {/* Balance */}
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 600 }}>
              {balance !== null ? `${balance.toFixed(2)} tNIGHT` : '0.00 tNIGHT'}
            </div>

            {/* Divider */}
            <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.15)' }} />

            {/* Address */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#fff', letterSpacing: '0.03em' }}>
                {formatAddress(address || '')}
              </span>
              <ChevronDown size={11} style={{ color: 'var(--text-muted)' }} />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Render Modals in Portals */}
      {renderWalletModal()}
      {renderAccountMenu()}
    </div>
  );
};
