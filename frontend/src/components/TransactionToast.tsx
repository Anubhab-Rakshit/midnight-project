import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, ExternalLink } from 'lucide-react';

export type ToastType = 'pending' | 'success' | 'error';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  txHash?: string;
}

interface ToastContextState {
  addToast: (toast: Omit<ToastMessage, 'id'>) => string;
  updateToast: (id: string, updates: Partial<Omit<ToastMessage, 'id'>>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextState | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...toast, id }]);
    
    // Auto-remove success/error after 5s
    if (toast.type !== 'pending') {
      setTimeout(() => removeToast(id), 5000);
    }
    
    return id;
  }, []);

  const updateToast = useCallback((id: string, updates: Partial<Omit<ToastMessage, 'id'>>) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    
    // Auto-remove if updated to success/error
    if (updates.type && updates.type !== 'pending') {
      setTimeout(() => removeToast(id), 5000);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, updateToast, removeToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          pointerEvents: 'none',
        }}
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              style={{
                pointerEvents: 'auto',
                background: 'rgba(10, 10, 12, 0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                padding: '1.25rem',
                borderRadius: '12px',
                minWidth: '320px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Glossy overlay */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
                pointerEvents: 'none',
              }} />

              <div style={{ marginTop: '0.125rem' }}>
                {t.type === 'pending' && <Loader2 size={18} className="animate-spin" style={{ color: 'var(--accent-gold)' }} />}
                {t.type === 'success' && <CheckCircle2 size={18} style={{ color: '#34d399' }} />}
                {t.type === 'error' && <XCircle size={18} style={{ color: '#ff5050' }} />}
              </div>

              <div style={{ flex: 1 }}>
                <h4 style={{ 
                  margin: 0, 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '11px', 
                  color: '#fff', 
                  letterSpacing: '0.1em',
                  marginBottom: t.message || t.txHash ? '0.5rem' : 0
                }}>
                  {t.title}
                </h4>
                
                {t.message && (
                  <p style={{ 
                    margin: 0, 
                    fontFamily: 'var(--font-mono)', 
                    fontSize: '11px', 
                    color: 'var(--text-muted)',
                    lineHeight: 1.4
                  }}>
                    {t.message}
                  </p>
                )}

                {t.txHash && (
                  <a
                    href={`https://explorer.preprod.midnight.network/transactions/${t.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      marginTop: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'var(--accent-gold)',
                      textDecoration: 'none',
                    }}
                  >
                    View on Explorer <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
