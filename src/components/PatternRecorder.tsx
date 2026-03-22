import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Circle, Square, Play, Trash2 } from 'lucide-react';

interface ClickEvent {
  x: number;
  y: number;
  time: number;
}

interface PatternRecorderProps {
  theme: any;
}

export const PatternRecorder: React.FC<PatternRecorderProps> = ({ theme }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pattern, setPattern] = useState<ClickEvent[]>([]);
  const startTimeRef = useRef<number>(0);
  const playbackTimeoutRef = useRef<NodeJS.Timeout[]>([]);

  const startRecording = () => {
    setPattern([]);
    setIsRecording(true);
    startTimeRef.current = Date.now();
    const handleRecordClick = (e: MouseEvent) => {
      setPattern(prev => [...prev, {
        x: e.clientX,
        y: e.clientY,
        time: Date.now() - startTimeRef.current
      }]);
    };
    window.addEventListener('click', handleRecordClick);
    window.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Store for cleanup
    (window as any)._stopRecording = () => {
      window.removeEventListener('click', handleRecordClick);
      setIsRecording(false);
    };
  };

  const stopRecording = () => {
    if ((window as any)._stopRecording) (window as any)._stopRecording();
  };

  const playPattern = () => {
    if (pattern.length === 0) return;
    setIsPlaying(true);
    playbackTimeoutRef.current = pattern.map((event, index) => {
      return setTimeout(() => {
        // Visual feedback only for now in web view
        const ripple = document.createElement('div');
        ripple.className = `fixed pointer-events-none z-50 rounded-full border-2 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]`;
        ripple.style.left = `${event.x}px`;
        ripple.style.top = `${event.y}px`;
        ripple.style.width = '40px';
        ripple.style.height = '40px';
        ripple.style.marginLeft = '-20px';
        ripple.style.marginTop = '-20px';
        document.body.appendChild(ripple);
        
        ripple.animate([
          { transform: 'scale(0)', opacity: 1 },
          { transform: 'scale(2)', opacity: 0 }
        ], { duration: 500, easing: 'ease-out' }).onfinish = () => ripple.remove();

        if (index === pattern.length - 1) setIsPlaying(false);
      }, event.time);
    });
  };

  const stopPlayback = () => {
    playbackTimeoutRef.current.forEach(clearTimeout);
    setIsPlaying(false);
  };

  return (
    <div className={`p-6 border ${theme.border} ${theme.card} ${theme.radius || 'rounded-none'} space-y-6 ${theme.glow}`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-bold ${theme.muted} uppercase tracking-widest`}>Pattern Recorder</span>
        <div className="flex gap-2">
          {pattern.length > 0 && (
            <button 
              onClick={() => setPattern([])} 
              className={`p-2 border ${theme.border} ${theme.radius || 'rounded-none'} ${theme.muted} hover:text-rose-500 transition-colors`}
              title="Clear Pattern"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`flex-1 p-4 border ${theme.border} ${theme.radius || 'rounded-none'} flex items-center justify-center gap-3 font-bold uppercase tracking-widest transition-all shadow-sm
            ${isRecording ? 'bg-rose-500/10 text-rose-500 border-rose-500/50' : `${theme.accent} hover:opacity-90`}
          `}
        >
          {isRecording ? <Square className="w-4 h-4 fill-current" /> : <Circle className="w-4 h-4 fill-current" />}
          {isRecording ? 'Stop' : 'Record'}
        </button>

        <button
          onClick={isPlaying ? stopPlayback : playPattern}
          disabled={pattern.length === 0 || isRecording}
          className={`flex-1 p-4 border ${theme.border} ${theme.radius || 'rounded-none'} flex items-center justify-center gap-3 font-bold uppercase tracking-widest transition-all shadow-sm
            ${isPlaying ? 'bg-amber-500/10 text-amber-500 border-amber-500/50' : `${theme.accent} hover:opacity-90 disabled:opacity-20`}
          `}
        >
          {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          {isPlaying ? 'Stop' : 'Play'}
        </button>
      </div>

      <div className={`p-4 border ${theme.border} ${theme.bg} ${theme.radius || 'rounded-none'} text-[11px] ${theme.muted} ${theme.font || 'font-mono'}`}>
        <div className="flex justify-between mb-3 pb-2 border-b border-slate-200">
          <span className="font-bold uppercase tracking-widest text-[10px]">Sequence Data</span>
          <span className={`${theme.accent} font-bold`}>{pattern.length} Events</span>
        </div>
        <div className="h-28 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {pattern.map((e, i) => (
            <div key={i} className="flex justify-between opacity-60 hover:opacity-100 transition-opacity">
              <span className="font-bold">EVENT_{i.toString().padStart(3, '0')}</span>
              <span className="font-medium">X:{e.x} Y:{e.y} T:{e.time}ms</span>
            </div>
          ))}
          {pattern.length === 0 && <div className="text-center py-6 opacity-30 italic">No data recorded</div>}
        </div>
      </div>
    </div>
  );
};
