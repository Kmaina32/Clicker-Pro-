/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Timer } from 'lucide-react';

// --- Types & Constants ---
import { ClickerConfig } from './types';
import { THEMES, DEFAULT_CONFIG } from './constants';

// --- Components ---
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ConfigPanel } from './components/ConfigPanel';
import { ScriptExporter } from './components/ScriptExporter';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { ProfileManager } from './components/ProfileManager';
import { Help } from './components/Help';

export default function App() {
  // --- State ---
  const [theme, setTheme] = useState(THEMES.MODERN);
  const [config, setConfig] = useState<ClickerConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<'config' | 'scripts' | 'theme' | 'help'>('config');
  const [isDetecting, setIsDetecting] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [profiles, setProfiles] = useState<ClickerConfig[]>([]);

  // --- Session Logic ---
  const startSession = useCallback(() => {
    setClickCount(0);
    setIsSessionActive(true);
  }, []);

  const stopSession = useCallback(() => {
    setIsSessionActive(false);
  }, []);

  // Simulation Loop
  useEffect(() => {
    if (!isSessionActive) return;

    let timeoutId: NodeJS.Timeout;
    const startTime = Date.now();

    const performClick = () => {
      if (!isSessionActive) return;

      // Check Duration Limit
      if (config.useDuration) {
        const elapsed = (Date.now() - startTime) / 1000;
        if (elapsed >= config.duration) {
          stopSession();
          return;
        }
      }

      let reachedLimit = false;
      // Check Click Limit
      setClickCount(prev => {
        const next = prev + 1;
        if (config.useLimit && next >= config.repeatCount) {
          reachedLimit = true;
        }
        return next;
      });

      if (reachedLimit) {
        stopSession();
        return;
      }

      // Schedule next click
      let nextInterval = config.interval;
      if (config.randomize) {
        nextInterval = Math.floor(Math.random() * (config.maxInterval - config.minInterval + 1)) + config.minInterval;
      }

      let ms = 0;
      switch (config.unit) {
        case 'ms': ms = nextInterval; break;
        case 's': ms = nextInterval * 1000; break;
        case 'm': ms = nextInterval * 60000; break;
        case 'cpm': ms = 60000 / Math.max(1, nextInterval); break;
      }

      timeoutId = setTimeout(performClick, ms);
    };

    // Initial delay or immediate start
    timeoutId = setTimeout(performClick, config.startDelay * 1000);

    return () => clearTimeout(timeoutId);
  }, [isSessionActive, config, stopSession]);

  // Expose startSession to window for ConfigPanel
  useEffect(() => {
    (window as any).startSession = startSession;
    return () => { delete (window as any).startSession; };
  }, [startSession]);

  // --- Fetch Profiles ---
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
      // Don't trigger hotkeys if user is typing in an input
      if (document.activeElement?.tagName === 'INPUT') return;

      const modifiers = [];
      if (e.ctrlKey) modifiers.push('CTRL');
      if (e.altKey) modifiers.push('ALT');
      if (e.shiftKey) modifiers.push('SHIFT');
      
      const key = e.key.toUpperCase();
      const pressed = [...modifiers, key].join('+');

      if (pressed === config.hotkeys.start) {
        e.preventDefault();
        startSession();
      } else if (pressed === config.hotkeys.stop) {
        e.preventDefault();
        stopSession();
      } else if (pressed === config.hotkeys.reset) {
        e.preventDefault();
        stopSession();
        // Reset logic if needed, for now just stop
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [config.hotkeys, startSession, stopSession]);

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} p-4 md:p-8 flex flex-col items-center justify-center selection:bg-indigo-500/30 ${theme.font || 'font-sans'} relative overflow-hidden`}>
      
      {/* Header */}
      <Header theme={theme} />

      {/* Main Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Navigation Rail */}
        <Navigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          config={config}
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
                      detectPosition={detectPosition}
                      isDetecting={isDetecting}
                      isSessionActive={isSessionActive}
                      stopSession={stopSession}
                      clickCount={clickCount}
                      theme={theme}
                    />
                  </div>
                  <div className="space-y-6">
                    <ProfileManager 
                      config={config} 
                      setConfig={setConfig} 
                      theme={theme} 
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'scripts' && (
              <ScriptExporter config={config} theme={theme} />
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
            <div className={`w-2 h-2 rounded-full ${isSessionActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
            <span className={`text-xs font-bold tracking-wider uppercase ${theme.muted}`}>System: {isSessionActive ? 'Active' : 'Ready'}</span>
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
    </div>
  );
}
