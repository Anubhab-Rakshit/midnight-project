import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==========================================
// Custom Luxury Bespoke SVG Icons & Vectors
// ==========================================

const SvgZkSeal: React.FC<{ size?: number; className?: string }> = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" stroke="var(--accent-gold)" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
    <circle cx="24" cy="24" r="17" stroke="var(--accent-gold)" strokeWidth="1.2" opacity="0.7" />
    <circle cx="24" cy="24" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    <path d="M24 8V14M24 34V40M8 24H14M34 24H40" stroke="var(--accent-gold)" strokeWidth="1.2" strokeLinecap="round" />
    <polygon points="24,18 29,24 24,30 19,24" fill="var(--accent-gold)" fillOpacity="0.2" stroke="var(--accent-gold)" strokeWidth="1" />
  </svg>
);

const SvgShieldedVault: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 3L6 8V17C6 24.5 11.2 31.4 18 33C24.8 31.4 30 24.5 30 17V8L18 3Z" stroke="var(--accent-gold)" strokeWidth="1.5" fill="rgba(212,175,55,0.06)" />
    <circle cx="18" cy="17" r="4.5" stroke="var(--accent-gold)" strokeWidth="1.2" />
    <path d="M18 21.5V25" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="18" cy="17" r="1.5" fill="var(--accent-gold)" />
  </svg>
);

const SvgCommitmentPrism: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="18,4 32,29 4,29" stroke="var(--accent-gold)" strokeWidth="1.2" fill="rgba(212,175,55,0.04)" />
    <line x1="4" y1="18" x2="18" y2="18" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="2 2" />
    <line x1="18" y1="18" x2="30" y2="13" stroke="var(--accent-gold)" strokeWidth="1.2" />
    <line x1="18" y1="18" x2="32" y2="21" stroke="#34d399" strokeWidth="1.2" />
    <circle cx="18" cy="18" r="2.5" fill="var(--accent-gold)" />
  </svg>
);

const SvgNettingMatrix: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="10" r="3.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="rgba(255,255,255,0.05)" />
    <circle cx="27" cy="10" r="3.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="rgba(255,255,255,0.05)" />
    <circle cx="18" cy="27" r="4" stroke="var(--accent-gold)" strokeWidth="1.5" fill="rgba(212,175,55,0.15)" />
    <path d="M11 12L16 24M25 12L20 24" stroke="var(--accent-gold)" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M12.5 10H23.5" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="2 2" />
  </svg>
);

const SvgSettlementSeal: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="5" width="26" height="26" rx="6" stroke="var(--accent-gold)" strokeWidth="1.2" fill="rgba(212,175,55,0.05)" />
    <path d="M11 18L16 23L25 13" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="26" cy="10" r="2" fill="#34d399" />
  </svg>
);

const SvgSurveillanceNode: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="11" stroke="#f87171" strokeWidth="1" opacity="0.4" strokeDasharray="2 2" />
    <circle cx="14" cy="14" r="6" stroke="#f87171" strokeWidth="1.2" opacity="0.8" />
    <circle cx="14" cy="14" r="2" fill="#f87171" />
    <line x1="14" y1="2" x2="14" y2="7" stroke="#f87171" strokeWidth="1" />
    <line x1="14" y1="21" x2="14" y2="26" stroke="#f87171" strokeWidth="1" />
    <line x1="2" y1="14" x2="7" y2="14" stroke="#f87171" strokeWidth="1" />
    <line x1="21" y1="14" x2="26" y2="14" stroke="#f87171" strokeWidth="1" />
  </svg>
);

const SvgGraphOptimization: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="3" stroke="var(--accent-gold)" strokeWidth="1" />
    <circle cx="28" cy="8" r="3" stroke="var(--accent-gold)" strokeWidth="1" />
    <circle cx="8" cy="28" r="3" stroke="var(--accent-gold)" strokeWidth="1" />
    <circle cx="28" cy="28" r="3" stroke="var(--accent-gold)" strokeWidth="1" />
    <path d="M11 8H25M8 11V25M28 11V25" stroke="var(--accent-gold)" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M10.5 10.5L25.5 25.5" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="2 2" />
    <circle cx="18" cy="18" r="2" fill="var(--accent-gold)" />
  </svg>
);

