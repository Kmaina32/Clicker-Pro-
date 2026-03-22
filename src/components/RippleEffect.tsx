import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface RippleEffectProps {
  ripples: { id: number; x: number; y: number }[];
  theme: any;
}

export const RippleEffect: React.FC<RippleEffectProps> = ({ ripples, theme }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: ripple.x,
              top: ripple.y,
              width: 100,
              height: 100,
              marginLeft: -50,
              marginTop: -50,
              borderRadius: '50%',
              border: `2px solid ${theme.accent.replace('text-', '') === '#00FF41' ? '#00FF41' : theme.accent.replace('text-', '')}`,
              boxShadow: `0 0 20px ${theme.accent.replace('text-', '') === '#00FF41' ? '#00FF41' : theme.accent.replace('text-', '')}44`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
