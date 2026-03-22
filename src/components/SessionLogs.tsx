import React from 'react';
import { motion } from 'motion/react';
import { SessionLog } from '../types';

interface SessionLogsProps {
  logs: SessionLog[];
  theme: any;
}

export const SessionLogs: React.FC<SessionLogsProps> = ({ logs, theme }) => {
  return (
    <motion.div
      key="history"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold uppercase italic tracking-tight">Session History</h2>
        <div className={`px-3 py-1 rounded-none border ${theme.border} text-[10px] ${theme.mono} ${theme.muted}`}>
          TOTAL_LOGS: {logs.length}
        </div>
      </div>

      <div className="space-y-2">
        {logs.length === 0 ? (
          <div className={`p-12 border border-dashed ${theme.border} text-center ${theme.muted} text-[10px] uppercase tracking-widest`}>
            NO_SESSION_DATA_AVAILABLE
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className={`p-4 border ${theme.border} bg-white/5 flex items-center justify-between group hover:border-[#00FF41]/30 transition-all`}>
              <div className="flex items-center gap-6">
                <div className="text-left">
                  <span className={`text-[10px] ${theme.muted} uppercase block`}>TIMESTAMP</span>
                  <span className="text-xs font-bold">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="text-left">
                  <span className={`text-[10px] ${theme.muted} uppercase block`}>PROCESS_NAME</span>
                  <span className={`text-xs font-bold ${theme.accent}`}>{log.configName}</span>
                </div>
              </div>
              <div className="flex items-center gap-12">
                <div className="text-right">
                  <span className={`text-[10px] ${theme.muted} uppercase block`}>CLICKS</span>
                  <span className="text-xs font-bold">{log.clicks.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] ${theme.muted} uppercase block`}>DURATION</span>
                  <span className="text-xs font-bold">{log.duration}s</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};
