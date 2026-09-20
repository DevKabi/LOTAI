import React from 'react';
import { useApp } from '../../context/AppContext';
import { LifeModule } from '../../types';
import {
  LayoutDashboard,
  Target,
  CheckSquare,
  Repeat,
  DollarSign,
  HeartPulse,
  BookOpen,
  PieChart,
  Settings,
  Sparkles
} from 'lucide-react';

interface NavItem {
  id: LifeModule;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { currentModule, setCurrentModule, tasks, habits, setIsOmniModalOpen } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const pendingTasksCount = tasks.filter(t => t.status !== 'done' && (t.dueDate === today || t.priority === 'urgent')).length;
  const uncompletedHabitsCount = habits.filter(h => !h.history[today]).length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Life Hub', icon: LayoutDashboard },
    { id: 'goals', label: 'Goals & OKRs', icon: Target },
    { 
      id: 'tasks', 
      label: 'Tasks & Focus', 
      icon: CheckSquare, 
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
    },
    { 
      id: 'habits', 
      label: 'Habit Streaks', 
      icon: Repeat,
      badge: uncompletedHabitsCount > 0 ? `${uncompletedHabitsCount} left` : 'Done',
      badgeColor: uncompletedHabitsCount > 0 
        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
    },
    { id: 'finance', label: 'Finance & Wealth', icon: DollarSign },
    { id: 'health', label: 'Health & Fitness', icon: HeartPulse },
    { id: 'journal', label: 'Journal & Mind', icon: BookOpen },
    { id: 'analytics', label: 'Life Analytics', icon: PieChart },
    { id: 'settings', label: 'Settings & Sync', icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800/80 bg-slate-950/60 backdrop-blur-xl flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* Navigation Categories */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Life Command Center
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentModule(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Promo & Quick Action */}
      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        <button
          onClick={() => setIsOmniModalOpen(true)}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 text-indigo-300 hover:text-white hover:border-indigo-500/60 transition group font-medium text-xs shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 group-hover:rotate-12 transition-transform" />
          <span>Quick Capture (Omni)</span>
        </button>

        <div className="px-2 text-[11px] text-slate-500 text-center">
          <p className="font-semibold text-slate-400">LOTAI 1.0</p>
          <p>Local-First & AI-Assisted</p>
        </div>
      </div>
    </aside>
  );
};
