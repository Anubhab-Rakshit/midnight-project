import { motion } from 'framer-motion';
import { useMidnightWallet } from '../context/MidnightWalletContext';
import { usePremonitionsStore } from '../hooks/usePremonitionsStore';

const CONTRACT_ADDRESS = '5b7dcd349113b6dc0a11caa89b9245dc701d43e1cf114fc99bd10acf8e930f6c';

export const Chronicles = () => {
  const { isConnected, address } = useMidnightWallet();
  const { premonitions, isLoading, error, refetch } = usePremonitionsStore(address);

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

      {!isConnected ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--text-muted)',
        }}>
          Connect your Midnight wallet to view your chronicles.
        </div>
      ) : (
        <>
          {/* Wallet Info */}
          <div style={{
            textAlign: 'center',
            marginBottom: '3rem',
            padding: '1.5rem',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.02)',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent-gold)', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>
              PLEASE NOTE: These are YOUR private premonitions, stored privately.
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '0.5rem', wordBreak: 'break-all' }}>
              Wallet: {address?.slice(0, 12)}...{address?.slice(-8)}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
              Contract: {CONTRACT_ADDRESS}
            </div>
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
              <span>Loading chronicles...</span>
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
              <span>
                {premonitions.length} inscribe{premonitions.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Transaction List */}
          {premonitions.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {premonitions.map((p) => (
                <div key={p.id} style={{
                  padding: '1.5rem',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.02)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent-gold)', letterSpacing: '0.15em', marginBottom: '0.25rem' }}>
                        {new Date(p.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '100px',
                      background: 'rgba(52,211,153,0.1)',
                      color: '#34d399',
                      border: '1px solid rgba(52,211,153,0.2)',
                    }}>
                      SEALED
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.1rem', color: '#fff', lineHeight: 1.5, marginBottom: '1rem' }}>
                    &ldquo;{p.premonitionText}&rdquo;
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', lineHeight: 1.8, wordBreak: 'break-all' }}>
                    <div>
                      hash: <span className="text-gold">{p.commitmentHash.slice(0, 16)}...{p.commitmentHash.slice(-4)}</span>
                    </div>
                    {p.blockHeight && (
                      <div>block: {p.blockHeight}</div>
                    )}
                    {p.txHash && (
                      <div>
                        tx: {p.txHash.slice(0, 20)}...
                        <a
                          href={`https://explorer.preprod.midnight.network/tx/${p.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'var(--accent-gold)', textDecoration: 'none', marginLeft: '0.5rem' }}
                        >
                          validate ↗
                        </a>
                      </div>
                    )}
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
              No premonitions inscribed yet.<br />
              <span style={{ opacity: 0.5 }}>Go to the Oracle and seal your first premonition.</span>
            </div>
          ) : null}
        </>
      )}
    </motion.div>
  );
};
