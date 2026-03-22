import { useState, useRef, useEffect, useCallback } from 'react';
import { ClickerConfig, SessionLog } from '../types';

export function useClicker(config: ClickerConfig) {
  const [isRunning, setIsRunning] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [clicksCount, setClicksCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([]);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [terminalLogs, setTerminalLogs] = useState<{ id: string; message: string; type: 'info' | 'success' | 'error' | 'warning' }[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const addTerminalLog = useCallback((message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setTerminalLogs(prev => [{ id, message, type }, ...prev].slice(0, 50));
  }, []);

  const playClickSound = useCallback(() => {
    if (!config.soundEnabled) return;
    const audio = new Audio('https://www.soundjay.com/buttons/button-16.mp3');
    audio.volume = 0.2;
    audio.play().catch(() => {});
  }, [config.soundEnabled]);

  const addRipple = useCallback((x: number, y: number) => {
    if (!config.rippleEnabled) return;
    const id = Date.now();
    setRipples(prev => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 1000);
  }, [config.rippleEnabled]);

  const stopSimulation = useCallback(() => {
    if (isRunning && startTime) {
      const duration = (Date.now() - startTime) / 1000;
      const newLog: SessionLog = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        clicks: clicksCount,
        duration: Math.round(duration),
        configName: config.name || 'UNNAMED_PROCESS',
      };
      setSessionLogs(prev => [newLog, ...prev].slice(0, 10));
      addTerminalLog(`Process terminated. Total clicks: ${clicksCount}`, 'warning');
    }
    setIsRunning(false);
    setIsCountingDown(false);
    setStartTime(null);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearTimeout(countdownRef.current);
  }, [isRunning, startTime, clicksCount, config.name, addTerminalLog]);

  const startSimulation = useCallback(() => {
    setClicksCount(0);
    if (config.startDelay > 0) {
      setIsCountingDown(true);
      setCountdown(config.startDelay);
      addTerminalLog(`Initiating countdown: ${config.startDelay}s`, 'info');
    } else {
      setIsRunning(true);
      setStartTime(Date.now());
      addTerminalLog('Simulation started.', 'success');
    }
  }, [config.startDelay, addTerminalLog]);

  useEffect(() => {
    if (isCountingDown) {
      if (countdown > 0) {
        countdownRef.current = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      } else {
        setIsCountingDown(false);
        setIsRunning(true);
        setStartTime(Date.now());
        addTerminalLog('Simulation started.', 'success');
      }
    }
    return () => {
      if (countdownRef.current) clearTimeout(countdownRef.current);
    };
  }, [isCountingDown, countdown, addTerminalLog]);

  useEffect(() => {
    if (isRunning) {
      const getMs = () => {
        if (config.randomize) {
          const min = config.minInterval;
          const max = config.maxInterval;
          const val = Math.floor(Math.random() * (max - min + 1) + min);
          if (config.unit === 'cpm') return 60000 / Math.max(1, val);
          return config.unit === 'ms' ? val : config.unit === 's' ? val * 1000 : val * 60000;
        }
        if (config.unit === 'cpm') return 60000 / Math.max(1, config.interval);
        return config.unit === 'ms' ? config.interval : config.unit === 's' ? config.interval * 1000 : config.interval * 60000;
      };

      const run = () => {
        if (config.useDuration && startTime) {
          const elapsed = (Date.now() - startTime) / 1000;
          if (elapsed >= config.duration) {
            addTerminalLog(`Duration limit reached: ${config.duration}s`, 'info');
            stopSimulation();
            return;
          }
        }

        setClicksCount(prev => {
          if (config.useLimit && prev >= config.repeatCount) {
            addTerminalLog(`Click limit reached: ${config.repeatCount}`, 'info');
            stopSimulation();
            return prev;
          }
          const nextCount = prev + 1;
          
          // Visuals & Audio
          playClickSound();
          if (config.useCoordinates) {
            const jX = (Math.random() - 0.5) * config.jitterX;
            const jY = (Math.random() - 0.5) * config.jitterY;
            addRipple(config.x + jX, config.y + jY);
          } else {
            addRipple(window.innerWidth / 2, window.innerHeight / 2);
          }

          return nextCount;
        });

        if (isRunning) {
          timerRef.current = setTimeout(run, getMs());
        }
      };

      timerRef.current = setTimeout(run, getMs());
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, config, startTime, playClickSound, addRipple, stopSimulation, addTerminalLog]);

  return {
    isRunning,
    isCountingDown,
    countdown,
    clicksCount,
    sessionLogs,
    ripples,
    terminalLogs,
    startSimulation,
    stopSimulation,
    setClicksCount
  };
}
