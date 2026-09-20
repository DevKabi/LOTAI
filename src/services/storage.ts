import { Goal, Task, Habit, FinanceRecord, HealthLog, JournalEntry, UserSettings } from '../types';
import { 
  INITIAL_SETTINGS, 
  INITIAL_GOALS, 
  INITIAL_TASKS, 
  INITIAL_HABITS, 
  INITIAL_FINANCES, 
  INITIAL_HEALTH, 
  INITIAL_JOURNAL 
} from './seedData';

const STORAGE_KEYS = {
  SETTINGS: 'lotai_settings_v1',
  GOALS: 'lotai_goals_v1',
  TASKS: 'lotai_tasks_v1',
  HABITS: 'lotai_habits_v1',
  FINANCES: 'lotai_finances_v1',
  HEALTH: 'lotai_health_v1',
  JOURNAL: 'lotai_journal_v1',
};

export const StorageService = {
  loadSettings(): UserSettings {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) {
      this.saveSettings(INITIAL_SETTINGS);
      return INITIAL_SETTINGS;
    }
    try {
      const parsed = JSON.parse(data);
      if (parsed.geminiModel === 'gemini-2.5-flash') {
        parsed.geminiModel = 'gemini-2.0-flash';
      }
      return { ...INITIAL_SETTINGS, ...parsed };
    } catch {
      return INITIAL_SETTINGS;
    }
  },

  saveSettings(settings: UserSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  loadGoals(): Goal[] {
    const data = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (!data) {
      this.saveGoals(INITIAL_GOALS);
      return INITIAL_GOALS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_GOALS;
    }
  },

  saveGoals(goals: Goal[]): void {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  },

  loadTasks(): Task[] {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!data) {
      this.saveTasks(INITIAL_TASKS);
      return INITIAL_TASKS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_TASKS;
    }
  },

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  loadHabits(): Habit[] {
    const data = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (!data) {
      this.saveHabits(INITIAL_HABITS);
      return INITIAL_HABITS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_HABITS;
    }
  },

  saveHabits(habits: Habit[]): void {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  },

  loadFinances(): FinanceRecord[] {
    const data = localStorage.getItem(STORAGE_KEYS.FINANCES);
    if (!data) {
      this.saveFinances(INITIAL_FINANCES);
      return INITIAL_FINANCES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_FINANCES;
    }
  },

  saveFinances(finances: FinanceRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.FINANCES, JSON.stringify(finances));
  },

  loadHealth(): HealthLog[] {
    const data = localStorage.getItem(STORAGE_KEYS.HEALTH);
    if (!data) {
      this.saveHealth(INITIAL_HEALTH);
      return INITIAL_HEALTH;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_HEALTH;
    }
  },

  saveHealth(health: HealthLog[]): void {
    localStorage.setItem(STORAGE_KEYS.HEALTH, JSON.stringify(health));
  },

  loadJournal(): JournalEntry[] {
    const data = localStorage.getItem(STORAGE_KEYS.JOURNAL);
    if (!data) {
      this.saveJournal(INITIAL_JOURNAL);
      return INITIAL_JOURNAL;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_JOURNAL;
    }
  },

  saveJournal(journal: JournalEntry[]): void {
    localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(journal));
  },

  exportAllData(): string {
    const fullBackup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings: this.loadSettings(),
      goals: this.loadGoals(),
      tasks: this.loadTasks(),
      habits: this.loadHabits(),
      finances: this.loadFinances(),
      health: this.loadHealth(),
      journal: this.loadJournal()
    };
    return JSON.stringify(fullBackup, null, 2);
  },

  importAllData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.settings) this.saveSettings(data.settings);
      if (Array.isArray(data.goals)) this.saveGoals(data.goals);
      if (Array.isArray(data.tasks)) this.saveTasks(data.tasks);
      if (Array.isArray(data.habits)) this.saveHabits(data.habits);
      if (Array.isArray(data.finances)) this.saveFinances(data.finances);
      if (Array.isArray(data.health)) this.saveHealth(data.health);
      if (Array.isArray(data.journal)) this.saveJournal(data.journal);
      return true;
    } catch (err) {
      console.error('Failed to import LOTAI backup:', err);
      return false;
    }
  },

  resetAllData(): void {
    this.saveSettings(INITIAL_SETTINGS);
    this.saveGoals(INITIAL_GOALS);
    this.saveTasks(INITIAL_TASKS);
    this.saveHabits(INITIAL_HABITS);
    this.saveFinances(INITIAL_FINANCES);
    this.saveHealth(INITIAL_HEALTH);
    this.saveJournal(INITIAL_JOURNAL);
  }
};
