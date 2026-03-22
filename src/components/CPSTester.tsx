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
      <div className="text-center space-y-3">
        <h2 className={`text-3xl font-bold tracking-tight ${theme.text}`}>Performance Tester</h2>
        <p className={`${theme.muted} text-sm font-medium`}>Measure your manual clicking speed (5s Burst)</p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-16">
        <div className="text-center order-2 md:order-1">
          <span className={`text-xs font-bold ${theme.muted} uppercase tracking-widest block mb-2`}>Current CPS</span>
          <span className={`text-7xl font-black ${theme.accent} tracking-tighter`}>{cps.toFixed(1)}</span>
        </div>

        <button
          onMouseDown={handleTestClick}
          className={`w-64 h-64 border-2 ${theme.border} ${theme.radius || 'rounded-none'} flex flex-col items-center justify-center gap-6 transition-all active:scale-95 group relative overflow-hidden ${theme.card} ${theme.glow} order-1 md:order-2`}
        >
          <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <MousePointerClick className={`w-16 h-16 ${theme.muted} group-hover:text-indigo-600 transition-colors`} />
          <span className={`text-sm font-bold ${theme.muted} group-hover:text-indigo-600 tracking-widest uppercase`}>Click to Test</span>
          
          {testStartTime && (
            <motion.div 
              animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.1, 0.2] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-0 border-4 border-indigo-500/20"
            />
          )}
        </button>

        <div className="text-center order-3">
          <span className={`text-xs font-bold ${theme.muted} uppercase tracking-widest block mb-2`}>Total Clicks</span>
          <span className={`text-7xl font-black ${theme.text} tracking-tighter`}>{testClicks}</span>
        </div>
      </div>

      {testStartTime && (
        <div className="w-full max-w-md h-2 bg-slate-100 rounded-full overflow-hidden relative">
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