const SvgAnalyticsCurve: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 28H32" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    <path d="M6 26C12 26 14 10 18 10C22 10 24 26 30 26" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round" fill="rgba(212,175,55,0.08)" />
    <circle cx="18" cy="10" r="2" fill="var(--accent-gold)" />
    <line x1="18" y1="12" x2="18" y2="28" stroke="var(--accent-gold)" strokeWidth="1" strokeDasharray="1 2" />
  </svg>
);

const SvgRecurringCycle: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="18" r="13" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 3" />
    <path d="M18 5C25.1797 5 31 10.8203 31 18C31 21.6 29.5 24.8 27.1 27.1" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round" />
    <polygon points="27,22 27,28 21,28" fill="var(--accent-gold)" />
    <circle cx="18" cy="18" r="4" stroke="var(--accent-gold)" strokeWidth="1" />
  </svg>
);

const SvgBadgeStar: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="18,3 22.5,13.5 34,14 25,21.5 28,33 18,26.5 8,33 11,21.5 2,14 13.5,13.5" stroke="var(--accent-gold)" strokeWidth="1.2" fill="rgba(212,175,55,0.1)" />
    <circle cx="18" cy="18" r="3" fill="var(--accent-gold)" />
  </svg>
);

const SvgCrossCircleVenn: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="13" cy="18" r="9" stroke="var(--accent-gold)" strokeWidth="1.2" fill="rgba(212,175,55,0.05)" />
    <circle cx="23" cy="18" r="9" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" fill="rgba(255,255,255,0.03)" />
    <path d="M18 11.5C19.8 13.2 20.8 15.5 20.8 18C20.8 20.5 19.8 22.8 18 24.5C16.2 22.8 15.2 20.5 15.2 18C15.2 15.5 16.2 13.2 18 11.5Z" fill="var(--accent-gold)" fillOpacity="0.25" stroke="var(--accent-gold)" strokeWidth="1" />
  </svg>
);

const SvgSelectiveIris: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 18C3 18 8 7 18 7C28 7 33 18 33 18C33 18 28 29 18 29C8 29 3 18 3 18Z" stroke="var(--accent-gold)" strokeWidth="1.2" fill="rgba(212,175,55,0.03)" />
    <circle cx="18" cy="18" r="6" stroke="var(--accent-gold)" strokeWidth="1.2" />
    <circle cx="18" cy="18" r="2.5" fill="#34d399" />
    <line x1="18" y1="12" x2="18" y2="7" stroke="var(--accent-gold)" strokeWidth="1" strokeDasharray="1 1" />
  </svg>
);

const SvgCompactCircuit: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="20" height="20" rx="4" stroke="var(--accent-gold)" strokeWidth="1.2" fill="rgba(212,175,55,0.06)" />
    <line x1="3" y1="14" x2="8" y2="14" stroke="var(--accent-gold)" strokeWidth="1.2" />
    <line x1="3" y1="22" x2="8" y2="22" stroke="var(--accent-gold)" strokeWidth="1.2" />
    <line x1="28" y1="18" x2="33" y2="18" stroke="#34d399" strokeWidth="1.2" />
    <path d="M13 14H18V18H23" stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeLinecap="round" />
    <circle cx="18" cy="18" r="1.5" fill="var(--accent-gold)" />
  </svg>
);

