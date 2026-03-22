import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, ShieldCheck, Terminal, MousePointer2 } from 'lucide-react';

interface HelpProps {
  theme: any;
}

export const Help: React.FC<HelpProps> = ({ theme }) => {
  const sops = [
    {
      title: "1. Configuration Protocol",
      icon: MousePointer2,
      steps: [
        "Select Click Type (Left, Right, or Double).",
        "Define Interval and Unit (ms, s, m, or CPM).",
        "Set Repeat Count or Duration limit if necessary.",
        "Enable 'Use Coordinates' and use 'Auto Detect' to lock target position.",
        "Adjust Jitter (X/Y) to define interaction variance."
      ]
    },
    {
      title: "2. Profile Management",
      icon: BookOpen,
      steps: [
        "Save your configurations as named Profiles for quick access.",
        "Use the Profile Manager to switch between different automation patterns.",
        "Export your profiles as JSON for backup or sharing.",
        "Import existing profile sets to quickly populate your workspace."
      ]
    },
    {
      title: "3. Script Exporting",
      icon: Terminal,
      steps: [
        "Configure your desired clicker settings in the 'Configuration' tab.",
        "Navigate to 'Export Scripts'.",
        "Review the generated Python (pyautogui) code.",
        "Click 'Copy to Clipboard' and save as a .py file on your local machine.",
        "Run with 'python script_name.py' for native OS automation."
      ]
    },
    {
      title: "4. Security & Safety",
      icon: ShieldCheck,
      steps: [
        "Use 'Randomize Interval' to avoid detection in sensitive environments.",
        "Keep jitter settings above 5px for more natural movement simulation.",
        "All profiles are stored securely on the local backend (data.json).",
        "Verify your target coordinates before running exported scripts."
      ]
    }
  ];

  return (
    <motion.div
      key="help"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold tracking-tight ${theme.text}`}>Standard Operating Procedures (SOP)</h2>
        <div className={`px-3 py-1 ${theme.radius || 'rounded-none'} border ${theme.border} text-[10px] font-bold ${theme.muted} uppercase tracking-wider`}>
          Documentation v2.5
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sops.map((sop, idx) => (
          <div key={idx} className={`p-6 border ${theme.border} ${theme.card} ${theme.radius || 'rounded-none'} ${theme.glow} space-y-4`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 ${theme.bg} ${theme.radius || 'rounded-none'} border ${theme.border}`}>
                <sop.icon className={`w-5 h-5 ${theme.accent}`} />
              </div>
              <h3 className={`text-sm font-bold ${theme.text} uppercase tracking-wider`}>{sop.title}</h3>
            </div>
            <ul className="space-y-3">
              {sop.steps.map((step, sIdx) => (
                <li key={sIdx} className="flex gap-3">
                  <span className={`text-[10px] font-bold ${theme.muted} mt-1`}>0{sIdx + 1}</span>
                  <p className={`text-xs leading-relaxed ${theme.text} opacity-80`}>{step}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={`p-8 border ${theme.border} ${theme.bg} ${theme.radius || 'rounded-none'} text-center space-y-4`}>
        <BookOpen className={`w-8 h-8 mx-auto ${theme.muted}`} />
        <p className={`text-sm ${theme.muted} max-w-lg mx-auto italic`}>
          "Automation is not just about speed; it's about precision, consistency, and reliability. Follow these procedures to maximize the efficiency of your Clicker Pro environment."
        </p>
      </div>
    </motion.div>
  );
};
