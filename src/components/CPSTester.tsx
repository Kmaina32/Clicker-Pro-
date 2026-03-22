import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { MousePointerClick } from 'lucide-react';

interface CPSTesterProps {
  theme: any;
}

export const CPSTester: React.FC<CPSTesterProps> = ({ theme }) => {
  const [testClicks, setTestClicks] = useState(0);
  const [testStartTime, setTestStartTime] = useState<number | null>(null);
  const [cps, setCps] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTestClick = () => {
    if (!testStartTime) {
      setTestStartTime(Date.now());
      setTestClicks(1);
      timerRef.current = setTimeout(() => {
        setTestStartTime(null);
        setTestClicks(0);
      }, 5000);
    } else {
      setTestClicks(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (testStartTime) {
      const interval = setInterval(() => {
        const elapsed = (Date.now() - testStartTime) / 1000;
        setCps(testClicks / elapsed);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setCps(0);
    }
  }, [testStartTime, testClicks]);

  return (
    <motion.div
      key="test"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col items-center justify-center space-y-12 py-12"
    >
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold uppercase italic tracking-tight">Performance Tester</h2>
        <p className={`${theme.muted} text-[10px] uppercase tracking-widest`}>Measure your manual clicking speed (5s Burst)</p>
      </div>

      <div className="flex items-center gap-16">
        <div className="text-center">
          <span className={`text-[10px] ${theme.muted} uppercase block`}>CURRENT_CPS</span>
          <span className={`text-6xl font-black ${theme.accent} italic`}>{cps.toFixed(1)}</span>
        </div>

        <button
          onMouseDown={handleTestClick}
          className={`w-64 h-64 border-2 ${theme.border} flex flex-col items-center justify-center gap-4 transition-all active:scale-95 group relative overflow-hidden bg-white/5`}
        >
          <div className="absolute inset-0 bg-[#00FF41]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00FF41]/50" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00FF41]/50" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00FF41]/50" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00FF41]/50" />
          
          <MousePointerClick className={`w-12 h-12 ${theme.muted} group-hover:text-white transition-colors`} />
          <span className={`text-xs font-bold ${theme.muted} group-hover:text-white tracking-widest uppercase`}>[ CLICK_TO_TEST ]</span>
          
          {testStartTime && (
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-0 border-2 border-[#00FF41]/20"
            />
          )}
        </button>

        <div className="text-center">
          <span className={`text-[10px] ${theme.muted} uppercase block`}>TOTAL_CLICKS</span>
          <span className="text-6xl font-black text-white italic">{testClicks}</span>
        </div>
      </div>

      {testStartTime && (
        <div className="w-full max-w-md h-1 bg-white/5 relative">
          <motion.div 
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 5, ease: 'linear' }}
            className={`absolute inset-0 ${theme.accentBg}`}
          />
        </div>
      )}
    </motion.div>
  );
};
