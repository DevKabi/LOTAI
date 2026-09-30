import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from './AuthLayout';
import { AuthView } from '../../types/auth';
import { Mail, ArrowLeft, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ForgotPasswordPageProps {
  onSwitchView: (view: AuthView) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onSwitchView }) => {
  const { resetPasswordForEmail, isConfigured } = useAuth();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setErrorMsg(null);

    const { error } = await resetPasswordForEmail(email);
    setIsLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setIsSent(true);
    }
  };

  if (isSent) {
    return (
      <AuthLayout
        title="Check Your Inbox"
        subtitle="Password recovery instructions sent"
      >
        <div className="text-center space-y-4 py-2">
          <div className="w-12 h-12 rounded-full bg-[#19B000]/20 text-[#19B000] mx-auto flex items-center justify-center border border-[#19B000]/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <p className="text-sm text-slate-300">
            If an account exists for <strong className="text-white">{email}</strong>, you will receive an email with instructions to reset your password.
          </p>
          <button
            onClick={() => onSwitchView('login')}
            className="w-full py-2.5 rounded-xl bg-[#11161D] hover:bg-[#1B222D] text-slate-200 text-xs font-heading font-bold border border-[#1B222D] transition flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Sign In</span>
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your email to receive a password reset link"
    >
      <div className="space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-[#FFC61A]/10 border border-[#FFC61A]/30 text-[#FFD43B] text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Email address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#11161D] border border-[#1B222D] focus:border-[#19B000] focus:ring-2 focus:ring-[#19B000]/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F0F6FC] placeholder-slate-500 focus:outline-none transition"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !isConfigured}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#19B000] to-[#4CAF00] text-black font-heading font-black text-sm shadow-lg shadow-[#19B000]/25 transition hover:brightness-110 disabled:opacity-40 flex items-center justify-center space-x-2 active:scale-95"
          >
            <span>{isLoading ? 'Sending Link...' : 'Send Recovery Link'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => onSwitchView('login')}
            className="text-xs font-heading font-bold text-[#19B000] hover:text-[#4CAF00] transition flex items-center justify-center space-x-1 mx-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};
