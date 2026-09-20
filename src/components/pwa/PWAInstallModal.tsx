import React from 'react';
import { 
  Download, 
  X, 
  Zap, 
  Smartphone, 
  WifiOff, 
  Maximize2, 
  Share, 
  PlusSquare, 
  Check, 
  Sparkles 
} from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => void;
  isIOS: boolean;
  isMobile: boolean;
  hasNativePrompt: boolean;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  onInstall,
  isIOS,
  isMobile,
  hasNativePrompt
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl shadow-indigo-950/80 space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with App Emblem */}
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 p-0.5 shadow-xl shadow-indigo-500/30 shrink-0">
            <img 
              src="/icons/icon-192x192.png" 
              alt="LOTAI Logo" 
              className="w-full h-full rounded-2xl object-cover" 
            />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500 border-2 border-slate-900"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black text-white tracking-tight">
                {isMobile ? 'Add LOTAI to Home Screen' : 'Install LOTAI App'}
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PWA
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Life On Track AI • Personal Life Operating System
            </p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Why Install LOTAI?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Benefit 1 */}
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Faster Launch</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Opens instantly from your dock or phone home screen.
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Works Like a Native App</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Clean app window without browser URL bar or extra tabs.
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                <WifiOff className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Offline Support</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Access cached dashboard and track data anytime, anywhere.
                </p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 shrink-0 mt-0.5">
                <Maximize2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Full-Screen Experience</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Immersive dark workspace optimized for deep execution.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* iOS Safari Special Instructions */}
        {isIOS && (
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-indigo-300">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>How to Install on iPhone / iPad (Safari)</span>
            </div>
            <ol className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center space-x-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 font-bold text-[11px] shrink-0">1</span>
                <span>Tap the <strong className="text-white">Share</strong> button <Share className="inline w-3.5 h-3.5 mx-1 text-indigo-400" /> in Safari&apos;s bottom toolbar.</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 font-bold text-[11px] shrink-0">2</span>
                <span>Scroll down and tap <strong className="text-white">Add to Home Screen</strong> <PlusSquare className="inline w-3.5 h-3.5 mx-1 text-emerald-400" />.</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 font-bold text-[11px] shrink-0">3</span>
                <span>Tap <strong className="text-white">Add</strong> in the top right corner to finish!</span>
              </li>
            </ol>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition"
          >
            Maybe Later
          </button>

          {!isIOS ? (
            <button
              type="button"
              onClick={onInstall}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{hasNativePrompt ? (isMobile ? 'Add LOTAI to Home Screen' : 'Install LOTAI') : (isMobile ? 'Add to Home Screen' : 'Install App')}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition"
            >
              <Check className="w-4 h-4" />
              <span>Got It</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
