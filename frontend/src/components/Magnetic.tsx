import React, { useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface MagneticProps {
  children: React.ReactElement;
  pull?: number; // How strong the magnetic pull is (lower = stronger pull, default 0.3)
}

export const Magnetic: React.FC<MagneticProps> = ({ children, pull = 0.3 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    
    x.set(distanceX * pull);
    y.set(distanceY * pull);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{ x: springX, y: springY, display: 'inline-block', position: 'relative' }}
      whileHover={{ scale: 1.05 }}
    >
      {React.cloneElement(children as React.ReactElement<any>, {
        style: { ...(children as React.ReactElement<any>).props.style, pointerEvents: isHovered ? 'none' : 'auto' }
      })}
    </motion.div>
  );
};
