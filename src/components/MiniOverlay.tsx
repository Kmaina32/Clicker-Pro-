import React from 'react';
import { motion } from 'motion/react';
import { Play, Square, Settings } from 'lucide-react';

interface MiniOverlayProps {
  isRunning: boolean;
  isCountingDown: boolean;
  countdown: number;
  clicksCount: number;
  startSimulation: () => void;
  stopSimulation: () => void;
  toggleOverlay: () => void;
  theme: any;
}

export const MiniOverlay: React.FC<MiniOverlayProps> = ({
  isRunning, isCountingDown, countdown, clicksCount,
  startSimulation, stopSimulation, toggleOverlay, theme
}) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      className={`fixed bottom-8 right-8 ${theme.card} border ${theme.border} ${theme.radius || 'rounded-none'} p-4 flex items-center gap-6 z-50 shadow-2xl ${theme.glow}`}
    >
      <div className="flex flex-col gap-1">
        <span className={`text-[9px] ${theme.muted} uppercase font-bold tracking-widest`}>Status</span>
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          <span className={`text-xs font-bold uppercase ${theme.text}`}>{isRunning ? 'Active' : 'Idle'}</span>
        </div>
      </div>

      <div className={`h-10 w-[1px] ${theme.border}`} />

      <div className="flex flex-col gap-1 min-w-[60px]">
        <span className={`text-[9px] ${theme.muted} uppercase font-bold tracking-widest`}>Clicks</span>
        <span className={`text-xs font-bold ${theme.text}`}>{clicksCount.toLocaleString()}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => isRunning || isCountingDown ? stopSimulation() : startSimulation()}
          className={`p-3 border ${theme.border} ${theme.radius || 'rounded-none'} transition-all shadow-sm
            ${isRunning || isCountingDown ? 'text-rose-500 bg-rose-500/10' : theme.accent}
          `}
        >
          {isCountingDown ? (
            <span className="text-xs font-bold">{countdown}</span>
          ) : (
            isRunning ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />
          )}
        </button>
        <button
          onClick={toggleOverlay}
          className={`p-3 border ${theme.border} ${theme.radius || 'rounded-none'} ${theme.muted} hover:text-indigo-600 transition-colors shadow-sm`}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
