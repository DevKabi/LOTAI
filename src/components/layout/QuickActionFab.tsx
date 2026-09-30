import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plus, 
  X, 
  Target, 
  CheckSquare, 
  Repeat, 
  DollarSign, 
  TrendingUp,
  HeartPulse, 
  BookOpen, 
  Lightbulb, 
  Brain,
  Mic,
  Sparkles 
} from 'lucide-react';
import { QuickModalType } from '../../types';

export const QuickActionFab: React.FC = () => {
  const { openQuickModal } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when tapping outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleAction = (type: QuickModalType) => {
    setIsOpen(false);
    openQuickModal(type);
  };

  const actionOptions = [
    {
      id: 'goal',
      label: 'Add Goal',
      subtitle: 'OKR or long-term milestone',
      icon: Target,
      color: 'text-[#9ACD00]',
      bgColor: 'bg-[#19B000]/10 border-[#19B000]/25',
      onClick: () => handleAction('goal')
    },
    {
      id: 'task',
      label: 'Add Task',
      subtitle: 'High-priority action item',
      icon: CheckSquare,
      color: 'text-[#4CAF00]',
      bgColor: 'bg-[#4CAF00]/10 border-[#4CAF00]/25',
      onClick: () => handleAction('task')
    },
    {
      id: 'habit',
      label: 'Add Habit',
      subtitle: 'Check or add daily standard',
      icon: Repeat,
      color: 'text-[#FFC61A]',
      bgColor: 'bg-[#FFC61A]/10 border-[#FFC61A]/25',
      onClick: () => handleAction('habit')
    },
    {
      id: 'expense',
      label: 'Add Expense',
      subtitle: 'Record an expense or bill',
      icon: DollarSign,
      color: 'text-[#FFD43B]',
      bgColor: 'bg-[#FFD43B]/10 border-[#FFD43B]/25',
      onClick: () => handleAction('expense')
    },
    {
      id: 'income',
      label: 'Add Income',
      subtitle: 'Salary, revenue or client fee',
      icon: TrendingUp,
      color: 'text-[#19B000]',
      bgColor: 'bg-[#19B000]/10 border-[#19B000]/25',
      onClick: () => handleAction('income')
    },
    {
      id: 'health',
      label: 'Add Health Log',
      subtitle: 'Water, sleep, workout, weight',
      icon: HeartPulse,
      color: 'text-[#4CAF00]',
      bgColor: 'bg-[#4CAF00]/10 border-[#4CAF00]/25',
      onClick: () => handleAction('health')
    },
    {
      id: 'journal',
      label: 'Add Journal',
      subtitle: 'Daily reflection & mindset',
      icon: BookOpen,
      color: 'text-[#9ACD00]',
      bgColor: 'bg-[#9ACD00]/10 border-[#9ACD00]/25',
      onClick: () => handleAction('journal')
    },
    {
      id: 'mind',
      label: 'Add Mind Note',
      subtitle: 'Startup idea, SaaS, insight',
      icon: Lightbulb,
      color: 'text-[#FFC61A]',
      bgColor: 'bg-[#FFC61A]/10 border-[#FFC61A]/25',
      onClick: () => handleAction('mind')
    },
    {
      id: 'focus',
      label: 'Start Focus Session',
      subtitle: 'Pomodoro timer & flow block',
      icon: Brain,
      color: 'text-[#4CAF00]',
      bgColor: 'bg-[#19B000]/10 border-[#19B000]/25',
      onClick: () => handleAction('focus')
    },
    {
      id: 'voice',
      label: 'Voice Capture',
      subtitle: 'Hands-free speech with Gemini',
      icon: Mic,
      color: 'text-black',
      bgColor: 'bg-gradient-to-tr from-[#19B000] to-[#FFC61A]',
      onClick: () => handleAction('voice')
    }
  ];

  return (
    <div 
      ref={menuRef} 
      className="fixed bottom-20 right-4 lg:bottom-8 lg:right-8 z-40 select-none"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Backdrop overlay when menu is open on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-30 transition-opacity animate-fadeIn lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Quick Actions Popup Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-2 w-72 sm:w-80 rounded-3xl bg-[#0D1117] border border-[#1B222D] shadow-2xl p-3 z-40 space-y-1.5 animate-fadeIn backdrop-blur-xl">
          <div className="px-3 py-2 border-b border-[#1B222D] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#4CAF00]" />
              <span className="text-xs font-heading font-black uppercase tracking-wider text-slate-200">
                Action Center
              </span>
            </div>
            <span className="text-[10px] text-[#9ACD00] bg-[#19B000]/15 px-2 py-0.5 rounded-full border border-[#19B000]/30 font-semibold">
              Instant OS Actions
            </span>
          </div>

          <div className="space-y-1 max-h-[62vh] overflow-y-auto pr-1">
            {actionOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  onClick={opt.onClick}
                  className="w-full flex items-center space-x-3 p-2.5 rounded-xl hover:bg-[#11161D] active:bg-[#161B22] transition text-left group min-h-[46px]"
                >
                  <div className={`p-2 rounded-xl border ${opt.bgColor} shrink-0`}>
                    <Icon className={`w-4 h-4 ${opt.color}`} />
                  </div>
                  <div className="truncate flex-1">
                    <p className="text-xs font-heading font-black text-white group-hover:text-[#9ACD00] transition truncate">
                      {opt.label}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {opt.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Universal Floating Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-14 h-14 rounded-2xl flex items-center justify-center text-black shadow-2xl transition-all duration-300 active:scale-90 z-40 ${
          isOpen
            ? 'bg-[#11161D] border border-[#1B222D] text-slate-300 rotate-90 shadow-none'
            : 'bg-gradient-to-tr from-[#19B000] via-[#4CAF00] to-[#FFC61A] hover:brightness-110 shadow-[#19B000]/40 ring-2 ring-[#9ACD00]/40'
        }`}
        aria-label="Universal Action Center"
        title="Quick Action Menu"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <Plus className="w-6 h-6 text-black stroke-[3]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD43B] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FFC61A]" />
            </span>
          </>
        )}
      </button>
    </div>
  );
};
