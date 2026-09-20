import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { GeminiService, AppContextSummary } from '../../services/geminiService';
import { SpeechService } from '../../services/speechService';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Volume2, 
  RefreshCw, 
  TrendingUp,
  DollarSign,
  Activity
} from 'lucide-react';
import { ChatMessage } from '../../types';

export const AICoachDrawer: React.FC = () => {
  const { 
    isCoachDrawerOpen, 
    setIsCoachDrawerOpen, 
    lifeScore, 
    habits, 
    tasks, 
    finances, 
    health, 
    journal, 
    goals, 
    settings 
  } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Hello ${settings.userName}! I am **LOTAI**, your Personal Life Coach.\n\nYour current **Life on Track Score is ${lifeScore.overall}%**. How can I help you optimize your habits, finances, health, or focus today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isCoachDrawerOpen) return null;

  // Build current real-time context summary
  const todayKey = new Date().toISOString().split('T')[0];
  const currentMonthKey = todayKey.substring(0, 7);
  const completedHabitsToday = habits.filter(h => h.history[todayKey]).length;
  const pendingTasks = tasks.filter(t => t.status !== 'done').length;
  const monthExpenses = finances
    .filter(f => f.type === 'expense' && f.date.startsWith(currentMonthKey))
    .reduce((acc, curr) => acc + curr.amount, 0);
  const todayHealth = health.find(h => h.date === todayKey) || health[0];

  const contextSummary: AppContextSummary = {
    lifeScore: lifeScore.overall,
    completedHabitsToday,
    totalHabits: habits.length,
    pendingTasksCount: pendingTasks,
    spentThisMonth: monthExpenses,
    monthlyBudget: settings.monthlyBudget,
    recentWaterMl: todayHealth?.waterIntakeMl || 0,
    recentSleepHours: todayHealth?.sleepHours || 8,
    recentMood: journal[0]?.mood || 'neutral',
    activeGoals: goals.filter(g => g.status === 'in-progress').map(g => g.title)
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await GeminiService.askCoach(
        query,
        contextSummary,
        settings.geminiApiKey,
        settings.geminiModel
      );

      const assistantMsg: ChatMessage = {
        id: 'assistant-' + Date.now(),
        sender: 'assistant',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);

      // Speak text if voice feedback enabled
      if (settings.voiceFeedback) {
        SpeechService.speakText(response);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    SpeechService.speakText(text);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex justify-end transition-opacity">
      <div 
        className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 flex flex-col shadow-2xl transition-transform transform translate-x-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-slate-100">LOTAI Life Coach</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {settings.geminiApiKey ? `Powered by Gemini (${settings.geminiModel})` : 'Smart Offline AI Assistant'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCoachDrawerOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Context Metric Pill Bar */}
        <div className="grid grid-cols-3 gap-2 px-4 py-2.5 bg-slate-950/40 border-b border-slate-800/80 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-400">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span>Score: <strong className="text-indigo-300">{lifeScore.overall}%</strong></span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-400">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            <span>Habits: <strong className="text-amber-300">{completedHabitsToday}/{habits.length}</strong></span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-400">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Spent: <strong className="text-emerald-300">{settings.currency}{monthExpenses.toFixed(0)}</strong></span>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
              </div>
              <div className="flex items-center space-x-2 mt-1 px-1 text-[10px] text-slate-500">
                <span>{msg.timestamp}</span>
                {msg.sender === 'assistant' && (
                  <button
                    onClick={() => handleSpeak(msg.text)}
                    className="hover:text-indigo-400 transition"
                    title="Read aloud"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 w-fit">
              <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />
              <span className="text-xs text-slate-400">LOTAI is synthesizing insights...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Carousel */}
        <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/60">
          <p className="text-[11px] text-slate-500 font-semibold mb-1.5 flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Suggested Coaching Questions:</span>
          </p>
          <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              'How is my overall life balance today?',
              'Analyze my spending vs monthly budget',
              'Give me advice to sleep better tonight',
              'What should I prioritize next?'
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap text-xs px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask coach for advice, habit ideas, or analysis..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-2.5 rounded-xl bg-indigo-600 text-white disabled:opacity-40 hover:bg-indigo-500 transition shadow-md shadow-indigo-600/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
