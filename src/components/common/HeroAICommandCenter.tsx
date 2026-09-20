import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { OmniCaptureService } from '../../services/omniCaptureService';
import { SpeechService } from '../../services/speechService';
import { OmniCaptureCard } from '../omni/OmniCaptureCard';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Send, 
  Keyboard, 
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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // If currently listening, stop mic and ensure full transcript is captured
    let query = inputText.trim();
    if (isListening) {
      const finalVoice = SpeechService.stopListening();
      setIsListening(false);
      if (finalVoice) {
        query = finalVoice.trim();
        setInputText(finalVoice);
      }
    }

    if (!query) return;

    setIsAnalyzing(true);
    SpeechService.stopListening();
    setIsListening(false);

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

  const toggleVoiceRecording = () => {
    if (isListening) {
      // Stop recording and preserve complete translation in the search bar
      const finalTranscript = SpeechService.stopListening();
      setIsListening(false);
      if (finalTranscript) {
        setInputText(finalTranscript);
      }
      inputRef.current?.focus();
    } else {
      setSpeechError(null);
      const ok = SpeechService.startListening(
        {
          onStart: () => setIsListening(true),
          onResult: (transcript) => {
            // Continuously paste real-time speech translation into the search bar
            setInputText(transcript);
          },
          onError: (err) => {
            setSpeechError(err);
            setIsListening(false);
          },
          onEnd: () => {
            if (!SpeechService.getIsListening()) {
              setIsListening(false);
            }
          }
        },
        inputText
      );
      if (!ok) {
        setSpeechError('Microphone not available in this browser or permission denied.');
      }
    }
  };

  const handleFocusType = () => {
    inputRef.current?.focus();
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
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Title & Tagline */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow" />
          <span>LOTAI Omni Capture AI Engine</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-300">
          LOTAI
        </h1>
        <p className="text-base sm:text-lg font-medium text-slate-400 mt-1">
          Life On Track. Powered by AI.
        </p>
      </div>

      {/* [ AI Command Center ] Interactive Console Box */}
      <div className="relative z-10 max-w-3xl mx-auto bg-slate-950/80 backdrop-blur-xl border border-indigo-500/40 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        {/* Console Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold tracking-wider text-indigo-400 uppercase">
              [ AI Command Center ]
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            {settings.geminiApiKey ? 'Gemini 2.5 Active' : 'Offline Heuristic Engine'}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tell LOTAI anything..."
              className="w-full bg-slate-900 border border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl px-4 sm:px-5 py-4 text-base sm:text-lg text-slate-100 placeholder-slate-500 focus:outline-none transition pr-28"
            />

            {/* Listening Wave Overlay when active */}
            {isListening && (
              <div className="absolute inset-y-0 right-3 flex items-center space-x-1.5 pointer-events-none pr-2">
                <span className="text-xs font-bold text-rose-400 animate-pulse hidden sm:inline">
                  Listening continuously...
                </span>
                <span className="w-1.5 h-4 bg-rose-500 rounded-full animate-pulse"></span>
                <span className="w-1.5 h-7 bg-rose-500 rounded-full animate-pulse delay-75"></span>
                <span className="w-1.5 h-10 bg-rose-500 rounded-full animate-pulse delay-150"></span>
                <span className="w-1.5 h-5 bg-rose-500 rounded-full animate-pulse delay-200"></span>
              </div>
            )}
          </div>

          {/* Action Control Buttons: Voice, Type, Submit */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center space-x-2">
              {/* 🎤 Voice Button */}
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md ${
                  isListening
                    ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse shadow-rose-500/40 ring-2 ring-rose-400/50'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4 text-white" />
                    <span>🔴 Stop Mic</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-rose-400" />
                    <span>🎤 Voice</span>
                  </>
                )}
              </button>

              {/* ⌨️ Type Button */}
              <button
                type="button"
                onClick={handleFocusType}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 font-bold text-xs sm:text-sm transition shadow-md"
              >
                <Keyboard className="w-4 h-4 text-indigo-400" />
                <span>⌨️ Type</span>
              </button>
            </div>

            {/* ➤ Submit / Go Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isAnalyzing}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg transition disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 ${
                isListening
                  ? 'bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white shadow-emerald-600/30 ring-2 ring-emerald-400/50'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : isListening ? (
                <>
                  <span>➤ Go / Submit</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>➤ Submit</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Speech Error Warning */}
          {speechError && (
            <p className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg">
              {speechError}
            </p>
          )}

          {/* Live Intent Classification Feedback Pill while typing */}
          {parsedPreview && !activeCapture && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-indigo-500/40 text-xs transition animate-fadeIn">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700">
                  {getModuleIcon(parsedPreview.module)}
                </div>
                <div>
                  <span className="font-bold text-indigo-400 uppercase tracking-wide mr-2">
                    ⚡ {parsedPreview.masterCategory} ➔ {parsedPreview.destinationTable}:
                  </span>
                  <span className="text-slate-200 font-medium">
                    {parsedPreview.summary}
                  </span>
                </div>
              </div>
              <span className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded border ${
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
