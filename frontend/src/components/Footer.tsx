import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Globe, Terminal, Disc } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Magnetic } from './Magnetic';

gsap.registerPlugin(ScrollTrigger);

export const Footer = () => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let proxy = { skew: 0 };
    let skewSetter = gsap.quickSetter(textRef.current, "skewY", "deg");
    let clamp = gsap.utils.clamp(-20, 20);

    const trigger = ScrollTrigger.create({
      onUpdate: (self) => {
        let skew = clamp(self.getVelocity() / -300);
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
          proxy.skew = skew;
          gsap.to(proxy, {
            skew: 0,
            duration: 0.8,
            ease: "power3",
            overwrite: true,
            onUpdate: () => skewSetter(proxy.skew)
          });
        }
      }
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <footer className="cinematic-footer">
      <div className="footer-content">
        <motion.div 
          ref={textRef}
          className="footer-massive-text"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          Predict the Unseen.
        </motion.div>
        
        <div className="footer-grid">
          <div className="footer-col">
            <h4 className="footer-heading">MIDNIGHT NETWORK</h4>
            <p className="footer-desc">
              Omen utilizes Zero-Knowledge proofs on the Midnight Preprod testnet to guarantee observable privacy behavior.
            </p>
          </div>
          
          <div className="footer-col align-right">
            <h4 className="footer-heading">CONNECT</h4>
            <div className="social-links">
              <Magnetic pull={0.4}><a href="#" className="social-link"><Terminal size={18} /></a></Magnetic>
              <Magnetic pull={0.4}><a href="#" className="social-link"><Globe size={18} /></a></Magnetic>
              <Magnetic pull={0.4}><a href="#" className="social-link"><Disc size={18} /></a></Magnetic>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="text-mono text-muted">&copy; 2026 Omen Protocol</span>
          <span className="text-mono text-muted">A Cryptographic Registry</span>
        </div>
      </div>
    </footer>
  );
};
