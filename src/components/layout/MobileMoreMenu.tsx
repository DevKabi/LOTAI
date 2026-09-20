import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { LifeModule } from '../../types';
import { 
  HeartPulse, 
  BookOpen, 
  Lightbulb, 
  PieChart, 
  Settings, 
  Bot, 
  Sun, 
  Moon, 
  LogOut, 
  X, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface MobileMoreMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMoreMenu: React.FC<MobileMoreMenuProps> = ({ isOpen, onClose }) => {
  const { 
    currentModule, 
    setCurrentModule, 
    settings, 
    updateSettings, 
    setIsCoachDrawerOpen,
    setIsOmniModalOpen
  } = useApp();
  const { user, profile, signOut } = useAuth();

  if (!isOpen) return null;

  const handleSelectModule = (mod: LifeModule) => {
    setCurrentModule(mod);
    onClose();
  };

  const handleOpenMindNotes = () => {
    setIsOmniModalOpen(true);
    onClose();
  };

  const handleOpenCoach = () => {
    setIsCoachDrawerOpen(true);
    onClose();
  };

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  const secondaryModules: { 
    id: LifeModule | 'mind_notes'; 
    label: string; 
    description: string;
    icon: React.ElementType; 
    color: string; 
    badgeBg: string;
    action: () => void;
    isActive: boolean;
  }[] = [
    {
      id: 'health',
      label: 'Health & Fitness',
      description: 'Hydration, sleep, body weight & vitals',
      icon: HeartPulse,
      color: 'text-rose-400',
      badgeBg: 'bg-rose-500/10 border-rose-500/20',
      action: () => handleSelectModule('health'),
      isActive: currentModule === 'health'
    },
    {
      id: 'journal',
      label: 'Journal & Mind',
      description: 'Daily reflections, mood & gratitude',
      icon: BookOpen,
      color: 'text-indigo-400',
      badgeBg: 'bg-indigo-500/10 border-indigo-500/20',
      action: () => handleSelectModule('journal'),
      isActive: currentModule === 'journal'
    },
    {
      id: 'mind_notes',
      label: 'Mind Notes & Ideas',
      description: 'Instant capture for thoughts & concepts',
      icon: Lightbulb,
      color: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/10 border-cyan-500/20',
      action: handleOpenMindNotes,
      isActive: false
    },
    {
      id: 'analytics',
      label: 'Life Analytics',
      description: 'Comprehensive scores & life metrics',
      icon: PieChart,
      color: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 border-amber-500/20',
      action: () => handleSelectModule('analytics'),
      isActive: currentModule === 'analytics'
    },
    {
      id: 'settings',
      label: 'Settings & Sync',
      description: 'Currency, Gemini API key, preferences',
      icon: Settings,
      color: 'text-slate-300',
      badgeBg: 'bg-slate-800 border-slate-700',
      action: () => handleSelectModule('settings'),
      isActive: currentModule === 'settings'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 backdrop-blur-md animate-fadeIn lg:hidden">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet Modal Container */}
      <div className="relative w-full max-w-lg bg-slate-900 border-t border-slate-800 rounded-t-3xl shadow-2xl p-5 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto pb-[calc(1.5rem+env(safe-area-inset-bottom,1rem))]">
        {/* Top Drag Pill */}
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-2 opacity-80" />

        {/* Sheet Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">More Modules</h3>
              <p className="text-xs text-slate-400">LOTAI Life Operating System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close more menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Life Coach Quick Banner */}
        <button
          onClick={handleOpenCoach}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30 hover:border-indigo-500/50 shadow-lg text-left transition active:scale-[0.98]"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-white">AI Life Coach</span>
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-xs text-indigo-300/90">Get AI guidance across all life pillars</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-indigo-400" />
        </button>

        {/* Modules List (Min 48px touch targets) */}
        <div className="space-y-2 pt-1">
          {secondaryModules.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition text-left min-h-[52px] active:scale-[0.99] ${
                  item.isActive
                    ? 'bg-indigo-600/15 border-indigo-500/50 shadow-md shadow-indigo-600/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div className={`p-2.5 rounded-xl border ${item.badgeBg}`}>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{item.label}</h4>
                    <p className="text-xs text-slate-400 line-clamp-1">{item.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            );
          })}
        </div>

        {/* Account & Quick Settings Tray */}
        <div className="pt-3 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <div className="flex items-center space-x-2.5 truncate">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.name || 'User'}
                  className="w-8 h-8 rounded-full object-cover border border-indigo-500/40"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center">
                  {(profile?.name || user?.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">
                  {profile?.name || user?.email?.split('@')[0] || 'LOTAI User'}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {settings.currency} • {settings.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
                title="Toggle Theme"
              >
                {settings.theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  signOut();
                  onClose();
                }}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
