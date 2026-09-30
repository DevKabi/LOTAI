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
      badgeColor: 'bg-[#FFC61A]/15 text-[#FFD43B] border border-[#FFC61A]/30'
    },
    { 
      id: 'habits', 
      label: 'Habit Streaks', 
      icon: Repeat,
      badge: uncompletedHabitsCount > 0 ? `${uncompletedHabitsCount} left` : 'Done',
      badgeColor: uncompletedHabitsCount > 0 
        ? 'bg-[#FFC61A]/15 text-[#FFD43B] border border-[#FFC61A]/30' 
        : 'bg-[#19B000]/15 text-[#4CAF00] border border-[#19B000]/30'
    },
    { id: 'finance', label: 'Finance & Wealth', icon: DollarSign },
    { id: 'health', label: 'Health & Fitness', icon: HeartPulse },
    { id: 'journal', label: 'Journal & Mind', icon: BookOpen },
    { id: 'analytics', label: 'Life Analytics', icon: PieChart },
    { id: 'settings', label: 'Settings & Sync', icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-[#1B222D] bg-[#0D1117] flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)] select-none">
      <div className="space-y-6">
        {/* Navigation Categories */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-heading font-black uppercase tracking-wider text-slate-500 mb-2">
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
                    ? 'bg-[#19B000]/15 text-[#9ACD00] border border-[#19B000]/30 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-[#11161D] border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#4CAF00]' : 'text-slate-500'}`} />
                  <span className={isActive ? 'font-semibold text-white' : ''}>{item.label}</span>
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
      <div className="pt-4 border-t border-[#1B222D] space-y-3">
        <button
          onClick={() => setIsOmniModalOpen(true)}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#19B000]/15 to-[#FFC61A]/15 border border-[#19B000]/30 text-[#9ACD00] hover:text-white hover:border-[#19B000]/60 transition group font-heading font-black text-xs shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#4CAF00] group-hover:rotate-12 transition-transform" />
          <span>Quick Capture (Omni)</span>
        </button>

        <div className="px-2 text-[11px] text-slate-500 text-center">
          <p className="font-heading font-black text-slate-400">LOTAI 1.0</p>
          <p>Local-First & AI-Assisted</p>
        </div>
      </div>
    </aside>
  );
};
