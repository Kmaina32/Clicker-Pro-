import React from 'react';
import { motion } from 'motion/react';
import { Play, Square, MousePointer2 } from 'lucide-react';
import { ClickerConfig, ClickType, IntervalUnit } from '../types';

interface ConfigPanelProps {
  config: ClickerConfig;
  setConfig: (config: ClickerConfig) => void;
  isRunning: boolean;
  isCountingDown: boolean;
  countdown: number;
  clicksCount: number;
  startSimulation: () => void;
  stopSimulation: () => void;
  detectPosition: () => void;
  isDetecting: boolean;
  theme: any;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  config, setConfig, isRunning, isCountingDown, countdown, clicksCount,
  startSimulation, stopSimulation, detectPosition, isDetecting, theme
}) => {
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
        <div className={`px-3 py-1 rounded-none border ${theme.border} text-[10px] ${theme.mono} ${theme.muted}`}>
          STATUS: {isRunning ? 'ACTIVE' : isCountingDown ? 'COUNTDOWN' : 'IDLE'}
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

      {/* Control Buttons */}
      <div className="pt-6 flex flex-col md:flex-row gap-4">
        <button
          onClick={() => isRunning || isCountingDown ? stopSimulation() : startSimulation()}
          className={`flex-1 p-4 ${theme.radius || 'rounded-none'} flex items-center justify-center gap-3 font-semibold transition-all border
            ${isRunning || isCountingDown
              ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
              : `bg-indigo-600 border-indigo-700 text-white hover:bg-indigo-700 shadow-md active:shadow-sm active:translate-y-0.5`
            }
          `}
        >
          {isCountingDown ? (
            <span className="text-xl font-bold animate-pulse">{countdown}</span>
          ) : (
            <>
              {isRunning ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              {isRunning ? 'Stop Simulation' : 'Start Simulation'}
            </>
          )}
        </button>
        
        <div className={`flex flex-col justify-center px-6 py-3 ${theme.radius || 'rounded-none'} border ${theme.border} ${theme.card} ${theme.glow}`}>
          <div className="flex items-center justify-between gap-6">
            <div>
              <span className={`text-[10px] ${theme.muted} uppercase font-bold tracking-wider block`}>Total Clicks</span>
              <span className={`text-xl font-bold ${theme.text}`}>{clicksCount.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <span className={`text-[10px] ${theme.muted} uppercase font-bold tracking-wider block`}>Realtime CPM</span>
              <span className={`text-xl font-bold ${theme.accent}`}>
                {isRunning ? (config.unit === 'cpm' ? config.interval : Math.round(60000 / (config.unit === 'ms' ? config.interval : config.unit === 's' ? config.interval * 1000 : config.interval * 60000))) : 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Monitor */}
      <div className={`p-4 border ${theme.border} ${theme.radius || 'rounded-none'} ${theme.card} grid grid-cols-2 md:grid-cols-4 gap-4 ${theme.glow}`}>
        <div className="flex flex-col">
          <span className={`text-[9px] ${theme.muted} uppercase font-bold tracking-wider`}>CPU Load</span>
          <span className={`text-xs font-semibold ${theme.text}`}>{(Math.random() * 5 + 2).toFixed(1)}%</span>
        </div>
        <div className="flex flex-col">
          <span className={`text-[9px] ${theme.muted} uppercase font-bold tracking-wider`}>Memory</span>
          <span className={`text-xs font-semibold ${theme.text}`}>{(Math.random() * 20 + 40).toFixed(1)}MB</span>
        </div>
        <div className="flex flex-col">
          <span className={`text-[9px] ${theme.muted} uppercase font-bold tracking-wider`}>Thread ID</span>
          <span className={`text-xs font-semibold ${theme.text}`}>0x{Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase()}</span>
        </div>
        <div className="flex flex-col">
          <span className={`text-[9px] ${theme.muted} uppercase font-bold tracking-wider`}>Latency</span>
          <span className={`text-xs font-semibold ${theme.text}`}>{(Math.random() * 0.5 + 0.1).toFixed(3)}ms</span>
        </div>
      </div>
    </motion.div>
  );
};
