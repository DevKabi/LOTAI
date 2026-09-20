import React, { useState } from 'react';
import { WifiOff, RefreshCw, CheckCircle2, Database } from 'lucide-react';
import { SyncStatus } from '../../hooks/useNetworkStatus';

interface OfflineBannerProps {
  isOnline: boolean;
  syncStatus: SyncStatus;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOnline, syncStatus }) => {
  const [isChecking, setIsChecking] = useState(false);

  const handleManualCheck = async () => {
    setIsChecking(true);
    try {
      await fetch('/favicon.png', { cache: 'no-store', method: 'HEAD' });
      window.location.reload();
    } catch {
      setTimeout(() => setIsChecking(false), 800);
    }
  };

  // If online and fully synced, do not show banner
  if (isOnline && syncStatus === 'synced') {
    return null;
  }

  // Reconnecting transient state
  if (isOnline && syncStatus === 'reconnecting') {
    return (
      <aside 
        aria-label="Network Status" 
        className="sticky top-16 z-30 w-full bg-emerald-950/90 border-b border-emerald-800/60 px-4 py-2 backdrop-blur-md animate-fadeIn"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">Reconnected! Synchronizing life records with cloud database...</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
            Syncing
          </span>
        </div>
      </aside>
    );
  }

  // Offline persistent state
  return (
    <aside 
      aria-label="Offline Mode Notice" 
      className="sticky top-16 z-30 w-full bg-gradient-to-r from-amber-950/90 via-slate-900/95 to-amber-950/90 border-b border-amber-500/30 px-4 py-2.5 backdrop-blur-md animate-slideDown shadow-lg"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
            <WifiOff className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-amber-300">You&apos;re Offline</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Local Cache Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Cached dashboard & local data active. Continue creating tasks, habits, and expenses — all changes are stored locally and will sync once reconnected.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
          {/* Sync Status Badge */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-amber-300/90 font-medium">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>Offline Shell</span>
          </div>

          {/* Retry Connection Button */}
          <button
            type="button"
            onClick={handleManualCheck}
            disabled={isChecking}
            className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-[11px] border border-amber-500/40 flex items-center space-x-1.5 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Checking...' : 'Check Connection'}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
