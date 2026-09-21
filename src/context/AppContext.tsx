import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode, useCallback } from 'react';
import { 
  LifeModule, 
  Goal, 
  Task, 
  Habit, 
  FinanceRecord, 
  HealthLog, 
  JournalEntry, 
  UserSettings, 
  LifeScoreBreakdown,
  ParsedIntentResult,
  OmniCaptureResult,
  FinanceCategory,
  GoalCategory,
  AnalyticsMetrics,
  QuickModalType
} from '../types';
import { StorageService } from '../services/storage';
import { dbService } from '../services/dbService';
import { AnalyticsEngine } from '../services/analyticsEngine';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  description?: string;
}

interface AppContextType {
  currentModule: LifeModule;
  setCurrentModule: (mod: LifeModule) => void;
  
  // Entities
  goals: Goal[];
  tasks: Task[];
  habits: Habit[];
  finances: FinanceRecord[];
  health: HealthLog[];
  journal: JournalEntry[];
  settings: UserSettings;
  
  // Loading & Sync State
  isDataLoading: boolean;
  refreshData: () => Promise<void>;

  // Life Score & Analytics Engine
  lifeScore: LifeScoreBreakdown;
  analyticsMetrics: AnalyticsMetrics;

  // Actions - Goals
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  toggleMilestone: (goalId: string, milestoneId: string) => Promise<void>;

  // Actions - Tasks
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;

