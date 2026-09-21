export type LifeModule = 
  | 'dashboard'
  | 'goals'
  | 'tasks'
  | 'habits'
  | 'finance'
  | 'health'
  | 'journal'
  | 'analytics'
  | 'settings';

export type QuickModalType = 
  | 'goal'
  | 'task'
  | 'habit'
  | 'expense'
  | 'income'
  | 'health'
  | 'journal'
  | 'mind'
  | 'focus'
  | 'voice'
  | null;

export type GoalCategory = 'Career' | 'Health' | 'Finance' | 'Personal' | 'Learning' | 'Relationships';
export type GoalStatus = 'not-started' | 'in-progress' | 'completed' | 'on-hold';

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: GoalCategory;
  targetDate: string;
  currentProgress: number; // 0 - 100%
  status: GoalStatus;
  milestones: Milestone[];
  targetMetric?: string;
  createdAt: string;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  category: GoalCategory;
  linkedGoalId?: string;
  createdAt: string;
}

export type HabitTimeOfDay = 'anytime' | 'morning' | 'afternoon' | 'evening';
export type HabitFrequency = 'daily' | 'weekdays' | 'weekends';

export interface Habit {
  id: string;
  title: string;
  category: GoalCategory;
  frequency: HabitFrequency;
  timeOfDay: HabitTimeOfDay;
  targetCount: number; // e.g. 1 time per day
  currentStreak: number;
  bestStreak: number;
  history: Record<string, boolean>; // 'YYYY-MM-DD': true
  color?: string;
  createdAt: string;
}

export type TransactionType = 'expense' | 'income';

export type ExpenseCategory = 
  | 'Food & Dining'
  | 'Transportation'
  | 'Health & Medical'
  | 'Housing & Utilities'
  | 'Shopping'
  | 'Education & Learning'
  | 'Business Expenses'
  | 'Financial Obligations'
  | 'Investments & Savings'
  | 'Entertainment'
  | 'Travel'
  | 'Miscellaneous';

export type IncomeCategory = 
  | 'Salary'
  | 'Business Revenue'
  | 'Freelancing'
  | 'Consulting'
  | 'Commission'
  | 'Affiliate Income'
  | 'Investment Income'
  | 'Rental Income'
  | 'Interest Income'
  | 'Refunds'
  | 'Other Income';

export type FinanceCategory = ExpenseCategory | IncomeCategory | string;

export interface FinanceRecord {
  id: string;
  type: TransactionType;
  amount: number;
  category: FinanceCategory;
  subcategory?: string;
  description: string;
  date: string; // YYYY-MM-DD
  paymentMethod?: string;
  aiConfidence?: number;
  isAiCategorized?: boolean;
  createdAt: string;
}

export interface HealthLog {
  id: string;
  date: string; // YYYY-MM-DD
  waterIntakeMl: number; // target: e.g. 2500ml
  sleepHours: number; // e.g. 7.5
  sleepQuality: 'poor' | 'fair' | 'good' | 'optimal';
  workoutMinutes: number;
  workoutType?: string;
  caloriesBurned?: number;
  energyLevel: number; // 1 to 5
  weightKg?: number; // e.g. 54
  notes?: string;
}

export type JournalMood = 'joyful' | 'productive' | 'calm' | 'neutral' | 'anxious' | 'tired' | 'sad';

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  mood: JournalMood;
  title?: string;
  content: string;
  gratitude?: string;
  tags: string[];
  aiSentiment?: 'positive' | 'neutral' | 'reflective' | 'challenging';
  aiReflection?: string;
  createdAt: string;
}

export interface LifeScoreBreakdown {
  overall: number; // 0 - 100
  goalsScore?: number;
  habitsScore: number;
  tasksScore: number;
  financeScore: number;
  healthScore: number;
  mindScore: number;
}

