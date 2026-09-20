import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LifeModule } from '../../types';
import { 
  LayoutDashboard, 
  Target, 
  CheckSquare, 
  Repeat, 
  DollarSign, 
  MoreHorizontal 
} from 'lucide-react';
import { MobileMoreMenu } from './MobileMoreMenu';

export const BottomNav: React.FC = () => {
  const { currentModule, setCurrentModule, tasks, habits } = useApp();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const pendingTasksCount = tasks.filter(t => t.status !== 'done' && (t.dueDate === today || t.priority === 'urgent')).length;
  const uncompletedHabitsCount = habits.filter(h => !h.history[today]).length;

  const tabs: {
    id: LifeModule;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
  }[] = [
    { id: 'dashboard', label: 'LifeHub', icon: LayoutDashboard },
    { id: 'goals', label: 'Goals', icon: Target },
    { 
      id: 'tasks', 
      label: 'Tasks', 
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
      badgeColor: 'bg-rose-500'
    },
    { 
      id: 'habits', 
      label: 'Habits', 
      icon: Repeat,
      badge: uncompletedHabitsCount > 0 ? uncompletedHabitsCount : undefined,
      badgeColor: 'bg-amber-500'
    },
    { id: 'finance', label: 'Finance', icon: DollarSign }
  ];

  const isMoreActive = [
    'health', 
    'journal', 
    'analytics', 
    'settings'
  ].includes(currentModule);

  return (
    <>
      <nav 
        className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/92 backdrop-blur-xl border-t border-slate-800/80 lg:hidden shadow-2xl transition-all"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        aria-label="Mobile Navigation"
      >
        <div className="grid grid-cols-6 items-center px-1 py-1 max-w-lg mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentModule === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setCurrentModule(tab.id);
                  setIsMoreOpen(false);
                }}
                className={`relative flex flex-col items-center justify-center min-h-[50px] py-1 rounded-xl transition-all duration-200 active:scale-95 ${
                  isActive 
                    ? 'text-indigo-400 font-bold' 
                    : 'text-slate-400 hover:text-slate-200 font-medium'
                }`}
                aria-label={tab.label}
              >
                {/* Active Indicator Top Glow */}
                {isActive && (
                  <span className="absolute top-0.5 w-6 h-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-sm shadow-indigo-500/80" />
                )}

                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-indigo-400' : 'text-slate-400'}`} />
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`absolute -top-1.5 -right-2 flex items-center justify-center min-w-[15px] h-[15px] px-1 text-[9px] font-black text-white rounded-full ${tab.badgeColor} ring-2 ring-slate-950 shadow-sm`}>
                      {tab.badge > 9 ? '9+' : tab.badge}
                    </span>
                  )}
                </div>

                <span className="text-[10px] tracking-tight mt-1 truncate max-w-[54px]">
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* Tab 6: More */}
          <button
            onClick={() => setIsMoreOpen(true)}
            className={`relative flex flex-col items-center justify-center min-h-[50px] py-1 rounded-xl transition-all duration-200 active:scale-95 ${
              isMoreActive 
                ? 'text-indigo-400 font-bold' 
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
            aria-label="More Life Modules"
          >
            {isMoreActive && (
              <span className="absolute top-0.5 w-6 h-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-sm shadow-indigo-500/80" />
            )}

            <div className="relative">
              <MoreHorizontal className={`w-5 h-5 transition-transform ${isMoreActive ? 'scale-110 text-indigo-400' : 'text-slate-400'}`} />
            </div>

            <span className="text-[10px] tracking-tight mt-1 truncate max-w-[54px]">
              More
            </span>
          </button>
        </div>
      </nav>

      {/* Slide-Up Bottom Sheet for More Modules */}
      <MobileMoreMenu 
        isOpen={isMoreOpen} 
        onClose={() => setIsMoreOpen(false)} 
      />
    </>
  );
};
