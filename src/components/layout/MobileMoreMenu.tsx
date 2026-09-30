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
  ChevronRight
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
  const { signOut } = useAuth();

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
      color: 'text-[#4CAF00]',
      badgeBg: 'bg-[#19B000]/10 border-[#19B000]/25',
      action: () => handleSelectModule('health'),
      isActive: currentModule === 'health'
    },
    {
      id: 'journal',
      label: 'Journal & Mind',
      description: 'Daily reflections, mood & gratitude',
      icon: BookOpen,
      color: 'text-[#9ACD00]',
      badgeBg: 'bg-[#9ACD00]/10 border-[#9ACD00]/25',
      action: () => handleSelectModule('journal'),
      isActive: currentModule === 'journal'
    },
    {
      id: 'mind_notes',
      label: 'Mind Notes & Ideas',
      description: 'Instant capture for thoughts & concepts',
      icon: Lightbulb,
      color: 'text-[#FFD43B]',
      badgeBg: 'bg-[#FFC61A]/10 border-[#FFC61A]/25',
      action: handleOpenMindNotes,
      isActive: false
    },
    {
      id: 'analytics',
      label: 'Life Analytics',
      description: 'Comprehensive scores & life metrics',
      icon: PieChart,
      color: 'text-[#4CAF00]',
      badgeBg: 'bg-[#19B000]/10 border-[#19B000]/25',
      action: () => handleSelectModule('analytics'),
      isActive: currentModule === 'analytics'
    },
    {
      id: 'settings',
      label: 'Settings & Sync',
      description: 'Profile, preferences & data exports',
      icon: Settings,
      color: 'text-slate-300',
      badgeBg: 'bg-slate-800/80 border-slate-700/60',
      action: () => handleSelectModule('settings'),
      isActive: currentModule === 'settings'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center lg:hidden select-none">
      {/* Dark backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-Up Container */}
      <div 
        className="relative w-full max-w-lg bg-[#0D1117] border-t border-[#1B222D] rounded-t-3xl shadow-2xl p-5 z-50 space-y-4 animate-slide-up max-h-[85vh] overflow-y-auto"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1.25rem)' }}
      >
        {/* Handle Bar */}
        <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto" />

        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#1B222D]">
          <div>
            <h3 className="text-base font-heading font-black text-white">More Life Dimensions</h3>
            <p className="text-xs text-slate-400">Additional modules and personal controls</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#11161D] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Life Coach Card Banner */}
        <div 
          onClick={handleOpenCoach}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-[#19B000]/15 via-[#4CAF00]/10 to-[#FFC61A]/10 border border-[#19B000]/30 flex items-center justify-between cursor-pointer group hover:border-[#19B000]/50 transition"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-[#19B000] to-[#4CAF00] text-black shadow-md shadow-[#19B000]/25">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-sm font-heading font-black text-white">AI Life Coach</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#19B000]/20 text-[#4CAF00] border border-[#19B000]/30">Active</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Ask questions, audit goals & get advice</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
        </div>

        {/* Module Items List */}
        <div className="space-y-1.5">
          {secondaryModules.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left ${
                  item.isActive 
                    ? 'bg-[#19B000]/15 border-[#19B000]/40 text-white shadow-sm' 
                    : 'bg-[#11161D] border-[#1B222D] hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3 truncate mr-2">
                  <div className={`p-2.5 rounded-xl border ${item.badgeBg} shrink-0`}>
                    <Icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div className="truncate">
                    <p className={`text-xs font-heading font-black truncate ${item.isActive ? 'text-white' : 'text-slate-200'}`}>
                      {item.label}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
              </button>
            );
          })}
        </div>

        {/* Bottom Preferences & Session Row */}
        <div className="pt-2 border-t border-[#1B222D] flex items-center justify-between">
          <button
            onClick={toggleTheme}
            className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-[#11161D] border border-[#1B222D] text-xs font-semibold text-slate-300"
          >
            {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-[#FFD43B]" /> : <Moon className="w-4 h-4 text-[#9ACD00]" />}
            <span>{settings.theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
          </button>

          <button
            onClick={async () => {
              onClose();
              await signOut();
            }}
            className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-[#FFC61A]/10 border border-[#FFC61A]/25 text-xs font-semibold text-[#FFD43B] hover:bg-[#FFC61A]/20 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