const SvgArrowRight: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface AboutUsProps {
  onLaunch: () => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({ onLaunch }) => {
  const [activeTab, setActiveTab] = useState<'contract' | 'circuits' | 'netting' | 'analytics' | 'badges'>('contract');

  return (
    <div className="about-page-wrapper" style={{ width: '100%', maxWidth: '1140px', margin: '0 auto', padding: '0 1.5rem 6rem 1.5rem' }}>
      
      {/* ========================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================= */}
      <section style={{ textAlign: 'center', padding: '3.5rem 0 5rem 0', position: 'relative' }}>
        {/* Subtle Ambient Radial Shimmer */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '300px',
          background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.12), transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: -1,
        }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.35rem 0.9rem', borderRadius: '999px', background: 'rgba(212, 175, 55, 0.08)', border: '1px solid rgba(212, 175, 55, 0.25)', marginBottom: '1.5rem' }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-gold)', letterSpacing: '0.15em', fontWeight: 600 }}>
            MIDNIGHT PREPROD • ZERO-KNOWLEDGE LEDGER
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(3.2rem, 7vw, 5.5rem)',
            fontStyle: 'italic',
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: '#fff',
            margin: '0 auto 1rem auto',
            background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.7) 60%, rgba(212,175,55,0.9) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Meridian.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.4rem, 3vw, 2.1rem)',
            color: 'var(--accent-gold)',
            fontStyle: 'italic',
            letterSpacing: '-0.01em',
            margin: '0 auto 1.5rem auto',
          }}
        >
          Private circles. Real money. Zero exposure.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '15px',
            color: 'rgba(240, 240, 240, 0.7)',
            maxWidth: '680px',
            margin: '0 auto 2.5rem auto',
            lineHeight: 1.7,
            letterSpacing: '0.01em',
          }}
        >
          The first dApp on Midnight Network that lets groups share expenses, split bills, and settle debts — with every amount, balance, and identity hidden from the public ledger. Built for people who want the simplicity of Venmo with the privacy of cash.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <button
            onClick={onLaunch}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.9rem 2rem',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, var(--accent-gold) 0%, #a38240 100%)',
              color: '#000',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(212,175,55,0.3)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(212,175,55,0.45)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(212,175,55,0.3)';
            }}
          >
            LAUNCH MERIDIAN
            <SvgArrowRight size={14} />
          </button>
        </motion.div>
      </section>

      {/* ========================================================= */}
      {/* 2. THE PROBLEM SECTION */}
      {/* ========================================================= */}
      <section style={{ margin: '4rem 0 6rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#f87171', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            THE STATUS QUO
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', fontStyle: 'italic', margin: 0 }}>
            The Problem With Splitting Money Today
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem', marginBottom: '2.5rem' }}>
          {/* Public Surveillance Card */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            style={{
              padding: '2.25rem',
              borderRadius: '20px',
              background: 'linear-gradient(180deg, rgba(239, 68, 68, 0.04) 0%, rgba(15, 15, 20, 0.8) 100%)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <SvgSurveillanceNode size={26} />
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#f87171', margin: 0, letterSpacing: '0.08em' }}>
                SURVEILLANCE APPS
              </h3>
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'rgba(240, 240, 240, 0.75)', lineHeight: 1.65, margin: '0 0 1rem 0' }}>
              Every expense-splitting app — Venmo, Splitwise, SplitIt — has the same fundamental flaw: <strong style={{ color: '#fff' }}>everything is public</strong>.
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13.5px', color: 'rgba(240, 240, 240, 0.6)', lineHeight: 1.65, margin: 0 }}>
              When you pay for dinner, everyone in the group sees who paid, how much, and for what. Your spending habits are an open book. Your financial relationships are exposed. Your social graph is monetized.
            </p>
          </motion.div>

          {/* Permanent Public Ledger Card */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            style={{
              padding: '2.25rem',
              borderRadius: '20px',
              background: 'linear-gradient(180deg, rgba(212, 175, 55, 0.04) 0%, rgba(15, 15, 20, 0.8) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <SvgZkSeal size={26} />
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--accent-gold)', margin: 0, letterSpacing: '0.08em' }}>
                PUBLIC BLOCKCHAINS
              </h3>
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'rgba(240, 240, 240, 0.75)', lineHeight: 1.65, margin: '0 0 1rem 0' }}>
              On transparent blockchains, it's worse. Every transaction is permanently recorded, visible to anyone, forever.
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13.5px', color: 'rgba(240, 240, 240, 0.6)', lineHeight: 1.65, margin: 0 }}>
              Your financial history becomes an indelible dossier that can never be erased, leaking your liquidity, income bracket, and peer interactions to the entire world.
            </p>
          </motion.div>
        </div>

        {/* Research Exposure Points */}
        <div style={{
          padding: '2rem 2.25rem',
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '2.5rem',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-gold)', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>
            EMPIRICAL RESEARCH DEMONSTRATES SPENDING PATTERNS REVEAL:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {[
              { label: 'Geolocation & Travel', desc: 'Where you eat, shop, and travel' },
              { label: 'Social Affiliations', desc: 'Who you share bills with (roommates, partners, colleagues)' },
              { label: 'Economic Profile', desc: 'Your income bracket and lifestyle tier' },
              { label: 'Behavioral Schedule', desc: "When you're home and when you're not" },
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f87171', marginTop: '6px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: '#fff', fontWeight: 600 }}>{item.label}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Question Monolith */}
        <div style={{
          textAlign: 'center',
          padding: '2.5rem 2rem',
          borderRadius: '20px',
          background: 'linear-gradient(180deg, rgba(212,175,55,0.08) 0%, rgba(10,10,14,0.9) 100%)',
          border: '1px solid rgba(212,175,55,0.3)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent-gold)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            THE FUNDAMENTAL QUESTION
          </span>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.4rem, 2.8vw, 2.2rem)',
            fontStyle: 'italic',
            color: '#fff',
            maxWidth: '780px',
            margin: '0.75rem auto 0 auto',
            lineHeight: 1.4,
          }}>
            "What if you could split expenses with friends, prove you paid your share, and settle debts — without anyone seeing the amounts?"
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. THE SOLUTION SECTION */}
      {/* ========================================================= */}
      <section style={{ margin: '6rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#34d399', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            ZERO-KNOWLEDGE ARCHITECTURE
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', fontStyle: 'italic', margin: '0 0 1rem 0' }}>
            How Meridian Works
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14.5px', color: 'rgba(240, 240, 240, 0.65)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Meridian is built on Midnight Network, a blockchain designed for <strong style={{ color: 'var(--accent-gold)' }}>selective disclosure</strong> — the ability to prove facts about your data without revealing the data itself.
          </p>
        </div>

        {/* 4-Step Pipeline Flow */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', position: 'relative' }}>
          {[
            {
              step: '01',
              title: 'Create a Circle',
              icon: <SvgShieldedVault size={28} />,
              desc: 'Deploy a privacy vault on Midnight. Each circle gets a unique smart contract address and an invite secret. The creator sets the rules; members join by proving knowledge of the secret.',
            },
            {
              step: '02',
              title: 'Log Expenses',
              icon: <SvgCommitmentPrism size={28} />,
              desc: 'When someone pays, they log the expense by generating a commitment hash — a cryptographic proof that the expense exists, without revealing the amount, label, or who paid. The commitment is stored on-chain; the details stay private.',
            },
            {
              step: '03',
              title: 'Compute Balances Off-Chain',
              icon: <SvgNettingMatrix size={28} />,
              desc: 'The netting engine computes who owes whom using only local data. No balances are ever published to the blockchain. The math happens on your device.',
            },
            {
              step: '04',
              title: 'Settle with Minimum Transfers',
              icon: <SvgSettlementSeal size={28} />,
              desc: 'When it’s time to settle, the on-chain settlement circuit proves that: balances are correct from committed expenses, the plan is optimal (minimum transfers), and every member nets to zero. The settlement hash is recorded on-chain; individual amounts are not.',
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6, borderColor: 'rgba(212, 175, 55, 0.4)' }}
              transition={{ duration: 0.3 }}
              style={{
                padding: '2rem 1.75rem',
                borderRadius: '20px',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(12, 12, 16, 0.95) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.icon}
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', color: 'rgba(212,175,55,0.4)', fontWeight: 700 }}>
                  {item.step}
                </span>
              </div>

              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: '#fff', fontStyle: 'italic', margin: '0 0 0.75rem 0' }}>
                {item.title}
              </h3>

              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'rgba(240, 240, 240, 0.65)', lineHeight: 1.65, margin: 0, flex: 1 }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Result Callout */}
        <div style={{
          marginTop: '2.5rem',
          padding: '1.5rem 2rem',
          borderRadius: '16px',
          background: 'rgba(52, 211, 153, 0.04)',
          border: '1px solid rgba(52, 211, 153, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          justifyContent: 'center',
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 10px #34d399', flexShrink: 0 }} />
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13.5px', color: '#fff', margin: 0, lineHeight: 1.5 }}>
            <strong style={{ color: '#34d399' }}>The Result:</strong> Every member can independently verify that the group's finances are mathematically correct, without learning anyone else's private balances.
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. KEY FEATURES SECTION */}
      {/* ========================================================= */}
      <section style={{ margin: '6rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            PRODUCT CAPABILITIES
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', fontStyle: 'italic', margin: 0 }}>
            What You Get
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
          {[
            {
              title: 'Confidential Expense Tracking',
              icon: <SvgShieldedVault size={26} />,
              desc: 'Every expense is stored as a cryptographic commitment. The blockchain sees a hash; you see the full details. No one else learns the amounts unless you choose to tell them.',
            },
            {
              title: 'Optimal Settlement Graph',
              icon: <SvgGraphOptimization size={26} />,
              desc: 'The netting engine computes the minimum number of transfers needed to settle all debts. For a group of N people with outstanding balances, the optimal plan uses exactly N-1 transfers — the mathematical minimum. This isn’t an approximation; it’s proven.',
            },
            {
              title: 'Privacy-Preserving Analytics',
              icon: <SvgAnalyticsCurve size={26} />,
              desc: 'See your circle’s spending patterns — total volume, per-member contributions, category breakdowns — all computed locally. The analytics engine produces aggregate statistics without exposing any individual member’s spending.',
            },
            {
              title: 'Recurring Pacts',
              icon: <SvgRecurringCycle size={26} />,
              desc: 'Automate shared subscriptions. Create recurring pacts for Netflix, Spotify, rent, or any regular expense. Each pact is a commitment to a fixed amount on a fixed schedule, enforced by the circle’s smart contract.',
            },
            {
              title: 'Badge System',
              icon: <SvgBadgeStar size={26} />,
              desc: 'Earn privacy-preserving badges based on your spending behavior: Fair Splitter (within 1 std dev), Top Contributor (paid above share), Settlement Champion (prompt settlement), and Circle Founder. Badges are computed locally and never published on-chain.',
            },
            {
              title: 'Cross-Circle Portability',
              icon: <SvgCrossCircleVenn size={26} />,
              desc: 'Your membership proof works across circles. Join multiple groups with the same wallet, and your identity is consistent — but each circle’s finances remain completely isolated and private.',
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5, borderColor: 'rgba(212, 175, 55, 0.35)' }}
              transition={{ duration: 0.25 }}
              style={{
                padding: '2.25rem',
                borderRadius: '20px',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(10, 10, 14, 0.9) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                {item.icon}
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#fff', fontStyle: 'italic', margin: '0 0 0.75rem 0' }}>
                {item.title}
              </h3>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13.5px', color: 'rgba(240, 240, 240, 0.65)', lineHeight: 1.65, margin: 0 }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. WHY MIDNIGHT SECTION */}
      {/* ========================================================= */}
      <section style={{ margin: '6rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            FOUNDATIONAL INFRASTRUCTURE
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', fontStyle: 'italic', margin: '0 0 1rem 0' }}>
            Why Midnight Network
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14.5px', color: 'rgba(240, 240, 240, 0.65)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            Meridian isn't just "a blockchain app with privacy features." It's built on Midnight specifically because Midnight's architecture makes private dApps possible in ways other chains don't.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {[
            {
              title: 'Selective Disclosure',
              icon: <SvgSelectiveIris size={26} />,
              desc: 'Midnight lets you prove facts about your data (e.g., "I have a positive balance in this circle") without revealing the data itself (the actual balance). This is the foundation of Meridian’s privacy model.',
            },
            {
              title: 'Compact Circuits',
              icon: <SvgCompactCircuit size={26} />,
              desc: 'Meridian’s ZK circuits are compiled from Compact, Midnight’s native circuit language. Each circuit — join, logExpense, settle — is a small, auditable program that proves a specific statement about private data.',
            },
            {
              title: 'Wallet Integration',
              icon: <SvgShieldedVault size={26} />,
              desc: 'Midnight wallets (1 AM, Lace) handle proving, balancing, and submission. The dApp never touches private keys. The wallet proves statements on your behalf; the blockchain verifies them.',
            },
            {
              title: 'Preprod Network',
              icon: <SvgZkSeal size={26} />,
              desc: 'Meridian runs on Midnight’s Preprod testnet. All contracts, transactions, and settlements are real on-chain operations — not simulations.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                padding: '2rem 1.75rem',
                borderRadius: '18px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ marginBottom: '1.25rem' }}>{item.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#fff', fontStyle: 'italic', margin: '0 0 0.75rem 0' }}>
                {item.title}
              </h3>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'rgba(240, 240, 240, 0.6)', lineHeight: 1.6, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. TEAM / MISSION SECTION */}
      {/* ========================================================= */}
      <section style={{
        margin: '6rem 0',
        padding: '4rem 2.5rem',
        borderRadius: '24px',
        background: 'linear-gradient(180deg, rgba(22, 22, 28, 0.95) 0%, rgba(10, 10, 14, 0.98) 100%)',
        border: '1px solid rgba(212, 175, 55, 0.25)',
        boxShadow: '0 30px 70px -10px rgba(0,0,0,0.8), 0 0 40px -5px rgba(212,175,55,0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            OUR ETHOS & PURPOSE
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', color: '#fff', fontStyle: 'italic', margin: '0 0 1.75rem 0' }}>
            Why We Built This
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15.5px', color: 'rgba(240, 240, 240, 0.8)', lineHeight: 1.8, margin: '0 0 1.25rem 0' }}>
            We believe financial privacy is a human right, not a luxury. Today's financial tools force a binary choice: use convenient apps that harvest your data, or use private tools that are unusable for groups.
          </p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'rgba(240, 240, 240, 0.7)', lineHeight: 1.8, margin: '0 0 1.25rem 0' }}>
            Meridian eliminates that tradeoff. You get the convenience of expense-splitting with the privacy of cash. No one — not the platform, not the blockchain, not other members — learns your financial details unless you choose to share them.
          </p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14.5px', color: 'rgba(240, 240, 240, 0.65)', lineHeight: 1.75, margin: '0 0 2rem 0' }}>
            This is the beginning of private group finance. The smart contract layer is open. The circuits are auditable. The privacy guarantees are mathematical, not policy-based.
          </p>
          <div style={{ display: 'inline-block', padding: '0.75rem 1.5rem', borderRadius: '12px', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--accent-gold)', fontStyle: 'italic' }}>
              We're building the financial infrastructure that should have existed from the start.
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. TECHNICAL DEEP DIVE SECTION */}
      {/* ========================================================= */}
      <section style={{ margin: '6rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            SYSTEM SPECIFICATION
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', fontStyle: 'italic', margin: 0 }}>
            Under the Hood
          </h2>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {[
            { id: 'contract', label: 'Smart Contract' },
            { id: 'circuits', label: 'ZK Circuits' },
            { id: 'netting', label: 'Netting Engine' },
            { id: 'analytics', label: 'Analytics Engine' },
            { id: 'badges', label: 'Badge System' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                padding: '0.6rem 1.25rem',
                borderRadius: '999px',
                border: activeTab === tab.id ? '1px solid var(--accent-gold)' : '1px solid rgba(255, 255, 255, 0.08)',
                background: activeTab === tab.id ? 'rgba(212, 175, 55, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                color: activeTab === tab.id ? 'var(--accent-gold)' : 'var(--text-muted)',
                cursor: 'pointer',
                letterSpacing: '0.05em',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Panes */}
        <div style={{
          padding: '2.5rem',
          borderRadius: '20px',
          background: 'rgba(13, 13, 17, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        }}>
          <AnimatePresence mode="wait">
            {activeTab === 'contract' && (
              <motion.div
                key="tab-contract"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <SvgCompactCircuit size={24} />
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#fff', fontStyle: 'italic', margin: 0 }}>
                    Compact Smart Contract: splitpool
                  </h3>
                </div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'rgba(240, 240, 240, 0.7)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Meridian uses the <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)' }}>splitpool</code> contract, compiled from Compact into ZK intermediate representations (zkir). It maintains five verified on-chain state fields:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  {[
                    { field: 'inviteRoot', desc: 'Commitment to the circle membership tree' },
                    { field: 'memberCount', desc: 'Verified counter of joined circle members' },
                    { field: 'expenseCount', desc: 'Cumulative total of logged confidential expenses' },
                    { field: 'settlementCount', desc: 'Number of successfully finalized debt settlements' },
                    { field: 'lastSettlementHash', desc: 'Cryptographic hash of the most recent settlement plan' },
                  ].map((item, idx) => (
                    <div key={idx} style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-gold)', fontWeight: 600 }}>{item.field}</div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', marginTop: '0.35rem' }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'circuits' && (
              <motion.div
                key="tab-circuits"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <SvgZkSeal size={24} />
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#fff', fontStyle: 'italic', margin: 0 }}>
                    Auditable ZK Circuits
                  </h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                  {[
                    { name: 'join', desc: 'Proves knowledge of the invite secret and increments memberCount without revealing the secret itself.' },
                    { name: 'logExpense', desc: 'Proves valid circle membership and increments expenseCount; the commitment hash is derived from the member’s private secret and salt.' },
                    { name: 'settle', desc: 'Proves membership, stores the verified settlement plan hash, and increments settlementCount to transition debt state.' },
                  ].map((c, idx) => (
                    <div key={idx} style={{ padding: '1.25rem', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#34d399', fontWeight: 600, marginBottom: '0.5rem' }}>
                        circuit {c.name}()
                      </div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12.5px', color: 'rgba(240, 240, 240, 0.65)', lineHeight: 1.5 }}>
                        {c.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'netting' && (
              <motion.div
                key="tab-netting"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <SvgNettingMatrix size={24} />
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#fff', fontStyle: 'italic', margin: 0 }}>
                    Minimum-Transfer Netting Engine
                  </h3>
                </div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'rgba(240, 240, 240, 0.7)', lineHeight: 1.65 }}>
                  Computes minimum-transaction settlement plans using a greedy algorithm that matches creditors and debtors by amount. For circles with ≤20 members, exhaustive search finds the true mathematical minimum. For larger circles, the greedy approximation achieves the same optimal reduction in $O(N \log N)$ complexity.
                </p>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                key="tab-analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <SvgAnalyticsCurve size={24} />
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#fff', fontStyle: 'italic', margin: 0 }}>
                    Client-Side Analytics Engine
                  </h3>
                </div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'rgba(240, 240, 240, 0.7)', lineHeight: 1.65 }}>
                  Computes aggregate statistics (total volume, averages, medians, standard deviations, distribution fairness) entirely from raw local expense data. All computation is performed client-side; only aggregated results are displayed in the dashboard.
                </p>
              </motion.div>
            )}

            {activeTab === 'badges' && (
              <motion.div
                key="tab-badges"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <SvgBadgeStar size={24} />
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#fff', fontStyle: 'italic', margin: 0 }}>
                    Statistical Badge System
                  </h3>
                </div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'rgba(240, 240, 240, 0.7)', lineHeight: 1.65 }}>
                  Evaluates spending behavior against statistical thresholds and assigns local badges (Fair Splitter, Top Contributor, Settlement Champion, Circle Founder). No on-chain transaction is needed — badges are computed in your browser and stored in local state.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. CALL TO ACTION SECTION */}
      {/* ========================================================= */}
      <section style={{
        textAlign: 'center',
        padding: '5rem 2rem',
        borderRadius: '28px',
        background: 'linear-gradient(180deg, rgba(212,175,55,0.12) 0%, rgba(12,12,16,0.95) 100%)',
        border: '1px solid rgba(212,175,55,0.3)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 50px rgba(212,175,55,0.15)',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '30%',
          right: '30%',
          height: '150px',
          background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.2), transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
            <SvgShieldedVault size={30} />
          </div>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#fff', fontStyle: 'italic', margin: '0 0 1rem 0' }}>
            Start Your First Circle
          </h2>

          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'rgba(240, 240, 240, 0.7)', maxWidth: '520px', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
            Connect your Midnight wallet. Deploy a privacy vault. Split your first expense — confidentially.
          </p>

          <button
            onClick={onLaunch}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1.1rem 2.75rem',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, var(--accent-gold) 0%, #a38240 100%)',
              color: '#000',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 10px 40px rgba(212,175,55,0.35)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
              e.currentTarget.style.boxShadow = '0 15px 50px rgba(212,175,55,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(212,175,55,0.35)';
            }}
          >
            LAUNCH MERIDIAN
            <SvgArrowRight size={16} />
          </button>
        </div>
      </section>

    </div>
  );
};
