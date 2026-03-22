import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Save, Trash2, Download, Upload } from 'lucide-react';
import { ClickerConfig } from '../types';

interface ProfileManagerProps {
  config: ClickerConfig;
  setConfig: (config: ClickerConfig) => void;
  theme: any;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({ config, setConfig, theme }) => {
  const [profiles, setProfiles] = useState<ClickerConfig[]>(() => {
    const saved = localStorage.getItem('clicker_profiles');
    return saved ? JSON.parse(saved) : [];
  });
  const [newProfileName, setNewProfileName] = useState('');

  const saveProfile = () => {
    if (!newProfileName.trim()) return;
    const newProfile = { ...config, id: Date.now().toString(), name: newProfileName };
    const updated = [...profiles, newProfile];
    setProfiles(updated);
    localStorage.setItem('clicker_profiles', JSON.stringify(updated));
    setNewProfileName('');
  };

  const deleteProfile = (id: string) => {
    const updated = profiles.filter(p => p.id !== id);
    setProfiles(updated);
    localStorage.setItem('clicker_profiles', JSON.stringify(updated));
  };

  const loadProfile = (profile: ClickerConfig) => {
    setConfig(profile);
  };

  const exportAll = () => {
    const blob = new Blob([JSON.stringify(profiles)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clicker_profiles.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importProfiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        const updated = [...profiles, ...imported];
        setProfiles(updated);
        localStorage.setItem('clicker_profiles', JSON.stringify(updated));
      } catch (err) {
        alert('INVALID_JSON_FILE');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className={`p-6 border ${theme.border} bg-white/5 space-y-6`}>
      <div className="flex items-center justify-between">
        <span className={`text-[10px] ${theme.muted} uppercase block tracking-widest`}>Profile_Manager</span>
        <div className="flex gap-2">
          <button onClick={exportAll} className={`p-2 border ${theme.border} ${theme.muted} hover:text-white`} title="Export All">
            <Download className="w-4 h-4" />
          </button>
          <label className={`p-2 border ${theme.border} ${theme.muted} hover:text-white cursor-pointer`} title="Import Profiles">
            <Upload className="w-4 h-4" />
            <input type="file" className="hidden" onChange={importProfiles} accept=".json" />
          </label>
        </div>
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          value={newProfileName}
          onChange={(e) => setNewProfileName(e.target.value)}
          placeholder="NEW_PROFILE_NAME"
          className={`flex-1 ${theme.bg} border ${theme.border} rounded-none p-4 text-[10px] ${theme.mono} focus:outline-none focus:border-[#00FF41]/50`}
        />
        <button 
          onClick={saveProfile}
          className={`px-6 border ${theme.border} ${theme.accent} text-[10px] font-bold uppercase hover:bg-white/5 transition-all`}
        >
          <Save className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {profiles.map((p) => (
          <div key={p.id} className={`p-3 border ${theme.border} bg-black/20 flex items-center justify-between group`}>
            <button 
              onClick={() => loadProfile(p)}
              className="flex-1 text-left text-[10px] font-bold uppercase tracking-widest hover:text-[#00FF41] transition-colors"
            >
              {p.name}
            </button>
            <button 
              onClick={() => deleteProfile(p.id!)}
              className={`p-1 opacity-0 group-hover:opacity-100 ${theme.muted} hover:text-red-500 transition-all`}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
