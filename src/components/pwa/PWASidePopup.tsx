import React from 'react';
import { Download, X, Smartphone, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface PWASidePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => void;
  isIOS: boolean;
  isMobile: boolean;
  hasNativePrompt: boolean;
  isSignupContext?: boolean;
}

export const PWASidePopup: React.FC<PWASidePopupProps> = ({
  isOpen,
  onClose,
  onInstall,
  isIOS,
  isMobile,
  hasNativePrompt: _hasNativePrompt,
  isSignupContext = false
}) => {
  if (!isOpen) return null;

  return (
    <aside
      aria-label="PWA Installation Notice"
      className="fixed bottom-4 right-3 left-3 sm:left-auto sm:right-6 sm:bottom-6 z-50 w-auto sm:w-[380px] max-w-full animate-slide-up sm:animate-slide-in-right"
    >
      <div className="relative p-4 sm:p-5 rounded-3xl bg-slate-900/95 backdrop-blur-2xl border border-indigo-500/40 shadow-2xl shadow-black/90 text-slate-100 space-y-3.5">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/80 transition"
          aria-label="Close PWA notification"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with App Emblem */}
        <div className="flex items-start space-x-3 pr-6">
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/30 shrink-0">
            <img 
              src="/icons/icon-96x96.png" 
              alt="LOTAI Logo" 
              className="w-full h-full rounded-2xl object-cover" 
            />
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-indigo-500 border-2 border-slate-900"></span>
            </span>
          </div>

          <div className="space-y-0.5 min-w-0">
            <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
              <span>{isSignupContext ? 'Install While Registering' : 'PWA App Available'}</span>
            </div>
            <h3 className="text-sm font-bold text-white leading-tight">
              {isIOS 
                ? 'Add LOTAI to Home Screen' 
                : isMobile 
                  ? 'Install LOTAI on Your Device' 
                  : 'Install LOTAI Desktop App'}
            </h3>
          </div>
        </div>

        {/* Value Pitch */}
        <p className="text-xs text-slate-300 leading-relaxed">
          {isSignupContext
            ? 'Install LOTAI on your phone for instantaneous offline access, 1-tap voice Omni Capture, and private life tracking.'
            : 'Experience full-screen native performance, zero browser clutter, and offline intent tracking.'}
        </p>

        {/* Feature Checkpoints */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-0.5">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">100% Offline Ready</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">1-Tap Instant Launch</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 pt-1">
          <button
            type="button"
            onClick={onInstall}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-[#6D5DFE] to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition active:scale-95 whitespace-nowrap"
          >
            {isMobile ? <Smartphone className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            <span>{isIOS ? 'Add to Home Screen' : 'Install App'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-semibold border border-slate-700/80 transition"
          >
            Later
          </button>
        </div>
      </div>
    </aside>
  );
};
