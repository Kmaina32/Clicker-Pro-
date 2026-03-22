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
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`fixed bottom-8 right-8 ${theme.card} border ${theme.border} p-4 flex items-center gap-6 z-50 shadow-2xl`}
    >
      <div className="flex flex-col gap-1">
        <span className={`text-[8px] ${theme.muted} uppercase tracking-widest`}>SIM_STATUS</span>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-[#00FF41] animate-pulse' : 'bg-red-500'}`} />
          <span className="text-xs font-bold uppercase">{isRunning ? 'ACTIVE' : 'IDLE'}</span>
        </div>
      </div>

      <div className="h-8 w-[1px] bg-white/10" />

      <div className="flex flex-col gap-1 min-w-[60px]">
        <span className={`text-[8px] ${theme.muted} uppercase tracking-widest`}>CLICKS</span>
        <span className="text-xs font-bold">{clicksCount.toLocaleString()}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => isRunning || isCountingDown ? stopSimulation() : startSimulation()}
          className={`p-3 border ${theme.border} transition-all
            ${isRunning || isCountingDown ? 'text-red-500 bg-red-500/10' : theme.accent + ' bg-white/5'}
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
          className={`p-3 border ${theme.border} ${theme.muted} hover:text-white bg-white/5`}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
