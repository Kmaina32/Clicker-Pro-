import React from 'react';
import { motion } from 'motion/react';
import { THEMES } from '../constants';

interface ThemeSwitcherProps {
  currentTheme: any;
  setTheme: (theme: any) => void;
  theme: any;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, setTheme, theme }) => {
  return (
    <motion.div
      key="theme"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold tracking-tight ${theme.text}`}>Theme Selection</h2>
        <div className={`px-3 py-1 ${theme.radius || 'rounded-none'} border ${theme.border} text-[10px] font-bold ${theme.muted} uppercase tracking-wider`}>
          Active: {currentTheme.name}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(THEMES).map(([key, t]) => (
          <button
            key={key}
            onClick={() => setTheme(t)}
            className={`p-6 border transition-all text-left relative overflow-hidden group ${t.radius || 'rounded-none'}
              ${currentTheme.name === t.name ? `${t.border} ${t.accent} ring-2 ring-indigo-500/20` : `${theme.border} ${theme.muted} hover:border-slate-300`}
              ${t.bg} ${t.card} ${t.glow}
            `}
          >
            <div className="flex flex-col gap-4">
              <span className={`text-xs font-bold uppercase tracking-widest ${t.text}`}>{t.name}</span>
              <div className="flex gap-2">
                <div className={`w-5 h-5 ${t.accentBg} ${t.radius || 'rounded-none'}`} />
                <div className={`w-5 h-5 ${t.bg} border ${t.border} ${t.radius || 'rounded-none'}`} />
                <div className={`w-5 h-5 ${t.text} bg-current ${t.radius || 'rounded-none'}`} />
              </div>
            </div>
            {currentTheme.name === t.name && (
              <div className={`absolute top-0 right-0 px-3 py-1 ${t.accentBg} text-white text-[9px] font-bold uppercase tracking-widest`}>
                Active
              </div>
            )}
          </button>
        ))}
      </div>

      <div className={`p-6 border ${theme.border} ${theme.card} ${theme.radius || 'rounded-none'} space-y-4 ${theme.glow}`}>
        <span className={`text-[10px] ${theme.muted} uppercase font-bold tracking-widest block`}>Visual Preview</span>
        <div className="space-y-3">
          <div className={`h-3 w-full ${theme.accentBg} opacity-10 rounded-full`} />
          <div className={`h-3 w-2/3 ${theme.accentBg} opacity-20 rounded-full`} />
          <div className={`h-3 w-1/2 ${theme.accentBg} opacity-30 rounded-full`} />
        </div>
      </div>
    </motion.div>
  );
};
