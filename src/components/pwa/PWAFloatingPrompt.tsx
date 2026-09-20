import React from 'react';
import { Download, X, Sparkles, Smartphone } from 'lucide-react';

interface PWAFloatingPromptProps {
  isInstallable: boolean;
  isStandalone: boolean;
  isDismissed: boolean;
  isMobile: boolean;
  onOpenModal: () => void;
  onDismiss: () => void;
}

export const PWAFloatingPrompt: React.FC<PWAFloatingPromptProps> = ({
  isInstallable,
  isStandalone,
  isDismissed,
  isMobile,
  onOpenModal,
  onDismiss
}) => {
  if (!isInstallable || isStandalone || isDismissed) {
    return null;
  }

  return (
    <aside 
      aria-label="App Installation Prompt" 
      className="fixed bottom-5 right-5 z-40 max-w-sm w-[calc(100vw-2.5rem)] sm:w-auto animate-slideUp"
    >
      <div className="relative flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-indigo-500/40 shadow-2xl shadow-indigo-950/90 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onDismiss}
          className="absolute -top-2 -right-2 p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 shadow-md transition"
          aria-label="Dismiss install banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Mini App Icon */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 p-0.5 shrink-0 shadow-md shadow-indigo-500/30">
          <img 
            src="/icons/icon-96x96.png" 
            alt="LOTAI" 
            className="w-full h-full rounded-xl object-cover" 
          />
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center space-x-1.5">
            <h3 className="text-xs font-bold text-white truncate">
              {isMobile ? 'Add LOTAI to Home Screen' : 'Install LOTAI'}
            </h3>
            <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
          </div>
          <p className="text-[11px] text-slate-400 truncate">
            Faster launch • Works offline • Full-screen
          </p>
        </div>

        {/* Install Action Button */}
        <button
          type="button"
          onClick={onOpenModal}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 shrink-0 transition active:scale-95"
        >
          {isMobile ? <Smartphone className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
          <span>{isMobile ? 'Add' : 'Install'}</span>
        </button>
      </div>
    </aside>
  );
};
