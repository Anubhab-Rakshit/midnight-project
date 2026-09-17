import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WalletConnect } from './WalletConnect';

interface NavbarProps {
  view: 'landing' | 'circles' | 'about';
  setView: (v: 'landing' | 'circles' | 'about') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ view, setView }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (v: 'landing' | 'circles' | 'about') => {
    setView(v);
    setMobileMenuOpen(false);
  };

  // Close mobile menu on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <motion.nav 
        className="floating-nav"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed',
          top: '1rem',
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 1000,
          pointerEvents: 'none',
          padding: '0 1rem',
        }}
      >
        <div
          className="nav-pill"
          style={{
            background: 'rgba(15, 15, 20, 0.88)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            borderRadius: '999px',
            padding: '0.55rem 1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            maxWidth: '860px',
            boxShadow: '0 20px 50px -10px rgba(0,0,0,0.85), 0 0 30px rgba(212,175,55,0.08)',
            pointerEvents: 'auto',
            transition: 'all 0.3s ease',
          }}
        >
          {/* Brand */}
          <div 
            onClick={() => handleNavClick('landing')} 
            style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: '1.6rem', 
              fontStyle: 'italic', 
              color: '#fff', 
              cursor: 'pointer',
              letterSpacing: '-0.02em',
              userSelect: 'none',
              flexShrink: 0,
            }}
          >
            Meridian.
          </div>
          
          {/* Desktop Nav Links */}
          <div 
            className="desktop-nav-links" 
            style={{ 
              alignItems: 'center', 
              gap: '1.75rem', 
              fontFamily: 'var(--font-mono)', 
              fontSize: '11px', 
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            <span 
              onClick={() => handleNavClick('circles')} 
              style={{ 
                color: view === 'circles' ? 'var(--accent-gold)' : 'var(--text-muted)', 
                cursor: 'pointer',
                fontWeight: view === 'circles' ? 600 : 400,
                transition: 'color 0.25s ease',
                position: 'relative',
                padding: '0.25rem 0',
              }}
            >
              Circles
              {view === 'circles' && (
                <motion.div 
                  layoutId="nav-underline"
                  style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1.5px', background: 'var(--accent-gold)', borderRadius: '2px' }} 
                />
              )}
            </span>

            <span 
              onClick={() => handleNavClick('about')} 
              style={{ 
                color: view === 'about' ? 'var(--accent-gold)' : 'var(--text-muted)', 
                cursor: 'pointer',
                fontWeight: view === 'about' ? 600 : 400,
                transition: 'color 0.25s ease',
                position: 'relative',
                padding: '0.25rem 0',
              }}
            >
              About Us
              {view === 'about' && (
                <motion.div 
                  layoutId="nav-underline"
                  style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1.5px', background: 'var(--accent-gold)', borderRadius: '2px' }} 
                />
              )}
            </span>
          </div>

          {/* Right Section: Wallet & Mobile Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <div className="nav-wallet-wrapper">
              <WalletConnect />
            </div>

            {/* Mobile Hamburger Toggle */}
            <motion.button
              className="mobile-menu-btn"
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: mobileMenuOpen ? 'rgba(212,175,55,0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: mobileMenuOpen ? '1px solid rgba(212,175,55,0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                color: mobileMenuOpen ? 'var(--accent-gold)' : '#fff',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.2s ease',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <path d="M4 8H20M4 16H20" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                )}
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Drawer Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              key="mobile-nav-drawer"
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{
                marginTop: '0.6rem',
                width: '100%',
                maxWidth: '860px',
                background: 'linear-gradient(180deg, rgba(20, 20, 26, 0.98) 0%, rgba(12, 12, 16, 0.98) 100%)',
                backdropFilter: 'blur(30px) saturate(180%)',
                WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                borderRadius: '20px',
                padding: '1.25rem',
                boxShadow: '0 24px 70px rgba(0,0,0,0.9), 0 0 35px rgba(212,175,55,0.08)',
                pointerEvents: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
              }}
            >
              {/* Status Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.25rem 0.5rem 0.5rem 0.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '0.25rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                  NAVIGATION
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent-gold)', letterSpacing: '0.08em' }}>
                    MIDNIGHT PREPROD
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleNavClick('circles')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.9rem 1.25rem',
                  borderRadius: '12px',
                  background: view === 'circles' ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
                  border: view === 'circles' ? '1px solid rgba(212,175,55,0.35)' : '1px solid rgba(255,255,255,0.06)',
                  color: view === 'circles' ? 'var(--accent-gold)' : '#fff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>Circles</span>
                {view === 'circles' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-gold)' }} />}
              </button>

              <button
                onClick={() => handleNavClick('about')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.9rem 1.25rem',
                  borderRadius: '12px',
                  background: view === 'about' ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
                  border: view === 'about' ? '1px solid rgba(212,175,55,0.35)' : '1px solid rgba(255,255,255,0.06)',
                  color: view === 'about' ? 'var(--accent-gold)' : '#fff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>About Us</span>
                {view === 'about' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-gold)' }} />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Backdrop for mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              zIndex: 999,
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};
