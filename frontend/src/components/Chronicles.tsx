import { motion } from 'framer-motion';
import { LiquidImage } from './LiquidImage';

const PAST_PREMONITIONS = [
  {
    id: 1,
    date: '2025-10-14',
    hash: '0x7e8b9f...2d1a',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop',
    title: 'The Great AI Alignment',
  },
  {
    id: 2,
    date: '2026-03-21',
    hash: '0x1a2b3c...9f8e',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    title: 'Quantum Leap Simulation',
  }
];

export const Chronicles = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '0 2rem' }}
    >
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '5rem', fontStyle: 'italic', marginBottom: '4rem', textAlign: 'center', background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.3) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        The Chronicles
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem' }}>
        {PAST_PREMONITIONS.map((item) => (
          <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-gold)', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>REVEALED: {item.date}</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontStyle: 'italic', fontWeight: 300 }}>{item.title}</h3>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)' }}>{item.hash}</div>
            </div>
            
            <div style={{ width: '100%', height: '300px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
              <LiquidImage src={item.image} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
