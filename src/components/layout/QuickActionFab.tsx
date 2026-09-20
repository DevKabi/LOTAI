import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plus, 
  X, 
  Target, 
  CheckSquare, 
  Repeat, 
  DollarSign, 
  HeartPulse, 
  BookOpen, 
  Lightbulb, 
  Sparkles 
} from 'lucide-react';
import { LifeModule } from '../../types';

export const QuickActionFab: React.FC = () => {
  const { setCurrentModule, setIsOmniModalOpen } = useApp();
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

  const handleAction = (module?: LifeModule, isMindNote?: boolean) => {
    setIsOpen(false);
    if (isMindNote) {
      setIsOmniModalOpen(true);
    } else if (module) {
      setCurrentModule(module);
      setIsOmniModalOpen(true);
    }
  };

  const captureOptions = [
    {
      id: 'task',
      label: 'Add Task',
      subtitle: 'To-do or urgent task',
      icon: CheckSquare,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/20',
      onClick: () => handleAction('tasks')
    },
    {
      id: 'expense',
      label: 'Add Expense',
      subtitle: 'Expense, bill or income',
      icon: DollarSign,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
      onClick: () => handleAction('finance')
    },
    {
      id: 'habit',
      label: 'Add Habit',
      subtitle: 'Daily recurring routine',
      icon: Repeat,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
      onClick: () => handleAction('habits')
    },
    {
      id: 'health',
      label: 'Add Health Log',
      subtitle: 'Water, weight or workout',
      icon: HeartPulse,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/20',
      onClick: () => handleAction('health')
    },
    {
      id: 'journal',
      label: 'Add Journal Entry',
      subtitle: 'Daily reflection & mood',
      icon: BookOpen,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10 border-indigo-500/20',
      onClick: () => handleAction('journal')
    },
    {
      id: 'goal',
      label: 'Add Goal',
      subtitle: 'Long-term outcome or OKR',
      icon: Target,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
      onClick: () => handleAction('goals')
    },
    {
      id: 'mind',
      label: 'Add Mind Note',
      subtitle: 'Startup idea, SaaS, thought',
      icon: Lightbulb,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 border-cyan-500/20',
      onClick: () => handleAction(undefined, true)
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
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-30 transition-opacity animate-fadeIn lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Quick Capture Popup Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-2 w-72 sm:w-80 rounded-3xl bg-slate-900 border border-indigo-500/30 shadow-2xl p-3 z-40 space-y-1.5 animate-fadeIn backdrop-blur-xl">
          <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Quick Capture
              </span>
            </div>
            <span className="text-[10px] text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
              AI Powered
            </span>
          </div>

          <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
            {captureOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  onClick={opt.onClick}
                  className="w-full flex items-center space-x-3 p-2.5 rounded-xl hover:bg-slate-800/80 active:bg-slate-800 transition text-left group min-h-[48px]"
                >
                  <div className={`p-2 rounded-xl border ${opt.bgColor} shrink-0`}>
                    <Icon className={`w-4 h-4 ${opt.color}`} />
                  </div>
                  <div className="truncate flex-1">
                    <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition truncate">
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
        className={`relative w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all duration-300 active:scale-90 z-40 ${
          isOpen
            ? 'bg-slate-800 border border-slate-700 text-slate-300 rotate-90 shadow-none'
            : 'bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-600/40 hover:shadow-indigo-600/60 ring-2 ring-indigo-400/30'
        }`}
        aria-label="Universal Quick Capture"
        title="Quick Capture Menu"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <Plus className="w-6 h-6 text-white stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-400" />
            </span>
          </>
        )}
      </button>
    </div>
  );
};
