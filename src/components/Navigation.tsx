import React from 'react';
import { motion } from 'motion/react';
import { Settings2, Code2, Zap, ChevronRight, History, Palette, Calendar, HelpCircle } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  theme: any;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, theme }) => {
  const tabs = [
    { id: 'config', label: 'Configuration', icon: Settings2 },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'scripts', label: 'Export Scripts', icon: Code2 },
    { id: 'test', label: 'CPS Tester', icon: Zap },
    { id: 'history', label: 'Session Logs', icon: History },
    { id: 'theme', label: 'Skins', icon: Palette },
    { id: 'help', label: 'SOP / Help', icon: HelpCircle },
  ];

  return (
    <div className="lg:col-span-3 flex lg:flex-col gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          className={`flex items-center gap-3 p-4 ${theme.radius || 'rounded-none'} transition-all duration-200 text-left group border
            ${activeTab === tab.id 
              ? `${theme.card} ${theme.border} ${theme.accent} shadow-sm` 
              : `${theme.muted} border-transparent hover:bg-white/50 hover:border-slate-200`}
          `}
        >
          <tab.icon className="w-5 h-5" />
          <span className="text-sm font-medium">{tab.label}</span>
          {activeTab === tab.id && (
            <motion.div layoutId="active-indicator" className="ml-auto">
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          )}
        </button>
      ))}

      {/* Hotkey Info */}
      <div className={`mt-auto p-4 ${theme.radius || 'rounded-none'} border ${theme.border} ${theme.card} hidden lg:block ${theme.glow}`}>
        <span className={`text-xs font-semibold ${theme.muted} uppercase tracking-wider block mb-3`}>Hotkeys</span>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className={theme.muted}>Start/Stop</span>
            <kbd className={`px-1.5 py-0.5 rounded border ${theme.border} bg-slate-50 font-sans text-[10px]`}>Ctrl+Alt+P</kbd>
          </div>
          <div className="flex justify-between text-xs">
            <span className={theme.muted}>Reset</span>
            <kbd className={`px-1.5 py-0.5 rounded border ${theme.border} bg-slate-50 font-sans text-[10px]`}>Ctrl+Alt+R</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};
