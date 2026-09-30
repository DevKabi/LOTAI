import React, { ReactNode } from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  const { isConfigured } = useAuth();

  return (
    <div className="min-h-screen w-full bg-[#050505] text-[#F0F6FC] flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Cyber Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#19B000]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#FFC61A]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Brand Header */}
      <header className="p-6 flex items-center justify-between max-w-7xl mx-auto w-full relative z-10">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-[#19B000] via-[#4CAF00] to-[#FFC61A] shadow-lg shadow-[#19B000]/25">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="font-heading font-black text-xl tracking-tight text-white">
              LOT<span className="text-[#19B000]">AI</span>
            </span>
            <span className="ml-2 text-[10px] uppercase font-heading font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#19B000]/15 text-[#4CAF00] border border-[#19B000]/30">
              Life Operating System
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#11161D] border border-[#1B222D] text-slate-300">
          <ShieldCheck className={`w-3.5 h-3.5 ${isConfigured ? 'text-[#19B000]' : 'text-[#FFC61A]'}`} />
          <span>{isConfigured ? 'LOTAI Cloud Connected' : 'Cloud Sync Ready'}</span>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md bg-[#0D1117] backdrop-blur-2xl border border-[#1B222D] rounded-3xl p-7 sm:p-9 shadow-2xl shadow-black/80 space-y-6">
          <div className="text-center space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-sans">
              {subtitle}
            </p>
          </div>

          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-slate-500 relative z-10 font-sans">
        LOTAI — Life On Track. Powered by AI. Protected by Cloud Security.
      </footer>
    </div>
  );
};