export type MasterCategory = 
  | 'GOALS' 
  | 'TASKS' 
  | 'HABITS' 
  | 'FINANCE' 
  | 'HEALTH_FITNESS' 
  | 'JOURNAL' 
  | 'MIND_NOTES';

export type DestinationTable = 
  | 'goals' 
  | 'tasks' 
  | 'habits' 
  | 'finance_transactions' 
  | 'health_logs' 
  | 'journal_entries' 
  | 'mind_notes';

export type FinanceSubType = 
  | 'expense' 
  | 'income' 
  | 'investment' 
  | 'loan' 
  | 'emi' 
  | 'transfer' 
  | 'savings';

export type HealthMetricType = 
  | 'weight' 
  | 'water' 
  | 'sleep' 
  | 'workout' 
  | 'steps' 
  | 'bp' 
  | 'calories';

export type ConfidenceTier = 'high' | 'medium' | 'low';

export interface MindNote {
  id: string;
  title: string;
  content: string;
  category?: string; // 'Startup Idea' | 'Podcast' | 'SaaS' | 'Thought' | 'Concept'
  tags: string[];
  date: string;
  createdAt: string;
}

export type AIIntentType = 
  | 'ADD_FINANCE_EXPENSE'
  | 'ADD_FINANCE_INCOME'
  | 'ADD_FINANCE_INVESTMENT'
  | 'ADD_FINANCE_LOAN_EMI'
  | 'ADD_TASK'
  | 'COMPLETE_HABIT'
  | 'LOG_WATER'
  | 'LOG_SLEEP'
  | 'LOG_WORKOUT'
  | 'LOG_WEIGHT'
  | 'LOG_BP'
  | 'LOG_STEPS'
  | 'LOG_HEALTH'
  | 'ADD_JOURNAL'
  | 'ADD_GOAL'
  | 'ADD_MIND_NOTE'
  | 'COACH_QUESTION'
  | 'UNKNOWN';

export interface ParsedIntentResult {
  intent: AIIntentType;
  confidence: number;
  summary: string;
  suggestedModule: LifeModule;
  payload: any;
}

export interface OmniCaptureFields {
  // Routing Meta
  masterCategory?: MasterCategory;
  destinationTable?: DestinationTable;

  // Common
  title?: string;
  description?: string;
  date?: string;
  category?: string;

  // Finance
  amount?: number;
  transactionType?: 'expense' | 'income';
  financeSubType?: FinanceSubType;
  subcategory?: string;
  aiConfidence?: number;
  isAiCategorized?: boolean;
  paymentMethod?: string;
  currencySymbol?: string;
  loanEmiDetails?: string;

  // Tasks
  priority?: TaskPriority;
  dueDate?: string;

  // Habits
  habitName?: string;
  isCompleted?: boolean;
  frequency?: string;

  // Health
  healthMetricType?: HealthMetricType;
  weightKg?: number;
  waterIntakeMl?: number;
  sleepHours?: number;
  sleepQuality?: 'poor' | 'fair' | 'good' | 'optimal';
  workoutMinutes?: number;
  workoutType?: string;
  caloriesBurned?: number;
  steps?: number;
  bloodPressure?: string;

  // Goals
  targetDate?: string;
  targetMetric?: string;
  milestones?: string[];

  // Journal
  content?: string;
  mood?: JournalMood;
  gratitude?: string;
  tags?: string[];

  // Mind Notes
  mindNoteCategory?: string;
}

export interface OmniCaptureResult {
  id: string;
  rawInput: string;
  module: LifeModule;
  masterCategory: MasterCategory;
  destinationTable: DestinationTable;
  intent: AIIntentType;
  confidence: number; // 0.0 - 1.0 (e.g. 0.95 = 95%)
  confidenceTier: ConfidenceTier; // 'high' (>=0.9), 'medium' (0.7-0.89), 'low' (<0.7)
  isUncertain: boolean; // true if confidence < 0.75 or ambiguous
  suggestedCategories?: MasterCategory[]; // for low-confidence category pickers
  title: string; // e.g. "Expense Saved", "Task Ready", "Weight Logged"
  summary: string;
  fields: OmniCaptureFields;
  uncertainReason?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; action: () => void }[];
}

