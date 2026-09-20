import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { EmptyState } from '../common/EmptyState';
import { 
  HeartPulse, 
  Droplet, 
  Moon, 
  Activity, 
  Flame, 
  Plus, 
  Sparkles,
  Calendar
} from 'lucide-react';

export const HealthView: React.FC = () => {
  const { health, logWater, logSleep, logWorkout, settings, isDataLoading } = useApp();
  const todayKey = new Date().toISOString().split('T')[0];
  const todayHealth = health.find(h => h.date === todayKey) || health[0];

  // Modals state
  const [isSleepModalOpen, setIsSleepModalOpen] = useState(false);
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);

  // Sleep Form
  const [sleepHours, setSleepHours] = useState('7.5');
  const [sleepQuality, setSleepQuality] = useState<'poor' | 'fair' | 'good' | 'optimal'>('good');

  // Workout Form
  const [workoutMins, setWorkoutMins] = useState('30');
  const [workoutType, setWorkoutType] = useState('Running');
  const [calories, setCalories] = useState('250');

  // Hydration calculation
  const waterIntake = todayHealth?.waterIntakeMl || 0;
  const waterTarget = settings.dailyWaterTargetMl || 2500;
  const waterPercentage = Math.min(100, Math.round((waterIntake / waterTarget) * 100));

  const handleSleepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logSleep(parseFloat(sleepHours) || 7.5, sleepQuality);
    setIsSleepModalOpen(false);
  };

  const handleWorkoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logWorkout(parseInt(workoutMins, 10) || 30, workoutType, parseInt(calories, 10) || 200);
    setIsWorkoutModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white">Health & Fitness</h1>
            <span className="p-1 rounded-lg bg-rose-500/20 text-rose-400">
              <HeartPulse className="w-5 h-5" />
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Optimize your physical vitality, sleep architecture, daily hydration, and stamina.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsSleepModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
          >
            <Moon className="w-4 h-4 text-indigo-400" />
            <span>Log Sleep</span>
          </button>
          <button
            onClick={() => setIsWorkoutModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/30 transition"
          >
            <Activity className="w-4 h-4" />
            <span>Log Workout</span>
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isDataLoading && <LoadingSkeleton rows={4} />}

      {!isDataLoading && (
        <>
          {/* Main 3 Vital Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hydration Tracker */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-cyan-950/20 via-slate-900 to-slate-900 border border-cyan-500/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Hydration</span>
                  <Droplet className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="mt-4 flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-white">{waterIntake}</span>
                  <span className="text-sm text-slate-400">/ {waterTarget} ml</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{waterPercentage}% of daily hydration target met</p>
                
                {/* Liquid Level Bar */}
                <div className="w-full bg-slate-800 rounded-full h-3 mt-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-700"
                    style={{ width: `${waterPercentage}%` }}
                  />
                </div>
              </div>

              {/* One-Tap Water Increments */}
              <div className="pt-6 border-t border-slate-800/80 mt-6">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Quick Log:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => logWater(250)}
                    className="py-2 px-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs border border-slate-700 flex flex-col items-center space-y-0.5 transition"
                  >
                    <span>+250ml</span>
                    <span className="text-[10px] text-slate-500 font-normal">Glass</span>
                  </button>
                  <button
                    onClick={() => logWater(500)}
                    className="py-2 px-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs border border-slate-700 flex flex-col items-center space-y-0.5 transition"
                  >
                    <span>+500ml</span>
                    <span className="text-[10px] text-slate-500 font-normal">Bottle</span>
                  </button>
                  <button
                    onClick={() => logWater(1000)}
                    className="py-2 px-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs border border-slate-700 flex flex-col items-center space-y-0.5 transition"
                  >
                    <span>+1000ml</span>
                    <span className="text-[10px] text-slate-500 font-normal">Flask</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sleep Tracker Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-indigo-950/20 via-slate-900 to-slate-900 border border-indigo-500/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Sleep Restoration</span>
                  <Moon className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="mt-4 flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-white">{todayHealth?.sleepHours || 8}</span>
                  <span className="text-sm text-slate-400">/ {settings.dailySleepHours} hrs</span>
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-xs text-slate-400">Quality:</span>
                  <span className="text-xs uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {todayHealth?.sleepQuality || 'Good'}
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800/80 mt-6 space-y-2">
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Target: 8h restorative sleep for peak cognition.</span>
                </div>
                <button
                  onClick={() => setIsSleepModalOpen(true)}
                  className="w-full py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition"
                >
                  Update Today's Sleep
                </button>
              </div>
            </div>

            {/* Workout & Stamina Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-rose-950/20 via-slate-900 to-slate-900 border border-rose-500/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Active Stamina</span>
                  <Activity className="w-4 h-4 text-rose-400" />
                </div>
                <div className="mt-4 flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-white">{todayHealth?.workoutMinutes || 0}</span>
                  <span className="text-sm text-slate-400">active mins</span>
                </div>
                <div className="mt-2 flex items-center space-x-3 text-xs text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                    <span>~{todayHealth?.caloriesBurned || 0} kcal burned</span>
                  </span>
                  <span>•</span>
                  <span className="text-slate-300 font-medium">{todayHealth?.workoutType || 'General Fitness'}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800/80 mt-6">
                <button
                  onClick={() => setIsWorkoutModalOpen(true)}
                  className="w-full py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-semibold border border-rose-500/30 transition flex items-center justify-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Training Session</span>
                </button>
              </div>
            </div>
          </div>

          {/* Historical Health Log Table */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Vitals History</h3>
            {health.length === 0 ? (
              <EmptyState
                icon={HeartPulse}
                title="No Vitals Logged"
                description="Start tracking your daily hydration, sleep duration, and exercise to establish your health baseline."
                actionLabel="Log Workout"
                onAction={() => setIsWorkoutModalOpen(true)}
                accentColor="rose"
              />
            ) : (
              <div className="divide-y divide-slate-800 overflow-x-auto">
                {health.map(log => (
                  <div key={log.id} className="py-3 flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                        <Calendar className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-200">
                          {log.date === todayKey ? 'Today' : log.date}
                        </h4>
                        <p className="text-xs text-slate-400">
                          {log.notes || 'Routine health log'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-xs text-slate-300">
                      <span className="flex items-center space-x-1">
                        <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{log.waterIntakeMl} ml</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Moon className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{log.sleepHours}h ({log.sleepQuality})</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Activity className="w-3.5 h-3.5 text-rose-400" />
                        <span>{log.workoutMinutes}m {log.workoutType ? `(${log.workoutType})` : ''}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Log Sleep Modal */}
      {isSleepModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-white">Log Sleep</h2>
            <form onSubmit={handleSleepSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Hours Slept</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Sleep Quality</label>
                <select
                  value={sleepQuality}
                  onChange={(e) => setSleepQuality(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="optimal">Optimal (Deeply refreshed)</option>
                  <option value="good">Good (Normal rest)</option>
                  <option value="fair">Fair (Slightly restless)</option>
                  <option value="poor">Poor (Disrupted/Fatigued)</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsSleepModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md shadow-indigo-600/30"
                >
                  Save Sleep
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Workout Modal */}
      {isWorkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-white">Log Workout Session</h2>
            <form onSubmit={handleWorkoutSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Activity / Sport</label>
                <input
                  type="text"
                  required
                  value={workoutType}
                  onChange={(e) => setWorkoutType(e.target.value)}
                  placeholder="e.g. Running, Strength Training, Yoga, HIIT"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    required
                    value={workoutMins}
                    onChange={(e) => {
                      setWorkoutMins(e.target.value);
                      const m = parseInt(e.target.value, 10) || 0;
                      setCalories((m * 7.5).toFixed(0));
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Est. Calories</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsWorkoutModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold shadow-md shadow-rose-600/30"
                >
                  Save Workout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
