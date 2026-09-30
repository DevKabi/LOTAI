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
      <div className="relative flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl bg-[#0D1117] backdrop-blur-xl border border-[#1B222D] shadow-2xl shadow-black/80 text-[#F0F6FC]">
        {/* Close Button */}
        <button
          onClick={onDismiss}
          className="absolute -top-2 -right-2 p-1 rounded-full bg-[#11161D] hover:bg-[#1B222D] text-slate-400 hover:text-white border border-[#1B222D] shadow-md transition"
          aria-label="Dismiss install banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Mini App Icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#19B000] via-[#4CAF00] to-[#FFC61A] p-0.5 shadow-md shadow-[#19B000]/30 shrink-0">
            <img 
              src="./icons/icon-96x96.png" 
              alt="LOTAI Logo" 
              className="w-full h-full rounded-xl object-cover" 
            />
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center space-x-1.5">
            <h3 className="text-xs font-heading font-bold text-white truncate">
              {isMobile ? 'Add LOTAI to Home Screen' : 'Install LOTAI'}
            </h3>
            <Sparkles className="w-3 h-3 text-[#FFC61A] shrink-0" />
          </div>
          <p className="text-[11px] text-slate-400 truncate font-sans">
            Faster launch • Works offline • Full-screen
          </p>
        </div>

        {/* Install Action Button */}
        <button
          type="button"
          onClick={onOpenModal}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#19B000] to-[#4CAF00] text-black text-xs font-heading font-black shadow-md shadow-[#19B000]/25 flex items-center space-x-1.5 shrink-0 transition hover:brightness-110 active:scale-95"
        >
          {isMobile ? <Smartphone className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
          <span>{isMobile ? 'Add' : 'Install'}</span>
        </button>
      </div>
    </aside>
  );
};
