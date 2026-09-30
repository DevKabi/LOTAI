import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Target, 
  CheckSquare, 
  DollarSign, 
  Droplet, 
  Moon, 
  Flame, 
  BookOpen, 
  Lightbulb, 
  Brain, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Circle,
  Activity
} from 'lucide-react';
import { GoalCategory, TaskPriority, ExpenseCategory, IncomeCategory, JournalMood } from '../../types';
import { SpeechService } from '../../services/speechService';
import { OmniCaptureService } from '../../services/omniCaptureService';

export const LifeHubQuickModals: React.FC = () => {
  const { 
    quickModalType, 
    closeQuickModal, 
    addGoal, 
    addTask, 
    habits, 
    toggleHabitToday, 
    addHabit, 
    addFinance, 
    logWater, 
    logSleep, 
    logWorkout, 
    logWeight, 
    addJournalEntry, 
    showToast,
    settings,
    executeOmniSave
  } = useApp();

  const todayKey = new Date().toISOString().split('T')[0];

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeQuickModal();
      }
    };
    if (quickModalType) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quickModalType, closeQuickModal]);

  // ============================================================================
  // 1. GOAL MODAL STATE
  // ============================================================================
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState<GoalCategory>('Career');
  const [goalMetric, setGoalMetric] = useState('');
  const [goalDate, setGoalDate] = useState('');
  const [goalMilestones, setGoalMilestones] = useState('');

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    const milestones = goalMilestones
      .split('\n')
      .map(m => m.trim())
      .filter(Boolean)
      .map(m => ({
        id: Math.random().toString(36).substring(2, 9),
        title: m,
        completed: false
      }));

    await addGoal({
      title: goalTitle.trim(),
      category: goalCategory,
      targetMetric: goalMetric.trim() || undefined,
      targetDate: goalDate || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      currentProgress: 0,
      status: 'in-progress',
      milestones
    });

    showToast('Goal Created 🎯', `"${goalTitle}" is now actively tracked in your OKRs.`);
    setGoalTitle('');
    setGoalMetric('');
    setGoalDate('');
    setGoalMilestones('');
    closeQuickModal();
  };

  // ============================================================================
  // 2. TASK MODAL STATE
  // ============================================================================
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
  const [taskCategory, setTaskCategory] = useState<GoalCategory>('Career');
  const [taskDueDate, setTaskDueDate] = useState(todayKey);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    await addTask({
      title: taskTitle.trim(),
      priority: taskPriority,
      status: 'todo',
      dueDate: taskDueDate,
      category: taskCategory
    });

    showToast('Task Added ⚡', `"${taskTitle}" added to today's execution plan.`);
    setTaskTitle('');
    setTaskPriority('medium');
    setTaskDueDate(todayKey);
    closeQuickModal();
  };

  // ============================================================================
  // 3. HABIT MODAL STATE
  // ============================================================================
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState<GoalCategory>('Health');
  const [newHabitTime, setNewHabitTime] = useState<'anytime' | 'morning' | 'afternoon' | 'evening'>('morning');
  const [showAddHabitForm, setShowAddHabitForm] = useState(false);

  const handleCreateHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;

    await addHabit({
      title: newHabitTitle.trim(),
      category: newHabitCategory,
      frequency: 'daily',
      timeOfDay: newHabitTime,
      targetCount: 1
    });

    showToast('Habit Created 🔥', `"${newHabitTitle}" added to your daily standards.`);
    setNewHabitTitle('');
    setShowAddHabitForm(false);
  };

  // ============================================================================
  // 4 & 5. FINANCE MODAL STATE (Expense & Income)
  // ============================================================================
  const [financeType, setFinanceType] = useState<'expense' | 'income'>('expense');
  const [financeAmount, setFinanceAmount] = useState('');
  const [financeCategory, setFinanceCategory] = useState('Food & Dining');
  const [financeDesc, setFinanceDesc] = useState('');
  const [financeDate, setFinanceDate] = useState(todayKey);

  // Sync modal type to expense/income
  useEffect(() => {
    if (quickModalType === 'expense') {
      setFinanceType('expense');
      setFinanceCategory('Food & Dining');
    } else if (quickModalType === 'income') {
      setFinanceType('income');
      setFinanceCategory('Salary');
    }
  }, [quickModalType]);

  const expenseCategories: ExpenseCategory[] = [
    'Food & Dining',
    'Transportation',
    'Housing & Utilities',
    'Shopping',
    'Health & Medical',
    'Entertainment',
    'Business Expenses',
    'Education & Learning',
    'Investments & Savings',
    'Miscellaneous'
  ];

  const incomeCategories: IncomeCategory[] = [
    'Salary',
    'Business Revenue',
    'Freelancing',
    'Consulting',
    'Investment Income',
    'Other Income'
  ];

  const handleCreateFinance = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(financeAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showToast('Invalid Amount', 'Please enter a valid numeric amount.', 'warning');
      return;
    }

    await addFinance({
      type: financeType,
      amount: parsedAmount,
      category: financeCategory,
      description: financeDesc.trim() || `${financeType === 'expense' ? 'Spent on' : 'Received from'} ${financeCategory}`,
      date: financeDate
    });

    showToast(
      financeType === 'expense' ? 'Expense Logged 💸' : 'Income Recorded 💰',
      `${settings.currency}${parsedAmount.toLocaleString()} saved in ${financeCategory}.`
    );
    setFinanceAmount('');
    setFinanceDesc('');
    closeQuickModal();
  };

  // ============================================================================
  // 6. HEALTH MODAL STATE
  // ============================================================================
  const [healthTab, setHealthTab] = useState<'water' | 'sleep' | 'workout' | 'weight'>('water');
  const [customWater, setCustomWater] = useState('250');
  const [sleepHrs, setSleepHrs] = useState('7.5');
  const [sleepQual, setSleepQual] = useState<'poor' | 'fair' | 'good' | 'optimal'>('good');
  const [workoutMin, setWorkoutMin] = useState('30');
  const [workoutType, setWorkoutType] = useState('Cardio / Gym');
  const [weightValue, setWeightValue] = useState('');

  const handleLogWater = async (amt: number) => {
    await logWater(amt);
    showToast('Hydration Logged 💧', `+${amt}ml water recorded.`);
    closeQuickModal();
  };

  const handleLogSleep = async (e: React.FormEvent) => {
    e.preventDefault();
    const hrs = parseFloat(sleepHrs);
    if (isNaN(hrs) || hrs <= 0) return;
    await logSleep(hrs, sleepQual);
    showToast('Sleep Logged 🌙', `${hrs} hrs of ${sleepQual} rest recorded.`);
    closeQuickModal();
  };

  const handleLogWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    const min = parseInt(workoutMin, 10);
    if (isNaN(min) || min <= 0) return;
    await logWorkout(min, workoutType);
    showToast('Workout Logged 🏃', `${min}m of ${workoutType} completed.`);
    closeQuickModal();
  };

  const handleLogWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    const kg = parseFloat(weightValue);
    if (isNaN(kg) || kg <= 0) return;
    await logWeight(kg);
    showToast('Weight Logged ⚖️', `${kg} kg recorded in your vitals.`);
    setWeightValue('');
    closeQuickModal();
  };

  // ============================================================================
  // 7. JOURNAL MODAL STATE
  // ============================================================================
  const [journalMood, setJournalMood] = useState<JournalMood>('productive');
  const [journalTitle, setJournalTitle] = useState('');
  const [journalContent, setJournalContent] = useState('');
  const [journalGratitude, setJournalGratitude] = useState('');

  const moods: { id: JournalMood; label: string; emoji: string }[] = [
    { id: 'joyful', label: 'Joyful', emoji: '✨' },
    { id: 'productive', label: 'Productive', emoji: '🚀' },
    { id: 'calm', label: 'Calm', emoji: '🌿' },
    { id: 'neutral', label: 'Neutral', emoji: '⚖️' },
    { id: 'anxious', label: 'Anxious', emoji: '🌪️' },
    { id: 'tired', label: 'Tired', emoji: '😴' },
    { id: 'sad', label: 'Reflective', emoji: '🌧️' }
  ];

  const handleSaveJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalContent.trim()) return;

    await addJournalEntry({
      date: todayKey,
      mood: journalMood,
      title: journalTitle.trim() || undefined,
      content: journalContent.trim(),
      gratitude: journalGratitude.trim() || undefined,
      tags: ['daily-journal', journalMood],
      aiSentiment: ['joyful', 'productive', 'calm'].includes(journalMood) ? 'positive' : 'reflective'
    });

    showToast('Journal Entry Saved 📖', 'Reflections encrypted and recorded.');
    setJournalTitle('');
    setJournalContent('');
    setJournalGratitude('');
    closeQuickModal();
  };

  // ============================================================================
  // 8. MIND NOTE MODAL STATE
  // ============================================================================
  const [mindTitle, setMindTitle] = useState('');
  const [mindCategory, setMindCategory] = useState('Startup Idea');
  const [mindContent, setMindContent] = useState('');
  const [mindTags, setMindTags] = useState('idea, lotai');

  const mindCategories = [
    'Startup Idea',
    'SaaS Concept',
    'Product Strategy',
    'Book Note',
    'Mental Model',
    'Quick Observation'
  ];

  const handleSaveMindNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mindContent.trim()) return;

    const tagsList = mindTags
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    await addJournalEntry({
      date: todayKey,
      mood: 'productive',
      title: mindTitle.trim() || `${mindCategory}: Quick Capture`,
      content: mindContent.trim(),
      tags: ['mind-note', mindCategory.toLowerCase().replace(/\s+/g, '-'), ...tagsList],
      aiSentiment: 'positive',
      aiReflection: `Mind note indexed under ${mindCategory}.`
    });

    showToast('Idea Captured 💡', `Saved under ${mindCategory}.`);
    setMindTitle('');
    setMindContent('');
    closeQuickModal();
  };

  // ============================================================================
  // 9. FOCUS SESSION TIMER STATE
  // ============================================================================
  const [focusTotalMinutes, setFocusTotalMinutes] = useState(25);
  const [focusSecondsRemaining, setFocusSecondsRemaining] = useState(25 * 60);
  const [isFocusActive, setIsFocusActive] = useState(false);
  const [focusTaskTitle, setFocusTaskTitle] = useState('Deep Concentration Block');

  useEffect(() => {
    let interval: any = null;
    if (isFocusActive && focusSecondsRemaining > 0) {
      interval = setInterval(() => {
        setFocusSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (focusSecondsRemaining === 0 && isFocusActive) {
      setIsFocusActive(false);
      showToast('Focus Session Complete! 🧠', `Great job sustaining deep work on "${focusTaskTitle}".`, 'success');
    }
    return () => clearInterval(interval);
  }, [isFocusActive, focusSecondsRemaining, focusTaskTitle, showToast]);

  const selectFocusDuration = (mins: number) => {
    setIsFocusActive(false);
    setFocusTotalMinutes(mins);
    setFocusSecondsRemaining(mins * 60);
  };

  const formatTimerDisplay = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ============================================================================
  // 10. VOICE CAPTURE MODAL STATE (Optional Hands-Free Capture)
  // ============================================================================
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'analyzing' | 'done'>('idle');
  const [voiceError, setVoiceError] = useState<string | null>(null);

  useEffect(() => {
    if (quickModalType === 'voice') {
      setVoiceTranscript('');
      setVoiceError(null);
      setVoiceStatus('idle');
      startVoiceRecording();
    } else {
      SpeechService.stopListening();
      setIsVoiceListening(false);
    }
  }, [quickModalType]);

  const startVoiceRecording = () => {
    setVoiceError(null);
    const ok = SpeechService.startListening(
      {
        onStart: () => {
          setIsVoiceListening(true);
          setVoiceStatus('listening');
        },
        onResult: (t) => {
          setVoiceTranscript(t);
        },
        onError: (err) => {
          setVoiceError(err);
          setIsVoiceListening(false);
          setVoiceStatus('idle');
        },
        onEnd: () => {
          if (!SpeechService.getIsListening()) {
            setIsVoiceListening(false);
          }
        }
      },
      ''
    );
    if (!ok) {
      setVoiceError('Microphone not available or access denied.');
      setVoiceStatus('idle');
    }
  };

  const stopVoiceRecording = () => {
    const finalTranscript = SpeechService.stopListening();
    setIsVoiceListening(false);
    if (finalTranscript) {
      setVoiceTranscript(finalTranscript);
    }
  };

  const handleProcessVoice = async () => {
    let text = voiceTranscript.trim();
    if (isVoiceListening) {
      const finalT = SpeechService.stopListening();
      setIsVoiceListening(false);
      if (finalT) text = finalT.trim();
    }

    if (!text) {
      showToast('No Voice Detected', 'Please say or type something to process.', 'warning');
      return;
    }

    setVoiceStatus('analyzing');
    try {
      const analyzed = await OmniCaptureService.analyzeInput(
        text,
        settings.geminiApiKey,
        settings.geminiModel
      );
      const msg = await executeOmniSave(analyzed);
      showToast('Voice Action Executed ✨', msg);
      setVoiceTranscript('');
      closeQuickModal();
    } catch (err: any) {
      console.error('Voice analyze error:', err);
      const fallback = OmniCaptureService.parseLocalHeuristic(text);
      const msg = await executeOmniSave(fallback);
      showToast('Action Saved ✨', msg);
      setVoiceTranscript('');
      closeQuickModal();
    } finally {
      setVoiceStatus('idle');
    }
  };

  if (!quickModalType) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-[#050505]/85 backdrop-blur-md animate-fadeIn">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={closeQuickModal} />

      {/* Modal Container */}
      <div 
        className="relative w-full max-w-lg bg-[#0D1117] border border-[#1B222D] rounded-3xl shadow-2xl overflow-hidden z-10 my-auto text-[#F0F6FC] transition-all transform animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ==================================================================== */}
        {/* 1. GOAL MODAL                                                        */}
        {/* ==================================================================== */}
        {quickModalType === 'goal' && (
          <div className="p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1B222D]">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-[#19B000]/15 text-[#4CAF00] border border-[#19B000]/30">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-heading font-black text-white">Create New Goal</h3>
                  <p className="text-xs text-[#8B949E]">Define an objective and target outcome</p>
                </div>
              </div>
              <button 
                onClick={closeQuickModal}
                className="p-1.5 rounded-lg text-[#8B949E] hover:text-white hover:bg-[#11161D] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#8B949E] mb-1.5">
                  Goal Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Build SaaS MVP, Reach ₹10L ARR, Run Half Marathon"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#11161D] border border-[#1B222D] text-white placeholder-[#8B949E] text-sm focus:outline-none focus:border-[#19B000] focus:ring-1 focus:ring-[#19B000]"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#8B949E] mb-1.5">
                    Category
                  </label>
                  <select
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value as GoalCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#11161D] border border-[#1B222D] text-white text-sm focus:outline-none focus:border-[#19B000]"
                  >
                    <option value="Career">Career & Startup</option>
                    <option value="Health">Health & Fitness</option>
                    <option value="Finance">Wealth & Finance</option>
                    <option value="Personal">Personal Growth</option>
                    <option value="Learning">Learning & Skills</option>
                    <option value="Relationships">Relationships</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#8B949E] mb-1.5">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={goalDate}
                    onChange={(e) => setGoalDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#11161D] border border-[#1B222D] text-white text-sm focus:outline-none focus:border-[#19B000]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#8B949E] mb-1.5">
                  Target Metric (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹10,00,000 revenue or 15% body fat"
                  value={goalMetric}
                  onChange={(e) => setGoalMetric(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#11161D] border border-[#1B222D] text-white placeholder-[#8B949E] text-sm focus:outline-none focus:border-[#19B000]"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#8B949E] mb-1.5">
                  Milestones (1 per line)
                </label>
                <textarea
                  rows={2}
                  placeholder="Draft project roadmap&#10;Ship v1 to beta users&#10;Hit first 100 paid subscriptions"
                  value={goalMilestones}
                  onChange={(e) => setGoalMilestones(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#11161D] border border-[#1B222D] text-white placeholder-[#8B949E] text-sm focus:outline-none focus:border-[#19B000]"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={closeQuickModal}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8B949E] hover:text-white hover:bg-[#11161D] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-heading font-black text-black bg-gradient-to-r from-[#19B000] to-[#4CAF00] hover:brightness-110 shadow-lg shadow-[#19B000]/20 transition flex items-center space-x-1.5"
                >
                  <Target className="w-4 h-4" />
                  <span>Save Goal</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 2. TASK MODAL                                                        */}
        {/* ==================================================================== */}
        {quickModalType === 'task' && (
          <div className="p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1B222D]">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-[#FFC61A]/15 text-[#FFC61A] border border-[#FFC61A]/30">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-heading font-black text-white">Add Focus Task</h3>
                  <p className="text-xs text-[#8B949E]">Queue an action item for immediate execution</p>
                </div>
              </div>
              <button 
                onClick={closeQuickModal}
                className="p-1.5 rounded-lg text-[#8B949E] hover:text-white hover:bg-[#11161D] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#8B949E] mb-1.5">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Call 10 enterprise prospects, Ship landing page update"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#11161D] border border-[#1B222D] text-white placeholder-[#8B949E] text-sm focus:outline-none focus:border-[#FFC61A] focus:ring-1 focus:ring-[#FFC61A]"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#8B949E] mb-1.5">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 rounded-xl bg-[#11161D] border border-[#1B222D] text-white text-xs focus:outline-none focus:border-[#FFC61A]"
                  >
                    <option value="urgent">🔥 Urgent</option>
                    <option value="high">⚡ High</option>
                    <option value="medium">🎯 Medium</option>
                    <option value="low">🌱 Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#8B949E] mb-1.5">
                    Category
                  </label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value as GoalCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-[#11161D] border border-[#1B222D] text-white text-xs focus:outline-none focus:border-[#FFC61A]"
                  >
                    <option value="Career">Career</option>
                    <option value="Personal">Personal</option>
                    <option value="Health">Health</option>
                    <option value="Finance">Finance</option>
                    <option value="Learning">Learning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#8B949E] mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#11161D] border border-[#1B222D] text-white text-xs focus:outline-none focus:border-[#FFC61A]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={closeQuickModal}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8B949E] hover:text-white hover:bg-[#11161D] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-heading font-black text-black bg-gradient-to-r from-[#FFC61A] to-[#FFD43B] hover:brightness-110 shadow-lg shadow-[#FFC61A]/20 transition flex items-center space-x-1.5"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>Add Task</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 3. HABIT MODAL                                                       */}
        {/* ==================================================================== */}
        {quickModalType === 'habit' && (
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1B222D]">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-[#FFC61A]/15 text-[#FFD43B] border border-[#FFC61A]/30">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-heading font-black text-white">Daily Habit Check-in</h3>
                  <p className="text-xs text-[#8B949E]">Review standards or add a routine</p>
                </div>
              </div>
              <button 
                onClick={closeQuickModal}
                className="p-1.5 rounded-lg text-[#8B949E] hover:text-white hover:bg-[#11161D] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Today's Habits Instant Checkoff List */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {habits.length === 0 ? (
                <div className="p-4 text-center text-xs text-[#8B949E] bg-[#11161D] rounded-xl border border-[#1B222D]">
                  No habits tracked yet. Create your first routine below!
                </div>
              ) : (
                habits.map((h) => {
                  const isDone = Boolean(h.history[todayKey]);
                  return (
                    <div
                      key={h.id}
                      onClick={() => toggleHabitToday(h.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer select-none ${
                        isDone 
                          ? 'bg-[#050505] border-[#FFC61A]/30 text-[#8B949E]' 
                          : 'bg-[#11161D] border-[#1B222D] hover:border-[#19B000]/50 text-[#F0F6FC]'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-[#FFD43B] shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-[#8B949E] shrink-0" />
                        )}
                        <span className={`text-xs font-semibold truncate ${isDone ? 'line-through text-[#8B949E]' : ''}`}>
                          {h.title}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-[11px] font-heading font-bold text-[#FFD43B] bg-[#FFC61A]/10 px-2 py-0.5 rounded-md">
                        <Flame className="w-3 h-3" />
                        <span>{h.currentStreak}d</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Inline Add Habit Section */}
            {showAddHabitForm ? (
              <form onSubmit={handleCreateHabit} className="pt-3 border-t border-[#1B222D] space-y-3">
                <input
                  type="text"
                  required
                  placeholder="New Habit (e.g. 20m Morning Cardio, Read 10 Pages)"
                  value={newHabitTitle}
                  onChange={(e) => setNewHabitTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#11161D] border border-[#1B222D] text-white text-xs focus:outline-none focus:border-[#FFC61A]"
                  autoFocus
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newHabitCategory}
                    onChange={(e) => setNewHabitCategory(e.target.value as GoalCategory)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-[#11161D] border border-[#1B222D] text-white text-xs"
                  >
                    <option value="Health">Health</option>
                    <option value="Career">Career</option>
                    <option value="Learning">Learning</option>
                    <option value="Personal">Personal</option>
                  </select>
                  <select
                    value={newHabitTime}
                    onChange={(e) => setNewHabitTime(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-[#11161D] border border-[#1B222D] text-white text-xs"
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                    <option value="anytime">Anytime</option>
                  </select>
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddHabitForm(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-[#8B949E] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg text-xs font-heading font-black text-black bg-[#FFC61A] hover:bg-[#FFD43B]"
                  >
                    Save Routine
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddHabitForm(true)}
                className="w-full py-2.5 rounded-xl border border-dashed border-[#1B222D] hover:border-[#FFC61A]/50 text-xs font-heading font-bold text-[#8B949E] hover:text-[#FFC61A] transition flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Habit Routine</span>
              </button>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={closeQuickModal}
                className="px-4 py-2 rounded-xl text-xs font-heading font-bold text-white bg-[#11161D] hover:bg-[#1B222D] border border-[#1B222D] transition"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 4 & 5. FINANCE MODAL (Expense / Income)                              */}
        {/* ==================================================================== */}
        {(quickModalType === 'expense' || quickModalType === 'income') && (
          <div className="p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1B222D]">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-xl border ${
                  financeType === 'expense' 
                    ? 'bg-[#FFC61A]/15 text-[#FFC61A] border-[#FFC61A]/30' 
                    : 'bg-[#19B000]/15 text-[#4CAF00] border-[#19B000]/30'
                }`}>
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-heading font-black text-white">
                    {financeType === 'expense' ? 'Log Expense' : 'Record Income'}
                  </h3>
                  <p className="text-xs text-[#8B949E]">Track cash flow and update budget in real time</p>
                </div>
              </div>
              <button 
                onClick={closeQuickModal}
                className="p-1.5 rounded-lg text-[#8B949E] hover:text-white hover:bg-[#11161D] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Type Toggle Pills */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#11161D] border border-[#1B222D]">
              <button
                type="button"
                onClick={() => {
                  setFinanceType('expense');
                  setFinanceCategory('Food & Dining');
                }}
                className={`py-1.5 rounded-lg text-xs font-heading font-bold transition ${
                  financeType === 'expense' 
                    ? 'bg-[#FFC61A] text-black shadow-md' 
                    : 'text-[#8B949E] hover:text-white'
                }`}
              >
                Expense (Outflow)
              </button>
              <button
                type="button"
                onClick={() => {
                  setFinanceType('income');
                  setFinanceCategory('Salary');
                }}
                className={`py-1.5 rounded-lg text-xs font-heading font-bold transition ${
                  financeType === 'income' 
                    ? 'bg-[#19B000] text-black shadow-md' 
                    : 'text-[#8B949E] hover:text-white'
                }`}
              >
                Income (Inflow)
              </button>
            </div>

            <form onSubmit={handleCreateFinance} className="space-y-4">
              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#8B949E] mb-1.5">
                  Amount ({settings.currency}) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-base font-bold text-[#8B949E]">
                    {settings.currency}
                  </span>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="0.00"
                    value={financeAmount}
                    onChange={(e) => setFinanceAmount(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#11161D] border border-[#1B222D] text-white placeholder-[#8B949E] text-base font-heading font-black focus:outline-none focus:border-[#19B000] focus:ring-1 focus:ring-[#19B000]"
                    autoFocus
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#8B949E] mb-1.5">
                    Category
                  </label>
                  <select
                    value={financeCategory}
                    onChange={(e) => setFinanceCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#11161D] border border-[#1B222D] text-white text-xs focus:outline-none focus:border-[#19B000]"
                  >
                    {(financeType === 'expense' ? expenseCategories : incomeCategories).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#8B949E] mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    value={financeDate}
                    onChange={(e) => setFinanceDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#11161D] border border-[#1B222D] text-white text-xs focus:outline-none focus:border-[#19B000]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#8B949E] mb-1.5">
                  Description / Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Grocery store, Client milestone payment, Cloud server fee"
                  value={financeDesc}
                  onChange={(e) => setFinanceDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#11161D] border border-[#1B222D] text-white placeholder-[#8B949E] text-xs focus:outline-none focus:border-[#19B000]"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={closeQuickModal}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8B949E] hover:text-white hover:bg-[#11161D] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 rounded-xl text-xs font-heading font-black text-black shadow-lg transition flex items-center space-x-1.5 ${
                    financeType === 'expense'
                      ? 'bg-gradient-to-r from-[#FFC61A] to-[#FFD43B] hover:brightness-110 shadow-[#FFC61A]/20'
                      : 'bg-gradient-to-r from-[#19B000] to-[#4CAF00] hover:brightness-110 shadow-[#19B000]/20'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>{financeType === 'expense' ? 'Save Expense' : 'Save Income'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 6. HEALTH MODAL                                                      */}
        {/* ==================================================================== */}
        {quickModalType === 'health' && (
          <div className="p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1B222D]">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-[#19B000]/15 text-[#4CAF00] border border-[#19B000]/30">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-heading font-black text-white">Log Health & Vitals</h3>
                  <p className="text-xs text-[#8B949E]">Quick track water, sleep, workout or weight</p>
                </div>
              </div>
              <button 
                onClick={closeQuickModal}
                className="p-1.5 rounded-lg text-[#8B949E] hover:text-white hover:bg-[#11161D] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab navigation */}
            <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-[#11161D] border border-[#1B222D] text-xs">
              <button
                type="button"
                onClick={() => setHealthTab('water')}
                className={`py-1.5 rounded-lg font-heading font-bold transition flex items-center justify-center space-x-1 ${
                  healthTab === 'water' ? 'bg-[#19B000] text-black shadow-md' : 'text-[#8B949E] hover:text-white'
                }`}
              >
                <Droplet className="w-3.5 h-3.5" />
                <span>Water</span>
              </button>
              <button
                type="button"
                onClick={() => setHealthTab('sleep')}
                className={`py-1.5 rounded-lg font-heading font-bold transition flex items-center justify-center space-x-1 ${
                  healthTab === 'sleep' ? 'bg-[#19B000] text-black shadow-md' : 'text-[#8B949E] hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Sleep</span>
              </button>
              <button
                type="button"
                onClick={() => setHealthTab('workout')}
                className={`py-1.5 rounded-lg font-heading font-bold transition flex items-center justify-center space-x-1 ${
                  healthTab === 'workout' ? 'bg-[#19B000] text-black shadow-md' : 'text-[#8B949E] hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Workout</span>
              </button>
              <button
                type="button"
                onClick={() => setHealthTab('weight')}
                className={`py-1.5 rounded-lg font-heading font-bold transition flex items-center justify-center space-x-1 ${
                  healthTab === 'weight' ? 'bg-[#19B000] text-black shadow-md' : 'text-[#8B949E] hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Weight</span>
              </button>
            </div>

            {/* Sub-tab: WATER */}
            {healthTab === 'water' && (
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleLogWater(250)}
                    className="p-3.5 rounded-xl bg-[#11161D] hover:bg-[#19B000]/15 border border-[#1B222D] hover:border-[#19B000]/50 text-center transition group active:scale-95"
                  >
                    <span className="text-xl block mb-1">💧</span>
                    <span className="text-xs font-heading font-bold text-white group-hover:text-[#4CAF00] block">+250 ml</span>
                    <span className="text-[10px] text-[#8B949E]">1 Glass</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLogWater(500)}
                    className="p-3.5 rounded-xl bg-[#11161D] hover:bg-[#19B000]/15 border border-[#1B222D] hover:border-[#19B000]/50 text-center transition group active:scale-95"
                  >
                    <span className="text-xl block mb-1">🍶</span>
                    <span className="text-xs font-heading font-bold text-white group-hover:text-[#4CAF00] block">+500 ml</span>
                    <span className="text-[10px] text-[#8B949E]">1 Bottle</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLogWater(1000)}
                    className="p-3.5 rounded-xl bg-[#11161D] hover:bg-[#19B000]/15 border border-[#1B222D] hover:border-[#19B000]/50 text-center transition group active:scale-95"
                  >
                    <span className="text-xl block mb-1">🚰</span>
                    <span className="text-xs font-heading font-bold text-white group-hover:text-[#4CAF00] block">+1000 ml</span>
                    <span className="text-[10px] text-[#8B949E]">Carafe</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="number"
                    placeholder="Custom ml (e.g. 350)"
                    value={customWater}
                    onChange={(e) => setCustomWater(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#11161D] border border-[#1B222D] text-white text-xs focus:outline-none focus:border-[#19B000]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = parseInt(customWater, 10);
                      if (val > 0) handleLogWater(val);
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#19B000] to-[#4CAF00] hover:brightness-110 text-black text-xs font-heading font-black transition"
                  >
                    Add Water
                  </button>
                </div>
              </div>
            )}

            {/* Sub-tab: SLEEP */}
            {healthTab === 'sleep' && (
              <form onSubmit={handleLogSleep} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-heading font-bold text-[#8B949E] mb-1">Hours Slept</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={sleepHrs}
                      onChange={(e) => setSleepHrs(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#11161D] border border-[#1B222D] text-white text-sm font-heading font-black focus:outline-none focus:border-[#19B000]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-heading font-bold text-[#8B949E] mb-1">Quality</label>
                    <select
                      value={sleepQual}
                      onChange={(e) => setSleepQual(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#11161D] border border-[#1B222D] text-white text-xs focus:outline-none focus:border-[#19B000]"
                    >
                      <option value="optimal">🌟 Optimal</option>
                      <option value="good">✨ Good</option>
                      <option value="fair">⚖️ Fair</option>
                      <option value="poor">😴 Poor</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#19B000] to-[#4CAF00] text-black text-xs font-heading font-black shadow-lg shadow-[#19B000]/20"
                  >
                    Log Sleep
                  </button>
                </div>
              </form>
            )}

            {/* Sub-tab: WORKOUT */}
            {healthTab === 'workout' && (
              <form onSubmit={handleLogWorkout} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-heading font-bold text-[#8B949E] mb-1">Duration (Mins)</label>
                    <input
                      type="number"
                      required
                      value={workoutMin}
                      onChange={(e) => setWorkoutMin(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#11161D] border border-[#1B222D] text-white text-sm font-heading font-black focus:outline-none focus:border-[#19B000]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-heading font-bold text-[#8B949E] mb-1">Workout Type</label>
                    <input
                      type="text"
                      value={workoutType}
                      onChange={(e) => setWorkoutType(e.target.value)}
                      placeholder="e.g. HIIT, Running, Weightlifting"
                      className="w-full px-3 py-2 rounded-xl bg-[#11161D] border border-[#1B222D] text-white text-xs focus:outline-none focus:border-[#19B000]"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFC61A] to-[#FFD43B] text-black text-xs font-heading font-black shadow-lg shadow-[#FFC61A]/20"
                  >
                    Record Workout
                  </button>
                </div>
              </form>
            )}

            {/* Sub-tab: WEIGHT */}
            {healthTab === 'weight' && (
              <form onSubmit={handleLogWeight} className="space-y-4">
                <div>
                  <label className="block text-xs font-heading font-bold text-[#8B949E] mb-1">Body Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="e.g. 72.5"
                    value={weightValue}
                    onChange={(e) => setWeightValue(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#11161D] border border-[#1B222D] text-white text-sm font-heading font-black focus:outline-none focus:border-[#19B000]"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#19B000] to-[#4CAF00] text-black text-xs font-heading font-black shadow-lg shadow-[#19B000]/20"
                  >
                    Save Vitals
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* 7. JOURNAL MODAL                                                     */}
        {/* ==================================================================== */}
        {quickModalType === 'journal' && (
          <div className="p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1B222D]">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-[#FFC61A]/15 text-[#FFC61A] border border-[#FFC61A]/30">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-heading font-black text-white">Daily Journal</h3>
                  <p className="text-xs text-[#8B949E]">Reflect on wins, clarity, and daily mindfulness</p>
                </div>
              </div>
              <button 
                onClick={closeQuickModal}
                className="p-1.5 rounded-lg text-[#8B949E] hover:text-white hover:bg-[#11161D] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJournal} className="space-y-4">
              {/* Mood selector */}
              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#8B949E] mb-1.5">
                  How are you feeling today?
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {moods.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setJournalMood(m.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition flex items-center space-x-1.5 border ${
                        journalMood === m.id
                          ? 'bg-[#FFC61A] border-[#FFD43B] text-black shadow-md'
                          : 'bg-[#11161D] border-[#1B222D] text-[#8B949E] hover:border-[#FFC61A]/40'
                      }`}
                    >
                      <span>{m.emoji}</span>
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#8B949E] mb-1.5">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Breakthrough session, Calm evening thoughts"
                  value={journalTitle}
                  onChange={(e) => setJournalTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#11161D] border border-[#1B222D] text-white placeholder-[#8B949E] text-xs focus:outline-none focus:border-[#FFC61A]"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#8B949E] mb-1.5">
                  Reflection *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="What was your main insight today? What went right? What did you learn?"
                  value={journalContent}
                  onChange={(e) => setJournalContent(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#11161D] border border-[#1B222D] text-white placeholder-[#8B949E] text-xs focus:outline-none focus:border-[#FFC61A]"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#8B949E] mb-1.5">
                  Gratitude Prompt
                </label>
                <input
                  type="text"
                  placeholder="Today I am genuinely grateful for..."
                  value={journalGratitude}
                  onChange={(e) => setJournalGratitude(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#11161D] border border-[#1B222D] text-white placeholder-[#8B949E] text-xs focus:outline-none focus:border-[#FFC61A]"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={closeQuickModal}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8B949E] hover:text-white hover:bg-[#11161D] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-heading font-black text-black bg-gradient-to-r from-[#FFC61A] to-[#FFD43B] hover:brightness-110 shadow-lg shadow-[#FFC61A]/20 transition flex items-center space-x-1.5"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Save Journal</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 8. MIND NOTE MODAL                                                   */}
        {/* ==================================================================== */}
        {quickModalType === 'mind' && (
          <div className="p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1B222D]">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-[#4CAF00]/15 text-[#4CAF00] border border-[#4CAF00]/30">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-heading font-black text-white">Capture Idea or Note</h3>
                  <p className="text-xs text-[#8B949E]">Save a concept, SaaS architecture, or creative insight</p>
                </div>
              </div>
              <button 
                onClick={closeQuickModal}
                className="p-1.5 rounded-lg text-[#8B949E] hover:text-white hover:bg-[#11161D] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMindNote} className="space-y-4">
              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#8B949E] mb-1.5">
                  Idea Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. AI-driven financial copilot, Viral loop mechanism"
                  value={mindTitle}
                  onChange={(e) => setMindTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#11161D] border border-[#1B222D] text-white placeholder-[#8B949E] text-sm focus:outline-none focus:border-[#4CAF00] focus:ring-1 focus:ring-[#4CAF00]"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#8B949E] mb-1.5">
                    Category
                  </label>
                  <select
                    value={mindCategory}
                    onChange={(e) => setMindCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#11161D] border border-[#1B222D] text-white text-xs focus:outline-none focus:border-[#4CAF00]"
                  >
                    {mindCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#8B949E] mb-1.5">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={mindTags}
                    onChange={(e) => setMindTags(e.target.value)}
                    placeholder="ai, startup, growth"
                    className="w-full px-3 py-2 rounded-xl bg-[#11161D] border border-[#1B222D] text-white text-xs focus:outline-none focus:border-[#4CAF00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#8B949E] mb-1.5">
                  Idea Details / Description *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Expand on the value proposition, implementation notes, or immediate next steps..."
                  value={mindContent}
                  onChange={(e) => setMindContent(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#11161D] border border-[#1B222D] text-white placeholder-[#8B949E] text-xs focus:outline-none focus:border-[#4CAF00]"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={closeQuickModal}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8B949E] hover:text-white hover:bg-[#11161D] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-heading font-black text-black bg-gradient-to-r from-[#19B000] to-[#4CAF00] hover:brightness-110 shadow-lg shadow-[#19B000]/20 transition flex items-center space-x-1.5"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>Capture Note</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 9. FOCUS SESSION TIMER MODAL                                         */}
        {/* ==================================================================== */}
        {quickModalType === 'focus' && (
          <div className="p-5 sm:p-6 space-y-6 text-center">
            <div className="flex items-center justify-between pb-3 border-b border-[#1B222D]">
              <div className="flex items-center space-x-3 text-left">
                <div className="p-2 rounded-xl bg-[#19B000]/15 text-[#4CAF00] border border-[#19B000]/30">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-heading font-black text-white">Focus Session</h3>
                  <p className="text-xs text-[#8B949E]">Eliminate distractions and enter flow state</p>
                </div>
              </div>
              <button 
                onClick={closeQuickModal}
                className="p-1.5 rounded-lg text-[#8B949E] hover:text-white hover:bg-[#11161D] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Duration presets */}
            <div className="flex items-center justify-center space-x-2">
              {[15, 25, 50].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => selectFocusDuration(m)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold transition border ${
                    focusTotalMinutes === m
                      ? 'bg-[#19B000] border-[#19B000] text-black shadow-lg shadow-[#19B000]/20'
                      : 'bg-[#11161D] border-[#1B222D] text-[#8B949E] hover:border-[#19B000]/40'
                  }`}
                >
                  {m} Min {m === 25 ? 'Pomodoro' : m === 50 ? 'Deep Sprint' : 'Quick'}
                </button>
              ))}
            </div>

            {/* Circular Timer Display */}
            <div className="relative py-4 flex items-center justify-center">
              <div className="w-44 h-44 rounded-full border-4 border-[#1B222D] flex flex-col items-center justify-center relative shadow-inner">
                {isFocusActive && (
                  <div className="absolute inset-0 rounded-full border-2 border-[#19B000] animate-ping opacity-25 pointer-events-none" />
                )}
                <span className="text-4xl sm:text-5xl font-heading font-black tracking-tight text-white font-mono">
                  {formatTimerDisplay(focusSecondsRemaining)}
                </span>
                <span className="text-[11px] font-heading font-bold text-[#4CAF00] mt-1 uppercase tracking-wider">
                  {isFocusActive ? 'In Flow State' : 'Ready To Focus'}
                </span>
              </div>
            </div>

            {/* Task input */}
            <div className="max-w-xs mx-auto">
              <input
                type="text"
                value={focusTaskTitle}
                onChange={(e) => setFocusTaskTitle(e.target.value)}
                placeholder="What are you focusing on?"
                className="w-full text-center px-3 py-1.5 rounded-xl bg-[#11161D] border border-[#1B222D] text-white text-xs focus:outline-none focus:border-[#19B000]"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsFocusActive(false);
                  setFocusSecondsRemaining(focusTotalMinutes * 60);
                }}
                className="p-3 rounded-2xl bg-[#11161D] hover:bg-[#1B222D] text-[#8B949E] border border-[#1B222D] transition"
                title="Reset Timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setIsFocusActive(!isFocusActive)}
                className={`px-8 py-3 rounded-2xl text-sm font-heading font-black text-black shadow-xl transition flex items-center space-x-2 ${
                  isFocusActive 
                    ? 'bg-[#FFC61A] hover:bg-[#FFD43B] shadow-[#FFC61A]/20' 
                    : 'bg-gradient-to-r from-[#19B000] to-[#4CAF00] hover:brightness-110 shadow-[#19B000]/30'
                }`}
              >
                {isFocusActive ? (
                  <>
                    <Pause className="w-5 h-5 fill-black" />
                    <span>Pause Session</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-black" />
                    <span>Start Session</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 10. OPTIONAL VOICE CAPTURE MODAL                                     */}
        {/* ==================================================================== */}
        {quickModalType === 'voice' && (
          <div className="p-5 sm:p-6 space-y-6 text-center">
            <div className="flex items-center justify-between pb-3 border-b border-[#1B222D]">
              <div className="flex items-center space-x-3 text-left">
                <div className="p-2 rounded-xl bg-[#19B000]/15 text-[#4CAF00] border border-[#19B000]/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-heading font-black text-white">LOTAI Voice Capture</h3>
                  <p className="text-xs text-[#8B949E]">Speak naturally — Gemini processes intent into your OS</p>
                </div>
              </div>
              <button 
                onClick={closeQuickModal}
                className="p-1.5 rounded-lg text-[#8B949E] hover:text-white hover:bg-[#11161D] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Visual Listening Orb */}
            <div className="py-4 flex flex-col items-center justify-center">
              <button
                type="button"
                onClick={isVoiceListening ? stopVoiceRecording : startVoiceRecording}
                className={`relative w-24 h-24 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-2xl ${
                  isVoiceListening 
                    ? 'bg-gradient-to-tr from-[#19B000] via-[#4CAF00] to-[#FFC61A] shadow-[#19B000]/50 ring-4 ring-[#19B000]/30 animate-pulse text-black'
                    : 'bg-[#11161D] border border-[#1B222D] hover:border-[#19B000] text-[#8B949E]'
                }`}
              >
                {isVoiceListening ? (
                  <Mic className="w-10 h-10 text-black animate-bounce" />
                ) : (
                  <MicOff className="w-10 h-10 text-[#8B949E]" />
                )}
              </button>

              <p className="text-xs font-heading font-bold text-white mt-3">
                {isVoiceListening ? 'Listening... Speak your command' : 'Tap microphone to speak'}
              </p>
              <p className="text-[10px] text-[#8B949E]">
                e.g. "Spent ₹450 on lunch", "Add task call accountant tomorrow", "Drank 500ml water"
              </p>
            </div>

            {/* Live Transcript Box */}
            <div className="text-left space-y-1.5">
              <label className="block text-xs font-heading font-bold text-[#8B949E] uppercase tracking-wider">
                Transcript & Intent
              </label>
              <textarea
                rows={3}
                value={voiceTranscript}
                onChange={(e) => setVoiceTranscript(e.target.value)}
                placeholder="Voice transcription appears here in real-time..."
                className="w-full p-3 rounded-2xl bg-[#11161D] border border-[#1B222D] text-white placeholder-[#8B949E] text-xs focus:outline-none focus:border-[#19B000]"
              />
              {voiceError && (
                <p className="text-xs text-[#FFC61A] font-medium">{voiceError}</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={closeQuickModal}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8B949E] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={voiceStatus === 'analyzing' || !voiceTranscript.trim()}
                onClick={handleProcessVoice}
                className="px-6 py-2.5 rounded-xl text-xs font-heading font-black text-black bg-gradient-to-r from-[#19B000] via-[#4CAF00] to-[#FFC61A] hover:brightness-110 shadow-lg shadow-[#19B000]/30 transition flex items-center space-x-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{voiceStatus === 'analyzing' ? 'Processing with Gemini...' : 'Execute Action'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
