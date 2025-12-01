import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const ZenParticles: React.FC = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      size: Math.random() * 6 + 2, // 2px to 8px
      left: Math.random() * 100, // 0% to 100%
      duration: Math.random() * 15 + 10, // 10s to 25s
      delay: Math.random() * 10, // 0s to 10s
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyan-200/20 blur-[1px]"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            bottom: '-10vh',
          }}
          animate={{
            y: [0, -1200], // Move up roughly screen height
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default ZenParticles;
