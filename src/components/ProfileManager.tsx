import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, Trash2, Download, Upload } from 'lucide-react';
import { ClickerConfig } from '../types';

interface ProfileManagerProps {
  config: ClickerConfig;
  setConfig: (config: ClickerConfig) => void;
  theme: any;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({ config, setConfig, theme }) => {
  const [profiles, setProfiles] = useState<ClickerConfig[]>([]);
  const [newProfileName, setNewProfileName] = useState('');

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const res = await fetch('/api/profiles');
      if (res.ok) {
        const data = await res.json();
        setProfiles(data);
      }
    } catch (err) {
      console.error('Failed to fetch profiles:', err);
    }
  };

  const saveProfile = async () => {
    if (!newProfileName.trim()) return;
    const newProfile = { ...config, id: Date.now().toString(), name: newProfileName };
    
    try {
      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProfile),
      });
      if (res.ok) {
        setProfiles(prev => [...prev, newProfile]);
        setNewProfileName('');
      }
    } catch (err) {
      console.error('Failed to save profile:', err);
    }
  };

  const deleteProfile = async (id: string) => {
    try {
      const res = await fetch(`/api/profiles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProfiles(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete profile:', err);
    }
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
    reader.onload = async (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          for (const profile of imported) {
            await fetch('/api/profiles', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(profile),
            });
          }
          fetchProfiles();
        }
      } catch (err) {
        console.error('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className={`p-6 border ${theme.border} ${theme.card} ${theme.radius || 'rounded-none'} space-y-6 ${theme.glow}`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-bold ${theme.muted} uppercase tracking-widest`}>Profile Manager</span>
        <div className="flex gap-2">
          <button onClick={exportAll} className={`p-2 border ${theme.border} ${theme.radius || 'rounded-none'} ${theme.muted} hover:text-indigo-600 transition-colors`} title="Export All">
            <Download className="w-4 h-4" />
          </button>
          <label className={`p-2 border ${theme.border} ${theme.radius || 'rounded-none'} ${theme.muted} hover:text-indigo-600 cursor-pointer transition-colors`} title="Import Profiles">
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
          placeholder="New profile name..."
          className={`flex-1 ${theme.bg} border ${theme.border} ${theme.radius || 'rounded-none'} p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all`}
        />
        <button 
          onClick={saveProfile}
          className={`px-6 border ${theme.border} ${theme.radius || 'rounded-none'} ${theme.accent} text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-sm`}
        >
          <Save className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {profiles.map((p) => (
          <div key={p.id} className={`p-3 border ${theme.border} ${theme.bg} ${theme.radius || 'rounded-none'} flex items-center justify-between group hover:border-indigo-500/30 transition-all`}>
            <button 
              onClick={() => loadProfile(p)}
              className={`flex-1 text-left text-xs font-semibold ${theme.text} hover:text-indigo-600 transition-colors truncate pr-2`}
            >
              {p.name}
            </button>
            <button 
              onClick={() => deleteProfile(p.id!)}
              className={`p-1.5 opacity-0 group-hover:opacity-100 ${theme.muted} hover:text-rose-500 transition-all`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {profiles.length === 0 && (
          <div className={`col-span-full py-8 text-center border border-dashed ${theme.border} ${theme.radius || 'rounded-none'} ${theme.muted} text-xs italic`}>
            No saved profiles
          </div>
        )}
      </div>
    </div>
  );
};
