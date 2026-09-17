import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { Lock, Zap, RefreshCw, Code } from 'lucide-react';
import { useRef } from 'react';

interface LandingPageProps {
  onLaunch: () => void;
}

export function LandingPage({ onLaunch }: LandingPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  const features = [
    {
      icon: <Lock className="w-6 h-6 text-[#c2a878]" />,
      title: "Private by Default",
      desc: "Amounts and payers hidden on-chain. Only you and your circle see the details."
    },
    {
      icon: <Zap className="w-6 h-6 text-[#c2a878]" />,
      title: "Instant Settlements",
      desc: "ZK proofs settle debts in a single transaction. No IOUs, no delays."
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-[#c2a878]" />,
      title: "Recurring Pacts",
      desc: "Set it and forget it. Auto-split rent, subscriptions, and shared bills."
    }
  ];

  const steps = [
    {
      num: "01",
      title: "Create a Circle",
      desc: "Name it, invite friends. On-chain, encrypted, done."
    },
    {
      num: "02",
      title: "Log Expenses",
      desc: "Who paid, how much, for what. Stored privately."
    },
    {
      num: "03",
      title: "Settle",
      desc: "One click. ZK proofs compute minimal transfers and settle on-chain."
    }
  ];

  const trustItems = [
    "Midnight Network (Layer 2)",
    "Zero Knowledge Proofs",
    "1 AM Wallet",
    "Dust Protocol"
  ];

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
    <div className="landing-container" ref={containerRef}>
      
      {/* HERO SECTION */}
      <motion.section 
        className="hero-section"
        style={{ opacity: heroOpacity, y: heroY }}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="hero-content">
          <motion.h1 variants={itemVariants} className="hero-title">
            Split expenses.<br/>
            <span className="hero-title-italic">Stay private.</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="hero-subtitle">
            End-to-end encrypted group settlements on Midnight Network. <br />
            Zero knowledge proofs keep your finances yours.
          </motion.p>
          <motion.div variants={itemVariants} className="hero-actions">
            <button onClick={onLaunch} className="launch-btn-primary">
              <span className="btn-text">Launch App</span>
              <div className="btn-glow-effect"></div>
            </button>
            <a href="#" className="github-link">
              <Code className="w-4 h-4" />
              <span>View on GitHub</span>
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* TRUST BAR */}
      <motion.section 
        className="trust-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
      >
        <p className="trust-label">POWERED BY</p>
        <div className="trust-marquee">
          <div className="trust-marquee-content">
            {trustItems.map((item, i) => (
              <span key={`t1-${i}`} className="trust-item">{item}</span>
            ))}
            {/* Duplicate for infinite loop */}
            {trustItems.map((item, i) => (
              <span key={`t2-${i}`} className="trust-item">{item}</span>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FEATURE CARDS */}
      <section className="features-section">
        <div className="features-grid">
          {features.map((feat, idx) => (
            <motion.div 
              key={idx}
              className="feature-card glass-panel"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
            >
              <div className="feature-icon-wrapper">
                {feat.icon}
                <div className="icon-glow"></div>
              </div>
              <h3 className="feature-title">{feat.title}</h3>
              <p className="feature-desc">{feat.desc}</p>
              
              {/* Subtle hover border effect */}
              <div className="feature-card-border"></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works-section">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="section-title">How It Works</h2>
          <div className="section-title-line"></div>
        </motion.div>
        
        <div className="steps-container">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              className="step-item"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
            >
              <div className="step-num">{step.num}</div>
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            </motion.div>
          ))}
          <div className="steps-progress-line"></div>
        </div>
      </section>

      {/* FOOTER CTA SECTION */}
      <section className="footer-cta-section">
        <motion.div
          className="cta-card glass-panel"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="cta-background-glow"></div>
          <h2 className="cta-title">Ready to split privately?</h2>
          <button onClick={onLaunch} className="launch-btn-secondary">
            Launch App
          </button>
        </motion.div>
      </section>

    </div>
  );
}
