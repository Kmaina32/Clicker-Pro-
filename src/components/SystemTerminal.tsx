import React from 'react';
import { motion } from 'motion/react';
import { Terminal as TerminalIcon } from 'lucide-react';

interface SystemTerminalProps {
  logs: { id: string; message: string; type: 'info' | 'success' | 'error' | 'warning' }[];
  theme: any;
}

export const SystemTerminal: React.FC<SystemTerminalProps> = ({ logs, theme }) => {
  return (
    <div className={`p-6 border ${theme.border} ${theme.card} ${theme.radius || 'rounded-none'} space-y-4 h-full flex flex-col ${theme.glow}`}>
      <div className={`flex items-center justify-between border-b ${theme.border} pb-3`}>
        <div className="flex items-center gap-2">
          <TerminalIcon className={`w-4 h-4 ${theme.accent}`} />
          <span className={`text-xs font-semibold ${theme.muted} uppercase tracking-wider`}>System Logs</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar ${theme.font || 'font-mono'} text-[11px]`}>
        {logs.length === 0 && (
          <div className={`${theme.muted} opacity-40 py-4 italic`}>Waiting for system events...</div>
        )}
        {logs.map((log) => (
          <motion.div 
            key={log.id}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3 items-start"
          >
            <span className={`${theme.muted} opacity-40 whitespace-nowrap`}>{new Date().toLocaleTimeString([], { hour12: false })}</span>
            <span className={`font-bold uppercase tracking-tighter w-12
              ${log.type === 'success' ? 'text-emerald-500' : 
                log.type === 'error' ? 'text-rose-500' : 
                log.type === 'warning' ? 'text-amber-500' : 
                'text-indigo-500'}
            `}>
              {log.type}
            </span>
            <span className={`${theme.text} opacity-80`}>{log.message}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
