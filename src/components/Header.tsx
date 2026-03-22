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
      className="mb-8 text-left max-w-6xl w-full"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold tracking-tight ${theme.text}`}>
            Clicker<span className={theme.accent}>Pro</span>
          </h1>
          <p className={`${theme.muted} text-sm mt-1`}>Advanced automation and simulation utility</p>
        </div>
        <div className={`px-3 py-1 rounded-full bg-white/5 border ${theme.border} text-[10px] font-bold uppercase tracking-wider ${theme.muted}`}>
          v2.5.0 Stable
        </div>
      </div>
    </motion.div>
  );
};
