import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { OmniCaptureService } from '../../services/omniCaptureService';
import { SpeechService } from '../../services/speechService';
import { OmniCaptureCard } from './OmniCaptureCard';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  X, 
  CornerDownLeft, 
  ArrowRight,
  DollarSign,
  HeartPulse,
  CheckSquare,
  Repeat,
  Target,
  BookOpen,
  Bot,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { OmniCaptureResult, LifeModule } from '../../types';

export const OmniInputModal: React.FC = () => {
  const { isOmniModalOpen, setIsOmniModalOpen, executeOmniSave, setCurrentModule, settings } = useApp();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<OmniCaptureResult | null>(null);
  const [activeCapture, setActiveCapture] = useState<OmniCaptureResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastExecuted, setLastExecuted] = useState<{ message: string; module: LifeModule } | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOmniModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setInputText('');
      setParsedPreview(null);
      setActiveCapture(null);
      setLastExecuted(null);
      setSpeechError(null);
    } else {
      SpeechService.stopListening();
      setIsListening(false);
    }
  }, [isOmniModalOpen]);

  // Live real-time classification preview
  useEffect(() => {
    if (inputText.trim().length > 2) {
      const result = OmniCaptureService.parseLocalHeuristic(inputText);
      setParsedPreview(result);
    } else {
      setParsedPreview(null);
    }
  }, [inputText]);

  if (!isOmniModalOpen) return null;

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

      // Show Preview Screen Before Save for review and confirmation
      setActiveCapture(analyzed);
    } catch (err: any) {
      console.error('Omni capture modal error:', err);
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

  const handlePresetClick = (preset: string) => {
    setInputText(preset);
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

  const presets = [
    'Spent ₹500 on lunch.',
    'Received ₹20,000 from client.',
    'My weight is 54kg.',
    'Completed meditation today.',
    'Tomorrow call 10 prospects.',
    'Create a goal to reach ₹1 crore revenue.',
    'Today I felt productive and closed two clients.'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-950/80 backdrop-blur-md transition-all overflow-y-auto pb-10">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden transition-all transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              LOTAI Omni Capture AI Engine
            </span>
          </div>
          <button
            onClick={() => setIsOmniModalOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tell LOTAI anything... (e.g. 'Spent ₹500 on lunch', 'My weight is 54kg')"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3.5 pr-24 text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
            
            <div className="absolute right-2.5 flex items-center space-x-1.5">
              {/* Voice Dictation Button */}
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`p-2 rounded-lg transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/50'
                    : 'text-slate-400 hover:text-indigo-400 hover:bg-slate-800'
                }`}
                title={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!inputText.trim() || isAnalyzing}
                className="p-2 rounded-lg bg-indigo-600 text-white disabled:opacity-30 hover:bg-indigo-500 transition shadow-sm"
                title="Execute Command"
              >
                {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CornerDownLeft className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Voice Listening Wave Indicator */}
          {isListening && (
            <div className="flex items-center justify-center space-x-2 py-2 px-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              <span className="font-medium">Listening to your voice... Speak naturally</span>
              <div className="flex space-x-1 items-center h-4 ml-2">
                <span className="w-1 h-3 bg-rose-400 animate-pulse"></span>
                <span className="w-1 h-5 bg-rose-400 animate-pulse delay-75"></span>
                <span className="w-1 h-2 bg-rose-400 animate-pulse delay-150"></span>
                <span className="w-1 h-4 bg-rose-400 animate-pulse"></span>
              </div>
            </div>
          )}

          {speechError && (
            <p className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg">
              {speechError}
            </p>
          )}

          {/* Real-time AI Intent Pill & Preview while typing */}
          {parsedPreview && !activeCapture && (
            <div className="p-3 rounded-xl bg-slate-950/80 border border-indigo-500/30 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700">
                  {getModuleIcon(parsedPreview.module)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                      AI Intent Detected:
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {parsedPreview.masterCategory} ➔ {parsedPreview.destinationTable}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                      parsedPreview.confidenceTier === 'high'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {Math.round(parsedPreview.confidence * 100)}%
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-200 mt-0.5">
                    {parsedPreview.summary}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="flex items-center space-x-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition shrink-0"
              >
                <span>Capture</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Confirmation Card & Fallback Review Card */}
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

          {/* Last Executed Notification */}
          {lastExecuted && !activeCapture && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-300 animate-fadeIn">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{lastExecuted.message}</span>
              </div>
              <button
                onClick={() => {
                  setCurrentModule(lastExecuted.module);
                  setIsOmniModalOpen(false);
                }}
                className="flex items-center space-x-1 font-semibold text-emerald-400 hover:text-emerald-300 ml-2 shrink-0"
              >
                <span>Go to {lastExecuted.module}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Quick Preset Ideas */}
          <div className="pt-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Try quick commands:
            </p>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-indigo-300 hover:border-indigo-500/30 border border-slate-700/60 transition"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Footer info */}
        <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-[11px] text-slate-500">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Enter</kbd> to submit</span>
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
};
