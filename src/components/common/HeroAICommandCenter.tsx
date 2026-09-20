import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { OmniCaptureService } from '../../services/omniCaptureService';
import { SpeechService } from '../../services/speechService';
import { OmniCaptureCard } from '../omni/OmniCaptureCard';
import { 
  Sparkles, 
  Mic, 
  Play,
  Pause,
  Square,
  Search,
  X,
  Send, 
  CheckCircle2, 
  ArrowRight,
  DollarSign,
  HeartPulse,
  CheckSquare,
  Repeat,
  Target,
  BookOpen,
  Bot,
  Loader2
} from 'lucide-react';
import { OmniCaptureResult, LifeModule } from '../../types';

export const HeroAICommandCenter: React.FC = () => {
  const { executeOmniSave, setCurrentModule, settings } = useApp();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<OmniCaptureResult | null>(null);
  const [activeCapture, setActiveCapture] = useState<OmniCaptureResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastExecuted, setLastExecuted] = useState<{ message: string; module: LifeModule } | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Real-time intent parsing preview as user types
  useEffect(() => {
    if (inputText.trim().length > 2) {
      const result = OmniCaptureService.parseLocalHeuristic(inputText);
      setParsedPreview(result);
    } else {
      setParsedPreview(null);
    }
  }, [inputText]);

  // Cleanup voice recording on unmount
  useEffect(() => {
    return () => {
      SpeechService.stopListening();
    };
  }, []);

  const handleStartVoice = () => {
    setSpeechError(null);
    setIsPaused(false);
    const ok = SpeechService.startListening(
      {
        onStart: () => {
          setIsListening(true);
          setIsPaused(false);
        },
        onResult: (transcript) => {
          setInputText(transcript);
        },
        onError: (err) => {
          setSpeechError(err);
          setIsListening(false);
          setIsPaused(false);
        },
        onEnd: () => {
          if (!SpeechService.getIsListening() && !SpeechService.isPaused()) {
            setIsListening(false);
          }
        }
      },
      inputText
    );
    if (!ok) {
      setSpeechError('Microphone not available in this browser or permission denied.');
    }
  };

  const handlePauseVoice = () => {
    const text = SpeechService.pauseListening();
    setIsListening(false);
    setIsPaused(true);
    if (text) setInputText(text);
  };

  const handleResumeVoice = () => {
    setIsPaused(false);
    handleStartVoice();
  };

  const handleStopVoice = () => {
    const text = SpeechService.stopListening();
    setIsListening(false);
    setIsPaused(false);
    if (text) setInputText(text);
  };

  const handleToggleVoiceOrb = () => {
    if (isListening) {
      handlePauseVoice();
    } else if (isPaused) {
      handleResumeVoice();
    } else {
      handleStartVoice();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // If currently listening, stop mic and ensure full transcript is captured
    let query = inputText.trim();
    if (isListening || isPaused) {
      const finalVoice = SpeechService.stopListening();
      setIsListening(false);
      setIsPaused(false);
      if (finalVoice) {
        query = finalVoice.trim();
        setInputText(finalVoice);
      }
    }

    if (!query) return;

    setIsAnalyzing(true);
    SpeechService.stopListening();
    setIsListening(false);
    setIsPaused(false);

    try {
      const analyzed = await OmniCaptureService.analyzeInput(
        query,
        settings.geminiApiKey,
        settings.geminiModel
      );

      // Show Preview Screen Before Save for user confirmation / editing
      setActiveCapture(analyzed);
    } catch (err: any) {
      console.error('Omni capture error:', err);
      const fallback = OmniCaptureService.parseLocalHeuristic(query);
      setActiveCapture(fallback);
    } finally {
      setIsAnalyzing(false);
      setInputText('');
      setParsedPreview(null);
    }
  };

  const handleCardSave = async (editedCapture: OmniCaptureResult) => {
    setIsSaving(true);
    try {
      const saveMsg = await executeOmniSave(editedCapture);
      setLastExecuted({
        message: saveMsg,
        module: editedCapture.module
      });
      setActiveCapture(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
    inputRef.current?.focus();
  };

  const getModuleIcon = (mod?: LifeModule) => {
    switch (mod) {
      case 'finance': return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'health': return <HeartPulse className="w-4 h-4 text-rose-400" />;
      case 'tasks': return <CheckSquare className="w-4 h-4 text-blue-400" />;
      case 'habits': return <Repeat className="w-4 h-4 text-amber-400" />;
      case 'goals': return <Target className="w-4 h-4 text-purple-400" />;
      case 'journal': return <BookOpen className="w-4 h-4 text-indigo-400" />;
      default: return <Bot className="w-4 h-4 text-cyan-400" />;
    }
  };

  const exampleChips = [
    'Spent ₹500 on lunch.',
    'today my transportation expense 700 rupees',
    'Hospital expense ₹5000',
    'Received ₹20,000 from client.',
    'Car loan EMI 12000 paid.',
    'My weight is 54kg.',
    'Completed meditation today.',
    'Tomorrow call 10 prospects.',
    'Create a goal to reach ₹1 crore revenue.',
    'Today I felt productive.',
    'AI startup idea: automated tax prep.'
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-indigo-500/30 p-4 sm:p-7 shadow-2xl space-y-6">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Title & Tagline */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow" />
          <span>LOTAI Omni Voice & Intelligence</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-300">
          LOTAI
        </h1>
        <p className="text-sm sm:text-base font-medium text-slate-400 mt-1">
          Life On Track. Powered by AI.
        </p>
      </div>

      {/* [ AI Command Center ] Interactive Console Box */}
      <div className="relative z-10 max-w-3xl mx-auto bg-slate-950/85 backdrop-blur-xl border border-indigo-500/40 rounded-3xl p-4 sm:p-7 shadow-2xl space-y-6">
        
        {/* Top Status Bar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold tracking-wider text-indigo-400 uppercase">
              [ AI COMMAND CENTER ]
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Gemini 3.6 Flash Active</span>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* CHATGPT-STYLE FLUID VOICE ORB SECTION (TOP PROMINENT FEATURE)          */}
        {/* ===================================================================== */}
        <div className="flex flex-col items-center justify-center py-4 sm:py-6 relative">
          
          {/* Animated Ambient Backing Glow */}
          <div className={`absolute w-44 h-44 rounded-full blur-3xl transition-all duration-700 pointer-events-none ${
            isListening 
              ? 'bg-sky-500/30 scale-125' 
              : isPaused 
              ? 'bg-amber-500/25 scale-105' 
              : 'bg-indigo-500/20 scale-100'
          }`} />

          {/* Glowing Fluid Orb Container */}
          <div className="relative flex items-center justify-center">
            {/* Outer Ripple Rings while Listening */}
            {isListening && (
              <>
                <div className="absolute -inset-4 rounded-full bg-sky-400/20 animate-ping opacity-60 pointer-events-none" />
                <div className="absolute -inset-2 rounded-full border border-sky-400/40 animate-pulse pointer-events-none" />
                <div className="absolute -inset-6 rounded-full border border-indigo-400/20 animate-spin-slow pointer-events-none" />
              </>
            )}

            {/* The Fluid Gradient Orb */}
            <button
              type="button"
              onClick={handleToggleVoiceOrb}
              title={isListening ? 'Tap to Pause' : isPaused ? 'Tap to Resume' : 'Tap to Start Voice'}
              className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-2xl cursor-pointer group ${
                isListening
                  ? 'bg-gradient-to-tr from-sky-300 via-blue-100 to-white shadow-[0_0_60px_rgba(56,189,248,0.7)] scale-105 ring-4 ring-sky-300/40'
                  : isPaused
                  ? 'bg-gradient-to-tr from-amber-300 via-indigo-100 to-white shadow-[0_0_40px_rgba(251,191,36,0.5)] ring-4 ring-amber-400/30'
                  : 'bg-gradient-to-tr from-indigo-300 via-sky-200 to-white hover:from-white hover:to-indigo-200 shadow-[0_0_45px_rgba(129,140,248,0.45)] hover:scale-105 ring-2 ring-indigo-400/30'
              }`}
            >
              {/* Inner Soft Center Icon (Play / Pause / Mic) */}
              <div className="relative z-10 flex items-center justify-center">
                {isListening ? (
                  <Pause className="w-9 h-9 sm:w-10 sm:h-10 text-slate-900 fill-slate-900/40 drop-shadow transition" />
                ) : isPaused ? (
                  <Play className="w-9 h-9 sm:w-10 sm:h-10 text-slate-900 fill-slate-900 ml-1 drop-shadow transition" />
                ) : (
                  <Mic className="w-9 h-9 sm:w-10 sm:h-10 text-slate-900 drop-shadow transition group-hover:scale-110" />
                )}
              </div>
            </button>
          </div>

          {/* Voice State Status Text & Visualizer */}
          <div className="text-center mt-4 space-y-1.5">
            <p className="text-sm sm:text-base font-bold text-white flex items-center justify-center space-x-2">
              {isListening ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-200 via-white to-sky-300 font-extrabold">
                    Listening to your voice...
                  </span>
                </>
              ) : isPaused ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="text-amber-300 font-semibold">Voice Paused — Tap to Resume</span>
                </>
              ) : (
                <span className="text-slate-300 font-medium">Tap orb to speak like ChatGPT</span>
              )}
            </p>

            {/* Audio Waveform Simulator Bars when listening */}
            {isListening && (
              <div className="flex items-center justify-center space-x-1.5 py-1">
                <span className="w-1 h-3 bg-sky-400 rounded-full animate-pulse"></span>
                <span className="w-1 h-6 bg-sky-300 rounded-full animate-pulse delay-75"></span>
                <span className="w-1 h-8 bg-white rounded-full animate-pulse delay-150"></span>
                <span className="w-1 h-5 bg-sky-300 rounded-full animate-pulse delay-200"></span>
                <span className="w-1 h-7 bg-indigo-300 rounded-full animate-pulse delay-100"></span>
                <span className="w-1 h-3 bg-sky-400 rounded-full animate-pulse delay-300"></span>
              </div>
            )}
          </div>

          {/* Soft Voice Action Controls (Play/Pause, Stop, Clear) */}
          {(isListening || isPaused || inputText.trim().length > 0) && (
            <div className="flex items-center justify-center gap-2.5 mt-3 animate-fadeIn">
              {/* Play / Pause Toggle Button */}
              <button
                type="button"
                onClick={handleToggleVoiceOrb}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-sm border ${
                  isListening
                    ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
                }`}
              >
                {isListening ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isPaused ? 'Resume' : 'Speak'}</span>
                  </>
                )}
              </button>

              {/* Stop Button */}
              {(isListening || isPaused) && (
                <button
                  type="button"
                  onClick={handleStopVoice}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/40 text-xs font-bold transition shadow-sm"
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>Stop</span>
                </button>
              )}

              {/* Clear Text Button */}
              {inputText.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setInputText('');
                    if (isListening || isPaused) {
                      SpeechService.stopListening();
                      setIsListening(false);
                      setIsPaused(false);
                    }
                  }}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 text-xs font-medium transition"
                >
                  <X className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          )}

          {/* Speech Error Notice */}
          {speechError && (
            <p className="mt-3 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-xl max-w-md text-center">
              {speechError}
            </p>
          )}
        </div>

        {/* ===================================================================== */}
        {/* LIVE DETECTION & SEARCH BAR (DIRECTLY BELOW VOICE SECTION)             */}
        {/* ===================================================================== */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative flex items-center bg-slate-900 border border-slate-700/80 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 rounded-2xl shadow-inner transition p-1 sm:p-1.5">
            <Search className="w-5 h-5 text-indigo-400 ml-3 shrink-0" />
            
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Live detection transcript or type anything here..."
              className="flex-1 bg-transparent px-3 py-3 text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none"
            />

            {/* Clear Button */}
            {inputText && (
              <button
                type="button"
                onClick={() => setInputText('')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 transition mr-1"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Submit / Process Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isAnalyzing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/30 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5 shrink-0 mr-1"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden sm:inline">Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Submit</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Live Intent Classification Feedback Badge */}
          {parsedPreview && !activeCapture && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/90 border border-indigo-500/40 text-xs transition animate-fadeIn">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 shrink-0">
                  {getModuleIcon(parsedPreview.module)}
                </div>
                <div className="truncate">
                  <span className="font-bold text-indigo-400 uppercase tracking-wide mr-2">
                    ⚡ {parsedPreview.masterCategory}:
                  </span>
                  <span className="text-slate-200 font-medium">
                    {parsedPreview.summary}
                  </span>
                </div>
              </div>
              <span className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded border shrink-0 ml-2 ${
                parsedPreview.confidenceTier === 'high'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : (parsedPreview.confidenceTier === 'medium'
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30')
              }`}>
                {Math.round(parsedPreview.confidence * 100)}% {parsedPreview.confidenceTier}
              </span>
            </div>
          )}
        </form>

        {/* Confirmation Card & Fallback Review Mode */}
        {activeCapture && (
          <div className="pt-2">
            <OmniCaptureCard
              capture={activeCapture}
              onSave={handleCardSave}
              onDismiss={() => setActiveCapture(null)}
              isSaving={isSaving}
            />
          </div>
        )}

        {/* Quick Suggestion Inspiration Prompts */}
        <div className="pt-3 border-t border-slate-800/80">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Try saying or typing:
          </p>
          <div className="flex flex-wrap gap-2">
            {exampleChips.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestionClick(item)}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-indigo-500/40 transition"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Last Executed Action Banner */}
        {lastExecuted && !activeCapture && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-300 animate-fadeIn">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{lastExecuted.message}</span>
            </div>
            <button
              onClick={() => setCurrentModule(lastExecuted.module)}
              className="flex items-center space-x-1 font-semibold text-emerald-400 hover:text-emerald-300 ml-2 shrink-0"
            >
              <span>View in {lastExecuted.module}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
