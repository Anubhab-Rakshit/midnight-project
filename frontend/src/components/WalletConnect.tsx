import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMidnightWallet } from '../context/MidnightWalletContext';
import { 
  Wallet, 
  LogOut, 
  Loader2, 
  Zap, 
  ChevronDown, 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  AlertCircle, 
  ArrowRight, 
  Lock,
  Download
} from 'lucide-react';

// ==========================================
// Custom Luxury Bespoke SVG Icons & Vectors
// ==========================================
const MidnightLogo = ({ size = 22, color = 'var(--accent-gold)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LaceLogo = ({ size = 20, color = '#a78bfa' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

const WalletVector = ({ size = 20, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 12V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V12ZM21 12H17C15.8954 12 15 11.1046 15 10C15 8.89543 15.8954 8 17 8H21V12Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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
              className="glass-panel"
              style={{
                width: '100%',
                maxWidth: '440px',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '2.5rem 2rem',
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
                  <h3 className="feature-title" style={{ marginBottom: '0.5rem', fontSize: '2.2rem' }}>
                    Connect Wallet
                  </h3>
                  <p className="feature-desc">
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
              <div className="wallet-options-list">
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
                        className={`wallet-option-btn ${isThisConnecting ? 'connecting' : ''}`}
                      >
                        {/* Custom Brand Icon Container */}
                        <div className={`wallet-icon-container ${isWallet1AM ? 'is-1am' : isWalletLace ? 'is-lace' : 'is-default'}`}>
                          {isWallet1AM ? (
                            <MidnightLogo size={22} color="var(--accent-gold)" />
                          ) : isWalletLace ? (
                            <LaceLogo size={20} color="#a78bfa" />
                          ) : (
                            <WalletVector size={20} color="#fff" />
                          )}
                        </div>

                        {/* Wallet Information */}
                        <div className="wallet-info">
                          <div className="wallet-info-top">
                            <span className="wallet-name">
                              {wallet.name}
                            </span>

                            {isWallet1AM && (
                              <span className="wallet-tag dust-free">
                                <Zap size={8} /> DUST-FREE
                              </span>
                            )}

                            {isWalletLace && (
                              <span className="wallet-tag official">
                                OFFICIAL
                              </span>
                            )}
                          </div>

                          <div className="wallet-info-bottom">
                            <span className="wallet-version">
                              v{wallet.apiVersion}
                            </span>
                            <span className="wallet-dot-divider">•</span>
                            <span className="wallet-type">
                              {isWallet1AM ? 'Observable State Prover' : isWalletLace ? 'Shielded ZK Connector' : 'Preprod Compatible'}
                            </span>
                          </div>
                        </div>

                        {/* Action / Spinner */}
                        <div className="wallet-action-indicator">
                          {isThisConnecting ? (
                            <Loader2 size={16} className="animate-spin" style={{ color: 'var(--accent-gold)' }} />
                          ) : (
                            <ArrowRight size={15} className="wallet-arrow" />
                          )}
                        </div>
                      </motion.button>
                    );
                  })
                ) : (
                  <div className="wallet-empty-state">
                    <AlertCircle size={24} style={{ color: 'var(--accent-gold)', margin: '0 auto 0.75rem auto' }} />
                    <p className="wallet-empty-title">
                      No Midnight Wallets Detected
                    </p>
                    <p className="wallet-empty-desc">
                      Install 1AM or Lace wallet extension to unlock real zero-knowledge contract interactions.
                    </p>

                    <div className="wallet-install-links">
                      <a
                        href="https://chromewebstore.google.com/detail/1am-wallet/gkhkghbjckofpndlfcbkffjplkgcfomj"
                        target="_blank"
                        rel="noreferrer"
                        className="wallet-install-btn btn-1am"
                      >
                        <Download size={11} /> Install 1AM
                      </a>
                      <a
                        href="https://chromewebstore.google.com/detail/midnight-lace/hgecmdngfehpkdehblpncmhkeoelaljg"
                        target="_blank"
                        rel="noreferrer"
                        className="wallet-install-btn btn-lace"
                      >
                        <Download size={11} /> Install Lace
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Security Badge & Privacy Guarantee */}
              <div className="wallet-security-badge">
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
            className="wallet-trigger-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 500,
              padding: '0.5rem 1rem',
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
              whiteSpace: 'nowrap',
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
                <Loader2 size={12} className="animate-spin" />
                <span className="wallet-label-full">CONNECTING...</span>
                <span className="wallet-label-short">...</span>
              </>
            ) : (
              <>
                <Wallet size={12} />
                <span className="wallet-label-full">CONNECT WALLET</span>
                <span className="wallet-label-short">CONNECT</span>
                <ChevronDown size={10} style={{ opacity: 0.7 }} className="wallet-chevron" />
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
            className="wallet-connected-pill"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '999px',
              padding: '0.35rem 0.75rem 0.35rem 0.6rem',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              transition: 'all 0.25s ease',
              whiteSpace: 'nowrap',
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
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
              {selectedWallet && (
                <span className="wallet-tag-hide-mobile" style={{
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
              {balance !== null ? `${balance.toFixed(1)} tNIGHT` : '0.0 tNIGHT'}
            </div>

            {/* Divider */}
            <div className="wallet-divider-hide-mobile" style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.15)' }} />

            {/* Address */}
            <div className="wallet-addr-hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
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
