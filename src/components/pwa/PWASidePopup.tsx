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
      <div className="relative p-4 sm:p-5 rounded-3xl bg-[#0D1117] backdrop-blur-2xl border border-[#1B222D] shadow-2xl shadow-black/90 text-[#F0F6FC] space-y-3.5">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#19B000]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-xl bg-[#11161D] hover:bg-[#1B222D] text-slate-400 hover:text-white border border-[#1B222D] transition"
          aria-label="Close PWA notification"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with App Emblem */}
        <div className="flex items-start space-x-3 pr-6">
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#19B000] via-[#4CAF00] to-[#FFC61A] p-0.5 shadow-lg shadow-[#19B000]/30 shrink-0">
            <img 
              src="./icons/icon-96x96.png" 
              alt="LOTAI Logo" 
              className="w-full h-full rounded-2xl object-cover" 
            />
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFC61A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#FFC61A] border-2 border-[#0D1117]"></span>
            </span>
          </div>

          <div className="space-y-0.5 min-w-0">
            <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-[#19B000]/15 text-[#4CAF00] border border-[#19B000]/30 text-[10px] font-heading font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#FFC61A] shrink-0" />
              <span>{isSignupContext ? 'Install While Registering' : 'PWA App Available'}</span>
            </div>
            <h3 className="text-sm font-heading font-black text-white leading-tight">
              {isIOS 
                ? 'Add LOTAI to Home Screen' 
                : isMobile 
                  ? 'Install LOTAI on Your Device' 
                  : 'Install LOTAI Desktop App'}
            </h3>
          </div>
        </div>

        {/* Value Pitch */}
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {isSignupContext
            ? 'Install LOTAI on your phone for instantaneous offline access, 1-tap voice Omni Capture, and private life tracking.'
            : 'Experience full-screen native performance, zero browser clutter, and offline intent tracking.'}
        </p>

        {/* Feature Checkpoints */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-0.5 font-sans">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#19B000] shrink-0" />
            <span className="truncate">100% Offline Ready</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#FFC61A] shrink-0" />
            <span className="truncate">1-Tap Instant Launch</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 pt-1 font-sans">
          <button
            type="button"
            onClick={onInstall}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#19B000] via-[#4CAF00] to-[#FFC61A] text-black text-xs font-heading font-black shadow-lg shadow-[#19B000]/25 flex items-center justify-center space-x-2 transition hover:brightness-110 active:scale-95 whitespace-nowrap"
          >
            {isMobile ? <Smartphone className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            <span>{isIOS ? 'Add to Home Screen' : 'Install App'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-3 rounded-xl bg-[#11161D] hover:bg-[#1B222D] text-slate-400 hover:text-slate-200 text-xs font-semibold border border-[#1B222D] transition"
          >
            Later
          </button>
        </div>
      </div>
    </aside>
  );
};
