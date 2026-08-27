import { motion } from 'framer-motion';
import { LiquidImage } from './LiquidImage';
import { usePremonitions } from '../hooks/usePremonitions';

export const Chronicles = () => {
  const { premonitions, isLoading, isUsingMock, refetch } = usePremonitions();

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

      {/* Data Source Indicator */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '2rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        color: 'var(--text-muted)',
      }}>
        {isLoading ? (
          <span>Loading from Midnight Indexer...</span>
        ) : isUsingMock ? (
          <span style={{ opacity: 0.6 }}>
            Demo Mode — Using mock data
            <button 
              onClick={refetch}
              style={{
                marginLeft: '1rem',
                padding: '0.25rem 0.5rem',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'var(--accent-gold)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
              }}
            >
              RETRY
            </button>
          </span>
        ) : (
          <span>Live from Midnight Preprod</span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem' }}>
        {premonitions.map((item) => (
          <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-gold)', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>
                  REVEALED: {new Date(item.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontStyle: 'italic', fontWeight: 300 }}>{item.title}</h3>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', textAlign: 'right' }}>
                <div>{item.commitmentHash.slice(0, 10)}...{item.commitmentHash.slice(-6)}</div>
                <div style={{ opacity: 0.5, marginTop: '0.25rem' }}>Block #{item.blockHeight}</div>
              </div>
            </div>
            
            <div style={{ width: '100%', height: '300px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
              <LiquidImage src={`https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop&seed=${item.id}`} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