  // Actions - Habits
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'currentStreak' | 'bestStreak' | 'history'>) => Promise<void>;
  toggleHabitToday: (habitId: string) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;

  // Actions - Finance
  addFinance: (rec: Omit<FinanceRecord, 'id' | 'createdAt'>) => Promise<void>;
  deleteFinance: (id: string) => Promise<void>;

  // Actions - Health
  logWater: (amountMl: number) => Promise<void>;
  logSleep: (hours: number, quality: 'poor' | 'fair' | 'good' | 'optimal') => Promise<void>;
  logWorkout: (minutes: number, workoutType?: string, caloriesBurned?: number) => Promise<void>;
  logWeight: (weightKg: number) => Promise<void>;

  // Actions - Journal
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => Promise<void>;
  deleteJournalEntry: (id: string) => Promise<void>;

  // Actions - Settings & Data
  updateSettings: (settings: Partial<UserSettings>) => void;
  exportData: () => void;
  importData: (jsonStr: string) => boolean;
  resetToSampleData: () => void;

  // AI & Modals
  executeAIIntent: (intentResult: ParsedIntentResult) => string;
  executeOmniSave: (capture: OmniCaptureResult) => Promise<string>;
  isOmniModalOpen: boolean;
  setIsOmniModalOpen: (open: boolean) => void;
  isCoachDrawerOpen: boolean;
  setIsCoachDrawerOpen: (open: boolean) => void;
  quickModalType: QuickModalType;
  openQuickModal: (type: QuickModalType) => void;
  closeQuickModal: () => void;

  // Toasts
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  showToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getTodayKey = () => new Date().toISOString().split('T')[0];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isDemoUser, isConfigured } = useAuth();

  const [currentModule, setCurrentModule] = useState<LifeModule>('dashboard');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [finances, setFinances] = useState<FinanceRecord[]>([]);
  const [health, setHealth] = useState<HealthLog[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [settings, setSettings] = useState<UserSettings>(() => StorageService.loadSettings());
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  const [isOmniModalOpen, setIsOmniModalOpen] = useState(false);
  const [isCoachDrawerOpen, setIsCoachDrawerOpen] = useState(false);
  const [quickModalType, setQuickModalType] = useState<QuickModalType>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const openQuickModal = useCallback((type: QuickModalType) => {
    setQuickModalType(type);
  }, []);

  const closeQuickModal = useCallback(() => {
    setQuickModalType(null);
  }, []);

  // Toast Helper
  const showToast = useCallback((title: string, description?: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899']
      });
    } catch {
      // ignore
    }
  };

  // Fetch all modules data from Supabase (or LocalStorage fallback)
  const refreshData = useCallback(async () => {
    if (isDemoUser) {
      // Load sample/local data for demo user
      setGoals(StorageService.loadGoals());
      setTasks(StorageService.loadTasks());
      setHabits(StorageService.loadHabits());
      setFinances(StorageService.loadFinances());
      setHealth(StorageService.loadHealth());
      setJournal(StorageService.loadJournal());
      setIsDataLoading(false);
      return;
    }

    if (!user || !isConfigured) {
      setIsDataLoading(false);
      return;
    }

    setIsDataLoading(true);
    try {
      const [goalsRes, tasksRes, habitsRes, financesRes, healthRes, journalRes] = await Promise.allSettled([
        dbService.fetchGoals(user.id),
        dbService.fetchTasks(user.id),
        dbService.fetchHabits(user.id),
        dbService.fetchFinances(user.id),
        dbService.fetchHealth(user.id),
        dbService.fetchJournal(user.id)
      ]);

      if (goalsRes.status === 'fulfilled') setGoals(goalsRes.value);
      if (tasksRes.status === 'fulfilled') setTasks(tasksRes.value);
      if (habitsRes.status === 'fulfilled') setHabits(habitsRes.value);
      if (financesRes.status === 'fulfilled') setFinances(financesRes.value);
      if (healthRes.status === 'fulfilled') setHealth(healthRes.value);
      if (journalRes.status === 'fulfilled') setJournal(journalRes.value);
    } catch (err) {
      console.error('Failed to load data from Cloud:', err);
      showToast('Data sync error', 'Could not load records from Cloud.', 'warning');
    } finally {
      setIsDataLoading(false);
    }
  }, [user, isDemoUser, isConfigured, showToast]);

  // Load data when user changes
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Handle Dark / Light Mode HTML class
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Master Analytics Engine & Life Score (6 Pillars: Goals, Tasks, Habits, Health, Finance, Mind)
  const analyticsMetrics = useMemo<AnalyticsMetrics>(() => {
    return AnalyticsEngine.calculateMetrics(
      goals,
      tasks,
      habits,
      finances,
      health,
      journal,
      settings
    );
  }, [goals, tasks, habits, finances, health, journal, settings]);

  const lifeScore = analyticsMetrics.breakdown;

  // ============================================================================
  // GOAL ACTIONS
  // ============================================================================
  const addGoal = async (newGoal: Omit<Goal, 'id' | 'createdAt'>) => {
    const tempId = 'temp-' + Date.now();
    const optimistic: Goal = { ...newGoal, id: tempId, createdAt: getTodayKey() };
    setGoals(prev => [optimistic, ...prev]);

    if (user && isConfigured && !isDemoUser) {
      try {
        const created = await dbService.createGoal(newGoal, user.id);
        setGoals(prev => prev.map(g => g.id === tempId ? created : g));
        showToast('Goal created!', `"${created.title}" added to roadmap.`);
      } catch (err: any) {
        setGoals(prev => prev.filter(g => g.id !== tempId));
        showToast('Failed to save goal', err.message, 'warning');
      }
    } else {
      StorageService.saveGoals([optimistic, ...goals]);
      showToast('Goal created!', `"${optimistic.title}" added.`);
    }
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
    if (user && isConfigured && !isDemoUser) {
      try {
        await dbService.updateGoal(id, updates);
      } catch (err: any) {
        showToast('Update failed', err.message, 'warning');
      }
    }
  };

  const deleteGoal = async (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    showToast('Goal deleted', undefined, 'info');
    if (user && isConfigured && !isDemoUser) {
      try {
        await dbService.deleteGoal(id);
      } catch (err: any) {
        showToast('Delete failed', err.message, 'warning');
      }
    }
  };

  const toggleMilestone = async (goalId: string, milestoneId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const updatedMilestones = goal.milestones.map(m => 
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    const completedCount = updatedMilestones.filter(m => m.completed).length;
    const progress = updatedMilestones.length > 0 
      ? Math.round((completedCount / updatedMilestones.length) * 100) 
      : goal.currentProgress;

    if (progress === 100 && goal.currentProgress !== 100) {
      triggerConfetti();
      showToast('Goal Completed! 🎉', `Congratulations on completing "${goal.title}"!`);
    }

    await updateGoal(goalId, { milestones: updatedMilestones, currentProgress: progress });
  };

  // ============================================================================
  // TASK ACTIONS
  // ============================================================================
  const addTask = async (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const tempId = 'temp-' + Date.now();
    const optimistic: Task = { ...newTask, id: tempId, createdAt: getTodayKey() };
    setTasks(prev => [optimistic, ...prev]);

    if (user && isConfigured && !isDemoUser) {
      try {
        const created = await dbService.createTask(newTask, user.id);
        setTasks(prev => prev.map(t => t.id === tempId ? created : t));
        showToast('Task added', created.title);
      } catch (err: any) {
        setTasks(prev => prev.filter(t => t.id !== tempId));
        showToast('Failed to add task', err.message, 'warning');
      }
    } else {
      StorageService.saveTasks([optimistic, ...tasks]);
      showToast('Task added', optimistic.title);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    if (user && isConfigured && !isDemoUser) {
      try {
        await dbService.updateTask(id, updates);
      } catch (err: any) {
        showToast('Update failed', err.message, 'warning');
      }
    }
  };

  const deleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast('Task removed', undefined, 'info');
    if (user && isConfigured && !isDemoUser) {
      try {
        await dbService.deleteTask(id);
      } catch (err: any) {
        showToast('Delete failed', err.message, 'warning');
      }
    }
  };

  const toggleTaskStatus = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const nextStatus: Task['status'] = task.status === 'done' ? 'todo' : 'done';
    if (nextStatus === 'done') {
      triggerConfetti();
      showToast('Task completed! ⚡', task.title);
    }
    await updateTask(id, { status: nextStatus });
  };

  // ============================================================================
  // HABIT ACTIONS
  // ============================================================================
  const addHabit = async (newHabit: Omit<Habit, 'id' | 'createdAt' | 'currentStreak' | 'bestStreak' | 'history'>) => {
    const tempId = 'temp-' + Date.now();
    const optimistic: Habit = {
      ...newHabit,
      id: tempId,
      currentStreak: 0,
      bestStreak: 0,
      history: {},
      createdAt: getTodayKey()
    };
    setHabits(prev => [...prev, optimistic]);

    if (user && isConfigured && !isDemoUser) {
      try {
        const created = await dbService.createHabit(newHabit, user.id);
        setHabits(prev => prev.map(h => h.id === tempId ? created : h));
        showToast('Habit tracked', `Started "${created.title}".`);
      } catch (err: any) {
        setHabits(prev => prev.filter(h => h.id !== tempId));
        showToast('Failed to track habit', err.message, 'warning');
      }
    } else {
      StorageService.saveHabits([...habits, optimistic]);
      showToast('Habit tracked', `Started "${optimistic.title}".`);
    }
  };

  const toggleHabitToday = async (habitId: string) => {
    const today = getTodayKey();
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const isDone = !habit.history[today];
    const newHistory = { ...habit.history, [today]: isDone };
    let streak = habit.currentStreak;
    if (isDone) {
      streak += 1;
      triggerConfetti();
      showToast('Habit completed! 🔥', `${habit.title} (Streak: ${streak} days)`);
    } else {
      streak = Math.max(0, streak - 1);
    }
    const best = Math.max(habit.bestStreak, streak);

    setHabits(prev => prev.map(h => h.id === habitId ? { ...h, history: newHistory, currentStreak: streak, bestStreak: best } : h));

    if (user && isConfigured && !isDemoUser) {
      try {
        await dbService.toggleHabitDay(habitId, today, isDone, user.id);
      } catch (err: any) {
        showToast('Habit sync failed', err.message, 'warning');
      }
    }
  };

  const deleteHabit = async (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    showToast('Habit deleted', undefined, 'info');
    if (user && isConfigured && !isDemoUser) {
      try {
        await dbService.deleteHabit(id);
      } catch (err: any) {
        showToast('Delete failed', err.message, 'warning');
      }
    }
  };

  // ============================================================================
  // FINANCE ACTIONS
  // ============================================================================
  const addFinance = async (rec: Omit<FinanceRecord, 'id' | 'createdAt'>) => {
    const tempId = 'temp-' + Date.now();
    const optimistic: FinanceRecord = { ...rec, id: tempId, createdAt: getTodayKey() };
    setFinances(prev => [optimistic, ...prev]);

    if (user && isConfigured && !isDemoUser) {
      try {
        const created = await dbService.createFinance(rec, user.id);
        setFinances(prev => prev.map(f => f.id === tempId ? created : f));
        showToast(
          created.type === 'expense' ? 'Expense logged' : 'Income added',
          `${settings.currency}${created.amount.toFixed(2)} — ${created.description}`
        );
      } catch (err: any) {
        setFinances(prev => prev.filter(f => f.id !== tempId));
        showToast('Failed to record transaction', err.message, 'warning');
      }
    } else {
      StorageService.saveFinances([optimistic, ...finances]);
      showToast(
        optimistic.type === 'expense' ? 'Expense logged' : 'Income added',
        `${settings.currency}${optimistic.amount.toFixed(2)} — ${optimistic.description}`
      );
    }
  };

  const deleteFinance = async (id: string) => {
    setFinances(prev => prev.filter(f => f.id !== id));
    showToast('Transaction removed', undefined, 'info');
    if (user && isConfigured && !isDemoUser) {
      try {
        await dbService.deleteFinance(id);
      } catch (err: any) {
        showToast('Delete failed', err.message, 'warning');
      }
    }
  };

  // ============================================================================
  // HEALTH ACTIONS
  // ============================================================================
  const logWater = async (amountMl: number) => {
    const today = getTodayKey();
    const existing = health.find(h => h.date === today);
    const newTotal = (existing?.waterIntakeMl || 0) + amountMl;

    const optimistic: HealthLog = existing ? {
      ...existing,
      waterIntakeMl: newTotal
    } : {
      id: 'health-' + Date.now(),
      date: today,
      waterIntakeMl: amountMl,
      sleepHours: 7.5,
      sleepQuality: 'good',
      workoutMinutes: 0,
      energyLevel: 4
    };

    setHealth(prev => existing ? prev.map(h => h.date === today ? optimistic : h) : [optimistic, ...prev]);
    showToast('Water logged 💧', `+${amountMl}ml (Total today: ${newTotal}ml)`);

    if (user && isConfigured && !isDemoUser) {
      try {
        const saved = await dbService.upsertHealthLog(optimistic, user.id);
        setHealth(prev => prev.map(h => h.date === today ? saved : h));
      } catch (err: any) {
        showToast('Health sync failed', err.message, 'warning');
      }
    }
  };

  const logSleep = async (hours: number, quality: 'poor' | 'fair' | 'good' | 'optimal') => {
    const today = getTodayKey();
    const existing = health.find(h => h.date === today);

    const optimistic: HealthLog = existing ? {
      ...existing,
      sleepHours: hours,
      sleepQuality: quality
    } : {
      id: 'health-' + Date.now(),
      date: today,
      waterIntakeMl: 0,
      sleepHours: hours,
      sleepQuality: quality,
      workoutMinutes: 0,
      energyLevel: 4
    };

    setHealth(prev => existing ? prev.map(h => h.date === today ? optimistic : h) : [optimistic, ...prev]);
    showToast('Sleep logged 🌙', `${hours} hours recorded (${quality} quality)`);

    if (user && isConfigured && !isDemoUser) {
      try {
        const saved = await dbService.upsertHealthLog(optimistic, user.id);
        setHealth(prev => prev.map(h => h.date === today ? saved : h));
      } catch (err: any) {
        showToast('Sleep sync failed', err.message, 'warning');
      }
    }
  };

  const logWorkout = async (minutes: number, workoutType: string = 'Workout', caloriesBurned: number = 0) => {
    const today = getTodayKey();
    const existing = health.find(h => h.date === today);

    const optimistic: HealthLog = existing ? {
      ...existing,
      workoutMinutes: (existing.workoutMinutes || 0) + minutes,
      workoutType,
      caloriesBurned: (existing.caloriesBurned || 0) + caloriesBurned
    } : {
      id: 'health-' + Date.now(),
      date: today,
      waterIntakeMl: 0,
      sleepHours: 7.5,
      sleepQuality: 'good',
      workoutMinutes: minutes,
      workoutType,
      caloriesBurned,
      energyLevel: 4
    };

    setHealth(prev => existing ? prev.map(h => h.date === today ? optimistic : h) : [optimistic, ...prev]);
    triggerConfetti();
    showToast('Workout recorded! 🏃', `${minutes}m ${workoutType} logged.`);

    if (user && isConfigured && !isDemoUser) {
      try {
        const saved = await dbService.upsertHealthLog(optimistic, user.id);
        setHealth(prev => prev.map(h => h.date === today ? saved : h));
      } catch (err: any) {
        showToast('Workout sync failed', err.message, 'warning');
      }
    }
  };

  const logWeight = async (weightKg: number) => {
    const today = getTodayKey();
    const existing = health.find(h => h.date === today);

    const optimistic: HealthLog = existing ? {
      ...existing,
      weightKg,
      notes: `Weight: ${weightKg}kg`
    } : {
      id: 'health-' + Date.now(),
      date: today,
      waterIntakeMl: 0,
      sleepHours: 7.5,
      sleepQuality: 'good',
      workoutMinutes: 0,
      energyLevel: 4,
      weightKg,
      notes: `Weight: ${weightKg}kg`
    };

    setHealth(prev => existing ? prev.map(h => h.date === today ? optimistic : h) : [optimistic, ...prev]);
    showToast('Weight recorded ⚖️', `${weightKg} kg logged for today.`);

    if (user && isConfigured && !isDemoUser) {
      try {
        const saved = await dbService.upsertHealthLog(optimistic, user.id);
        setHealth(prev => prev.map(h => h.date === today ? saved : h));
      } catch (err: any) {
        showToast('Weight sync failed', err.message, 'warning');
      }
    }
  };

  // ============================================================================
  // JOURNAL ACTIONS
  // ============================================================================
  const addJournalEntry = async (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => {
    const tempId = 'temp-' + Date.now();
    const optimistic: JournalEntry = { ...entry, id: tempId, createdAt: getTodayKey() };
    setJournal(prev => [optimistic, ...prev]);

    if (user && isConfigured && !isDemoUser) {
      try {
        const created = await dbService.createJournal(entry, user.id);
        setJournal(prev => prev.map(j => j.id === tempId ? created : j));
        showToast('Journal saved ✍️', `Mood: ${created.mood}`);
      } catch (err: any) {
        setJournal(prev => prev.filter(j => j.id !== tempId));
        showToast('Failed to save reflection', err.message, 'warning');
      }
    } else {
      StorageService.saveJournal([optimistic, ...journal]);
      showToast('Journal saved ✍️', `Mood: ${optimistic.mood}`);
    }
  };

  const deleteJournalEntry = async (id: string) => {
    setJournal(prev => prev.filter(j => j.id !== id));
    showToast('Journal entry removed', undefined, 'info');
    if (user && isConfigured && !isDemoUser) {
      try {
        await dbService.deleteJournal(id);
      } catch (err: any) {
        showToast('Delete failed', err.message, 'warning');
      }
    }
  };

  // ============================================================================
  // SETTINGS & DATA
  // ============================================================================
  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...updates };
      StorageService.saveSettings(next);
      return next;
    });
    showToast('Settings updated', 'Preferences saved.');
  };

  const exportData = () => {
    const fullBackup = {
      version: '2.0',
      source: 'LOTAI Cloud & Client',
      exportedAt: new Date().toISOString(),
      settings,
      goals,
      tasks,
      habits,
      finances,
      health,
      journal
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LOTAI_Backup_${getTodayKey()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Export successful', 'LOTAI backup downloaded.');
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (Array.isArray(data.goals)) setGoals(data.goals);
      if (Array.isArray(data.tasks)) setTasks(data.tasks);
      if (Array.isArray(data.habits)) setHabits(data.habits);
      if (Array.isArray(data.finances)) setFinances(data.finances);
      if (Array.isArray(data.health)) setHealth(data.health);
      if (Array.isArray(data.journal)) setJournal(data.journal);
      showToast('Data restored! 🚀', 'Loaded into current session.');
      return true;
    } catch {
      showToast('Import failed', 'Invalid JSON backup format.', 'warning');
      return false;
    }
  };

  const resetToSampleData = () => {
    StorageService.resetAllData();
    setGoals(StorageService.loadGoals());
    setTasks(StorageService.loadTasks());
    setHabits(StorageService.loadHabits());
    setFinances(StorageService.loadFinances());
    setHealth(StorageService.loadHealth());
    setJournal(StorageService.loadJournal());
    setSettings(StorageService.loadSettings());
    showToast('Sample data restored', 'Fresh demo records loaded.');
  };

  // AI Intent Execution
  const executeAIIntent = (intentResult: ParsedIntentResult): string => {
    const { intent, payload } = intentResult;

    switch (intent) {
      case 'ADD_FINANCE_EXPENSE':
      case 'ADD_FINANCE_INCOME':
        addFinance({
          type: payload.type,
          amount: payload.amount,
          category: payload.category,
          description: payload.description,
          date: payload.date || getTodayKey()
        });
        return `Recorded ${payload.type} of ${settings.currency}${payload.amount} in ${payload.category}.`;

      case 'LOG_WATER':
        logWater(payload.amountMl);
        return `Logged ${payload.amountMl}ml of water.`;

      case 'LOG_SLEEP':
        logSleep(payload.hours, payload.quality);
        return `Logged ${payload.hours} hours of sleep.`;

      case 'LOG_WORKOUT':
        logWorkout(payload.minutes, payload.workoutType, payload.estimatedCalories);
        return `Logged ${payload.minutes} min workout.`;

      case 'COMPLETE_HABIT': {
        const query = (payload.habitName || '').toLowerCase();
        const matched = habits.find(h => h.title.toLowerCase().includes(query)) || habits[0];
        if (matched) {
          toggleHabitToday(matched.id);
          return `Marked "${matched.title}" as completed!`;
        }
        return 'Habit not found.';
      }

      case 'ADD_GOAL':
        addGoal({
          title: payload.title,
          category: payload.category,
          targetDate: payload.targetDate,
          currentProgress: 0,
          status: 'in-progress',
          milestones: [
            { id: 'm-' + Date.now(), title: 'First Milestone', completed: false }
          ]
        });
        return `Created goal: "${payload.title}"`;

      case 'ADD_JOURNAL':
        addJournalEntry({
          date: payload.date || getTodayKey(),
          mood: payload.mood,
          content: payload.content,
          gratitude: payload.gratitude,
          tags: ['voice-capture']
        });
        return `Saved journal entry with mood: ${payload.mood}`;

      case 'COACH_QUESTION':
        setIsCoachDrawerOpen(true);
        return `Opening AI Life Coach for: "${payload.question}"`;

      case 'ADD_TASK':
      default:
        addTask({
          title: payload.title,
          priority: payload.priority || 'medium',
          status: 'todo',
          dueDate: payload.dueDate || getTodayKey(),
          category: payload.category || 'Personal'
        });
        return `Added task: "${payload.title}"`;
    }
  };

  // Structured Omni Capture Execution with direct Supabase routing
  const executeOmniSave = async (capture: OmniCaptureResult): Promise<string> => {
    const { module, masterCategory, destinationTable, fields } = capture;
    const today = getTodayKey();

    // Check MIND_NOTES first (destinationTable: mind_notes)
    if (masterCategory === 'MIND_NOTES' || destinationTable === 'mind_notes') {
      const title = fields.title || capture.rawInput;
      const content = fields.content || capture.rawInput;
      const category = fields.mindNoteCategory || 'Thought';
      const tags = fields.tags || ['mind-note', category.toLowerCase().replace(/\s+/g, '-')];
      const date = fields.date || today;

      await dbService.createMindNote({
        title,
        content,
        category,
        tags,
        date
      }, user?.id || 'demo-user');

      showToast('Mind Note Saved', `"${title}" saved to mind notes`, 'success');
      return `Mind Note "${title}" saved to Cloud.`;
    }

    switch (module) {
      case 'finance': {
        const amount = fields.amount || 0;
        const subType = fields.financeSubType || 'expense';
        const type = subType === 'income' ? 'income' : 'expense';
        const category = (fields.category || (type === 'income' ? 'Salary & Earnings' : 'Food & Dining')) as FinanceCategory;
        const description = fields.description || fields.title || `${category} ${subType}`;
        const date = fields.date || today;

        await addFinance({
          type,
          amount,
          category,
          description,
          date
        });

        const subTypeLabel = subType.toUpperCase();
        return `${subTypeLabel} of ${fields.currencySymbol || settings.currency}${amount.toLocaleString()} saved to Cloud.`;
      }

      case 'health': {
        if (fields.weightKg) {
          await logWeight(fields.weightKg);
          return `Weight (${fields.weightKg} kg) saved to Cloud.`;
        }
        if (fields.waterIntakeMl) {
          await logWater(fields.waterIntakeMl);
          return `Hydration (${fields.waterIntakeMl} ml) saved to Cloud.`;
        }
        if (fields.sleepHours) {
          await logSleep(fields.sleepHours, fields.sleepQuality || 'good');
          return `Sleep (${fields.sleepHours}h) saved to Cloud.`;
        }
        if (fields.workoutMinutes) {
          await logWorkout(fields.workoutMinutes, fields.workoutType || 'Workout', fields.caloriesBurned);
          return `Workout (${fields.workoutMinutes}m ${fields.workoutType || 'Workout'}) saved to Cloud.`;
        }
        if (fields.steps) {
          const existing = health.find(h => h.date === today);
          const optimistic: HealthLog = existing ? {
            ...existing,
            notes: `${existing.notes ? existing.notes + ' | ' : ''}Walked ${fields.steps.toLocaleString()} steps`
          } : {
            id: 'health-' + Date.now(),
            date: today,
            waterIntakeMl: 0,
            sleepHours: 7.5,
            sleepQuality: 'good',
            workoutMinutes: 0,
            energyLevel: 4,
            notes: `Walked ${fields.steps.toLocaleString()} steps`
          };
          setHealth(prev => existing ? prev.map(h => h.date === today ? optimistic : h) : [optimistic, ...prev]);
          if (user && isConfigured && !isDemoUser) {
            try {
              await dbService.upsertHealthLog(optimistic, user.id);
            } catch {}
          }
          return `Steps (${fields.steps.toLocaleString()}) saved to Cloud.`;
        }
        if (fields.bloodPressure) {
          const existing = health.find(h => h.date === today);
          const optimistic: HealthLog = existing ? {
            ...existing,
            notes: `${existing.notes ? existing.notes + ' | ' : ''}BP ${fields.bloodPressure} mmHg`
          } : {
            id: 'health-' + Date.now(),
            date: today,
            waterIntakeMl: 0,
            sleepHours: 7.5,
            sleepQuality: 'good',
            workoutMinutes: 0,
            energyLevel: 4,
            notes: `BP ${fields.bloodPressure} mmHg`
          };
          setHealth(prev => existing ? prev.map(h => h.date === today ? optimistic : h) : [optimistic, ...prev]);
          if (user && isConfigured && !isDemoUser) {
            try {
              await dbService.upsertHealthLog(optimistic, user.id);
            } catch {}
          }
          return `Blood Pressure (${fields.bloodPressure}) saved to Cloud.`;
        }
        return 'Health record saved to Cloud.';
      }

      case 'habits': {
        const habitQuery = (fields.habitName || fields.title || '').toLowerCase();
        const matched = habits.find(h => h.title.toLowerCase().includes(habitQuery));
        if (!matched && fields.habitName) {
          await addHabit({
            title: fields.habitName,
            category: (fields.category as GoalCategory) || 'Health',
            frequency: 'daily',
            timeOfDay: 'morning',
            targetCount: 1,
            color: '#6366f1'
          });
          return `Created habit "${fields.habitName}" and saved to Cloud.`;
        } else if (matched) {
          await toggleHabitToday(matched.id);
          return `Marked "${matched.title}" as completed today in Cloud.`;
        }
        return 'Habit checked in.';
      }

      case 'tasks': {
        const title = fields.title || capture.rawInput;
        const priority = fields.priority || 'medium';
        const dueDate = fields.dueDate || today;
        const category = (fields.category as GoalCategory) || 'Personal';

        await addTask({
          title,
          priority,
          status: 'todo',
          dueDate,
          category
        });
        return `Task "${title}" saved to Cloud (Due: ${dueDate}, Priority: ${priority}).`;
      }

      case 'goals': {
        const title = fields.title || capture.rawInput;
        const category = (fields.category as GoalCategory) || 'Finance';
        const targetDate = fields.targetDate || new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0];
        const milestones = (fields.milestones && fields.milestones.length > 0)
          ? fields.milestones.map((m, idx) => ({ id: `m-${Date.now()}-${idx}`, title: m, completed: false }))
          : [{ id: `m-${Date.now()}`, title: 'Initial milestone', completed: false }];

        await addGoal({
          title,
          category,
          targetDate,
          currentProgress: 0,
          status: 'in-progress',
          targetMetric: fields.targetMetric,
          milestones
        });
        return `Goal "${title}" saved to Cloud (Category: ${category}).`;
      }

      case 'journal': {
        const content = fields.content || capture.rawInput;
        const mood = fields.mood || 'productive';
        const tags = fields.tags || ['daily-reflection'];
        const gratitude = fields.gratitude;

        await addJournalEntry({
          date: fields.date || today,
          mood,
          title: fields.title || `Reflection on ${today}`,
          content,
          gratitude,
          tags,
          aiSentiment: mood === 'productive' || mood === 'joyful' ? 'positive' : 'reflective'
        });
        return `Journal reflection saved to Cloud (Mood: ${mood}).`;
      }

      default:
        return 'Captured and processed successfully.';
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentModule,
        setCurrentModule,
        goals,
        tasks,
        habits,
        finances,
        health,
        journal,
        settings,
        isDataLoading,
        refreshData,
        lifeScore,
        analyticsMetrics,
        addGoal,
        updateGoal,
        deleteGoal,
        toggleMilestone,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        addHabit,
        toggleHabitToday,
        deleteHabit,
        addFinance,
        deleteFinance,
        logWater,
        logSleep,
        logWorkout,
        logWeight,
        addJournalEntry,
        deleteJournalEntry,
        updateSettings,
        exportData,
        importData,
        resetToSampleData,
        executeAIIntent,
        executeOmniSave,
        isOmniModalOpen,
        setIsOmniModalOpen,
        isCoachDrawerOpen,
        setIsCoachDrawerOpen,
        quickModalType,
        openQuickModal,
        closeQuickModal,
        toasts,
        dismissToast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
