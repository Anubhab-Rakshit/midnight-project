import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';

import { Preloader } from './components/Preloader';
import { Monolith } from './components/Monolith';
import { Chronicles } from './components/Chronicles';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LiquidAura } from './components/LiquidAura';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [view, setView] = useState<'oracle' | 'chronicles'>('oracle');
  const [isProving, setIsProving] = useState(false);
  const [hasProven, setHasProven] = useState(false);

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

  const handleProve = async () => {
    setIsProving(true);
    setTimeout(() => {
      setIsProving(false);
      setHasProven(true);
    }, 4500);
  };

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
          <Navbar view={view} setView={setView} />

          <div className="omen-layout">
            <main className="omen-content" style={{ marginTop: '120px' }}>
              <AnimatePresence mode="wait">
                {view === 'oracle' ? (
                  <motion.div key="oracle-view" style={{ width: '100%' }}>
                    {!hasProven && (
                      <motion.div 
                        style={{ textAlign: 'center', marginBottom: '4rem' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 1 }}
                      >
                        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 300, fontStyle: 'italic', color: 'var(--text-muted)' }}>
                          A Cryptographic Premonition Registry
                        </h1>
                      </motion.div>
                    )}
                    <Monolith 
                      onProve={handleProve} 
                      isProving={isProving} 
                      hasProven={hasProven} 
                    />
                  </motion.div>
                ) : (
                  <Chronicles key="chronicles-view" />
                )}
              </AnimatePresence>
            </main>
            
            <Footer />
          </div>
        </motion.div>
      )}
    </>
  );
}

export default App;
