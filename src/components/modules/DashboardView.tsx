import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Sparkles, 
  Target, 
  CheckSquare, 
  Repeat, 
  DollarSign, 
  HeartPulse, 
  BookOpen, 
  Lightbulb, 
  Brain, 
  Flame, 
  ArrowUpRight, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Clock, 
  TrendingUp, 
  Zap, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { QuickAccessLifeModules } from './QuickAccessLifeModules';
import { AnalyticsEngine } from '../../services/analyticsEngine';

export const DashboardView: React.FC = () => {
  const { 
    settings, 
    lifeScore, 
    habits, 
    toggleHabitToday, 
    tasks, 
    toggleTaskStatus, 
    finances, 
    health, 
    journal,
    goals,
    setCurrentModule,
    openQuickModal
  } = useApp();

  const { profile, user } = useAuth();
  const [prioritiesTab, setPrioritiesTab] = useState<'all' | 'tasks' | 'habits' | 'deadlines'>('all');

  const todayKey = new Date().toISOString().split('T')[0];
  const currentMonthKey = todayKey.substring(0, 7);

  // Time-based dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const displayName = profile?.name || settings.userName || user?.email?.split('@')[0] || 'Debasish';

  // Formatted Date & Day
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
  const currentDate = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Streak calculation
  const currentStreak = Math.max(...habits.map(h => h.currentStreak), 0);

  // Snapshot 1: Goals
  const activeGoals = goals.filter(g => g.status === 'in-progress' || g.status === 'not-started');
  const avgGoalProgress = goals.length > 0 
    ? Math.round(goals.reduce((acc, g) => acc + (g.currentProgress || 0), 0) / goals.length) 
    : 75;

  // Snapshot 2: Tasks
  const todayTasks = tasks.filter(t => t.dueDate === todayKey || t.priority === 'urgent');
  const pendingTasks = todayTasks.filter(t => t.status !== 'done');
  const completedTasksCount = tasks.filter(t => t.status === 'done').length;
  const taskCompletionRate = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 60;

  // Snapshot 3: Habits
  const completedHabitsToday = habits.filter(h => h.history[todayKey]).length;
  const habitCompletionRate = habits.length > 0 ? Math.round((completedHabitsToday / habits.length) * 100) : 0;

  // Snapshot 4: Finance
  const todaySpent = finances
    .filter(f => f.type === 'expense' && f.date === todayKey)
    .reduce((acc, curr) => acc + curr.amount, 0);
  const monthSpent = finances
    .filter(f => f.type === 'expense' && f.date.startsWith(currentMonthKey))
    .reduce((acc, curr) => acc + curr.amount, 0);
  const budgetPercent = Math.min(100, Math.round((monthSpent / (settings.monthlyBudget || 1)) * 100));

  // Snapshot 5: Health
  const todayHealth = health.find(h => h.date === todayKey) || health[0];
  const waterPercent = Math.min(100, Math.round(((todayHealth?.waterIntakeMl || 0) / (settings.dailyWaterTargetMl || 2500)) * 100));

  // Snapshot 6: Mind
  const todayJournalEntries = journal.filter(j => j.date === todayKey);
  const dominantMood = todayJournalEntries[0]?.mood || 'productive';

  // Section 4: Upcoming deadlines (tasks or goals due in next 7 days)
  const upcomingDeadlines = useMemo(() => {
    const next7Days = new Date();
    next7Days.setDate(next7Days.getDate() + 7);
    const next7DaysKey = next7Days.toISOString().split('T')[0];

    const upcomingTasks = tasks.filter(t => t.status !== 'done' && t.dueDate > todayKey && t.dueDate <= next7DaysKey);
    const upcomingGoals = goals.filter(g => g.status !== 'completed' && g.targetDate > todayKey && g.targetDate <= next7DaysKey);
    return { upcomingTasks, upcomingGoals };
  }, [tasks, goals, todayKey]);

  // Section 5: Trend series data from analytics engine
  const trend7d = useMemo(() => {
    return AnalyticsEngine.generateTrendSeries(7, habits, tasks, health, finances);
  }, [habits, tasks, health, finances]);

  const trend30d = useMemo(() => {
    return AnalyticsEngine.generateTrendSeries(30, habits, tasks, health, finances);
  }, [habits, tasks, health, finances]);

  const avg30dVelocity = useMemo(() => {
    if (trend30d.length === 0) return 76;
    return Math.round(trend30d.reduce((a, b) => a + b.lifeScore, 0) / trend30d.length);
  }, [trend30d]);

  return (
    <div className="space-y-8 sm:space-y-10 animate-fadeIn select-none">
      {/* ========================================================================= */}
      {/* SECTION 1: WELCOME HEADER                                                 */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-indigo-950/50 backdrop-blur-2xl border border-slate-800/90 shadow-2xl">
        {/* Subtle luminous ambient backdrop glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left: Greeting + Date + Day + Subtle Glowing LOTAI Logo */}
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              {/* Subtle animated LOTAI glow logo */}
              <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 shadow-xl shadow-indigo-500/30 ring-1 ring-indigo-400/40">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-400" />
                </span>
              </div>

              <div>
                <span className="text-[11px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                  Personal Life Operating System
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mt-1">
              {getGreeting()}, <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-300">{displayName}</span>
            </h1>

            <div className="flex items-center space-x-3 text-xs sm:text-sm text-slate-400 font-medium">
              <span className="text-slate-200 font-semibold">{currentDay}</span>
              <span className="text-slate-600">•</span>
              <span>{currentDate}</span>
            </div>
          </div>

          {/* Right: Glassmorphic Life Score & Streak Pills */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
            {/* Life Score Pill */}
            <div 
              onClick={() => setCurrentModule('analytics')}
              className="group flex items-center space-x-3.5 px-4 sm:px-5 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/40 transition shadow-lg cursor-pointer backdrop-blur-md"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                <Zap className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-lg sm:text-xl font-black text-white">{lifeScore.overall}%</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    {lifeScore.overall >= 80 ? 'Optimal' : lifeScore.overall >= 65 ? 'Steady' : 'Focus'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Life Score</p>
              </div>
            </div>

            {/* Current Streak Pill */}
            <div 
              onClick={() => setCurrentModule('habits')}
              className="group flex items-center space-x-3.5 px-4 sm:px-5 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/40 transition shadow-lg cursor-pointer backdrop-blur-md"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Flame className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <span className="text-lg sm:text-xl font-black text-white">{currentStreak}</span>
                  <span className="text-xs font-bold text-amber-400">Days</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Current Streak</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: TODAY SNAPSHOT (6 COMPACT CARDS)                                */}
      {/* ========================================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center space-x-2">
              <span>Today Snapshot</span>
            </h2>
            <p className="text-xs text-slate-400">Real-time status across your 6 core life pillars</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">Tap to open</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Card 1: Goals */}
          <div
            onClick={() => setCurrentModule('goals')}
            className="group relative p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-105 transition-transform">
                <Target className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-purple-400 transition" />
            </div>
            <div className="mt-3">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Goals</p>
              <p className="text-base sm:text-lg font-extrabold text-white mt-0.5 truncate">
                {activeGoals.length}/{Math.max(goals.length, 1)} Active
              </p>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                <div 
                  className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${avgGoalProgress}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 truncate">
                {avgGoalProgress}% Progress
              </p>
            </div>
          </div>

          {/* Card 2: Tasks */}
          <div
            onClick={() => setCurrentModule('tasks')}
            className="group relative p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-105 transition-transform">
                <CheckSquare className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 transition" />
            </div>
            <div className="mt-3">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tasks</p>
              <p className="text-base sm:text-lg font-extrabold text-white mt-0.5 truncate">
                {pendingTasks.length} Pending
              </p>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${taskCompletionRate}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 truncate">
                {taskCompletionRate}% Done ({completedTasksCount})
              </p>
            </div>
          </div>

          {/* Card 3: Habits */}
          <div
            onClick={() => setCurrentModule('habits')}
            className="group relative p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
                <Repeat className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-400 transition" />
            </div>
            <div className="mt-3">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Habits</p>
              <p className="text-base sm:text-lg font-extrabold text-white mt-0.5 truncate">
                {completedHabitsToday}/{habits.length} Completed
              </p>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                <div 
                  className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${habitCompletionRate}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 truncate">
                {habitCompletionRate}% Completed Today
              </p>
            </div>
          </div>

          {/* Card 4: Finance */}
          <div
            onClick={() => setCurrentModule('finance')}
            className="group relative p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                <DollarSign className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition" />
            </div>
            <div className="mt-3">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Finance</p>
              <p className="text-base sm:text-lg font-extrabold text-white mt-0.5 truncate">
                {settings.currency}{todaySpent.toLocaleString()} Spent
              </p>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-500 ${budgetPercent > 90 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  style={{ width: `${budgetPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 truncate">
                {budgetPercent}% of monthly limit
              </p>
            </div>
          </div>

          {/* Card 5: Health */}
          <div
            onClick={() => setCurrentModule('health')}
            className="group relative p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 hover:border-rose-500/50 hover:shadow-lg hover:shadow-rose-500/10 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:scale-105 transition-transform">
                <HeartPulse className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-rose-400 transition" />
            </div>
            <div className="mt-3">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Health</p>
              <p className="text-base sm:text-lg font-extrabold text-white mt-0.5 truncate">
                {todayHealth?.sleepHours || 7.5}h Sleep
              </p>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                <div 
                  className="bg-rose-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${waterPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 truncate">
                {todayHealth?.waterIntakeMl || 0}ml ({waterPercent}%) Water
              </p>
            </div>
          </div>

          {/* Card 6: Mind */}
          <div
            onClick={() => setCurrentModule('journal')}
            className="group relative p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-105 transition-transform">
                <BookOpen className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 transition" />
            </div>
            <div className="mt-3">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Mind</p>
              <p className="text-base sm:text-lg font-extrabold text-white mt-0.5 truncate">
                {todayJournalEntries.length} Journal {todayJournalEntries.length === 1 ? 'Entry' : 'Entries'}
              </p>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                <div 
                  className="bg-cyan-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${lifeScore.mindScore}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 truncate capitalize">
                {dominantMood} Mindset
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: QUICK ACTION CENTER (LARGE BEAUTIFUL ACTION CARDS)             */}
      {/* ========================================================================= */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center space-x-2">
              <span>Quick Action Center</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                One-Click
              </span>
            </h2>
            <p className="text-xs text-slate-400">Launch actions immediately without leaving your dashboard</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Action 1: Goal */}
          <div 
            onClick={() => openQuickModal('goal')}
            className="group relative p-4 sm:p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 group-hover:scale-110 transition-transform">
                <Target className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Goal</span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                Goal
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Set milestones & OKRs</p>
              <button
                type="button"
                className="w-full mt-3.5 py-1.5 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-bold transition flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ New Goal</span>
              </button>
            </div>
          </div>

          {/* Action 2: Task */}
          <div 
            onClick={() => openQuickModal('task')}
            className="group relative p-4 sm:p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 group-hover:scale-110 transition-transform">
                <CheckSquare className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Task</span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                Task
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Add high priority todo</p>
              <button
                type="button"
                className="w-full mt-3.5 py-1.5 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold transition flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Task</span>
              </button>
            </div>
          </div>

          {/* Action 3: Habit */}
          <div 
            onClick={() => openQuickModal('habit')}
            className="group relative p-4 sm:p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 group-hover:scale-110 transition-transform">
                <Repeat className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Habit</span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                Habit
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Check or add routine</p>
              <button
                type="button"
                className="w-full mt-3.5 py-1.5 px-3 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Check Habit</span>
              </button>
            </div>
          </div>

          {/* Action 4: Finance */}
          <div 
            onClick={() => openQuickModal('expense')}
            className="group relative p-4 sm:p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 group-hover:scale-110 transition-transform">
                <DollarSign className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Finance</span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                Finance
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Record money outflow</p>
              <button
                type="button"
                className="w-full mt-3.5 py-1.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Expense</span>
              </button>
            </div>
          </div>

          {/* Action 5: Health */}
          <div 
            onClick={() => openQuickModal('health')}
            className="group relative p-4 sm:p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 hover:border-rose-500/50 hover:shadow-xl hover:shadow-rose-500/10 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 group-hover:scale-110 transition-transform">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Health</span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-rose-300 transition-colors">
                Health
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Water, sleep & workout</p>
              <button
                type="button"
                className="w-full mt-3.5 py-1.5 px-3 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Log Health</span>
              </button>
            </div>
          </div>

          {/* Action 6: Journal */}
          <div 
            onClick={() => openQuickModal('journal')}
            className="group relative p-4 sm:p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Journal</span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                Journal
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Reflections & gratitude</p>
              <button
                type="button"
                className="w-full mt-3.5 py-1.5 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Write Entry</span>
              </button>
            </div>
          </div>

          {/* Action 7: Mind Notes */}
          <div 
            onClick={() => openQuickModal('mind')}
            className="group relative p-4 sm:p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 group-hover:scale-110 transition-transform">
                <Lightbulb className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mind</span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                Mind Notes
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Startup idea & thoughts</p>
              <button
                type="button"
                className="w-full mt-3.5 py-1.5 px-3 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Capture Idea</span>
              </button>
            </div>
          </div>

          {/* Action 8: Focus Session */}
          <div 
            onClick={() => openQuickModal('focus')}
            className="group relative p-4 sm:p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-violet-500/15 text-violet-400 border border-violet-500/30 group-hover:scale-110 transition-transform">
                <Brain className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Focus</span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                Focus Session
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Deep concentration block</p>
              <button
                type="button"
                className="w-full mt-3.5 py-1.5 px-3 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-bold transition flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Start Focus</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: TODAY'S PRIORITIES                                             */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-1">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center space-x-2">
              <span>Today's Priorities</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {todayTasks.length + habits.length} Items
              </span>
            </h2>
            <p className="text-xs text-slate-400">Execution plan, active routines, upcoming goals and deadlines</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 self-start">
            <button
              onClick={() => setPrioritiesTab('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                prioritiesTab === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setPrioritiesTab('tasks')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                prioritiesTab === 'tasks' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tasks ({todayTasks.length})
            </button>
            <button
              onClick={() => setPrioritiesTab('habits')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                prioritiesTab === 'habits' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Habits ({habits.length})
            </button>
            <button
              onClick={() => setPrioritiesTab('deadlines')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                prioritiesTab === 'deadlines' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Deadlines ({upcomingDeadlines.upcomingTasks.length + upcomingDeadlines.upcomingGoals.length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Column 1: Today's Tasks & Today's Habits */}
          {(prioritiesTab === 'all' || prioritiesTab === 'tasks') && (
            <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <CheckSquare className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-bold text-white">Today's Tasks</h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {pendingTasks.length} left
                  </span>
                </div>
                <button
                  onClick={() => openQuickModal('task')}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
              </div>

              <div className="space-y-2">
                {todayTasks.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    No tasks scheduled for today. Hit "+ Add Task" to set an agenda.
                  </div>
                ) : (
                  todayTasks.map((t) => {
                    const isDone = t.status === 'done';
                    return (
                      <div
                        key={t.id}
                        onClick={() => toggleTaskStatus(t.id)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer min-h-[46px] select-none ${
                          isDone 
                            ? 'bg-slate-950/60 border-slate-800 text-slate-500' 
                            : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center space-x-3 truncate mr-2">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                          )}
                          <div className="truncate">
                            <span className={`text-xs font-semibold truncate block ${isDone ? 'line-through text-slate-500' : ''}`}>
                              {t.title}
                            </span>
                            <span className="text-[10px] text-slate-500 block truncate">
                              {t.category} • {t.dueDate === todayKey ? 'Due Today' : t.dueDate}
                            </span>
                          </div>
                        </div>

                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${
                          t.priority === 'urgent'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : t.priority === 'high'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-700 text-slate-300'
                        }`}>
                          {t.priority}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Column 2: Today's Habits */}
          {(prioritiesTab === 'all' || prioritiesTab === 'habits') && (
            <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Today's Habits</h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {completedHabitsToday}/{habits.length} done
                  </span>
                </div>
                <button
                  onClick={() => openQuickModal('habit')}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Check Habit</span>
                </button>
              </div>

              <div className="space-y-2">
                {habits.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    No habits active. Start a streak with "+ Check Habit".
                  </div>
                ) : (
                  habits.map((h) => {
                    const isDone = Boolean(h.history[todayKey]);
                    return (
                      <div
                        key={h.id}
                        onClick={() => toggleHabitToday(h.id)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer min-h-[46px] select-none ${
                          isDone 
                            ? 'bg-slate-950/60 border-amber-500/30 text-slate-400' 
                            : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center space-x-3 truncate mr-2">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                          )}
                          <div className="truncate">
                            <span className={`text-xs font-semibold truncate block ${isDone ? 'line-through text-slate-400' : ''}`}>
                              {h.title}
                            </span>
                            <span className="text-[10px] text-slate-500 block truncate">
                              {h.category} • {h.timeOfDay}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 shrink-0">
                          <Flame className="w-3 h-3" />
                          <span>{h.currentStreak}d</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Today's Focus Session & Upcoming Deadlines/Goals */}
          {(prioritiesTab === 'all' || prioritiesTab === 'deadlines') && (
            <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 space-y-4 lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Focus Session Block */}
                <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-indigo-400 mb-2">
                      <Brain className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Today's Focus</span>
                    </div>
                    <p className="text-sm font-bold text-white">2h 45m Focused</p>
                    <p className="text-xs text-slate-400 mt-0.5">4 Pomodoro blocks completed today</p>
                  </div>
                  <button
                    onClick={() => openQuickModal('focus')}
                    className="mt-4 w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-md shadow-indigo-600/30"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Launch 25m Focus Block</span>
                  </button>
                </div>

                {/* Upcoming Deadlines */}
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-rose-400 mb-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Upcoming Deadlines</span>
                    </div>
                    {upcomingDeadlines.upcomingTasks.length === 0 ? (
                      <p className="text-xs text-slate-400 mt-2">No urgent deadlines in the next 7 days.</p>
                    ) : (
                      <div className="space-y-1.5 mt-2">
                        {upcomingDeadlines.upcomingTasks.slice(0, 2).map(t => (
                          <div key={t.id} className="text-xs flex items-center justify-between">
                            <span className="text-slate-200 font-medium truncate max-w-[140px]">{t.title}</span>
                            <span className="text-[10px] text-rose-300 bg-rose-500/15 px-1.5 py-0.5 rounded font-bold">{t.dueDate}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setCurrentModule('tasks')}
                    className="mt-3 text-[11px] font-bold text-slate-400 hover:text-white transition flex items-center space-x-1"
                  >
                    <span>View Calendar →</span>
                  </button>
                </div>

                {/* Upcoming Goals */}
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-purple-400 mb-2">
                      <Target className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Upcoming Goals</span>
                    </div>
                    {activeGoals.length === 0 ? (
                      <p className="text-xs text-slate-400 mt-2">All goals up to date.</p>
                    ) : (
                      <div className="space-y-1.5 mt-2">
                        {activeGoals.slice(0, 2).map(g => (
                          <div key={g.id} className="text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-200 font-medium truncate max-w-[140px]">{g.title}</span>
                              <span className="text-[10px] text-purple-300 font-bold">{g.currentProgress || 0}%</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-1 mt-1">
                              <div className="bg-purple-500 h-1 rounded-full" style={{ width: `${g.currentProgress || 0}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setCurrentModule('goals')}
                    className="mt-3 text-[11px] font-bold text-slate-400 hover:text-white transition flex items-center space-x-1"
                  >
                    <span>View All Goals →</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: LIFE ANALYTICS                                                 */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center space-x-2">
              <span>Life Analytics</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                Active Insights
              </span>
            </h2>
            <p className="text-xs text-slate-400">Holistic performance scores, weekly velocity and monthly trend</p>
          </div>
          <button
            onClick={() => setCurrentModule('analytics')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition flex items-center space-x-1"
          >
            <span>Full Analytics Hub</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5 Core Life Scores */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          {/* Life Score */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Life Score</span>
            <p className="text-2xl font-black text-white mt-1">{lifeScore.overall}%</p>
            <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 mt-1">
              Overall Index
            </span>
          </div>

          {/* Habit Score */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Habit Score</span>
            <p className="text-2xl font-black text-white mt-1">{lifeScore.habitsScore}%</p>
            <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 mt-1">
              Consistency
            </span>
          </div>

          {/* Finance Score */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Finance Score</span>
            <p className="text-2xl font-black text-white mt-1">{lifeScore.financeScore}%</p>
            <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 mt-1">
              Budget Health
            </span>
          </div>

          {/* Health Score */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Health Score</span>
            <p className="text-2xl font-black text-white mt-1">{lifeScore.healthScore}%</p>
            <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-300 mt-1">
              Vitals & Rest
            </span>
          </div>

          {/* Mind Score */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Mind Score</span>
            <p className="text-2xl font-black text-white mt-1">{lifeScore.mindScore}%</p>
            <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 mt-1">
              Reflective Clarity
            </span>
          </div>
        </div>

        {/* Weekly & Monthly Trend Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Weekly Trend (7-day velocity) */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  <span>Weekly Trend (7 Days)</span>
                </h3>
                <p className="text-xs text-slate-400">Daily velocity based on completed tasks & habits</p>
              </div>
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                +4.8% vs last week
              </span>
            </div>

            {/* Visual 7-day sparkline bar chart */}
            <div className="pt-2 flex items-end justify-between gap-2 h-28">
              {trend7d.map((pt, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[9px] font-bold text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    {pt.lifeScore}%
                  </span>
                  <div className="w-full bg-slate-800 rounded-t-lg relative overflow-hidden flex items-end h-full">
                    <div 
                      className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all duration-500 group-hover:from-indigo-500 group-hover:to-cyan-400"
                      style={{ height: `${Math.max(pt.lifeScore, 15)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 truncate max-w-full">
                    {pt.label.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trend (30-day trajectory) */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Monthly Trajectory (30 Days)</span>
                </h3>
                <p className="text-xs text-slate-400">Consistency curve and long-term habits momentum</p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                {avg30dVelocity}% Consistency
              </span>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1 font-semibold">
                  <span>Target Discipline Benchmark</span>
                  <span className="text-emerald-400 font-bold">85% Optimal</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-700" 
                    style={{ width: `${Math.min(avg30dVelocity, 100)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Longest Habit Streak</span>
                  <p className="text-sm font-extrabold text-white mt-0.5">{currentStreak} Consecutive Days</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Productive Days</span>
                  <p className="text-sm font-extrabold text-emerald-400 mt-0.5">24 / 30 Days Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: QUICK ACCESS MODULES                                           */}
      {/* ========================================================================= */}
      <section className="pt-2">
        <QuickAccessLifeModules />
      </section>
    </div>
  );
};
