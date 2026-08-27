
import { motion } from 'framer-motion';
import { Magnetic } from './Magnetic';

interface NavbarProps {
  view: 'oracle' | 'chronicles';
  setView: (v: 'oracle' | 'chronicles') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ view, setView }) => {
  return (
    <motion.nav 
      className="floating-nav"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="nav-pill">
        <div className="omen-brand-mini">Omen.</div>
        
        <div className="nav-links">
          <span className={`omen-nav-link ${view === 'oracle' ? 'active' : ''}`} onClick={() => setView('oracle')} style={{ cursor: 'none' }}>Oracle</span>
          <span className={`omen-nav-link ${view === 'chronicles' ? 'active' : ''}`} onClick={() => setView('chronicles')} style={{ cursor: 'none' }}>Chronicles</span>
        </div>

        <div className="nav-actions">
          <div className="status-indicator">
            <div className="status-dot emerald"></div>
            <span className="text-mono text-muted" style={{ fontSize: '9px' }}>SYS.ONLINE</span>
          </div>
          <Magnetic pull={0.2}>
            <button className="connect-btn">
              <span className="btn-text">CONNECT LACE</span>
              <div className="btn-glare"></div>
            </button>
          </Magnetic>
        </div>
      </div>
    </motion.nav>
  );
};
