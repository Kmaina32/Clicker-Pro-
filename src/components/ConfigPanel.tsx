import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MousePointer2, Keyboard } from 'lucide-react';
import { ClickerConfig, ClickType, IntervalUnit } from '../types';

interface ConfigPanelProps {
  config: ClickerConfig;
  setConfig: (config: ClickerConfig) => void;
  detectPosition: () => void;
  isDetecting: boolean;
  isSessionActive: boolean;
  theme: any;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  config, setConfig, detectPosition, isDetecting, isSessionActive, theme
}) => {
  const [recordingKey, setRecordingKey] = useState<'start' | 'stop' | 'reset' | null>(null);

  useEffect(() => {
    if (!recordingKey) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      let key = e.key.toUpperCase();
      if (key === 'CONTROL') return;
      if (key === 'ALT') return;
      if (key === 'SHIFT') return;
      if (key === 'META') return;

      const modifiers = [];
      if (e.ctrlKey) modifiers.push('CTRL');
      if (e.altKey) modifiers.push('ALT');
      if (e.shiftKey) modifiers.push('SHIFT');
      
      const finalKey = [...modifiers, key].join('+');

      setConfig({
        ...config,
        hotkeys: {
          ...config.hotkeys,
          [recordingKey]: finalKey
        }
      });
      setRecordingKey(null);
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [recordingKey, config, setConfig]);

  return (
    <motion.div
      key="config"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold uppercase italic tracking-tight">Main Controller</h2>
        <div className={`px-3 py-1 rounded-none border ${theme.border} text-[10px] ${theme.mono} ${isSessionActive ? 'text-emerald-500 border-emerald-500/50 animate-pulse' : theme.muted}`}>
          STATUS: {isSessionActive ? 'ACTIVE' : 'READY'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Interval Setting */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className={`text-[10px] uppercase tracking-[0.2em] ${theme.muted} font-bold`}>
              {config.unit === 'cpm' ? 'Clicks Per Minute' : 'Click Interval'}
            </label>
            <button 
              onClick={() => setConfig({ ...config, randomize: !config.randomize })}
              className={`text-[10px] font-bold uppercase transition-colors ${config.randomize ? theme.accent : theme.muted}`}
            >
              {config.randomize ? '[ Randomized ]' : '[ Fixed ]'}
            </button>
          </div>
          
          {config.randomize ? (
            <div className="flex items-center gap-2">
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white/20">{config.unit === 'cpm' ? 'MIN CPM' : 'MIN'}</span>
                <input 
                  type="number" 
                  value={config.minInterval}
                  onChange={(e) => setConfig({ ...config, minInterval: parseInt(e.target.value) || 0 })}
                  className={`w-full ${theme.bg} border ${theme.border} rounded-none p-4 pl-16 ${theme.mono} focus:outline-none focus:border-[#00FF41]/50 transition-colors`}
                />
              </div>
              <span className={theme.muted}>-</span>
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white/20">{config.unit === 'cpm' ? 'MAX CPM' : 'MAX'}</span>
                <input 
                  type="number" 
                  value={config.maxInterval}
                  onChange={(e) => setConfig({ ...config, maxInterval: parseInt(e.target.value) || 0 })}
                  className={`w-full ${theme.bg} border ${theme.border} rounded-none p-4 pl-16 ${theme.mono} focus:outline-none focus:border-[#00FF41]/50 transition-colors`}
                />
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <input 
                type="number" 
                value={config.interval}
                onChange={(e) => setConfig({ ...config, interval: parseInt(e.target.value) || 0 })}
                className={`w-full ${theme.bg} border ${theme.border} rounded-none p-4 ${theme.mono} focus:outline-none focus:border-[#00FF41]/50 transition-colors`}
              />
              <select 
                value={config.unit}
                onChange={(e) => setConfig({ ...config, unit: e.target.value as IntervalUnit })}
                className={`${theme.bg} border ${theme.border} rounded-none px-4 ${theme.mono} text-xs focus:outline-none`}
              >
                <option value="ms">MS</option>
                <option value="s">SEC</option>
                <option value="m">MIN</option>
                <option value="cpm">CPM</option>
              </select>
            </div>
          )}
        </div>

        {/* Click Type */}
        <div className="space-y-3">
          <label className={`text-sm font-semibold ${theme.text}`}>Trigger Type</label>
          <div className="grid grid-cols-3 gap-2">
            {(['left', 'right', 'double'] as ClickType[]).map((type) => (
              <button
                key={type}
                onClick={() => setConfig({ ...config, clickType: type })}
                className={`p-3 ${theme.radius || 'rounded-none'} border text-xs font-medium capitalize transition-all
                  ${config.clickType === type ? `${theme.accentBg} text-white border-transparent shadow-sm` : `${theme.border} ${theme.muted} hover:bg-white/50`}
                `}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Randomization (Jitter) */}
      <div className="space-y-3">
        <label className={`text-sm font-semibold ${theme.text}`}>Advanced Jitter (X/Y Pixel Offset)</label>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">X_OFFSET</span>
            <input 
              type="number" 
              value={config.jitterX}
              onChange={(e) => setConfig({ ...config, jitterX: parseInt(e.target.value) || 0 })}
              className={`w-full ${theme.bg} border ${theme.border} ${theme.radius || 'rounded-none'} p-3 pl-20 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all`}
            />
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">Y_OFFSET</span>
            <input 
              type="number" 
              value={config.jitterY}
              onChange={(e) => setConfig({ ...config, jitterY: parseInt(e.target.value) || 0 })}
              className={`w-full ${theme.bg} border ${theme.border} ${theme.radius || 'rounded-none'} p-3 pl-20 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all`}
            />
          </div>
        </div>
      </div>

      {/* Targeting System */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className={`text-sm font-semibold ${theme.text}`}>Targeting System</label>
          <div className="flex gap-4">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                detectPosition();
              }}
              className={`text-xs font-medium transition-colors ${isDetecting ? theme.accent : theme.muted} hover:opacity-80`}
            >
              {isDetecting ? 'Detecting...' : 'Auto Detect'}
            </button>
            <button 
              onClick={() => setConfig({ ...config, useCoordinates: !config.useCoordinates })}
              className={`text-xs font-medium transition-colors ${config.useCoordinates ? theme.accent : theme.muted} hover:opacity-80`}
            >
              {config.useCoordinates ? 'Custom Position' : 'Mouse Position'}
            </button>
          </div>
        </div>
        {config.useCoordinates && (
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">X_AXIS</span>
              <input 
                type="number" 
                value={config.x}
                onChange={(e) => setConfig({ ...config, x: parseInt(e.target.value) || 0 })}
                className={`w-full ${theme.bg} border ${theme.border} ${theme.radius || 'rounded-none'} p-3 pl-16 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all`}
              />
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">Y_AXIS</span>
              <input 
                type="number" 
                value={config.y}
                onChange={(e) => setConfig({ ...config, y: parseInt(e.target.value) || 0 })}
                className={`w-full ${theme.bg} border ${theme.border} ${theme.radius || 'rounded-none'} p-3 pl-16 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all`}
              />
            </div>
          </div>
        )}
        {isDetecting && (
          <p className="text-[10px] text-yellow-500 animate-pulse">Move mouse to target and CLICK to lock coordinates.</p>
        )}
        
        {config.useCoordinates && !isDetecting && !isSessionActive && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => (window as any).startSession?.()}
            className={`w-full mt-4 py-4 border-2 ${theme.accent === 'text-[#00FF41]' ? 'border-[#00FF41] text-[#00FF41]' : 'border-indigo-600 text-indigo-600'} ${theme.radius || 'rounded-none'} text-sm font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all shadow-[0_0_20px_rgba(0,0,0,0.2)]`}
          >
            Start Session
          </motion.button>
        )}
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setConfig({ ...config, soundEnabled: !config.soundEnabled })}
          className={`p-4 border ${theme.border} text-[10px] font-bold uppercase transition-all
            ${config.soundEnabled ? theme.accent : theme.muted}
          `}
        >
          {config.soundEnabled ? '[ SOUND_ON ]' : '[ SOUND_OFF ]'}
        </button>
        <button 
          onClick={() => setConfig({ ...config, rippleEnabled: !config.rippleEnabled })}
          className={`p-4 border ${theme.border} text-[10px] font-bold uppercase transition-all
            ${config.rippleEnabled ? theme.accent : theme.muted}
          `}
        >
          {config.rippleEnabled ? '[ RIPPLE_ON ]' : '[ RIPPLE_OFF ]'}
        </button>
      </div>

      {/* Stop Modes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className={`text-[10px] uppercase tracking-[0.2em] ${theme.muted} font-bold`}>Click Limit</label>
            <button 
              onClick={() => setConfig({ ...config, useLimit: !config.useLimit })}
              className={`text-[10px] font-bold uppercase transition-colors ${config.useLimit ? theme.accent : theme.muted}`}
            >
              {config.useLimit ? '[ ENABLED ]' : '[ DISABLED ]'}
            </button>
          </div>
          {config.useLimit && (
            <input 
              type="number" 
              value={config.repeatCount}
              onChange={(e) => setConfig({ ...config, repeatCount: parseInt(e.target.value) || 0 })}
              className={`w-full ${theme.bg} border ${theme.border} rounded-none p-4 ${theme.mono} focus:outline-none focus:border-[#00FF41]/50`}
            />
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className={`text-[10px] uppercase tracking-[0.2em] ${theme.muted} font-bold`}>Duration Limit</label>
            <button 
              onClick={() => setConfig({ ...config, useDuration: !config.useDuration })}
              className={`text-[10px] font-bold uppercase transition-colors ${config.useDuration ? theme.accent : theme.muted}`}
            >
              {config.useDuration ? '[ ENABLED ]' : '[ DISABLED ]'}
            </button>
          </div>
          {config.useDuration && (
            <div className="relative">
              <input 
                type="number" 
                value={config.duration}
                onChange={(e) => setConfig({ ...config, duration: parseInt(e.target.value) || 0 })}
                className={`w-full ${theme.bg} border ${theme.border} rounded-none p-4 pr-16 ${theme.mono} focus:outline-none focus:border-[#00FF41]/50`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white/20">SECONDS</span>
            </div>
          )}
        </div>
      </div>

      {/* Hotkey Manager */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Keyboard className={`w-4 h-4 ${theme.accent}`} />
          <label className={`text-sm font-semibold ${theme.text}`}>Hotkey Manager</label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['start', 'stop', 'reset'] as const).map((action) => (
            <div key={action} className="space-y-2">
              <span className={`text-[10px] font-bold ${theme.muted} uppercase tracking-widest`}>{action}</span>
              <button
                onClick={() => setRecordingKey(action)}
                className={`w-full p-3 border ${theme.border} ${theme.radius || 'rounded-none'} ${theme.bg} text-xs font-mono transition-all hover:border-indigo-500/50
                  ${recordingKey === action ? 'ring-2 ring-indigo-500/30 border-indigo-500 animate-pulse' : ''}
                `}
              >
                {recordingKey === action ? 'Press Key...' : config.hotkeys[action]}
              </button>
            </div>
          ))}
        </div>
        <p className={`text-[10px] ${theme.muted} italic`}>
          Click a button to record a new hotkey. Supports modifiers (Ctrl, Alt, Shift).
        </p>
      </div>

    </motion.div>
  );
};
