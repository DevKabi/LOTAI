import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskPriority, TaskStatus, GoalCategory } from '../../types';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { EmptyState } from '../common/EmptyState';
import { 
  CheckSquare, 
  Plus, 
  Calendar, 
  Trash2, 
  Kanban, 
  List, 
  CheckCircle2, 
  Circle,
  ArrowRight
} from 'lucide-react';

export const TasksView: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskStatus, goals, isDataLoading } = useApp();
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'list';
    }
    return 'kanban';
  });
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<GoalCategory>('Career');
  const [linkedGoalId, setLinkedGoalId] = useState('');

  const filteredTasks = selectedPriority === 'All'
    ? tasks
    : tasks.filter(t => t.priority === selectedPriority.toLowerCase());

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title,
      description,
      priority,
      status: 'todo',
      dueDate,
      category,
      linkedGoalId: linkedGoalId || undefined
    });

    setTitle('');
    setDescription('');
    setIsAddModalOpen(false);
  };

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'urgent':
        return <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">Urgent</span>;
      case 'high':
        return <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">High</span>;
      case 'medium':
        return <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">Medium</span>;
      case 'low':
        return <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-700 text-slate-300">Low</span>;
    }
  };

  const columns: { id: TaskStatus; label: string; count: number; color: string }[] = [
    { id: 'todo', label: 'To Do', count: tasks.filter(t => t.status === 'todo').length, color: 'text-slate-400' },
    { id: 'in-progress', label: 'In Progress', count: tasks.filter(t => t.status === 'in-progress').length, color: 'text-indigo-400' },
    { id: 'done', label: 'Completed', count: tasks.filter(t => t.status === 'done').length, color: 'text-emerald-400' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white">Tasks & Focus</h1>
            <span className="p-1 rounded-lg bg-blue-500/20 text-blue-400">
              <CheckSquare className="w-5 h-5" />
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Execute your day with relentless focus, Eisenhower matrix prioritization, and Kanban workflow.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 sm:p-1.5 rounded-lg min-w-[38px] min-h-[38px] sm:min-w-0 sm:min-h-0 flex items-center justify-center transition ${
                viewMode === 'kanban' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Kanban Board"
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 sm:p-1.5 rounded-lg min-w-[38px] min-h-[38px] sm:min-w-0 sm:min-h-0 flex items-center justify-center transition ${
                viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Priority Filter */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        {['All', 'Urgent', 'High', 'Medium', 'Low'].map(p => (
          <button
            key={p}
            onClick={() => setSelectedPriority(p)}
            className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition shrink-0 min-h-[36px] flex items-center ${
              selectedPriority === p
                ? 'bg-slate-800 text-white border border-indigo-500/40'
                : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {isDataLoading && <LoadingSkeleton rows={4} />}

      {/* Empty State */}
      {!isDataLoading && filteredTasks.length === 0 && (
        <EmptyState
          icon={CheckSquare}
          title="No Tasks in Queue"
          description={selectedPriority === 'All' ? "Your task pipeline is completely clear. Capture a new focus item to power your day." : `No tasks found with priority "${selectedPriority}".`}
          actionLabel="Add Task"
          onAction={() => setIsAddModalOpen(true)}
          accentColor="blue"
        />
      )}

      {/* Kanban Board & List Views */}
      {!isDataLoading && filteredTasks.length > 0 && (
        viewMode === 'kanban' ? (
        <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {columns.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);
            return (
              <div
                key={col.id}
                className="w-[82vw] max-w-[360px] md:w-auto shrink-0 snap-center p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col space-y-4 min-h-[500px]"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-bold ${col.color}`}>{col.label}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold">
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  {colTasks.length === 0 ? (
                    <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-800/80 rounded-xl text-xs text-slate-500">
                      No tasks in this lane
                    </div>
                  ) : (
                    colTasks.map(task => (
                      <div
                        key={task.id}
                        className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition shadow-sm space-y-3 group"
                      >
                        <div className="flex items-start justify-between">
                          {getPriorityBadge(task.priority)}
                          <div className="flex items-center space-x-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition">
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-500 hover:text-rose-400 rounded-lg active:scale-95"
                              title="Delete"
                              aria-label="Delete Task"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <h4 className={`text-sm font-semibold text-slate-100 ${task.status === 'done' ? 'line-through text-slate-400' : ''}`}>
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>

                        <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{task.dueDate}</span>
                          </span>

                          {/* Quick Status Shift */}
                          <div className="flex items-center space-x-1">
                            {col.id === 'todo' && (
                              <button
                                onClick={() => updateTask(task.id, { status: 'in-progress' })}
                                className="min-h-[36px] px-3 py-1 rounded-xl bg-slate-800 text-indigo-400 hover:bg-slate-700 active:scale-95 flex items-center space-x-1 text-xs font-medium"
                              >
                                <span>Start</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                            {col.id === 'in-progress' && (
                              <button
                                onClick={() => updateTask(task.id, { status: 'done' })}
                                className="min-h-[36px] px-3 py-1 rounded-xl bg-slate-800 text-emerald-400 hover:bg-slate-700 active:scale-95 flex items-center space-x-1 text-xs font-medium"
                              >
                                <span>Done</span>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {col.id === 'done' && (
                              <button
                                onClick={() => updateTask(task.id, { status: 'todo' })}
                                className="min-h-[36px] px-3 py-1 rounded-xl bg-slate-800 text-slate-400 hover:bg-slate-700 active:scale-95 text-xs font-medium"
                              >
                                Reopen
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 divide-y divide-slate-800/80">
          {filteredTasks.map(task => {
            const isDone = task.status === 'done';
            return (
              <div
                key={task.id}
                className="py-3 sm:py-3.5 flex items-center justify-between space-x-3 sm:space-x-4"
              >
                <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className="min-w-[48px] min-h-[48px] -ml-2 flex items-center justify-center text-slate-500 hover:text-emerald-400 active:scale-95 transition shrink-0"
                    aria-label={isDone ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500" />
                    )}
                  </button>
                  <div className="min-w-0">
                    <h4 className={`text-sm font-semibold text-slate-100 truncate ${isDone ? 'line-through text-slate-500' : ''}`}>
                      {task.title}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">
                      {task.category} • Due: {task.dueDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <div className="hidden sm:block">
                    {getPriorityBadge(task.priority)}
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="min-w-[48px] min-h-[48px] flex items-center justify-center text-slate-500 hover:text-rose-400 rounded-xl transition active:scale-95"
                    aria-label="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )
      )}

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 my-8">
            <h2 className="text-xl font-bold text-white">Add New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Deliver client roadmap presentation"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
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
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Link to Goal (optional)</label>
                  <select
                    value={linkedGoalId}
                    onChange={(e) => setLinkedGoalId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">None</option>
                    {goals.map(g => (
                      <option key={g.id} value={g.id}>{g.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Notes / Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Additional context or links..."
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
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
