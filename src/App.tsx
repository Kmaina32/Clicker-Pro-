/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Timer, Play, Square } from 'lucide-react';

// --- Types & Constants ---
import { ClickerConfig } from './types';
import { THEMES, DEFAULT_CONFIG } from './constants';

// --- Hooks ---
import { useClicker } from './hooks/useClicker';

// --- Components ---
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ConfigPanel } from './components/ConfigPanel';
import { ScriptExporter } from './components/ScriptExporter';
import { CPSTester } from './components/CPSTester';
import { SessionLogs } from './components/SessionLogs';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { RippleEffect } from './components/RippleEffect';
import { ProfileManager } from './components/ProfileManager';
import { PatternRecorder } from './components/PatternRecorder';
import { MiniOverlay } from './components/MiniOverlay';
import { SystemTerminal } from './components/SystemTerminal';
import { TaskScheduler } from './components/TaskScheduler';
import { Help } from './components/Help';

export default function App() {
  // --- State ---
  const [theme, setTheme] = useState(THEMES.MODERN);
  const [config, setConfig] = useState<ClickerConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<'config' | 'schedule' | 'scripts' | 'test' | 'history' | 'theme' | 'help'>('config');
  const [showOverlay, setShowOverlay] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [profiles, setProfiles] = useState<ClickerConfig[]>([]);

  // --- Simulation Hook ---
  const {
    isRunning,
    isCountingDown,
    countdown,
    clicksCount,
    sessionLogs,
    ripples,
    terminalLogs,
    startSimulation,
    stopSimulation,
    setClicksCount,
    addTerminalLog
  } = useClicker(config);

  // --- Fetch Profiles for Scheduler ---
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await fetch('/api/profiles');
        if (res.ok) {
          const data = await res.json();
          setProfiles(data);
        }
      } catch (err) {
        console.error('Failed to fetch profiles:', err);
      }
    };
    fetchProfiles();
  }, [activeTab]);

  // --- Background Scheduler Logic ---
  useEffect(() => {
    const checkTasks = async () => {
      if (isRunning || isCountingDown) return;

      try {
        const res = await fetch('/api/tasks');
        if (!res.ok) return;
        const tasks = await res.json();
        
        const now = new Date();
        const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        const currentDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()];

        for (const task of tasks) {
          if (task.isActive && task.days.includes(currentDay) && task.startTime === currentTime) {
            // Check if it already ran in the last minute to avoid double triggering
            const lastRun = task.lastRun || 0;
            if (Date.now() - lastRun > 61000) {
              addTerminalLog(`Scheduled task triggered: ${task.name}`, 'info');
              setConfig(task.config);
              
              // Update last run time on server
              await fetch(`/api/tasks/${task.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...task, lastRun: Date.now() }),
              });

              // Start simulation after a small delay to ensure config is set
              setTimeout(() => startSimulation(), 500);
              break; 
            }
          }
        }
      } catch (err) {
        console.error('Scheduler error:', err);
      }
    };

    const interval = setInterval(checkTasks, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [isRunning, isCountingDown, startSimulation, addTerminalLog]);

  // --- Auto Detect Position ---
  const detectPosition = useCallback(() => {
    setIsDetecting(true);
    const handleMove = (e: MouseEvent) => {
      setConfig(prev => ({ ...prev, x: e.clientX, y: e.clientY, useCoordinates: true }));
    };
    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDetecting(false);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('click', handleClick, true);
    };
    // Delay slightly to avoid capturing the current button click
    setTimeout(() => {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('click', handleClick, true);
    }, 100);
  }, []);

  // --- Hotkeys ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Alt + P (Start/Stop)
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        if (isRunning || isCountingDown) stopSimulation();
        else startSimulation();
      }
      // Ctrl + Alt + R (Reset)
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        setClicksCount(0);
      }
      // Ctrl + Alt + M (Overlay)
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setShowOverlay(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, isCountingDown, startSimulation, stopSimulation, setClicksCount]);

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} p-4 md:p-8 flex flex-col items-center justify-center selection:bg-indigo-500/30 ${theme.font || 'font-sans'} relative overflow-hidden`}>
      {/* Ripple Visuals */}
      <RippleEffect ripples={ripples} theme={theme} />

      {/* Mini Overlay */}
      {showOverlay && (
        <MiniOverlay 
          isRunning={isRunning} 
          isCountingDown={isCountingDown}
          countdown={countdown}
          clicksCount={clicksCount} 
          startSimulation={startSimulation}
          stopSimulation={stopSimulation}
          toggleOverlay={() => setShowOverlay(false)}
          theme={theme}
        />
      )}
      
      {/* Header */}
      <Header theme={theme} />

      {/* Main Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Navigation Rail */}
        <Navigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          theme={theme} 
        />

        {/* Content Area */}
        <div className={`lg:col-span-9 ${theme.card} ${theme.radius || 'rounded-none'} border ${theme.border} p-6 md:p-8 relative overflow-hidden ${theme.glow}`}>
          
          <AnimatePresence mode="wait">
            {activeTab === 'config' && (
              <motion.div
                key="config"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  <div className="xl:col-span-2 space-y-8">
                    <ConfigPanel 
                      config={config} 
                      setConfig={setConfig} 
                      isRunning={isRunning} 
                      isCountingDown={isCountingDown}
                      countdown={countdown}
                      clicksCount={clicksCount}
                      startSimulation={startSimulation}
                      stopSimulation={stopSimulation}
                      detectPosition={detectPosition}
                      isDetecting={isDetecting}
                      theme={theme}
                    />
                    <SystemTerminal logs={terminalLogs} theme={theme} />
                  </div>
                  <div className="space-y-6">
                    <ProfileManager 
                      config={config} 
                      setConfig={setConfig} 
                      theme={theme} 
                    />
                    <PatternRecorder theme={theme} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'schedule' && (
              <TaskScheduler theme={theme} profiles={profiles} />
            )}

            {activeTab === 'scripts' && (
              <ScriptExporter config={config} theme={theme} />
            )}

            {activeTab === 'test' && (
              <CPSTester theme={theme} />
            )}

            {activeTab === 'history' && (
              <SessionLogs logs={sessionLogs} theme={theme} />
            )}

            {activeTab === 'theme' && (
              <ThemeSwitcher currentTheme={theme} setTheme={setTheme} theme={theme} />
            )}

            {activeTab === 'help' && (
              <Help theme={theme} />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer / Status Bar */}
      <div className={`mt-12 w-full max-w-6xl flex items-center justify-between px-8 py-6 border-t ${theme.border}`}>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
            <span className={`text-xs font-bold tracking-wider uppercase ${theme.muted}`}>System: {isRunning ? 'Running' : 'Ready'}</span>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Timer className={`w-4 h-4 ${theme.muted}`} />
            <span className={`text-xs font-bold tracking-wider uppercase ${theme.muted}`}>Uptime: {Math.floor(performance.now() / 1000)}s</span>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-12">
          <div className="flex flex-col items-end">
            <span className={`text-[9px] ${theme.muted} uppercase font-bold tracking-widest`}>Security</span>
            <span className={`text-xs font-semibold ${theme.text}`}>AES-256-GCM</span>
          </div>
          <div className="flex flex-col items-end">
            <span className={`text-[9px] ${theme.muted} uppercase font-bold tracking-widest`}>Connection</span>
            <span className={`text-xs font-semibold ${theme.text}`}>Encrypted</span>
          </div>
          <div className="flex flex-col items-end">
            <span className={`text-[9px] ${theme.muted} uppercase font-bold tracking-widest`}>Latency</span>
            <span className={`text-xs font-semibold ${theme.text}`}>0.002ms</span>
          </div>
        </div>

        <div className={`text-xs font-bold ${theme.muted} tracking-widest`}>
          v2.5.0 // {theme.name}
        </div>
      </div>

      {/* Overlay Toggle Button (if hidden) */}
      {!showOverlay && (
        <button 
          onClick={() => setShowOverlay(true)}
          className={`fixed bottom-8 right-8 p-4 border ${theme.border} ${theme.radius || 'rounded-none'} ${theme.muted} hover:text-indigo-600 ${theme.card} z-50 shadow-lg transition-all hover:scale-110`}
          title="Show Overlay (Ctrl+Alt+M)"
        >
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}>
            <Play className="w-5 h-5" />
          </motion.div>
        </button>
      )}
    </div>
  );
}
