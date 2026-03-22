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
        <h2 className={`text-2xl font-bold tracking-tight ${theme.text}`}>Session History</h2>
        <div className={`px-3 py-1 ${theme.radius || 'rounded-none'} border ${theme.border} text-[10px] font-bold ${theme.muted} uppercase tracking-wider`}>
          Total Logs: {logs.length}
        </div>
      </div>

      <div className="space-y-3">
        {logs.length === 0 ? (
          <div className={`p-12 border border-dashed ${theme.border} ${theme.radius || 'rounded-none'} text-center ${theme.muted} text-sm font-medium`}>
            No session data available
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className={`p-4 border ${theme.border} ${theme.card} ${theme.radius || 'rounded-none'} flex items-center justify-between group hover:border-indigo-500/30 transition-all ${theme.glow}`}>
              <div className="flex items-center gap-8">
                <div className="text-left">
                  <span className={`text-[10px] ${theme.muted} uppercase font-bold tracking-wider block mb-1`}>Timestamp</span>
                  <span className={`text-sm font-semibold ${theme.text}`}>{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="text-left">
                  <span className={`text-[10px] ${theme.muted} uppercase font-bold tracking-wider block mb-1`}>Process</span>
                  <span className={`text-sm font-bold ${theme.accent}`}>{log.configName}</span>
                </div>
              </div>
              <div className="flex items-center gap-12">
                <div className="text-right">
                  <span className={`text-[10px] ${theme.muted} uppercase font-bold tracking-wider block mb-1`}>Clicks</span>
                  <span className={`text-sm font-bold ${theme.text}`}>{log.clicks.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] ${theme.muted} uppercase font-bold tracking-wider block mb-1`}>Duration</span>
                  <span className={`text-sm font-bold ${theme.text}`}>{log.duration}s</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};
