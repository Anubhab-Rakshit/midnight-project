import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

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

interface AboutUsProps {
  onLaunch: () => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({ onLaunch }) => {
  const [activeTab, setActiveTab] = useState<'contract' | 'circuits' | 'netting' | 'analytics' | 'badges'>('contract');

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="landing-container">
      
      {/* ========================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================= */}
      <motion.section 
        className="hero-section"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="hero-content">
          <motion.div variants={itemVariants} className="trust-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
            MIDNIGHT PREPROD • ZERO-KNOWLEDGE LEDGER
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="hero-title">
            Meridian.
          </motion.h1>
          <motion.p variants={itemVariants} className="hero-subtitle" style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--accent-gold)' }}>
            Private circles. Real money. Zero exposure.
          </motion.p>
          <motion.p variants={itemVariants} className="hero-subtitle">
            The first dApp on Midnight Network that lets groups share expenses, split bills, and settle debts — with every amount, balance, and identity hidden from the public ledger. Built for people who want the simplicity of Venmo with the privacy of cash.
          </motion.p>
          <motion.div variants={itemVariants} className="hero-actions">
            <button onClick={onLaunch} className="launch-btn-primary">
              <span className="btn-text">LAUNCH MERIDIAN</span>
              <div className="btn-glow-effect"></div>
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* ========================================================= */}
      {/* 2. THE PROBLEM SECTION */}
      {/* ========================================================= */}
      <section className="features-section">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          style={{ marginBottom: '2rem', justifyContent: 'center' }}
        >
          <div className="section-title-line"></div>
          <h2 className="section-title">The Status Quo</h2>
          <div className="section-title-line"></div>
        </motion.div>

        <div className="features-grid">
          <motion.div 
            className="feature-card glass-panel"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="feature-icon-wrapper" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
              <SvgSurveillanceNode size={26} />
              <div className="icon-glow" style={{ boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)' }}></div>
            </div>
            <h3 className="feature-title">Surveillance Apps</h3>
            <p className="feature-desc">
              Every expense-splitting app — Venmo, Splitwise, SplitIt — has the same fundamental flaw: <strong style={{ color: '#fff' }}>everything is public</strong>.
              <br/><br/>
              When you pay for dinner, everyone in the group sees who paid, how much, and for what. Your spending habits are an open book. Your financial relationships are exposed. Your social graph is monetized.
            </p>
            <div className="feature-card-border"></div>
          </motion.div>

          <motion.div 
            className="feature-card glass-panel"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          >
            <div className="feature-icon-wrapper">
              <SvgZkSeal size={26} />
              <div className="icon-glow"></div>
            </div>
            <h3 className="feature-title">Public Blockchains</h3>
            <p className="feature-desc">
              On transparent blockchains, it's worse. Every transaction is permanently recorded, visible to anyone, forever.
              <br/><br/>
              Your financial history becomes an indelible dossier that can never be erased, leaking your liquidity, income bracket, and peer interactions to the entire world.
            </p>
            <div className="feature-card-border"></div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. THE SOLUTION SECTION (How Meridian Works) */}
      {/* ========================================================= */}
      <section className="features-section" style={{ marginTop: '4rem' }}>
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          style={{ marginBottom: '2rem', justifyContent: 'center', flexDirection: 'column' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '2rem' }}>
            <div className="section-title-line"></div>
            <h2 className="section-title">Zero-Knowledge Architecture</h2>
            <div className="section-title-line"></div>
          </div>
          <p className="hero-subtitle" style={{ marginTop: '1rem', fontSize: '1rem' }}>
            Meridian is built on Midnight Network, a blockchain designed for selective disclosure — the ability to prove facts about your data without revealing the data itself.
          </p>
        </motion.div>

        <div className="features-grid">
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
              title: 'Compute Balances',
              icon: <SvgNettingMatrix size={28} />,
              desc: 'The netting engine computes who owes whom using only local data. No balances are ever published to the blockchain. The math happens on your device.',
            },
            {
              step: '04',
              title: 'Settle on-chain',
              icon: <SvgSettlementSeal size={28} />,
              desc: 'When it’s time to settle, the on-chain settlement circuit proves that balances are correct from committed expenses, the plan is optimal, and every member nets to zero. The settlement hash is recorded on-chain.',
            },
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              className="feature-card glass-panel"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '1rem' }}>
                <div className="feature-icon-wrapper">
                  {item.icon}
                  <div className="icon-glow"></div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', color: 'var(--accent-gold)', opacity: 0.5 }}>{item.step}</div>
              </div>
              <h3 className="feature-title" style={{ fontSize: '1.5rem' }}>{item.title}</h3>
              <p className="feature-desc">{item.desc}</p>
              <div className="feature-card-border"></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. KEY FEATURES SECTION */}
      {/* ========================================================= */}
      <section className="features-section" style={{ marginTop: '4rem' }}>
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          style={{ marginBottom: '2rem', justifyContent: 'center' }}
        >
          <div className="section-title-line"></div>
          <h2 className="section-title">Product Capabilities</h2>
          <div className="section-title-line"></div>
        </motion.div>

        <div className="features-grid">
          {[
            {
              title: 'Confidential Expense Tracking',
              icon: <SvgShieldedVault size={26} />,
              desc: 'Every expense is stored as a cryptographic commitment. The blockchain sees a hash; you see the full details. No one else learns the amounts.',
            },
            {
              title: 'Optimal Settlement Graph',
              icon: <SvgGraphOptimization size={26} />,
              desc: 'The netting engine computes the minimum number of transfers needed to settle all debts. This isn’t an approximation; it’s proven.',
            },
            {
              title: 'Privacy-Preserving Analytics',
              icon: <SvgAnalyticsCurve size={26} />,
              desc: 'See your circle’s spending patterns — total volume, per-member contributions — all computed locally. The analytics engine produces aggregate statistics safely.',
            },
            {
              title: 'Recurring Pacts',
              icon: <SvgRecurringCycle size={26} />,
              desc: 'Automate shared subscriptions. Create recurring pacts for Netflix or rent. Each pact is a commitment to a fixed amount on a fixed schedule.',
            },
            {
              title: 'Badge System',
              icon: <SvgBadgeStar size={26} />,
              desc: 'Earn privacy-preserving badges based on your spending behavior. Badges are computed locally and never published on-chain.',
            },
            {
              title: 'Cross-Circle Portability',
              icon: <SvgCrossCircleVenn size={26} />,
              desc: 'Your membership proof works across circles. Join multiple groups with the same wallet, and your identity is consistent but isolated.',
            },
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              className="feature-card glass-panel"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: (idx % 3) * 0.1, ease: "easeOut" }}
            >
              <div className="feature-icon-wrapper">
                {item.icon}
                <div className="icon-glow"></div>
              </div>
              <h3 className="feature-title" style={{ fontSize: '1.5rem' }}>{item.title}</h3>
              <p className="feature-desc">{item.desc}</p>
              <div className="feature-card-border"></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. WHY MIDNIGHT SECTION */}
      {/* ========================================================= */}
      <section className="features-section" style={{ marginTop: '4rem' }}>
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          style={{ marginBottom: '2rem', justifyContent: 'center' }}
        >
          <div className="section-title-line"></div>
          <h2 className="section-title">Foundational Infrastructure</h2>
          <div className="section-title-line"></div>
        </motion.div>

        <div className="features-grid">
          {[
            {
              title: 'Selective Disclosure',
              icon: <SvgSelectiveIris size={26} />,
              desc: 'Midnight lets you prove facts about your data (e.g., "I have a positive balance in this circle") without revealing the data itself (the actual balance).',
            },
            {
              title: 'Compact Circuits',
              icon: <SvgCompactCircuit size={26} />,
              desc: 'Meridian’s ZK circuits are compiled from Compact, Midnight’s native circuit language. Each circuit is a small, auditable program.',
            },
            {
              title: 'Wallet Integration',
              icon: <SvgShieldedVault size={26} />,
              desc: 'Midnight wallets (1 AM, Lace) handle proving, balancing, and submission. The dApp never touches private keys. The wallet proves statements on your behalf.',
            },
            {
              title: 'Preprod Network',
              icon: <SvgZkSeal size={26} />,
              desc: 'Meridian runs on Midnight’s Preprod testnet. All contracts, transactions, and settlements are real on-chain operations — not simulations.',
            },
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              className="feature-card glass-panel"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: (idx % 2) * 0.1, ease: "easeOut" }}
            >
              <div className="feature-icon-wrapper">
                {item.icon}
                <div className="icon-glow"></div>
              </div>
              <h3 className="feature-title" style={{ fontSize: '1.5rem' }}>{item.title}</h3>
              <p className="feature-desc">{item.desc}</p>
              <div className="feature-card-border"></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. TEAM / MISSION SECTION */}
      {/* ========================================================= */}
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        style={{ minHeight: 'auto', marginTop: '4rem', padding: '4rem 2rem' }}
      >
        <div className="hero-content" style={{ maxWidth: '800px' }}>
          <h2 className="hero-title" style={{ fontSize: '3rem' }}>
            Why We Built This
          </h2>
          <p className="hero-subtitle">
            We believe financial privacy is a human right, not a luxury. Today's financial tools force a binary choice: use convenient apps that harvest your data, or use private tools that are unusable for groups.
          </p>
          <p className="hero-subtitle">
            Meridian eliminates that tradeoff. You get the convenience of expense-splitting with the privacy of cash. No one — not the platform, not the blockchain, not other members — learns your financial details unless you choose to share them.
          </p>
        </div>
      </motion.section>

      {/* ========================================================= */}
      {/* 7. TECHNICAL DEEP DIVE SECTION */}
      {/* ========================================================= */}
      <section className="features-section" style={{ marginTop: '4rem' }}>
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          style={{ marginBottom: '2rem', justifyContent: 'center' }}
        >
          <div className="section-title-line"></div>
          <h2 className="section-title">System Specification</h2>
          <div className="section-title-line"></div>
        </motion.div>

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
                borderRadius: '100px',
                border: activeTab === tab.id ? '1px solid var(--accent-gold)' : '1px solid rgba(255, 255, 255, 0.1)',
                background: activeTab === tab.id ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                color: activeTab === tab.id ? 'var(--accent-gold)' : 'var(--text-primary)',
                cursor: 'pointer',
                letterSpacing: '0.05em',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(10px)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Panes */}
        <div className="glass-panel" style={{ padding: '3rem', minHeight: '300px' }}>
          <AnimatePresence mode="wait">
            {activeTab === 'contract' && (
              <motion.div
                key="tab-contract"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="feature-icon-wrapper" style={{ width: '40px', height: '40px' }}><SvgCompactCircuit size={20} /></div>
                  <h3 className="feature-title" style={{ fontSize: '2rem' }}>Compact Smart Contract: splitpool</h3>
                </div>
                <p className="feature-desc" style={{ marginBottom: '2rem' }}>
                  Meridian uses the <code style={{ color: 'var(--accent-gold)' }}>splitpool</code> contract, compiled from Compact into ZK intermediate representations (zkir). It maintains five verified on-chain state fields:
                </p>
                <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {[
                    { field: 'inviteRoot', desc: 'Commitment to the circle membership tree' },
                    { field: 'memberCount', desc: 'Verified counter of joined circle members' },
                    { field: 'expenseCount', desc: 'Cumulative total of logged confidential expenses' },
                    { field: 'settlementCount', desc: 'Number of successfully finalized debt settlements' },
                    { field: 'lastSettlementHash', desc: 'Cryptographic hash of the most recent settlement plan' },
                  ].map((item, idx) => (
                    <div key={idx} style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>{item.field}</div>
                      <div className="feature-desc" style={{ fontSize: '0.85rem' }}>{item.desc}</div>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="feature-icon-wrapper" style={{ width: '40px', height: '40px' }}><SvgZkSeal size={20} /></div>
                  <h3 className="feature-title" style={{ fontSize: '2rem' }}>Auditable ZK Circuits</h3>
                </div>
                <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                  {[
                    { name: 'join', desc: 'Proves knowledge of the invite secret and increments memberCount without revealing the secret itself.' },
                    { name: 'logExpense', desc: 'Proves valid circle membership and increments expenseCount; the commitment hash is derived from the member’s private secret and salt.' },
                    { name: 'settle', desc: 'Proves membership, stores the verified settlement plan hash, and increments settlementCount to transition debt state.' },
                  ].map((c, idx) => (
                    <div key={idx} style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--accent-gold)', marginBottom: '1rem' }}>
                        circuit {c.name}()
                      </div>
                      <div className="feature-desc" style={{ fontSize: '0.9rem' }}>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="feature-icon-wrapper" style={{ width: '40px', height: '40px' }}><SvgNettingMatrix size={20} /></div>
                  <h3 className="feature-title" style={{ fontSize: '2rem' }}>Minimum-Transfer Netting Engine</h3>
                </div>
                <p className="feature-desc" style={{ maxWidth: '800px' }}>
                  Computes minimum-transaction settlement plans using a greedy algorithm that matches creditors and debtors by amount. For circles with ≤20 members, exhaustive search finds the true mathematical minimum. For larger circles, the greedy approximation achieves the same optimal reduction in O(N log N) complexity.
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="feature-icon-wrapper" style={{ width: '40px', height: '40px' }}><SvgAnalyticsCurve size={20} /></div>
                  <h3 className="feature-title" style={{ fontSize: '2rem' }}>Client-Side Analytics Engine</h3>
                </div>
                <p className="feature-desc" style={{ maxWidth: '800px' }}>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="feature-icon-wrapper" style={{ width: '40px', height: '40px' }}><SvgBadgeStar size={20} /></div>
                  <h3 className="feature-title" style={{ fontSize: '2rem' }}>Statistical Badge System</h3>
                </div>
                <p className="feature-desc" style={{ maxWidth: '800px' }}>
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
      <section className="footer-cta-section" style={{ marginTop: '4rem' }}>
        <motion.div
          className="cta-card glass-panel"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="cta-background-glow"></div>
          <div className="feature-icon-wrapper" style={{ margin: '0 auto 1.5rem auto' }}>
            <SvgShieldedVault size={26} />
            <div className="icon-glow"></div>
          </div>
          <h2 className="cta-title">Start Your First Circle</h2>
          <p className="hero-subtitle" style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>
            Connect your Midnight wallet. Deploy a privacy vault. Split your first expense — confidentially.
          </p>
          <button onClick={onLaunch} className="launch-btn-secondary">
            LAUNCH MERIDIAN
          </button>
        </motion.div>
      </section>

    </div>
  );
};
