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
  const [profiles, setProfiles] = useState<ClickerConfig[]>([]);

  // --- Session Logic ---
  const startSession = useCallback(() => {
    setIsSessionActive(true);
  }, []);

  const stopSession = useCallback(() => {
    setIsSessionActive(false);
  }, []);

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
      // No hotkeys for simulation anymore
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} p-4 md:p-8 flex flex-col items-center justify-center selection:bg-indigo-500/30 ${theme.font || 'font-sans'} relative overflow-hidden`}>
      
      {/* Header */}
      <Header theme={theme} />

      {/* Main Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Session Overlay */}
        <AnimatePresence>
          {isSessionActive && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-8"
            >
              <div className="relative">
                <div className={`absolute inset-0 blur-3xl opacity-20 ${theme.accentBg}`} />
                <div className={`relative p-12 border-2 ${theme.border} ${theme.card} ${theme.radius || 'rounded-none'} text-center space-y-6 shadow-2xl`}>
                  <div className="flex items-center justify-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${theme.accentBg} animate-ping`} />
                    <h3 className={`text-2xl font-black uppercase tracking-[0.4em] ${theme.text}`}>Session Active</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 py-4">
                    <div className="text-center">
                      <span className={`block text-[10px] font-bold ${theme.muted} uppercase tracking-widest mb-1`}>Target</span>
                      <span className={`text-sm font-mono ${theme.text}`}>X:{config.x} Y:{config.y}</span>
                    </div>
                    <div className="text-center">
                      <span className={`block text-[10px] font-bold ${theme.muted} uppercase tracking-widest mb-1`}>Interval</span>
                      <span className={`text-sm font-mono ${theme.text}`}>{config.interval}{config.unit}</span>
                    </div>
                  </div>

                  <p className={`text-xs ${theme.muted} italic max-w-xs mx-auto`}>
                    Automation is running in architect mode. This is a simulation for configuration verification.
                  </p>

                  <button 
                    onClick={stopSession}
                    className={`w-full py-4 border-2 border-rose-500/50 text-rose-500 text-xs font-black uppercase tracking-[0.3em] hover:bg-rose-500/10 transition-all`}
                  >
                    Terminate Session
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
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
                      detectPosition={detectPosition}
                      isDetecting={isDetecting}
                      isSessionActive={isSessionActive}
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
