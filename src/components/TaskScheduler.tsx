import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Plus, Trash2, Power, CheckCircle2, Circle } from 'lucide-react';
import { ScheduledTask, ClickerConfig } from '../types';

interface TaskSchedulerProps {
  theme: any;
  profiles: ClickerConfig[];
}

export const TaskScheduler: React.FC<TaskSchedulerProps> = ({ theme, profiles }) => {
  const [tasks, setTasks] = useState<ScheduledTask[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState<Partial<ScheduledTask>>({
    name: '',
    startTime: '09:00',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    isActive: true,
  });

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  const addTask = async () => {
    if (!newTask.name || !newTask.config) return;
    
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      if (res.ok) {
        const added = await res.json();
        setTasks(prev => [...prev, added]);
        setIsAdding(false);
        setNewTask({
          name: '',
          startTime: '09:00',
          days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          isActive: true,
        });
      }
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const toggleTask = async (task: ScheduledTask) => {
    const updated = { ...task, isActive: !task.isActive };
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setTasks(prev => prev.map(t => t.id === task.id ? updated : t));
      }
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTasks(prev => prev.filter(t => t.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const toggleDay = (day: string) => {
    setNewTask(prev => ({
      ...prev,
      days: prev.days?.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...(prev.days || []), day]
    }));
  };

  return (
    <motion.div
      key="scheduler"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold tracking-tight ${theme.text}`}>Task Scheduler</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`px-4 py-2 ${theme.radius || 'rounded-none'} ${theme.accentBg} text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all shadow-md`}
        >
          {isAdding ? 'Cancel' : <><Plus className="w-4 h-4" /> Add Task</>}
        </button>
      </div>

      {isAdding && (
        <div className={`p-6 border ${theme.border} ${theme.card} ${theme.radius || 'rounded-none'} space-y-6 ${theme.glow}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className={`text-[10px] font-bold ${theme.muted} uppercase tracking-widest block mb-2`}>Task Name</label>
                <input
                  type="text"
                  value={newTask.name}
                  onChange={(e) => setNewTask(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Morning Simulation..."
                  className={`w-full ${theme.bg} border ${theme.border} ${theme.radius || 'rounded-none'} p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none`}
                />
              </div>
              <div>
                <label className={`text-[10px] font-bold ${theme.muted} uppercase tracking-widest block mb-2`}>Start Time</label>
                <input
                  type="time"
                  value={newTask.startTime}
                  onChange={(e) => setNewTask(prev => ({ ...prev, startTime: e.target.value }))}
                  className={`w-full ${theme.bg} border ${theme.border} ${theme.radius || 'rounded-none'} p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none`}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className={`text-[10px] font-bold ${theme.muted} uppercase tracking-widest block mb-2`}>Select Profile</label>
                <select
                  onChange={(e) => {
                    const profile = profiles.find(p => p.id === e.target.value);
                    setNewTask(prev => ({ ...prev, config: profile }));
                  }}
                  className={`w-full ${theme.bg} border ${theme.border} ${theme.radius || 'rounded-none'} p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none`}
                >
                  <option value="">Select a profile...</option>
                  {profiles.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`text-[10px] font-bold ${theme.muted} uppercase tracking-widest block mb-2`}>Active Days</label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map(day => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 text-[10px] font-bold border transition-all ${theme.radius || 'rounded-none'}
                        ${newTask.days?.includes(day) 
                          ? `${theme.accentBg} text-white border-transparent` 
                          : `${theme.bg} ${theme.muted} ${theme.border} hover:border-indigo-500/30`}
                      `}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={addTask}
            disabled={!newTask.name || !newTask.config}
            className={`w-full p-4 ${theme.accentBg} text-white font-bold uppercase tracking-widest ${theme.radius || 'rounded-none'} hover:opacity-90 disabled:opacity-30 transition-all shadow-lg`}
          >
            Create Scheduled Task
          </button>
        </div>
      )}

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className={`p-12 border border-dashed ${theme.border} ${theme.radius || 'rounded-none'} text-center ${theme.muted} text-sm font-medium`}>
            No scheduled tasks defined
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className={`p-6 border ${theme.border} ${theme.card} ${theme.radius || 'rounded-none'} flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-indigo-500/30 transition-all ${theme.glow}`}>
              <div className="flex items-center gap-6">
                <div className={`p-4 ${theme.bg} ${theme.radius || 'rounded-none'} border ${theme.border}`}>
                  <Calendar className={`w-6 h-6 ${task.isActive ? theme.accent : theme.muted}`} />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${theme.text} mb-1`}>{task.name}</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className={`w-3.5 h-3.5 ${theme.muted}`} />
                      <span className={`text-xs font-bold ${theme.text}`}>{task.startTime}</span>
                    </div>
                    <div className="flex gap-1">
                      {daysOfWeek.map(day => (
                        <span 
                          key={day} 
                          className={`text-[9px] font-bold uppercase px-1.5 py-0.5 ${theme.radius || 'rounded-none'}
                            ${task.days.includes(day) ? `${theme.accentBg} text-white` : `${theme.bg} ${theme.muted} opacity-30`}
                          `}
                        >
                          {day.charAt(0)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <span className={`text-[10px] ${theme.muted} uppercase font-bold tracking-wider block mb-1`}>Profile</span>
                  <span className={`text-xs font-bold ${theme.accent}`}>{task.config.name}</span>
                </div>
                <div className={`h-10 w-[1px] ${theme.border} hidden md:block`} />
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleTask(task)}
                    className={`p-3 border ${theme.border} ${theme.radius || 'rounded-none'} transition-all shadow-sm
                      ${task.isActive ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' : 'text-slate-400 bg-slate-100'}
                    `}
                    title={task.isActive ? 'Deactivate' : 'Activate'}
                  >
                    <Power className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className={`p-3 border ${theme.border} ${theme.radius || 'rounded-none'} ${theme.muted} hover:text-rose-500 transition-colors shadow-sm`}
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};
