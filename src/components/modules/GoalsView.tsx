import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GoalCategory } from '../../types';
import { EmptyState } from '../common/EmptyState';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { 
  Target, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Sparkles,
  Trophy,
  Pencil
} from 'lucide-react';

export const GoalsView: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal, toggleMilestone, isDataLoading } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GoalCategory>('Career');
  const [targetDate, setTargetDate] = useState('');
  const [targetMetric, setTargetMetric] = useState('');
  const [milestonesText, setMilestonesText] = useState('');

  const categories = ['All', 'Career', 'Health', 'Finance', 'Personal', 'Learning'];

  const filteredGoals = selectedCategory === 'All' 
    ? goals 
    : goals.filter(g => g.category === selectedCategory);

  const openCreateModal = () => {
    setEditingGoalId(null);
    setTitle('');
    setDescription('');
    setCategory('Career');
    setTargetDate('');
    setTargetMetric('');
    setMilestonesText('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (goal: typeof goals[0]) => {
    setEditingGoalId(goal.id);
    setTitle(goal.title);
    setDescription(goal.description || '');
    setCategory(goal.category);
    setTargetDate(goal.targetDate);
    setTargetMetric(goal.targetMetric || '');
    setMilestonesText((goal.milestones || []).map(m => m.title).join('\n'));
    setIsAddModalOpen(true);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingGoalId) {
      const existingGoal = goals.find(g => g.id === editingGoalId);
      const existingMilestones = existingGoal?.milestones || [];
      const lines = milestonesText.split('\n').map(m => m.trim()).filter(Boolean);
      
      // Preserve completion status for existing milestones where possible
      const updatedMilestones = lines.map((line, idx) => {
        const found = existingMilestones.find(em => em.title.toLowerCase() === line.toLowerCase());
        return {
          id: found ? found.id : `m-${Date.now()}-${idx}`,
          title: line,
          completed: found ? found.completed : false
        };
      });

      const completedCount = updatedMilestones.filter(m => m.completed).length;
      const progress = updatedMilestones.length > 0 
        ? Math.round((completedCount / updatedMilestones.length) * 100)
        : existingGoal?.currentProgress || 0;

      updateGoal(editingGoalId, {
        title,
        description,
        category,
        targetDate: targetDate || existingGoal?.targetDate || new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
        targetMetric: targetMetric || undefined,
        milestones: updatedMilestones,
        currentProgress: progress,
        status: progress === 100 ? 'completed' : 'in-progress'
      });
    } else {
      const milestones = milestonesText
        .split('\n')
        .map(m => m.trim())
        .filter(Boolean)
        .map((m, idx) => ({
          id: `m-${Date.now()}-${idx}`,
          title: m,
          completed: false
        }));

      addGoal({
        title,
        description,
        category,
        targetDate: targetDate || new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
        currentProgress: 0,
        status: 'in-progress',
        targetMetric: targetMetric || undefined,
        milestones
      });
    }

    setIsAddModalOpen(false);
    setEditingGoalId(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white">Goals & OKRs</h1>
            <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Target className="w-5 h-5" />
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Define your visionary outcomes, track key milestones, and conquer long-term benchmarks.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center space-x-2 px-4 py-3 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition min-h-[48px] sm:min-h-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Life Goal</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shrink-0 min-h-[40px] flex items-center ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {isDataLoading && <LoadingSkeleton rows={3} />}

      {/* Empty State */}
      {!isDataLoading && filteredGoals.length === 0 && (
        <EmptyState
          icon={Target}
          title="No Goals Found"
          description={selectedCategory === 'All' ? "You haven't defined any visionary goals yet. Set your first goal to begin charting your roadmap." : `No goals found under category "${selectedCategory}".`}
          actionLabel="Create Goal"
          onAction={openCreateModal}
          accentColor="purple"
        />
      )}

      {/* Goals Grid */}
      {!isDataLoading && filteredGoals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredGoals.map((goal) => {
          const isCompleted = goal.currentProgress === 100;
          return (
            <div
              key={goal.id}
              className={`p-5 sm:p-6 rounded-2xl bg-slate-900/90 border transition-all flex flex-col justify-between relative overflow-hidden ${
                isCompleted 
                  ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 to-slate-900' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {goal.category}
                  </span>
                  
                  {/* Action Buttons with 44-48px touch targets */}
                  <div className="flex items-center space-x-1.5">
                    {isCompleted && (
                      <span className="flex items-center space-x-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                        <Trophy className="w-3 h-3" />
                        <span>Achieved</span>
                      </span>
                    )}
                    <button
                      onClick={() => openEditModal(goal)}
                      className="min-w-[44px] min-h-[44px] p-2 flex items-center justify-center rounded-xl bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white transition active:scale-95"
                      title="Edit Goal"
                      aria-label="Edit Goal"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="min-w-[44px] min-h-[44px] p-2 flex items-center justify-center rounded-xl bg-slate-800/70 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition active:scale-95"
                      title="Delete Goal"
                      aria-label="Delete Goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white mt-3 leading-snug">
                  {goal.title}
                </h3>
                {goal.description && (
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {goal.description}
                  </p>
                )}

                {goal.targetMetric && (
                  <div className="mt-3 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 text-xs text-slate-300 border border-slate-700">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Target: <strong>{goal.targetMetric}</strong></span>
                  </div>
                )}

                {/* Progress Bar */}
                <div className="mt-5 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Progress</span>
                    <span className={isCompleted ? 'text-emerald-400' : 'text-indigo-400'}>
                      {goal.currentProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isCompleted ? 'bg-emerald-400' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${goal.currentProgress}%` }}
                    />
                  </div>
                </div>

                {/* Milestones List with >= 48px touch targets */}
                {goal.milestones.length > 0 && (
                  <div className="mt-5 space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Milestones ({goal.milestones.filter(m => m.completed).length}/{goal.milestones.length})
                    </p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {goal.milestones.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => toggleMilestone(goal.id, m.id)}
                          className={`flex items-center space-x-3 p-3 min-h-[48px] rounded-xl text-xs sm:text-sm cursor-pointer transition select-none ${
                            m.completed 
                              ? 'bg-slate-950/50 text-slate-400 line-through border border-slate-900' 
                              : 'bg-slate-800/60 hover:bg-slate-800 text-slate-200 border border-slate-800/80 active:bg-slate-700'
                          }`}
                        >
                          {m.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-500 shrink-0" />
                          )}
                          <span className="truncate flex-1 font-medium">{m.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Target Date Footer */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Target: {goal.targetDate}</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  {Math.max(0, Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days left
                </span>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Add / Edit Goal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 my-8">
            <h2 className="text-xl font-bold text-white">
              {editingGoalId ? 'Edit Life Goal' : 'Create New Goal'}
            </h2>
            <form onSubmit={handleSaveGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Goal Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Build $15,000 Emergency Reserve"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as GoalCategory)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Career">Career</option>
                    <option value="Health">Health</option>
                    <option value="Finance">Finance</option>
                    <option value="Personal">Personal</option>
                    <option value="Learning">Learning</option>
                    <option value="Relationships">Relationships</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Target Metric / Benchmark (optional)</label>
                <input
                  type="text"
                  value={targetMetric}
                  onChange={(e) => setTargetMetric(e.target.value)}
                  placeholder="e.g. $15,000 saved, 21.1 km run, 100 beta users"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Milestones (One per line)</label>
                <textarea
                  rows={3}
                  value={milestonesText}
                  onChange={(e) => setMilestonesText(e.target.value)}
                  placeholder="Reach $5,000&#10;Automate monthly transfer&#10;Reach $15,000 goal"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md shadow-indigo-600/30 min-h-[44px]"
                >
                  {editingGoalId ? 'Save Changes' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
