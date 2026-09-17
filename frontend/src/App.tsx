import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import { Lock } from 'lucide-react';

import { Preloader } from './components/Preloader';
import { AboutUs } from './components/AboutUs';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LiquidAura } from './components/LiquidAura';
import { MidnightWalletProvider, useMidnightWallet } from './context/MidnightWalletContext';
import { ToastProvider } from './components/TransactionToast';

import { LandingPage } from './components/LandingPage';
import { CircleList } from './components/CircleList';
import { CircleDetail } from './components/CircleDetail';
import { CreateCircleForm } from './components/CreateCircleForm';

function AppContent() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [view, setView] = useState<'landing' | 'circles' | 'about'>('landing');
  const [activeCircle, setActiveCircle] = useState<string | null>(null);

  const { isConnected, openWalletModal } = useMidnightWallet();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {!isLoaded && <Preloader key="preloader" onComplete={() => setIsLoaded(true)} />}
      </AnimatePresence>

      <CustomCursor />
      <LiquidAura />
      <div className="noise-overlay" />

      {isLoaded && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <Navbar view={view} setView={(v) => { setView(v); setActiveCircle(null); }} />

          <div className="omen-layout">
            <main className="omen-content" style={{ marginTop: '120px' }}>
              <AnimatePresence mode="wait">
                {view === 'landing' ? (
                  <motion.div 
                    key="landing-view" 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    style={{ width: '100%' }}
                  >
                    <LandingPage onLaunch={() => { setView('circles'); setActiveCircle(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
                  </motion.div>
                ) : view === 'circles' ? (
                  <motion.div 
                    key="circles-view" 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    style={{ width: '100%' }}
                  >
                    {!isConnected ? (
                      <div className="landing-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                        <div className="cta-card glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '500px', width: '100%' }}>
                          <div className="cta-background-glow"></div>
                          <div className="feature-icon-wrapper" style={{ margin: '0 auto 1.5rem auto' }}>
                            <Lock size={28} style={{ color: 'var(--accent-gold)' }} />
                            <div className="icon-glow"></div>
                          </div>
                          <h2 className="cta-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Wallet Required</h2>
                          <p className="hero-subtitle" style={{ fontSize: '1rem', marginBottom: '2rem' }}>
                            Please connect your Midnight wallet to view your circles, log expenses, and settle debts privately.
                          </p>
                          <button onClick={openWalletModal} className="launch-btn-primary">
                            <span className="btn-text">CONNECT WALLET</span>
                            <div className="btn-glow-effect"></div>
                          </button>
                        </div>
                      </div>
                    ) : activeCircle === 'new' ? (
                      <CreateCircleForm 
                        onBack={() => setActiveCircle(null)} 
                        onCreated={(addr) => setActiveCircle(addr)}
                      />
                    ) : activeCircle ? (
                      <CircleDetail 
                        contractAddress={activeCircle} 
                        onBack={() => setActiveCircle(null)} 
                      />
                    ) : (
                      <CircleList 
                        onSelectCircle={setActiveCircle} 
                        onCreateNew={() => setActiveCircle('new')} 
                      />
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="about-view"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    style={{ width: '100%' }}
                  >
                    <AboutUs onLaunch={() => { setView('circles'); setActiveCircle(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
            
            <Footer onNavigateAbout={() => { setView('about'); setActiveCircle(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
          </div>
        </motion.div>
      )}
    </>
  );
}

function App() {
  return (
    <ToastProvider>
      <MidnightWalletProvider>
        <AppContent />
      </MidnightWalletProvider>
    </ToastProvider>
  );
}

export default App;

