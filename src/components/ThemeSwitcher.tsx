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
        <h2 className="text-xl font-bold uppercase italic tracking-tight">Skin Selection</h2>
        <div className={`px-3 py-1 rounded-none border ${theme.border} text-[10px] ${theme.mono} ${theme.muted}`}>
          ACTIVE_SKIN: {currentTheme.name}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(THEMES).map(([key, t]) => (
          <button
            key={key}
            onClick={() => setTheme(t)}
            className={`p-6 border transition-all text-left relative overflow-hidden group
              ${currentTheme.name === t.name ? `${t.border} ${t.accent} border-current` : `${theme.border} ${theme.muted} hover:border-white/20`}
              ${t.bg}
            `}
          >
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-widest">{t.name}</span>
              <div className="flex gap-2">
                <div className={`w-4 h-4 ${t.accentBg}`} />
                <div className={`w-4 h-4 ${t.bg} border ${t.border}`} />
                <div className={`w-4 h-4 ${t.text} bg-current`} />
              </div>
            </div>
            {currentTheme.name === t.name && (
              <div className={`absolute top-0 right-0 p-2 ${t.accentBg} text-black text-[8px] font-bold uppercase`}>
                ACTIVE
              </div>
            )}
          </button>
        ))}
      </div>

      <div className={`p-6 border ${theme.border} bg-white/5 space-y-4`}>
        <span className={`text-[10px] ${theme.muted} uppercase block tracking-widest`}>VISUAL_PREVIEW</span>
        <div className="space-y-2">
          <div className={`h-2 w-full ${theme.accentBg} opacity-10`} />
          <div className={`h-2 w-2/3 ${theme.accentBg} opacity-20`} />
          <div className={`h-2 w-1/2 ${theme.accentBg} opacity-30`} />
        </div>
      </div>
    </motion.div>
  );
};