export interface UserSettings {
  userName: string;
  currency: string;
  dailyWaterTargetMl: number;
  dailySleepHours: number;
  monthlyBudget: number;
  geminiApiKey?: string;
  geminiModel: string;
  soundEffects: boolean;
  voiceFeedback: boolean;
  theme: 'dark' | 'light';
}

// ============================================================================
// LOTAI ANALYTICS ENGINE TYPES
// ============================================================================

export type AnalyticsTimeRange = '7d' | '30d' | 'all';

export interface GoalAnalyticsMetrics {
  totalGoals: number;
  completedGoals: number;
  inProgressGoals: number;
  notStartedGoals: number;
  overallCompletionRate: number; // 0 - 100%
  averageMilestoneProgress: number; // 0 - 100%
  completedMilestones: number;
  totalMilestones: number;
}

export interface HabitAnalyticsMetrics {
  totalHabits: number;
  consistencyRate7d: number; // 0 - 100%
  consistencyRate30d: number; // 0 - 100%
  todayCompletedCount: number;
  todayCompletionRate: number; // 0 - 100%
  currentStreaksSum: number;
  longestStreak: number;
  topHabitTitle?: string;
}

export interface TaskAnalyticsMetrics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number; // 0 - 100%
  urgentAndHighCompletedRate: number; // 0 - 100%
  overdueCount: number;
  tasksDueToday: number;
}

export interface HealthAnalyticsMetrics {
  healthScore: number; // 0 - 100
  waterComplianceRate: number; // 0 - 100%
  averageWaterIntakeMl: number;
  sleepComplianceRate: number; // 0 - 100%
  averageSleepHours: number;
  workoutsPast7Days: number;
  latestWeightKg?: number;
}

export interface FinancialAnalyticsMetrics {
  financialHealthScore: number; // 0 - 100
  monthlyBudget: number;
  monthExpenses: number;
  monthIncome: number;
  netSavings: number;
  budgetUtilizationRate: number; // %
  savingsRate: number; // %
  topExpenseCategory?: string;
}

export interface MindAnalyticsMetrics {
  mindScore: number; // 0 - 100
  totalReflections: number;
  reflectionsLast7Days: number;
  dominantMood: JournalMood;
  positiveMoodRate: number; // % joyful, productive, calm
}

export interface AnalyticsMetrics {
  lifeScore: number; // 0 - 100
  breakdown: LifeScoreBreakdown;
  goals: GoalAnalyticsMetrics;
  habits: HabitAnalyticsMetrics;
  tasks: TaskAnalyticsMetrics;
  health: HealthAnalyticsMetrics;
  finance: FinancialAnalyticsMetrics;
  mind: MindAnalyticsMetrics;
}

export interface AnalyticsTrendPoint {
  date: string;
  label: string; // e.g. "Mon 15"
  lifeScore: number;
  habitsRate: number;
  tasksRate: number;
  waterMl: number;
  sleepHrs: number;
  expenseAmount: number;
  incomeAmount: number;
}

export interface CorrelationInsight {
  id: string;
  category: 'productivity' | 'vitality' | 'discipline' | 'wealth' | 'clarity';
  title: string;
  description: string;
  impactBadge: string;
  iconName: 'Flame' | 'Droplet' | 'ShieldCheck' | 'Sparkles' | 'TrendingUp' | 'Brain';
}

export interface GeneratedReport {
  id: string;
  type: 'weekly' | 'monthly';
  title: string;
  dateRange: string;
  generatedAt: string;
  summary: string;
  metricsSnapshot: {
    lifeScore: number;
    goalRate: number;
    habitRate: number;
    taskRate: number;
    healthScore: number;
    financeScore: number;
  };
  contentMarkdown: string;
}
