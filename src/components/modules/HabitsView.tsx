import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HabitTimeOfDay, GoalCategory } from '../../types';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { EmptyState } from '../common/EmptyState';
import { 
  Repeat, 
  Plus, 
  Flame, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Sparkles,
  Trophy,
  Sun,
  Sunset,
  Moon
} from 'lucide-react';

export const HabitsView: React.FC = () => {
  const { habits, addHabit, toggleHabitToday, deleteHabit, isDataLoading } = useApp();
  const [selectedTime, setSelectedTime] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GoalCategory>('Health');
  const [timeOfDay, setTimeOfDay] = useState<HabitTimeOfDay>('morning');

  const todayKey = new Date().toISOString().split('T')[0];

  // Helper to generate last 7 days array
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      isToday: i === 6
    };
  });

  const filteredHabits = selectedTime === 'all'
    ? habits
    : habits.filter(h => h.timeOfDay === selectedTime || h.timeOfDay === 'anytime');

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addHabit({
      title,
      category,
      frequency: 'daily',
      timeOfDay,
      targetCount: 1,
      color: '#6366f1'
    });

    setTitle('');
    setIsAddModalOpen(false);
  };

  const getTimeIcon = (t: HabitTimeOfDay) => {
    switch (t) {
      case 'morning': return <Sun className="w-3.5 h-3.5 text-amber-400" />;
      case 'afternoon': return <Sunset className="w-3.5 h-3.5 text-orange-400" />;
      case 'evening': return <Moon className="w-3.5 h-3.5 text-indigo-400" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white">Habits & Streaks</h1>
            <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400">
              <Repeat className="w-5 h-5" />
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Build unshakeable daily rituals. Consistency is the compound interest of self-improvement.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold shadow-lg shadow-amber-600/30 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Daily Habit</span>
        </button>
      </div>

      {/* Routine Filter Tabs */}
      <div className="flex space-x-2">
        {[
          { id: 'all', label: 'All Routines' },
          { id: 'morning', label: 'Morning Ritual' },
          { id: 'afternoon', label: 'Afternoon' },
          { id: 'evening', label: 'Evening Wind-down' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTime(tab.id)}
            className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition ${
              selectedTime === tab.id
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {isDataLoading && <LoadingSkeleton rows={4} />}

      {/* Empty State */}
      {!isDataLoading && filteredHabits.length === 0 && (
        <EmptyState
          icon={Repeat}
          title="No Habits Configured"
          description={selectedTime === 'all' ? "Build positive rituals and track your daily consistency. Start by adding your first daily habit." : `No habits scheduled for ${selectedTime}.`}
          actionLabel="New Daily Habit"
          onAction={() => setIsAddModalOpen(true)}
          accentColor="amber"
        />
      )}

      {/* Habits Grid */}
      {!isDataLoading && filteredHabits.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHabits.map((habit) => {
            const isDoneToday = Boolean(habit.history[todayKey]);

            return (
              <div
                key={habit.id}
                className={`p-5 rounded-2xl bg-slate-900/90 border transition-all ${
                  isDoneToday 
                    ? 'border-indigo-500/40 bg-gradient-to-r from-indigo-950/20 to-slate-900' 
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="p-1 rounded-md bg-slate-800 border border-slate-700">
                      {getTimeIcon(habit.timeOfDay)}
                    </span>
                    <span className="text-xs font-medium text-slate-400 capitalize">
                      {habit.timeOfDay} • {habit.category}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Streak pill */}
                    <div className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                      <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{habit.currentStreak} days</span>
                    </div>

                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Delete Habit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Title & Today Checkbox */}
                <div className="mt-4 flex items-center justify-between">
                  <h3 className={`text-base font-bold text-white ${isDoneToday ? 'line-through text-slate-400' : ''}`}>
                    {habit.title}
                  </h3>

                  <button
                    onClick={() => toggleHabitToday(habit.id)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                      isDoneToday
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {isDoneToday ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4" />
                        <span>Check In</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 7-Day Mini Heatmap Row */}
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">Last 7 Days</span>
                  <div className="flex items-center space-x-2">
                    {last7Days.map(day => {
                      const completed = Boolean(habit.history[day.dateStr]);
                      return (
                        <div key={day.dateStr} className="flex flex-col items-center space-y-1">
                          <div
                            className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold transition ${
                              completed
                                ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/40'
                                : day.isToday
                                ? 'border border-dashed border-indigo-400/80 text-slate-400'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            {completed ? '✓' : ''}
                          </div>
                          <span className="text-[9px] text-slate-500 font-medium">{day.dayName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Personal Record Footer */}
                <div className="mt-2 text-[11px] text-slate-500 flex items-center space-x-1">
                  <Trophy className="w-3 h-3 text-amber-400" />
                  <span>Personal Best: <strong>{habit.bestStreak} days</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Habit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-white">Create New Habit</h2>
            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Habit Name *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 10m Morning Meditation, 2.5L Water"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Time of Day</label>
                  <select
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value as HabitTimeOfDay)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                    <option value="anytime">Anytime</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as GoalCategory)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Health">Health</option>
                    <option value="Personal">Personal</option>
                    <option value="Learning">Learning</option>
                    <option value="Career">Career</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold shadow-md shadow-amber-600/30"
                >
                  Track Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
