import React from 'react';
import { motion } from 'motion/react';

interface HeaderProps {
  theme: any;
}

export const Header: React.FC<HeaderProps> = ({ theme }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12 text-center relative"
    >
      <div className="flex flex-col items-center justify-center gap-1">
        <div className="text-[10px] tracking-[0.5em] opacity-30 mb-2">SYSTEM_OVERRIDE_INIT</div>
        <div className="flex items-baseline gap-1">
          <h1 className="text-5xl font-black tracking-tighter uppercase italic flex items-center">
            <span className={theme.accent}>C</span>LICKER
            <span className="opacity-20">_</span>
            <span className={theme.accent}>P</span>RO
          </h1>
          <div className={`w-3 h-8 ${theme.accentBg} animate-pulse ml-2`} />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="h-[1px] w-12 bg-white/10" />
          <p className={`${theme.muted} text-[10px] tracking-[0.3em] uppercase`}>v2.5 // KERNEL_LEVEL_SIM</p>
          <div className="h-[1px] w-12 bg-white/10" />
        </div>
      </div>
    </motion.div>
  );
};
