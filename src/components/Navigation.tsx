import React from 'react';
import { motion } from 'motion/react';
import { Settings2, Code2, ChevronRight, Palette, HelpCircle } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  theme: any;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, theme }) => {
  const tabs = [
    { id: 'config', label: 'Configuration', icon: Settings2 },
    { id: 'scripts', label: 'Export Scripts', icon: Code2 },
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
    </div>
  );
};
