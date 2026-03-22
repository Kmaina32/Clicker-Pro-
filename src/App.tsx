/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Timer } from 'lucide-react';

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

export default function App() {
  // --- State ---
  const [theme, setTheme] = useState(THEMES.MATRIX);
  const [config, setConfig] = useState<ClickerConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<'config' | 'scripts' | 'test' | 'history' | 'theme'>('config');
  const [showOverlay, setShowOverlay] = useState(false);

  // --- Simulation Hook ---
  const {
    isRunning,
    isCountingDown,
    countdown,
    clicksCount,
    sessionLogs,
    ripples,
    startSimulation,
    stopSimulation,
    setClicksCount
  } = useClicker(config);

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
    <div className={`min-h-screen ${theme.bg} ${theme.text} p-4 md:p-8 flex flex-col items-center justify-center selection:bg-[#00FF41]/30 font-mono relative overflow-hidden`}>
      
      {/* Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] overflow-hidden">
        <div className="w-full h-[2px] bg-white animate-scanline" />
      </div>
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        .animate-scanline {
          animation: scanline 8s linear infinite;
        }
      `}</style>

      {/* Ripple Visuals */}
      <RippleEffect ripples={ripples} theme={theme} />

      {/* Mini Overlay */}
      <MiniOverlay 
        show={showOverlay} 
        isRunning={isRunning} 
        clicksCount={clicksCount} 
        theme={theme}
        onToggle={() => isRunning ? stopSimulation() : startSimulation()}
        onClose={() => setShowOverlay(false)}
      />
      
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
        <div className={`lg:col-span-9 ${theme.card} rounded-none border ${theme.border} p-6 md:p-8 relative overflow-hidden ${theme.glow}`}>
          
          {/* Decorative Grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

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
                  <div className="xl:col-span-2">
                    <ConfigPanel 
                      config={config} 
                      setConfig={setConfig} 
                      isRunning={isRunning} 
                      isCountingDown={isCountingDown}
                      countdown={countdown}
                      clicksCount={clicksCount}
                      onStart={startSimulation}
                      onStop={stopSimulation}
                      theme={theme}
                    />
                  </div>
                  <div className="space-y-6">
                    <ProfileManager 
                      currentConfig={config} 
                      onLoadConfig={setConfig} 
                      theme={theme} 
                    />
                    <PatternRecorder theme={theme} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'scripts' && (
              <motion.div
                key="scripts"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <ScriptExporter config={config} theme={theme} />
              </motion.div>
            )}

            {activeTab === 'test' && (
              <motion.div
                key="test"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <CPSTester theme={theme} />
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <SessionLogs logs={sessionLogs} theme={theme} />
              </motion.div>
            )}

            {activeTab === 'theme' && (
              <motion.div
                key="theme"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer / Status Bar */}
      <div className="mt-12 w-full max-w-5xl flex items-center justify-between px-6 py-4 border-t border-white/5">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-[#00FF00] animate-pulse' : 'bg-white/20'}`} />
            <span className={`text-[10px] font-bold tracking-widest uppercase ${theme.muted}`}>System Status: {isRunning ? 'Running' : 'Ready'}</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Timer className={`w-3 h-3 ${theme.muted}`} />
            <span className={`text-[10px] font-bold tracking-widest uppercase ${theme.muted}`}>Uptime: {Math.floor(performance.now() / 1000)}s</span>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className={`text-[8px] ${theme.muted} uppercase`}>Encryption</span>
            <span className={`text-[10px] ${theme.accent}`}>AES-256-GCM</span>
          </div>
          <div className="flex flex-col items-end">
            <span className={`text-[8px] ${theme.muted} uppercase`}>Connection</span>
            <span className={`text-[10px] ${theme.accent}`}>SECURE_SOCKET</span>
          </div>
          <div className="flex flex-col items-end">
            <span className={`text-[8px] ${theme.muted} uppercase`}>Latency</span>
            <span className={`text-[10px] ${theme.accent}`}>0.002ms</span>
          </div>
        </div>
        <div className={`text-[10px] font-mono ${theme.muted}`}>
          v2.5.0 // {theme.name}
        </div>
      </div>
    </div>
  );
}
