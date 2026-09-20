import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JournalEntry, JournalMood } from '../../types';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { EmptyState } from '../common/EmptyState';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Sparkles, 
  Smile, 
  Heart, 
  Zap, 
  Coffee, 
  CloudRain, 
  Compass,
  Maximize2,
  ArrowLeft,
  Check
} from 'lucide-react';

export const JournalView: React.FC = () => {
  const { journal, addJournalEntry, deleteJournalEntry, isDataLoading } = useApp();
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [isDistractionFree, setIsDistractionFree] = useState(false);

  // Form State
  const [mood, setMood] = useState<JournalMood>('productive');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [tagInput, setTagInput] = useState('');

  const moods: { id: JournalMood; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'joyful', label: 'Joyful', icon: Smile, color: 'text-amber-400 border-amber-400/40 bg-amber-500/10' },
    { id: 'productive', label: 'Productive', icon: Zap, color: 'text-indigo-400 border-indigo-400/40 bg-indigo-500/10' },
    { id: 'calm', label: 'Calm', icon: Coffee, color: 'text-emerald-400 border-emerald-400/40 bg-emerald-500/10' },
    { id: 'neutral', label: 'Neutral', icon: Compass, color: 'text-slate-400 border-slate-400/40 bg-slate-500/10' },
    { id: 'anxious', label: 'Anxious', icon: CloudRain, color: 'text-purple-400 border-purple-400/40 bg-purple-500/10' },
    { id: 'tired', label: 'Tired', icon: Coffee, color: 'text-rose-400 border-rose-400/40 bg-rose-500/10' }
  ];

  const handleSaveEntry = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim()) return;

    const tags = tagInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    // Dynamic AI Sentiment analysis (heuristic or AI)
    let aiSentiment: JournalEntry['aiSentiment'] = 'reflective';
    if (mood === 'joyful' || mood === 'productive') aiSentiment = 'positive';
    else if (mood === 'anxious' || mood === 'tired') aiSentiment = 'challenging';

    addJournalEntry({
      date: new Date().toISOString().split('T')[0],
      mood,
      title: title.trim() || undefined,
      content,
      gratitude: gratitude.trim() || undefined,
      tags: tags.length > 0 ? tags : ['daily-reflection'],
      aiSentiment,
      aiReflection: `LOTAI Reflection: Your mindset during this entry shows self-awareness. Continuing to log your thoughts reinforces emotional resilience.`
    });

    setTitle('');
    setContent('');
    setGratitude('');
    setTagInput('');
    setIsWriteOpen(false);
    setIsDistractionFree(false);
  };

  const filteredEntries = selectedMoodFilter === 'all'
    ? journal
    : journal.filter(j => j.mood === selectedMoodFilter);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white">Journal & Mind</h1>
            <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Capture daily reflections, express gratitude, track emotional states, and cultivate clarity.
          </p>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => setIsDistractionFree(true)}
            className="flex items-center justify-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 text-xs sm:text-sm font-semibold transition active:scale-95 min-h-[44px]"
            title="Full-Screen Distraction-Free Zen Writing"
          >
            <Maximize2 className="w-4 h-4 text-indigo-400" />
            <span>Zen Mode</span>
          </button>
          <button
            onClick={() => setIsWriteOpen(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition active:scale-95 min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Write Reflection</span>
          </button>
        </div>
      </div>

      {/* Mood Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setSelectedMoodFilter('all')}
          className={`text-xs font-semibold px-3.5 py-2 rounded-xl shrink-0 min-h-[38px] flex items-center transition ${
            selectedMoodFilter === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All Moods
        </button>
        {moods.map(m => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => setSelectedMoodFilter(m.id)}
              className={`flex items-center space-x-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl shrink-0 min-h-[38px] transition ${
                selectedMoodFilter === m.id
                  ? 'bg-slate-800 text-white border border-indigo-500/40'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Write Reflection Drawer / Form */}
      {isWriteOpen && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-indigo-500/30 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Today's Mental Check-in</span>
            </h3>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsDistractionFree(true)}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-medium border border-indigo-500/20 transition"
              >
                <Maximize2 className="w-3 h-3" />
                <span className="hidden sm:inline">Zen Mode</span>
              </button>
              <button
                onClick={() => setIsWriteOpen(false)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 min-h-[32px]"
              >
                Close
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveEntry} className="space-y-4">
            {/* Mood selector buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">How are you feeling right now?</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {moods.map(m => {
                  const Icon = m.icon;
                  const isSelected = mood === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMood(m.id)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition ${
                        isSelected ? m.color : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-1" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Title / Headline (optional)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Breakthrough in project focus & calm evening"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Reflection / Freeform Thoughts *</label>
              <textarea
                rows={4}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What happened today? How did you react? What lessons can you take forward?"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center space-x-1">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>Daily Gratitude (What are you thankful for?)</span>
              </label>
              <input
                type="text"
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
                placeholder="e.g. Grateful for quiet morning coffee and deep focus"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="focus, clarity, family, learning"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsWriteOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-400 hover:text-white min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/30 min-h-[44px]"
              >
                Save Reflection
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading Skeleton */}
      {isDataLoading && <LoadingSkeleton rows={4} />}

      {/* Empty State */}
      {!isDataLoading && filteredEntries.length === 0 && (
        <EmptyState
          icon={BookOpen}
          title="No Journal Entries"
          description={selectedMoodFilter === 'all' ? "Clear your thoughts, cultivate gratitude, and document your life lessons. Write your first reflection." : `No journal entries logged with mood "${selectedMoodFilter}".`}
          actionLabel="Write Reflection"
          onAction={() => setIsWriteOpen(true)}
          accentColor="indigo"
        />
      )}

      {/* Past Journal Entries Feed */}
      {!isDataLoading && filteredEntries.length > 0 && (
        <div className="space-y-4">
          {filteredEntries.map(entry => (
            <div
              key={entry.id}
              className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {entry.mood}
                  </span>
                  <span className="text-xs text-slate-500">{entry.date}</span>
                </div>
                <button
                  onClick={() => deleteJournalEntry(entry.id)}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 active:scale-95 transition"
                  title="Delete Entry"
                  aria-label="Delete Entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {entry.title && (
                <h3 className="text-base font-bold text-white">
                  {entry.title}
                </h3>
              )}

              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {entry.content}
              </p>

              {entry.gratitude && (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-start space-x-2">
                  <Heart className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-rose-300">Gratitude: </span>
                    <span>{entry.gratitude}</span>
                  </div>
                </div>
              )}

              {entry.aiReflection && (
                <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-300 flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{entry.aiReflection}</span>
                </div>
              )}

              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {entry.tags.map((t, idx) => (
                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Full-Screen Distraction-Free Zen Writing Overlay for Mobile & Focused Authors */}
      {isDistractionFree && (
        <div className="fixed inset-0 z-50 bg-[#050816] text-slate-100 flex flex-col p-4 sm:p-8 overflow-y-auto animate-fadeIn">
          <div className="max-w-3xl w-full mx-auto flex flex-col flex-1">
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setIsDistractionFree(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition active:scale-95"
                title="Exit Zen Mode"
                aria-label="Exit Zen Mode"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-semibold text-slate-300">Zen Reflection</span>
                <span>•</span>
                <span>{content.trim() ? content.trim().split(/\s+/).length : 0} words</span>
              </div>

              <button
                type="button"
                onClick={() => handleSaveEntry()}
                disabled={!content.trim()}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition active:scale-95 min-h-[44px] flex items-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>

            {/* Zen Writing Canvas */}
            <div className="flex-1 flex flex-col py-6 space-y-4 min-h-[400px]">
              {/* Mood Bar */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
                {moods.map(m => {
                  const Icon = m.icon;
                  const isSelected = mood === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMood(m.id)}
                      className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold shrink-0 min-h-[38px] transition ${
                        isSelected ? m.color : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Title */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title or thought of the day..."
                className="text-xl sm:text-2xl font-bold bg-transparent placeholder:text-slate-600 border-b border-transparent focus:border-slate-800 text-white focus:outline-none py-2"
              />

              {/* Content Area */}
              <textarea
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write freely. No distractions, just your mindful thoughts, realizations, and breakthroughs..."
                className="flex-1 w-full bg-transparent text-base sm:text-lg leading-relaxed text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none min-h-[260px]"
                autoFocus
              />

              {/* Secondary Inputs */}
              <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <label className="block text-[11px] font-semibold text-rose-400 mb-1 flex items-center space-x-1">
                    <Heart className="w-3.5 h-3.5" />
                    <span>Daily Gratitude</span>
                  </label>
                  <input
                    type="text"
                    value={gratitude}
                    onChange={(e) => setGratitude(e.target.value)}
                    placeholder="What are you thankful for today?"
                    className="w-full bg-transparent text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="clarity, mindset, vision"
                    className="w-full bg-transparent text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
