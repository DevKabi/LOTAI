import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup' | 'forgot_password';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login'
}) => {
  const { 
    signInWithEmail, 
    signUpWithEmail, 
    signInWithGoogle, 
    resetPasswordForEmail, 
    signInAsDemoUser 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'forgot_password'>(initialTab);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [signupSent, setSignupSent] = useState(false);

  // Sync tab when initialTab changes
  useEffect(() => {
    setActiveTab(initialTab);
    setErrorMsg(null);
    setResetSent(false);
    setSignupSent(false);
  }, [initialTab, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setErrorMsg(null);

    const { error } = await signInWithEmail(email, password);
    setIsLoading(false);

    if (error) {
      setErrorMsg(error.message || 'Failed to sign in. Please verify your credentials.');
    } else {
      onClose();
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const { error, needsEmailConfirmation } = await signUpWithEmail(email, password, name);
    setIsLoading(false);

    if (error) {
      setErrorMsg(error.message || 'Failed to sign up.');
    } else if (needsEmailConfirmation) {
      setSignupSent(true);
    } else {
      onClose();
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    const { error } = await signInWithGoogle();
    if (error) {
      setErrorMsg(error.message || 'Google OAuth failed.');
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setErrorMsg(null);

    const { error } = await resetPasswordForEmail(email);
    setIsLoading(false);

    if (error) {
      setErrorMsg(error.message || 'Failed to send recovery email.');
    } else {
      setResetSent(true);
    }
  };

  const handleDemoLogin = () => {
    signInAsDemoUser();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-w-md bg-[#0D1117] border border-[#1B222D] rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/90 space-y-5 relative max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-[#11161D] hover:bg-[#1B222D] transition active:scale-95"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1 pt-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#19B000]/15 border border-[#19B000]/30 text-[#4CAF00] text-xs font-heading font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#FFC61A]" />
            <span>LOTAI Unified Life OS</span>
          </div>
          <h3 className="text-2xl font-heading font-black text-white">
            {activeTab === 'login' && 'Welcome Back'}
            {activeTab === 'signup' && 'Create Your Account'}
            {activeTab === 'forgot_password' && 'Reset Password'}
          </h3>
          <p className="text-xs text-slate-400 font-sans">
            {activeTab === 'login' && 'Sign in to access your unified LifeHub, Omni Capture & AI Coach.'}
            {activeTab === 'signup' && 'Start organizing your life with intelligent AI assistance.'}
            {activeTab === 'forgot_password' && 'Enter your email to receive recovery instructions.'}
          </p>
        </div>

        {/* Tab Toggle (if not in forgot password) */}
        {activeTab !== 'forgot_password' && (
          <div className="grid grid-cols-2 p-1 bg-[#11161D] rounded-2xl border border-[#1B222D]">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-heading font-black rounded-xl transition ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-[#19B000] to-[#4CAF00] text-black shadow-md shadow-[#19B000]/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-heading font-black rounded-xl transition ${
                activeTab === 'signup'
                  ? 'bg-gradient-to-r from-[#19B000] to-[#4CAF00] text-black shadow-md shadow-[#19B000]/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Start Journey
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-[#FFC61A]/10 border border-[#FFC61A]/30 text-[#FFD43B] text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Sign In Tab */}
        {activeTab === 'login' && (
          <div className="space-y-4">
            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm shadow-md transition disabled:opacity-40 active:scale-[0.98]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="font-heading font-bold">Continue with Google</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-[#1B222D]"></div>
              <span className="flex-shrink mx-3 text-slate-500 text-[11px] uppercase tracking-wider font-semibold">Or with email</span>
              <div className="flex-grow border-t border-[#1B222D]"></div>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-3">
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

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-400">Password</label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('forgot_password')}
                    className="text-xs text-[#FFC61A] hover:text-[#FFD43B] transition"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#11161D] border border-[#1B222D] focus:border-[#19B000] focus:ring-2 focus:ring-[#19B000]/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F0F6FC] placeholder-slate-500 focus:outline-none transition"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#19B000] to-[#4CAF00] text-black font-heading font-black text-sm shadow-lg shadow-[#19B000]/25 transition hover:brightness-110 disabled:opacity-40 flex items-center justify-center space-x-2 active:scale-95 min-h-[44px]"
              >
                <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Sign Up Tab */}
        {activeTab === 'signup' && (
          <div className="space-y-4">
            {signupSent ? (
              <div className="text-center space-y-3 py-3">
                <div className="w-12 h-12 rounded-full bg-[#19B000]/20 text-[#19B000] mx-auto flex items-center justify-center border border-[#19B000]/30">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-heading font-bold text-white">Check Your Inbox</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  We sent an activation link to <strong className="text-white">{email}</strong>. Please check your email to complete your registration.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="w-full py-2.5 rounded-xl bg-[#11161D] hover:bg-[#1B222D] text-slate-200 text-xs font-heading font-bold border border-[#1B222D] transition"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <>
                {/* Google OAuth */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-heading font-bold text-xs sm:text-sm shadow-md transition disabled:opacity-40 active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Sign up with Google</span>
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-[#1B222D]"></div>
                  <span className="flex-shrink mx-3 text-slate-500 text-[11px] uppercase tracking-wider font-semibold">Or with email</span>
                  <div className="flex-grow border-t border-[#1B222D]"></div>
                </div>

                <form onSubmit={handleEmailSignUp} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Mercer"
                        className="w-full bg-[#11161D] border border-[#1B222D] focus:border-[#19B000] focus:ring-2 focus:ring-[#19B000]/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F0F6FC] placeholder-slate-500 focus:outline-none transition"
                      />
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    </div>
                  </div>

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

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Password</label>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-[#11161D] border border-[#1B222D] focus:border-[#19B000] focus:ring-2 focus:ring-[#19B000]/20 rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#F0F6FC] placeholder-slate-500 focus:outline-none transition"
                        />
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Confirm</label>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-[#11161D] border border-[#1B222D] focus:border-[#19B000] focus:ring-2 focus:ring-[#19B000]/20 rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#F0F6FC] placeholder-slate-500 focus:outline-none transition"
                        />
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#19B000] to-[#4CAF00] text-black font-heading font-black text-sm shadow-lg shadow-[#19B000]/25 transition hover:brightness-110 disabled:opacity-40 flex items-center justify-center space-x-2 active:scale-95 min-h-[44px]"
                  >
                    <span>{isLoading ? 'Creating Account...' : 'Start Your Journey'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        )}

        {/* Forgot Password Tab */}
        {activeTab === 'forgot_password' && (
          <div className="space-y-4">
            {resetSent ? (
              <div className="text-center space-y-3 py-3">
                <div className="w-12 h-12 rounded-full bg-[#19B000]/20 text-[#19B000] mx-auto flex items-center justify-center border border-[#19B000]/30">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-heading font-bold text-white">Reset Link Sent</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  If an account exists for <strong className="text-white">{email}</strong>, you will receive instructions to reset your password.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="w-full py-2.5 rounded-xl bg-[#11161D] hover:bg-[#1B222D] text-slate-200 text-xs font-heading font-bold border border-[#1B222D] transition flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Sign In</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3">
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

                <div className="flex space-x-2 pt-1 font-sans">
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="w-1/3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-[#11161D] hover:bg-[#1B222D] border border-[#1B222D] transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#19B000] to-[#4CAF00] text-black font-heading font-black text-xs shadow-lg shadow-[#19B000]/25 transition hover:brightness-110 disabled:opacity-40"
                  >
                    {isLoading ? 'Sending...' : 'Send Recovery Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Instant Preview Option */}
        <div className="pt-2 border-t border-[#1B222D] space-y-2 text-center">
          <p className="text-[11px] text-slate-400 font-sans">
            Want to test LOTAI immediately without an account?
          </p>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-3 rounded-xl bg-[#11161D] hover:bg-[#1B222D] text-[#4CAF00] hover:text-[#9ACD00] border border-[#19B000]/30 text-xs font-heading font-bold transition active:scale-95 flex items-center justify-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFC61A]" />
            <span>Instant Preview</span>
          </button>
        </div>
      </div>
    </div>
  );
};
