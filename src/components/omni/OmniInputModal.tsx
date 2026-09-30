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
      case 'finance': return <DollarSign className="w-4 h-4 text-[#4CAF00]" />;
      case 'health': return <HeartPulse className="w-4 h-4 text-[#19B000]" />;
      case 'tasks': return <CheckSquare className="w-4 h-4 text-[#FFC61A]" />;
      case 'habits': return <Repeat className="w-4 h-4 text-[#FFD43B]" />;
      case 'goals': return <Target className="w-4 h-4 text-[#9ACD00]" />;
      case 'journal': return <BookOpen className="w-4 h-4 text-[#FFE066]" />;
      default: return <Bot className="w-4 h-4 text-[#4CAF00]" />;
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-[#050505]/85 backdrop-blur-md transition-all overflow-y-auto pb-10">
      <div 
        className="w-full max-w-2xl bg-[#0D1117] border border-[#1B222D] rounded-2xl shadow-2xl overflow-hidden transition-all transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1B222D] bg-[#050505]">
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded-lg bg-[#19B000]/15 text-[#4CAF00] border border-[#19B000]/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-heading font-black uppercase tracking-wider text-white">
              LOTAI Omni Capture AI Engine
            </span>
          </div>
          <button
            onClick={() => setIsOmniModalOpen(false)}
            className="p-1 text-[#8B949E] hover:text-white rounded-lg hover:bg-[#11161D] transition"
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
              className="w-full bg-[#11161D] border border-[#1B222D] rounded-xl px-4 py-3.5 pr-24 text-base text-white placeholder-[#8B949E] focus:outline-none focus:border-[#19B000] focus:ring-1 focus:ring-[#19B000]"
            />
            
            <div className="absolute right-2.5 flex items-center space-x-1.5">
              {/* Voice Dictation Button */}
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`p-2 rounded-lg transition-all ${
                  isListening
                    ? 'bg-[#FFC61A] text-black animate-pulse shadow-lg shadow-[#FFC61A]/50'
                    : 'text-[#8B949E] hover:text-[#4CAF00] hover:bg-[#11161D]'
                }`}
                title={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!inputText.trim() || isAnalyzing}
                className="p-2 rounded-lg bg-gradient-to-r from-[#19B000] to-[#4CAF00] text-black disabled:opacity-30 hover:brightness-110 transition shadow-sm font-heading font-black"
                title="Execute Command"
              >
                {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CornerDownLeft className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Voice Listening Wave Indicator */}
          {isListening && (
            <div className="flex items-center justify-center space-x-2 py-2 px-4 rounded-xl bg-[#FFC61A]/10 border border-[#FFC61A]/30 text-[#FFD43B] text-sm font-heading font-bold">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFC61A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFC61A]"></span>
              </span>
              <span>Listening to your voice... Speak naturally</span>
              <div className="flex space-x-1 items-center h-4 ml-2">
                <span className="w-1 h-3 bg-[#FFC61A] animate-pulse"></span>
                <span className="w-1 h-5 bg-[#FFC61A] animate-pulse delay-75"></span>
                <span className="w-1 h-2 bg-[#FFC61A] animate-pulse delay-150"></span>
                <span className="w-1 h-4 bg-[#FFC61A] animate-pulse"></span>
              </div>
            </div>
          )}

          {speechError && (
            <p className="text-xs text-[#FFC61A] bg-[#FFC61A]/10 border border-[#FFC61A]/20 px-3 py-1.5 rounded-lg">
              {speechError}
            </p>
          )}

          {/* Real-time AI Intent Pill & Preview while typing */}
          {parsedPreview && !activeCapture && (
            <div className="p-3 rounded-xl bg-[#11161D] border border-[#19B000]/40 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded-lg bg-[#0D1117] border border-[#1B222D]">
                  {getModuleIcon(parsedPreview.module)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-heading font-black uppercase tracking-wider text-[#4CAF00]">
                      AI Intent Detected:
                    </span>
                    <span className="text-xs font-heading font-bold px-2 py-0.5 rounded-full bg-[#19B000]/15 text-[#4CAF00] border border-[#19B000]/30">
                      {parsedPreview.masterCategory} ➔ {parsedPreview.destinationTable}
                    </span>
                    <span className={`text-[10px] uppercase font-heading font-black px-2 py-0.5 rounded border ${
                      parsedPreview.confidenceTier === 'high'
                        ? 'bg-[#19B000]/20 text-[#4CAF00] border-[#19B000]/30'
                        : 'bg-[#FFC61A]/20 text-[#FFD43B] border-[#FFC61A]/30'
                    }`}>
                      {Math.round(parsedPreview.confidence * 100)}%
                    </span>
                  </div>
                  <p className="text-sm font-medium text-[#F0F6FC] mt-0.5">
                    {parsedPreview.summary}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="flex items-center space-x-1 text-xs font-heading font-black px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#19B000] to-[#4CAF00] text-black hover:brightness-110 transition shrink-0"
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
            <div className="p-3.5 rounded-xl bg-[#19B000]/10 border border-[#19B000]/30 flex items-center justify-between text-xs text-[#4CAF00] animate-fadeIn">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#4CAF00] shrink-0" />
                <span className="font-semibold text-white">{lastExecuted.message}</span>
              </div>
              <button
                onClick={() => {
                  setCurrentModule(lastExecuted.module);
                  setIsOmniModalOpen(false);
                }}
                className="flex items-center space-x-1 font-heading font-bold text-[#FFC61A] hover:text-[#FFD43B] ml-2 shrink-0"
              >
                <span>Go to {lastExecuted.module}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Quick Preset Ideas */}
          <div className="pt-2">
            <p className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#8B949E] mb-2">
              Try quick commands:
            </p>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-[#11161D] text-[#C9D1D9] hover:bg-[#1B222D] hover:text-[#4CAF00] hover:border-[#19B000]/40 border border-[#1B222D] transition"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Footer info */}
        <div className="px-5 py-3 border-t border-[#1B222D] bg-[#050505] flex items-center justify-between text-[11px] text-[#8B949E]">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-[#11161D] text-[#C9D1D9] border border-[#1B222D]">Enter</kbd> to submit</span>
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-[#11161D] text-[#C9D1D9] border border-[#1B222D]">Esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
};
