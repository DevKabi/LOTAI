import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Circle, 
  Flame, 
  Droplet, 
  Moon, 
  DollarSign, 
  ArrowUpRight, 
  Plus,
  Zap
} from 'lucide-react';
import { HeroAICommandCenter } from '../common/HeroAICommandCenter';
import { QuickAccessLifeModules } from './QuickAccessLifeModules';
import { LoadingSkeleton } from '../common/LoadingSkeleton';

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
    logWater, 
    setCurrentModule,
    isDataLoading
  } = useApp();

  const todayKey = new Date().toISOString().split('T')[0];
  const todayHealth = health.find(h => h.date === todayKey) || health[0];

  // Calculations
  const currentMonthKey = todayKey.substring(0, 7);
  const monthSpent = finances
    .filter(f => f.type === 'expense' && f.date.startsWith(currentMonthKey))
    .reduce((acc, curr) => acc + curr.amount, 0);
  const budgetRemaining = Math.max(0, settings.monthlyBudget - monthSpent);
  const budgetPercent = Math.min(100, Math.round((monthSpent / (settings.monthlyBudget || 1)) * 100));

  const todayTasks = tasks.filter(t => t.dueDate === todayKey || t.priority === 'urgent');
  const pendingTasks = todayTasks.filter(t => t.status !== 'done');

  // Modular Render Helpers for Dashboard Sections
  const renderLifeScoreCard = () => (
    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-indigo-950/40 via-slate-900/80 to-slate-900 border border-indigo-500/20 shadow-xl flex flex-col justify-between relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-indigo-400">
            Overall Life Velocity
          </span>
          <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
            Active Index
          </span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-100 mt-1.5 sm:mt-2">Life On Track Score</h2>
      </div>

      <div className="my-5 sm:my-6 flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          {/* Circular SVG Ring */}
          <svg className="w-36 h-36 sm:w-40 sm:h-40 transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="60"
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-800 sm:hidden"
              fill="transparent"
            />
            <circle
              cx="72"
              cy="72"
              r="60"
              stroke="currentColor"
              strokeWidth="10"
              className="text-indigo-500 transition-all duration-1000 ease-out sm:hidden"
              strokeDasharray={2 * Math.PI * 60}
              strokeDashoffset={2 * Math.PI * 60 * (1 - lifeScore.overall / 100)}
              strokeLinecap="round"
              fill="transparent"
            />
            <circle
              cx="80"
              cy="80"
              r="68"
              stroke="currentColor"
              strokeWidth="12"
              className="text-slate-800 hidden sm:block"
              fill="transparent"
            />
            <circle
              cx="80"
              cy="80"
              r="68"
              stroke="currentColor"
              strokeWidth="12"
              strokeDasharray={2 * Math.PI * 68}
              strokeDashoffset={2 * Math.PI * 68 * (1 - lifeScore.overall / 100)}
              strokeLinecap="round"
              className="text-indigo-500 transition-all duration-1000 ease-out hidden sm:block"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              {lifeScore.overall}%
            </span>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-indigo-300">
              {lifeScore.overall >= 80 ? 'Optimal' : lifeScore.overall >= 65 ? 'Steady' : 'Focus Needed'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-1 pt-3 border-t border-slate-800 text-center">
        <div>
          <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Habits</p>
          <p className="text-xs font-bold text-slate-200 mt-0.5">{lifeScore.habitsScore}%</p>
        </div>
        <div>
          <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Tasks</p>
          <p className="text-xs font-bold text-slate-200 mt-0.5">{lifeScore.tasksScore}%</p>
        </div>
        <div>
          <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Finance</p>
          <p className="text-xs font-bold text-slate-200 mt-0.5">{lifeScore.financeScore}%</p>
        </div>
        <div>
          <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Health</p>
          <p className="text-xs font-bold text-slate-200 mt-0.5">{lifeScore.healthScore}%</p>
        </div>
        <div>
          <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Mind</p>
          <p className="text-xs font-bold text-slate-200 mt-0.5">{lifeScore.mindScore}%</p>
        </div>
      </div>
    </div>
  );

  const renderHabitsPillarCard = () => (
    <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-200">Daily Habits</h3>
            <p className="text-xs text-slate-400">Consistency & Streaks</p>
          </div>
        </div>
        <button 
          onClick={() => setCurrentModule('habits')}
          className="text-slate-400 hover:text-white p-1.5"
          title="Go to Habits"
        >
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
      <div className="my-3 sm:my-4">
        <div className="flex items-baseline space-x-2">
          <span className="text-xl sm:text-2xl font-black text-white">
            {habits.filter(h => h.history[todayKey]).length} / {habits.length}
          </span>
          <span className="text-xs text-slate-400">completed today</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 mt-2">
          <div 
            className="bg-amber-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(habits.filter(h => h.history[todayKey]).length / Math.max(habits.length, 1)) * 100}%` }}
          />
        </div>
      </div>
      <p className="text-xs text-slate-400">
        Longest active streak: <strong className="text-amber-400">{Math.max(...habits.map(h => h.currentStreak), 0)} days</strong>
      </p>
    </div>
  );

  const renderTasksPillarCard = () => (
    <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-200">Execution Velocity</h3>
            <p className="text-xs text-slate-400">Priority Tasks</p>
          </div>
        </div>
        <button 
          onClick={() => setCurrentModule('tasks')}
          className="text-slate-400 hover:text-white p-1.5"
          title="Go to Tasks"
        >
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
      <div className="my-3 sm:my-4">
        <div className="flex items-baseline space-x-2">
          <span className="text-xl sm:text-2xl font-black text-white">
            {tasks.filter(t => t.status === 'done').length} / {tasks.length}
          </span>
          <span className="text-xs text-slate-400">all-time completed</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 mt-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(tasks.filter(t => t.status === 'done').length / Math.max(tasks.length, 1)) * 100}%` }}
          />
        </div>
      </div>
      <div className="text-xs text-blue-400 font-medium truncate">
        {pendingTasks.length === 0 ? 'All caught up! Great job.' : `${pendingTasks[0]?.title.substring(0, 30)}...`}
      </div>
    </div>
  );

  const renderFinancePillarCard = () => (
    <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-200">Monthly Budget</h3>
            <p className="text-xs text-slate-400">{settings.currency}{budgetRemaining.toFixed(0)} remaining</p>
          </div>
        </div>
        <button 
          onClick={() => setCurrentModule('finance')}
          className="text-slate-400 hover:text-white p-1.5"
          title="Go to Finance"
        >
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
      <div className="my-3 sm:my-4">
        <div className="flex items-baseline space-x-2">
          <span className="text-xl sm:text-2xl font-black text-white">
            {settings.currency}{monthSpent.toFixed(0)}
          </span>
          <span className="text-xs text-slate-400">of {settings.currency}{settings.monthlyBudget}</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 mt-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${budgetPercent > 90 ? 'bg-rose-500' : 'bg-emerald-500'}`}
            style={{ width: `${budgetPercent}%` }}
          />
        </div>
      </div>
      <p className="text-xs text-slate-400">
        {budgetPercent}% of monthly limit utilized
      </p>
    </div>
  );

  const renderHealthPillarCard = () => (
    <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Droplet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-200">Health & Vitals</h3>
            <p className="text-xs text-slate-400">Water & Sleep</p>
          </div>
        </div>
        <button 
          onClick={() => setCurrentModule('health')}
          className="text-slate-400 hover:text-white p-1.5"
          title="Go to Health"
        >
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
      <div className="my-3 sm:my-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">Hydration</p>
          <p className="text-lg sm:text-xl font-bold text-white mt-0.5">
            {todayHealth?.waterIntakeMl || 0} <span className="text-xs text-slate-400 font-normal">/ {settings.dailyWaterTargetMl}ml</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Last Sleep</p>
          <p className="text-lg sm:text-xl font-bold text-white mt-0.5">
            {todayHealth?.sleepHours || 8} <span className="text-xs text-slate-400 font-normal">hrs</span>
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => logWater(250)}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition flex items-center space-x-1 min-h-[36px]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+250ml Water</span>
        </button>
        <span className="text-xs text-slate-400 flex items-center space-x-1">
          <Moon className="w-3.5 h-3.5 text-indigo-400" />
          <span>{todayHealth?.sleepQuality || 'Good'}</span>
        </span>
      </div>
    </div>
  );

  const renderHabitsChecklist = () => (
    <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-white">Today's Habits</h2>
          <p className="text-xs text-slate-400">Check off your daily standards</p>
        </div>
        <button
          onClick={() => setCurrentModule('habits')}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 py-1"
        >
          Manage All →
        </button>
      </div>

      <div className="space-y-2.5">
        {isDataLoading ? (
          <LoadingSkeleton rows={3} />
        ) : habits.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-sm">
            No habits tracked yet. Add your first routine in Habits!
          </div>
        ) : (
          habits.map((habit) => {
            const isDone = Boolean(habit.history[todayKey]);
            return (
              <div
                key={habit.id}
                onClick={() => toggleHabitToday(habit.id)}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer min-h-[50px] active:scale-[0.99] ${
                  isDone 
                    ? 'bg-slate-950/60 border-indigo-500/30 text-slate-300' 
                    : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600 text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3 truncate mr-2">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500 shrink-0" />
                  )}
                  <div className="truncate">
                    <span className={`text-sm font-medium truncate block ${isDone ? 'line-through text-slate-400' : ''}`}>
                      {habit.title}
                    </span>
                    <span className="block text-[11px] text-slate-500 truncate">
                      {habit.category} • {habit.timeOfDay}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{habit.currentStreak}d</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  const renderTasksChecklist = () => (
    <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-white">Focus Tasks</h2>
          <p className="text-xs text-slate-400">High priority & due today</p>
        </div>
        <button
          onClick={() => setCurrentModule('tasks')}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 py-1"
        >
          Open Tasks →
        </button>
      </div>

      <div className="space-y-2.5">
        {isDataLoading ? (
          <LoadingSkeleton rows={3} />
        ) : todayTasks.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-sm">
            No urgent tasks for today! Enjoy your flow state.
          </div>
        ) : (
          todayTasks.map((task) => {
            const isDone = task.status === 'done';
            return (
              <div
                key={task.id}
                onClick={() => toggleTaskStatus(task.id)}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition cursor-pointer min-h-[50px] active:scale-[0.99] ${
                  isDone
                    ? 'bg-slate-950/60 border-slate-800 text-slate-400'
                    : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600 text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3 truncate mr-2">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500 shrink-0" />
                  )}
                  <div className="truncate">
                    <span className={`text-sm font-medium truncate block ${isDone ? 'line-through text-slate-500' : ''}`}>
                      {task.title}
                    </span>
                    <span className="block text-[11px] text-slate-500 truncate">
                      {task.category} • Due {task.dueDate === todayKey ? 'Today' : task.dueDate}
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded shrink-0 ${
                  task.priority === 'urgent'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : task.priority === 'high'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {task.priority}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div className="animate-fadeIn space-y-6 sm:space-y-8">
      {/* ========================================================================= */}
      {/* DESKTOP LAYOUT (>= 1024px) - 100% UNCHANGED GRID                          */}
      {/* ========================================================================= */}
      <div className="hidden lg:block space-y-8">
        <HeroAICommandCenter />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            {renderLifeScoreCard()}
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderHabitsPillarCard()}
            {renderTasksPillarCard()}
            {renderFinancePillarCard()}
            {renderHealthPillarCard()}
          </div>
        </div>

        <QuickAccessLifeModules />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderHabitsChecklist()}
          {renderTasksChecklist()}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE & TABLET LAYOUT (< 1024px) - STRICT PRIORITY SPECIFICATION         */}
      {/* 1. AI Command Center                                                      */}
      {/* 2. Life Score                                                             */}
      {/* 3. Today's Tasks                                                          */}
      {/* 4. Today's Habits                                                         */}
      {/* 5. Finance Snapshot                                                       */}
      {/* 6. Health Snapshot                                                        */}
      {/* 7. Quick Access Modules                                                   */}
      {/* ========================================================================= */}
      <div className="block lg:hidden space-y-5">
        {/* Priority 1: AI Command Center */}
        <HeroAICommandCenter />

        {/* Priority 2: Life Score */}
        {renderLifeScoreCard()}

        {/* Priority 3: Today's Tasks */}
        {renderTasksChecklist()}

        {/* Priority 4: Today's Habits */}
        {renderHabitsChecklist()}

        {/* Priority 5 & 6: Finance & Health Snapshots (Stacked on mobile, 2-col on tablet) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderFinancePillarCard()}
          {renderHealthPillarCard()}
        </div>

        {/* Priority 7: Quick Access Modules */}
        <QuickAccessLifeModules />
      </div>
    </div>
  );
};
