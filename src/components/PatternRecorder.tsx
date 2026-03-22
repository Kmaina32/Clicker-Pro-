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
        ripple.className = 'fixed pointer-events-none z-50 rounded-full border-2 border-[#00FF41] shadow-[0_0_15px_#00FF41]';
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
    <div className={`p-6 border ${theme.border} bg-white/5 space-y-6`}>
      <div className="flex items-center justify-between">
        <span className={`text-[10px] ${theme.muted} uppercase block tracking-widest`}>Pattern_Recorder</span>
        <div className="flex gap-2">
          {pattern.length > 0 && (
            <button 
              onClick={() => setPattern([])} 
              className={`p-2 border ${theme.border} ${theme.muted} hover:text-red-500`}
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
          className={`flex-1 p-4 border ${theme.border} flex items-center justify-center gap-3 font-bold uppercase tracking-widest transition-all
            ${isRecording ? 'bg-red-500/10 text-red-500 border-red-500/50' : `${theme.accent} hover:bg-white/5`}
          `}
        >
          {isRecording ? <Square className="w-4 h-4 fill-current" /> : <Circle className="w-4 h-4 fill-current" />}
          {isRecording ? 'STOP_RECORD' : 'START_RECORD'}
        </button>

        <button
          onClick={isPlaying ? stopPlayback : playPattern}
          disabled={pattern.length === 0 || isRecording}
          className={`flex-1 p-4 border ${theme.border} flex items-center justify-center gap-3 font-bold uppercase tracking-widest transition-all
            ${isPlaying ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50' : `${theme.accent} hover:bg-white/5 disabled:opacity-20`}
          `}
        >
          {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          {isPlaying ? 'STOP_PLAYBACK' : 'PLAY_PATTERN'}
        </button>
      </div>

      <div className={`p-4 border ${theme.border} bg-black/20 text-[10px] ${theme.muted} ${theme.mono}`}>
        <div className="flex justify-between mb-2">
          <span>SEQUENCE_DATA:</span>
          <span className={theme.accent}>{pattern.length} EVENTS</span>
        </div>
        <div className="h-24 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
          {pattern.map((e, i) => (
            <div key={i} className="flex justify-between opacity-50">
              <span>EVENT_{i.toString().padStart(3, '0')}</span>
              <span>X:{e.x} Y:{e.y} T:{e.time}ms</span>
            </div>
          ))}
          {pattern.length === 0 && <div className="text-center py-4 opacity-20">NO_DATA_RECORDED</div>}
        </div>
      </div>
    </div>
  );
};
