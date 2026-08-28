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
import { MidnightWalletProvider, useMidnightWallet } from './context/MidnightWalletContext';
import { useOmenContract } from './hooks/useOmenContract';
import { savePremonition } from './hooks/usePremonitionsStore';

function AppContent() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [view, setView] = useState<'oracle' | 'chronicles'>('oracle');
  const [isProving, setIsProving] = useState(false);
  const [hasProven, setHasProven] = useState(false);
  const [commitmentHash, setCommitmentHash] = useState<string | null>(null);
  const [sealError, setSealError] = useState<string | null>(null);

  const { isConnected, connect, disconnect, isConnecting, address } = useMidnightWallet();
  const { sealPremonition, isExecuting } = useOmenContract();

  const handleReset = () => {
    setHasProven(false);
    setCommitmentHash(null);
    setSealError(null);
  };

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

  const handleProve = async (premonition: string) => {
    if (!premonition.trim()) {
      return;
    }

    setIsProving(true);
    setSealError(null);

    try {
      // Generate random salt for this premonition
      const salt = Array.from({ length: 32 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('');

      // Execute the real ZK seal circuit
      const result = await sealPremonition(premonition, salt);

      // Store the commitment hash
      setCommitmentHash(result.commitmentHash);
      setHasProven(true);

      console.log('[App] Premonition sealed successfully');
      console.log('[App] Commitment hash:', result.commitmentHash);

      // Persist to Supabase (cross-device storage keyed by wallet)
      if (address) {
        try {
          await savePremonition({
            walletAddress: address,
            premonitionText: premonition,
            commitmentHash: result.commitmentHash,
          });
          console.log('[App] Premonition saved to Supabase');
        } catch (saveErr) {
          console.warn('[App] Failed to save to Supabase:', saveErr);
        }
      }
    } catch (err) {
      console.error('[App] Seal failed:', err);
      setSealError(err instanceof Error ? err.message : 'Failed to seal premonition');
    } finally {
      setIsProving(false);
    }
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
                    {/* Wallet Connection Status */}
                    {!isConnected && (
                      <motion.div
                        style={{ 
                          textAlign: 'center', 
                          marginBottom: '2rem',
                          padding: '1rem',
                          border: '1px solid rgba(212, 175, 55, 0.3)',
                          borderRadius: '8px',
                          background: 'rgba(212, 175, 55, 0.05)',
                        }}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                          Connect your Midnight wallet to inscribe premonitions
                        </p>
                        <button
                          onClick={connect}
                          disabled={isConnecting}
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            padding: '0.5rem 1.5rem',
                            background: 'transparent',
                            border: '1px solid var(--accent-gold)',
                            color: 'var(--accent-gold)',
                            cursor: 'pointer',
                            letterSpacing: '0.1em',
                          }}
                        >
                          {isConnecting ? 'CONNECTING...' : 'CONNECT WALLET'}
                        </button>
                      </motion.div>
                    )}

                    {isConnected && address && (
                      <motion.div
                        style={{
                          textAlign: 'center',
                          marginBottom: '2rem',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                          color: 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '1rem',
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <span>Connected: {address.slice(0, 12)}...{address.slice(-8)}</span>
                        <button
                          onClick={disconnect}
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '9px',
                            padding: '0.25rem 0.75rem',
                            background: 'transparent',
                            border: '1px solid rgba(255, 80, 80, 0.4)',
                            color: '#ff5050',
                            cursor: 'pointer',
                            letterSpacing: '0.1em',
                            borderRadius: '100px',
                          }}
                        >
                          DISCONNECT
                        </button>
                      </motion.div>
                    )}

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

                    {/* Error Display */}
                    {sealError && (
                      <motion.div
                        style={{
                          textAlign: 'center',
                          marginBottom: '2rem',
                          padding: '1rem',
                          border: '1px solid rgba(255, 80, 80, 0.3)',
                          borderRadius: '8px',
                          background: 'rgba(255, 80, 80, 0.05)',
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#ff5050' }}>
                          {sealError}
                        </p>
                      </motion.div>
                    )}

                    <Monolith
                      onProve={handleProve}
                      onReset={handleReset}
                      isProving={isProving || isExecuting}
                      hasProven={hasProven}
                      commitmentHash={commitmentHash}
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

function App() {
  return (
    <MidnightWalletProvider>
      <AppContent />
    </MidnightWalletProvider>
  );
}

export default App;
