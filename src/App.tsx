import React, { useEffect, useState } from 'react';
import { useApp } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/modules/DashboardView';
import { GoalsView } from './components/modules/GoalsView';
import { TasksView } from './components/modules/TasksView';
import { HabitsView } from './components/modules/HabitsView';
import { FinanceView } from './components/modules/FinanceView';
import { HealthView } from './components/modules/HealthView';
import { JournalView } from './components/modules/JournalView';
import { AnalyticsView } from './components/modules/AnalyticsView';
import { SettingsView } from './components/modules/SettingsView';
import { OmniInputModal } from './components/omni/OmniInputModal';
import { AICoachDrawer } from './components/coach/AICoachDrawer';
import { ToastContainer } from './components/common/ToastContainer';
import { AuthFlow } from './components/auth/AuthFlow';
import { usePWAInstall } from './hooks/usePWAInstall';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { PWAInstallModal } from './components/pwa/PWAInstallModal';
import { PWAFloatingPrompt } from './components/pwa/PWAFloatingPrompt';
import { OfflineBanner } from './components/pwa/OfflineBanner';
import { BottomNav } from './components/layout/BottomNav';
import { QuickActionFab } from './components/layout/QuickActionFab';
import { LandingPage } from './components/landing/LandingPage';
import { Sparkles, ArrowLeft } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { currentModule, setCurrentModule, updateSettings } = useApp();
  const { user, profile, isLoading, isDemoUser } = useAuth();
  const [isViewingTour, setIsViewingTour] = useState(false);
  
  // PWA & Offline state management
  const {
    isInstallable,
    isInstalled,
    isStandalone,
    isIOS,
    isMobile,
    isDismissed,
    setIsDismissed,
    isModalOpen,
    setIsModalOpen,
    promptInstall,
    hasNativePrompt
  } = usePWAInstall();

  const { isOnline, syncStatus } = useNetworkStatus();

  const isAuthenticated = Boolean(user || isDemoUser);

  // Sync profile name to settings when profile changes
  useEffect(() => {
    if (profile?.name) {
      updateSettings({ userName: profile.name });
    }
  }, [profile?.name]);

  // When authenticating, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      setCurrentModule('dashboard');
    }
  }, [isAuthenticated]);

  // Loading Screen while Supabase verifies session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 shadow-2xl shadow-indigo-500/50 animate-pulse">
          <Sparkles className="w-8 h-8 text-white animate-spin-slow" />
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold text-white tracking-wide">LOTAI</h2>
          <p className="text-xs text-slate-400">Verifying secure session...</p>
        </div>
      </div>
    );
  }

  // Unauthenticated Route Guard: Redirect to Landing Page & Auth Flow
  if (!isAuthenticated) {
    return <AuthFlow />;
  }

  // Optional: Authenticated User Viewing Product Tour
  if (isViewingTour) {
    return (
      <div className="relative min-h-screen bg-[#050816]">
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setIsViewingTour(false)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xl shadow-indigo-600/30 flex items-center space-x-2 transition active:scale-95 border border-indigo-400/30"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to LifeHub</span>
          </button>
        </div>
        <LandingPage />
      </div>
    );
  }

  // Authenticated: Render Protected LifeHub Shell
  const renderModule = () => {
    switch (currentModule) {
      case 'dashboard': return <DashboardView />;
      case 'goals': return <GoalsView />;
      case 'tasks': return <TasksView />;
      case 'habits': return <HabitsView />;
      case 'finance': return <FinanceView />;
      case 'health': return <HealthView />;
      case 'journal': return <JournalView />;
      case 'analytics': return <AnalyticsView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Universal Navbar */}
      <Navbar 
        onInstallClick={promptInstall}
        isInstallable={isInstallable && !isStandalone && !isInstalled}
        isOnline={isOnline}
        syncStatus={syncStatus}
        onViewTour={() => setIsViewingTour(true)}
      />

      {/* Offline Status Notice Banner */}
      <OfflineBanner isOnline={isOnline} syncStatus={syncStatus} />

      {/* Main App Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation (Desktop only: preserved completely untouched) */}
        <div className="hidden lg:flex shrink-0">
          <Sidebar />
        </div>

        {/* Dynamic Module Content Viewport */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 pb-28 lg:pb-8 max-w-7xl mx-auto w-full transition-all">
          {renderModule()}
        </main>
      </div>

      {/* Universal Floating Action Button (Quick Capture) */}
      <QuickActionFab />

      {/* Mobile Universal Bottom Navigation (Visible on mobile/tablet) */}
      <BottomNav />

      {/* PWA Floating Install Prompt & Benefits Modal */}
      <PWAFloatingPrompt 
        isInstallable={isInstallable}
        isStandalone={isStandalone}
        isDismissed={isDismissed}
        isMobile={isMobile}
        onOpenModal={() => setIsModalOpen(true)}
        onDismiss={() => setIsDismissed(true)}
      />

      <PWAInstallModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInstall={promptInstall}
        isIOS={isIOS}
        isMobile={isMobile}
        hasNativePrompt={hasNativePrompt}
      />

      {/* Global Modals & Drawers */}
      <OmniInputModal />
      <AICoachDrawer />
      <ToastContainer />
    </div>
  );
};

export default AppContent;

