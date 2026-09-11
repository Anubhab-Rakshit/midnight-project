import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';

import { Preloader } from './components/Preloader';
import { Chronicles } from './components/Chronicles';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LiquidAura } from './components/LiquidAura';
import { MidnightWalletProvider, useMidnightWallet } from './context/MidnightWalletContext';
import { ToastProvider } from './components/TransactionToast';

import { CircleList } from './components/CircleList';
import { CircleDetail } from './components/CircleDetail';
import { CreateCircleForm } from './components/CreateCircleForm';

function AppContent() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [view, setView] = useState<'circles' | 'chronicles'>('circles');
  const [activeCircle, setActiveCircle] = useState<string | null>(null);

  useMidnightWallet();

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
                {view === 'circles' ? (
                  <motion.div key="circles-view" style={{ width: '100%' }}>
                    {activeCircle === 'new' ? (
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
