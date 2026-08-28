import { motion } from 'framer-motion';
import { usePremonitions } from '../hooks/usePremonitions';

export const Chronicles = () => {
  const { premonitions, isLoading, error, refetch, contractAddress } = usePremonitions();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '0 2rem' }}
    >
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '5rem', fontStyle: 'italic', marginBottom: '2rem', textAlign: 'center', background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.3) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        The Chronicles
      </h2>

      {/* Contract Info */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem',
        padding: '1.5rem',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '8px',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent-gold)', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>
          PREMONITION CONTRACT — PREPROD
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '0.5rem', wordBreak: 'break-all' }}>
          {contractAddress}
        </div>
        <a
          href={`https://explorer.preprod.midnight.network/address/${contractAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent-gold)', textDecoration: 'none', opacity: 0.7 }}
        >
          VIEW ON EXPLORER
        </a>
      </div>

      {/* Status */}
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        color: 'var(--text-muted)',
      }}>
        {isLoading ? (
          <span>Querying Midnight Indexer...</span>
        ) : error ? (
          <span style={{ color: '#ff5050' }}>
            {error}
            <button
              onClick={refetch}
              style={{
                marginLeft: '1rem',
                padding: '0.25rem 0.5rem',
                background: 'transparent',
                border: '1px solid rgba(255,80,80,0.3)',
                color: '#ff5050',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
              }}
            >
              RETRY
            </button>
          </span>
        ) : (
          <span>Live from Midnight Preprod · {premonitions.length} transaction{premonitions.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {/* Transactions */}
      {premonitions.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {premonitions.map((tx) => (
            <div key={tx.id} style={{
              padding: '1.5rem',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.02)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent-gold)', letterSpacing: '0.15em', marginBottom: '0.25rem' }}>
                    BLOCK #{tx.blockHeight}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                    {new Date(tx.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '100px',
                  background: tx.actionType === 'Contract Deploy' ? 'rgba(139,92,246,0.1)' : 'rgba(52,211,153,0.1)',
                  color: tx.actionType === 'Contract Deploy' ? '#a78bfa' : '#34d399',
                  border: `1px solid ${tx.actionType === 'Contract Deploy' ? 'rgba(139,92,246,0.2)' : 'rgba(52,211,153,0.2)'}`,
                }}>
                  {tx.actionType}
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
                tx: {tx.txHash}
              </div>
            </div>
          ))}
        </div>
      ) : !isLoading ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--text-muted)',
        }}>
          No transactions found for this contract yet.<br />
          <span style={{ opacity: 0.5 }}>Seal a premonition on the Oracle to see it here.</span>
        </div>
      ) : null}
    </motion.div>
  );
};
