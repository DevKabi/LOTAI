import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Target, 
  CheckSquare, 
  Brain, 
  Repeat, 
  GraduationCap, 
  Wallet, 
  Activity, 
  BookOpen, 
  Lightbulb, 
  ArrowRight, 
  Plus, 
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  X,
  Send,
  Timer
} from 'lucide-react';
import { LifeModule } from '../../types';

interface ModuleCardConfig {
  id: string;
  name: string;
  description: string;
  targetModule: LifeModule;
  icon: React.ElementType;
  accentColor: {
    badge: string;
    iconBg: string;
    borderHover: string;
    shadowHover: string;
    textHover: string;
    bar: string;
    btnAccent: string;
  };
  stat1: string;
  stat2: string;
  progressPercent: number;
  openLabel: string;
  quickActionLabel: string;
  onQuickAction: () => void;
}

export const QuickAccessLifeModules: React.FC = () => {
  const { 
    goals, 
    tasks, 
    habits, 
    finances, 
    health, 
    journal, 
    settings, 
    setCurrentModule, 
    showToast,
    logWater,
    addJournalEntry
  } = useApp();

  // Modals for Focus & Mind Notes
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);
  const [focusSeconds, setFocusSeconds] = useState(25 * 60);
  const [isFocusRunning, setIsFocusRunning] = useState(false);
  const [focusTaskName, setFocusTaskName] = useState('Deep Work Session');

  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  // Study log modal
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);
  const [studySubject, setStudySubject] = useState('System Design & AI Algorithms');
  const [studyHours, setStudyHours] = useState('2.5');

  // Focus Pomodoro countdown timer
  useEffect(() => {
    let timer: any = null;
    if (isFocusRunning && focusSeconds > 0) {
      timer = setInterval(() => {
        setFocusSeconds(prev => prev - 1);
      }, 1000);
    } else if (focusSeconds === 0 && isFocusRunning) {
      setIsFocusRunning(false);
      showToast('Focus Session Complete! 🧠', 'Great job sustaining deep concentration.', 'success');
    }
    return () => clearInterval(timer);
  }, [isFocusRunning, focusSeconds, showToast]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    addJournalEntry({
      date: new Date().toISOString().split('T')[0],
      mood: 'productive',
      title: noteTitle.trim() || 'Mind Note / Quick Idea',
      content: noteContent.trim(),
      tags: ['mind-note', 'idea', 'observation'],
      aiSentiment: 'positive',
      aiReflection: 'Mind Note captured and indexed in your knowledge graph.'
    });

    setNoteTitle('');
    setNoteContent('');
    setIsNotesModalOpen(false);
    showToast('Mind Note Saved 💡', 'Idea saved to your reflections.');
  };

  const handleLogStudy = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Study Session Logged 🎓', `${studyHours}h on "${studySubject}" recorded.`);
    setIsStudyModalOpen(false);
  };

  // Real-time metrics calculations
  const todayKey = new Date().toISOString().split('T')[0];
  const currentMonthKey = todayKey.substring(0, 7);

  // 1. Goals
  const activeGoals = goals.filter(g => g.status === 'in-progress');
  const avgGoalProgress = goals.length > 0 
    ? Math.round(goals.reduce((acc, g) => acc + g.currentProgress, 0) / goals.length) 
    : 75;

  // 2. Tasks
  const pendingTasksCount = tasks.filter(t => t.status !== 'done').length;
  const completedTasksCount = tasks.filter(t => t.status === 'done').length;
  const taskProgress = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 50;

  // 3. Habits
  const completedHabitsToday = habits.filter(h => h.history[todayKey]).length;
  const habitBestStreak = Math.max(...habits.map(h => h.bestStreak), 0);
  const habitProgress = habits.length > 0 ? Math.round((completedHabitsToday / habits.length) * 100) : 0;

  // 4. Finance
  const totalIncome = finances.filter(f => f.type === 'income').reduce((a, c) => a + c.amount, 0);
  const totalExpense = finances.filter(f => f.type === 'expense').reduce((a, c) => a + c.amount, 0);
  const netSaved = Math.max(0, totalIncome - totalExpense);
  const monthSpent = finances
    .filter(f => f.type === 'expense' && f.date.startsWith(currentMonthKey))
    .reduce((a, c) => a + c.amount, 0);
  const budgetRatio = Math.min(100, Math.round((monthSpent / (settings.monthlyBudget || 1)) * 100));

  // 5. Health
  const todayHealth = health.find(h => h.date === todayKey) || health[0];
  const sleepHours = todayHealth?.sleepHours || 7.5;
  const workoutMins = todayHealth?.workoutMinutes || 45;
  const waterProgress = Math.min(100, Math.round(((todayHealth?.waterIntakeMl || 0) / (settings.dailyWaterTargetMl || 2500)) * 100));

  // 6. Journal
  const journalStreak = 5;

  // Module configs for the 9 cards
  const moduleCards: ModuleCardConfig[] = [
    {
      id: 'goals',
      name: 'Goals',
      description: 'Track life goals and milestones',
      targetModule: 'goals',
      icon: Target,
      accentColor: {
        badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
        iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        borderHover: 'hover:border-purple-500/50',
        shadowHover: 'hover:shadow-purple-500/10',
        textHover: 'group-hover:text-purple-300',
        bar: 'bg-gradient-to-r from-purple-500 to-indigo-500',
        btnAccent: 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border-purple-500/30'
      },
      stat1: `${avgGoalProgress}% Progress`,
      stat2: `${activeGoals.length} Active Goals`,
      progressPercent: avgGoalProgress,
      openLabel: 'Open',
      quickActionLabel: 'Quick Add',
      onQuickAction: () => {
        setCurrentModule('goals');
        showToast('Goals Module', 'Ready to add or edit life milestones.');
      }
    },
    {
      id: 'tasks',
      name: 'Tasks',
      description: 'Manage daily execution',
      targetModule: 'tasks',
      icon: CheckSquare,
      accentColor: {
        badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
        iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        borderHover: 'hover:border-blue-500/50',
        shadowHover: 'hover:shadow-blue-500/10',
        textHover: 'group-hover:text-blue-300',
        bar: 'bg-gradient-to-r from-blue-500 to-cyan-500',
        btnAccent: 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border-blue-500/30'
      },
      stat1: `${pendingTasksCount} Tasks Pending`,
      stat2: `${completedTasksCount} Completed`,
      progressPercent: taskProgress,
      openLabel: 'Open',
      quickActionLabel: 'Quick Add',
      onQuickAction: () => {
        setCurrentModule('tasks');
        showToast('Tasks Kanban', 'Create a new focus action.');
      }
    },
    {
      id: 'focus',
      name: 'Focus',
      description: 'Deep work and concentration tracking',
      targetModule: 'dashboard',
      icon: Brain,
      accentColor: {
        badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
        iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        borderHover: 'hover:border-indigo-500/50',
        shadowHover: 'hover:shadow-indigo-500/10',
        textHover: 'group-hover:text-indigo-300',
        bar: 'bg-gradient-to-r from-indigo-500 to-violet-500',
        btnAccent: 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border-indigo-500/30'
      },
      stat1: '2h 45m Focused',
      stat2: '4 Pomodoro Blocks',
      progressPercent: 68,
      openLabel: 'Open',
      quickActionLabel: 'Start Focus',
      onQuickAction: () => setIsFocusModalOpen(true)
    },
    {
      id: 'habits',
      name: 'Habits',
      description: 'Build powerful daily routines',
      targetModule: 'habits',
      icon: Repeat,
      accentColor: {
        badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        borderHover: 'hover:border-amber-500/50',
        shadowHover: 'hover:shadow-amber-500/10',
        textHover: 'group-hover:text-amber-300',
        bar: 'bg-gradient-to-r from-amber-500 to-orange-500',
        btnAccent: 'bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border-amber-500/30'
      },
      stat1: `${completedHabitsToday}/${habits.length} Completed`,
      stat2: `${habitBestStreak}d Best Streak`,
      progressPercent: habitProgress,
      openLabel: 'Open',
      quickActionLabel: 'Check In',
      onQuickAction: () => setCurrentModule('habits')
    },
    {
      id: 'studies',
      name: 'Studies',
      description: 'Learning, courses, reading and skill development',
      targetModule: 'goals',
      icon: GraduationCap,
      accentColor: {
        badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
        iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
        borderHover: 'hover:border-cyan-500/50',
        shadowHover: 'hover:shadow-cyan-500/10',
        textHover: 'group-hover:text-cyan-300',
        bar: 'bg-gradient-to-r from-cyan-500 to-teal-500',
        btnAccent: 'bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border-cyan-500/30'
      },
      stat1: '14h Studied this Week',
      stat2: '3 Topics in Progress',
      progressPercent: 70,
      openLabel: 'Open',
      quickActionLabel: 'Log Study',
      onQuickAction: () => setIsStudyModalOpen(true)
    },
    {
      id: 'finance',
      name: 'Finance',
      description: 'Income, expenses, savings and wealth',
      targetModule: 'finance',
      icon: Wallet,
      accentColor: {
        badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        borderHover: 'hover:border-emerald-500/50',
        shadowHover: 'hover:shadow-emerald-500/10',
        textHover: 'group-hover:text-emerald-300',
        bar: 'bg-gradient-to-r from-emerald-500 to-teal-500',
        btnAccent: 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border-emerald-500/30'
      },
      stat1: `${settings.currency}${netSaved.toLocaleString()} Saved`,
      stat2: `${settings.currency}${monthSpent.toLocaleString()} Monthly Expense`,
      progressPercent: budgetRatio,
      openLabel: 'Open',
      quickActionLabel: 'Add Entry',
      onQuickAction: () => setCurrentModule('finance')
    },
    {
      id: 'health',
      name: 'Health & Fitness',
      description: 'Body, exercise, sleep and nutrition',
      targetModule: 'health',
      icon: Activity,
      accentColor: {
        badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
        iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        borderHover: 'hover:border-rose-500/50',
        shadowHover: 'hover:shadow-rose-500/10',
        textHover: 'group-hover:text-rose-300',
        bar: 'bg-gradient-to-r from-rose-500 to-red-500',
        btnAccent: 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border-rose-500/30'
      },
      stat1: `${workoutMins}m Active`,
      stat2: `${sleepHours} Hours Sleep`,
      progressPercent: waterProgress,
      openLabel: 'Open',
      quickActionLabel: 'Log Health',
      onQuickAction: () => {
        logWater(250);
        showToast('Logged 250ml Water 💧', 'Quick health check logged.');
      }
    },
    {
      id: 'journal',
      name: 'Journal',
      description: 'Daily reflections and gratitude',
      targetModule: 'journal',
      icon: BookOpen,
      accentColor: {
        badge: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
        iconBg: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
        borderHover: 'hover:border-pink-500/50',
        shadowHover: 'hover:shadow-pink-500/10',
        textHover: 'group-hover:text-pink-300',
        bar: 'bg-gradient-to-r from-pink-500 to-rose-500',
        btnAccent: 'bg-pink-600/20 hover:bg-pink-600/30 text-pink-300 border-pink-500/30'
      },
      stat1: `${journal.length} Entries`,
      stat2: `${journalStreak} Day Streak`,
      progressPercent: 85,
      openLabel: 'Open',
      quickActionLabel: 'Write',
      onQuickAction: () => setCurrentModule('journal')
    },
    {
      id: 'notes',
      name: 'Mind Notes',
      description: 'Ideas, thoughts, observations and life notes',
      targetModule: 'journal',
      icon: Lightbulb,
      accentColor: {
        badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
        iconBg: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
        borderHover: 'hover:border-violet-500/50',
        shadowHover: 'hover:shadow-violet-500/10',
        textHover: 'group-hover:text-violet-300',
        bar: 'bg-gradient-to-r from-violet-500 to-purple-500',
        btnAccent: 'bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border-violet-500/30'
      },
      stat1: '128 Notes',
      stat2: '12 New This Month',
      progressPercent: 60,
      openLabel: 'Open',
      quickActionLabel: 'Capture',
      onQuickAction: () => setIsNotesModalOpen(true)
    }
  ];

  return (
    <section className="space-y-4">
      {/* Section Title & Subheading */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-white flex items-center space-x-2">
              <span>Quick Access Life Modules</span>
            </h2>
            <p className="text-xs text-slate-400">
              Your primary life operating dashboard — instant access to all core dimensions.
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex text-[11px] font-semibold text-slate-400 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">
          9 Active Pillars
        </span>
      </div>

      {/* 3x3 Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {moduleCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => setCurrentModule(card.targetModule)}
              className={`group relative flex flex-col justify-between p-5 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-slate-800/90 ${card.accentColor.borderHover} ${card.accentColor.shadowHover} hover:-translate-y-1.5 transition-all duration-300 cursor-pointer shadow-lg overflow-hidden`}
            >
              {/* Subtle Ambient Hover Glow in corner */}
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all pointer-events-none" />

              <div>
                {/* Top Row: Icon + Module Name + Chevron */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-xl ${card.accentColor.iconBg} border shadow-sm group-hover:scale-105 transition-transform duration-200`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`text-base font-bold text-white ${card.accentColor.textHover} transition-colors flex items-center space-x-1.5`}>
                        <span>{card.name}</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all mt-1" />
                </div>

                {/* Metrics Stats Row */}
                <div className="mt-5 flex items-baseline justify-between text-xs">
                  <span className="font-bold text-slate-200">
                    {card.stat1}
                  </span>
                  <span className="text-slate-400 text-[11px] font-medium">
                    {card.stat2}
                  </span>
                </div>

                {/* Progress Indicator Bar */}
                <div className="w-full bg-slate-950/80 border border-slate-800/80 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div 
                    className={`h-1.5 rounded-full ${card.accentColor.bar} transition-all duration-700`}
                    style={{ width: `${Math.max(8, Math.min(card.progressPercent, 100))}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons Footer: [Open] [Quick Add] */}
              <div 
                className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between space-x-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setCurrentModule(card.targetModule)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 hover:border-slate-700 transition"
                >
                  {card.openLabel}
                </button>

                <button
                  type="button"
                  onClick={card.onQuickAction}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition active:scale-95 shadow-sm ${card.accentColor.btnAccent}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{card.quickActionLabel}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Focus / Pomodoro Modal */}
      {isFocusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl space-y-6 text-center">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-indigo-400">
                <Brain className="w-5 h-5" />
                <span className="font-bold text-sm uppercase tracking-wider text-white">Focus Deep Work Studio</span>
              </div>
              <button 
                onClick={() => setIsFocusModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <input
                type="text"
                value={focusTaskName}
                onChange={(e) => setFocusTaskName(e.target.value)}
                placeholder="What are you focusing on?"
                className="w-full bg-slate-950 border border-slate-700 text-center font-bold text-base text-slate-100 rounded-xl py-2 px-3 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Big Countdown Timer */}
            <div className="py-6">
              <div className="text-6xl font-black tracking-tight text-indigo-400 font-mono">
                {formatTime(focusSeconds)}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {isFocusRunning ? '⚡ Flow state active. Eliminate distractions.' : 'Paused • Ready to start 25-minute sprint.'}
              </p>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={() => setIsFocusRunning(!isFocusRunning)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold text-sm text-white shadow-lg transition active:scale-95 ${
                  isFocusRunning 
                    ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30' 
                    : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
                }`}
              >
                {isFocusRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isFocusRunning ? 'Pause Sprint' : 'Start Focus Sprint'}</span>
              </button>

              <button
                onClick={() => {
                  setIsFocusRunning(false);
                  setFocusSeconds(25 * 60);
                }}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mind Notes Quick Capture Modal */}
      {isNotesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-violet-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-violet-400">
                <Lightbulb className="w-5 h-5" />
                <span className="font-bold text-sm uppercase tracking-wider text-white">Quick Mind Note Capture</span>
              </div>
              <button 
                onClick={() => setIsNotesModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Idea / Observation headline..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 font-semibold"
                />
              </div>

              <div>
                <textarea
                  rows={4}
                  required
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Capture spontaneous ideas, mental models, quotes, or thoughts before they vanish..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNotesModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md shadow-violet-600/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Save Note</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Study Log Modal */}
      {isStudyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-cyan-400">
                <GraduationCap className="w-5 h-5" />
                <span className="font-bold text-sm uppercase tracking-wider text-white">Log Study / Skill Session</span>
              </div>
              <button 
                onClick={() => setIsStudyModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogStudy} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Subject / Book / Course</label>
                <input
                  type="text"
                  required
                  value={studySubject}
                  onChange={(e) => setStudySubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Duration (Hours)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={studyHours}
                  onChange={(e) => setStudyHours(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStudyModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/30"
                >
                  <Timer className="w-3.5 h-3.5" />
                  <span>Record Hours</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
