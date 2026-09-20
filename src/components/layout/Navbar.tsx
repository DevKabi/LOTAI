import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Sparkles, 
  Mic, 
  Search, 
  Bot, 
  Sun, 
  Moon, 
  Activity,
  Flame,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Download
} from 'lucide-react';
import { SyncStatus } from '../../hooks/useNetworkStatus';

interface NavbarProps {
  onInstallClick?: () => void;
  isInstallable?: boolean;
  isOnline?: boolean;
  syncStatus?: SyncStatus;
  onViewTour?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onInstallClick,
  isInstallable,
  isOnline = true,
  syncStatus = 'synced',
  onViewTour
}) => {
  const { 
    settings, 
    updateSettings, 
    setIsOmniModalOpen, 
    setIsCoachDrawerOpen, 
    lifeScore,
    habits,
    setCurrentModule
  } = useApp();

  const { user, profile, signOut } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const todayKey = new Date().toISOString().split('T')[0];
  const completedHabits = habits.filter(h => h.history[todayKey]).length;

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut: Cmd/Ctrl + K opens Omni-Input Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOmniModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsOmniModalOpen]);

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo & Mission Tagline */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300">
                LOTAI
              </span>
              <span className="hidden min-[380px]:inline-block text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AI Life OS
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-400 font-medium">
              Life On Track. Powered by AI.
            </p>
          </div>
        </div>

        {/* Center: Omni-Input Trigger Search Bar with prominent Mic button */}
        <div className="flex-1 mx-2 sm:mx-4 max-w-xl">
          <button
            onClick={() => setIsOmniModalOpen(true)}
            className="w-full group flex items-center justify-between pl-3 pr-1.5 sm:px-4 py-1.5 text-xs sm:text-sm text-slate-400 bg-slate-900/90 border border-slate-800 rounded-full hover:border-indigo-500/50 hover:bg-slate-900 transition-all shadow-inner min-h-[44px]"
            title="Type or speak anything to capture into LOTAI"
          >
            <div className="flex items-center space-x-2 truncate mr-1">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400 group-hover:text-indigo-300 shrink-0" />
              <span className="truncate hidden sm:inline">
                Type or speak: <span className="text-slate-300 italic">"Spent $35 on groceries"</span>...
              </span>
              <span className="truncate sm:hidden text-slate-300">
                Type or speak anything...
              </span>
            </div>
            <div className="flex items-center space-x-1.5 shrink-0">
              <span className="flex items-center justify-center w-8 h-8 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition">
                <Mic className="w-3.5 h-3.5" />
              </span>
              <kbd className="hidden lg:inline-block px-2 py-0.5 text-[11px] font-semibold text-slate-400 bg-slate-800/80 border border-slate-700/60 rounded-md">
                Ctrl K
              </kbd>
            </div>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          {/* Real-time Sync Status Indicator */}
          <div 
            className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
              syncStatus === 'synced'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : syncStatus === 'reconnecting'
                ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}
            title={isOnline ? 'All records synchronized to cloud' : 'Offline mode — local storage active'}
          >
            <span className={`w-2 h-2 rounded-full ${
              syncStatus === 'synced' ? 'bg-emerald-400 animate-pulse' : syncStatus === 'reconnecting' ? 'bg-indigo-400 animate-ping' : 'bg-amber-400'
            }`}></span>
            <span className="capitalize">{syncStatus}</span>
          </div>

          {/* Small Header Install Indicator */}
          {isInstallable && (
            <button
              onClick={onInstallClick}
              className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-600/20 to-purple-600/20 hover:from-indigo-600/30 hover:to-purple-600/30 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs font-bold transition shadow-sm animate-pulse hover:animate-none min-h-[36px]"
              title="Install LOTAI app directly on your device"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="hidden sm:inline">Install</span>
            </button>
          )}

          {/* Daily Streak Indicator (Desktop) */}
          <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500/30" />
            <span>{completedHabits}/{habits.length} Habits</span>
          </div>

          {/* Life On Track Score Pill */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
            <Activity className="w-4 h-4 text-indigo-400" />
            <div className="flex items-baseline space-x-1">
              <span className="text-xs text-slate-400 font-medium">Life Score:</span>
              <span className="text-sm font-bold text-indigo-400">{lifeScore.overall}%</span>
            </div>
          </div>

          {/* AI Life Coach Drawer Button (Desktop/Tablet) */}
          <button
            onClick={() => setIsCoachDrawerOpen(true)}
            className="hidden sm:flex relative items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-xs shadow-md shadow-indigo-600/20 hover:from-indigo-500 hover:to-purple-500 transition active:scale-95"
            title="Open AI Life Coach"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden md:inline">AI Coach</span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          </button>

          {/* Theme Switcher (Desktop) */}
          <button
            onClick={toggleTheme}
            className="hidden md:flex p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition"
            title="Toggle theme"
          >
            {settings.theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile Avatar & Dropdown */}
          <div className="relative pl-1 border-l border-slate-800" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-900 border border-transparent hover:border-slate-800 transition"
              title="User Account & Session"
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.name || 'User'}
                  className="w-8 h-8 rounded-full object-cover border border-indigo-500/40"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center border border-indigo-400/30">
                  {(profile?.name || user?.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <span className="hidden xl:inline-block text-xs font-semibold text-slate-200 max-w-[110px] truncate">
                {profile?.name || user?.email?.split('@')[0] || 'User'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-fadeIn space-y-1">
                <div className="px-3 py-2 border-b border-slate-800/80">
                  <p className="text-xs font-bold text-white truncate">
                    {profile?.name || 'LOTAI User'}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {profile?.email || user?.email || 'authenticated'}
                  </p>
                </div>

                {isInstallable && (
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      onInstallClick?.();
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-indigo-300 hover:text-white hover:bg-indigo-600/20 rounded-xl transition font-medium"
                  >
                    <Download className="w-4 h-4 text-indigo-400" />
                    <span>Install App on Device</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onViewTour?.();
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-indigo-300 hover:text-white hover:bg-indigo-600/20 rounded-xl transition font-medium"
                >
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Product Tour & Overview</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentModule('settings');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition font-medium"
                >
                  <UserIcon className="w-4 h-4 text-indigo-400" />
                  <span>Profile & Life Targets</span>
                </button>

                <button
                  onClick={async () => {
                    setIsProfileOpen(false);
                    await signOut();
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
