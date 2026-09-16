
import { motion } from 'framer-motion';
import { WalletConnect } from './WalletConnect';

interface NavbarProps {
  view: 'circles' | 'chronicles';
  setView: (v: 'circles' | 'chronicles') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ view, setView }) => {
  return (
    <motion.nav 
      className="floating-nav"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="nav-pill" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div className="omen-brand-mini">Meridian.</div>
        
        <div className="nav-links">
          <span className={`omen-nav-link ${view === 'circles' ? 'active' : ''}`} onClick={() => setView('circles')} style={{ cursor: 'pointer' }}>Circles</span>
          <span className={`omen-nav-link ${view === 'chronicles' ? 'active' : ''}`} onClick={() => setView('chronicles')} style={{ cursor: 'pointer' }}>Chronicles</span>
        </div>

        <div className="nav-actions">
          <WalletConnect />
        </div>
      </div>
    </motion.nav>
  );
};
