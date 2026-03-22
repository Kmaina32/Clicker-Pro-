import React from 'react';
import { motion } from 'motion/react';
import { Settings2, Code2, Zap, ChevronRight, History, Palette } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  theme: any;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, theme }) => {
  const tabs = [
    { id: 'config', label: 'Configuration', icon: Settings2 },
    { id: 'scripts', label: 'Export Scripts', icon: Code2 },
    { id: 'test', label: 'CPS Tester', icon: Zap },
    { id: 'history', label: 'Session Logs', icon: History },
    { id: 'theme', label: 'Skins', icon: Palette },
  ];

  return (
    <div className="lg:col-span-3 flex lg:flex-col gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          className={`flex items-center gap-3 p-4 rounded-none transition-all duration-200 text-left group border
            ${activeTab === tab.id 
              ? `${theme.card} ${theme.border} ${theme.accent} border-current` 
              : `${theme.muted} border-transparent hover:text-white hover:border-white/10`}
          `}
        >
          <tab.icon className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">{tab.label}</span>
          {activeTab === tab.id && (
            <motion.div layoutId="active-indicator" className="ml-auto">
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          )}
        </button>
      ))}

      {/* Hotkey Info */}
      <div className={`mt-auto p-4 rounded-none border ${theme.border} bg-white/5 hidden lg:block`}>
        <span className={`text-[10px] font-bold ${theme.muted} uppercase block mb-2`}>Hotkeys</span>
        <div className="space-y-2">
          <div className="flex justify-between text-[10px]">
            <span className={theme.muted}>Start/Stop</span>
            <span className={theme.accent}>^⌥P</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className={theme.muted}>Reset</span>
            <span className={theme.accent}>^⌥R</span>
          </div>
        </div>
      </div>
    </div>
  );
};
