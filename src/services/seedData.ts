import { Goal, Task, Habit, FinanceRecord, HealthLog, JournalEntry, UserSettings } from '../types';

const getTodayString = (offsetDays: number = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_SETTINGS: UserSettings = {
  userName: 'Alex Mercer',
  currency: '$',
  dailyWaterTargetMl: 2500,
  dailySleepHours: 8,
  monthlyBudget: 3500,
  geminiApiKey: '',
  geminiModel: 'gemini-3.6-flash',
  soundEffects: true,
  voiceFeedback: false,
  theme: 'dark'
};

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal-1',
    title: 'Run a Half Marathon (21km)',
    description: 'Train consistently to complete the City Spring Half Marathon under 2 hours.',
    category: 'Health',
    targetDate: getTodayString(60),
    currentProgress: 65,
    status: 'in-progress',
    targetMetric: '21.1 km distance',
    createdAt: getTodayString(-30),
    milestones: [
      { id: 'm1', title: 'Complete 5k under 25 mins', completed: true },
      { id: 'm2', title: 'Run 10k continuous pacing', completed: true },
      { id: 'm3', title: 'Complete 15k weekend long run', completed: false, dueDate: getTodayString(14) },
      { id: 'm4', title: 'Race day pacing simulation', completed: false, dueDate: getTodayString(45) }
    ]
  },
  {
    id: 'goal-2',
    title: 'Build $15,000 Emergency Reserve',
    description: 'Ensure 6 months of living expenses are safely stored in a high-yield savings account.',
    category: 'Finance',
    targetDate: getTodayString(120),
    currentProgress: 80,
    status: 'in-progress',
    targetMetric: '$15,000 balance',
    createdAt: getTodayString(-90),
    milestones: [
      { id: 'm5', title: 'Reach $5,000 milestone', completed: true },
      { id: 'm6', title: 'Automate $750 monthly transfer', completed: true },
      { id: 'm7', title: 'Reach $12,000 reserve', completed: true },
      { id: 'm8', title: 'Reach target $15,000', completed: false, dueDate: getTodayString(120) }
    ]
  },
  {
    id: 'goal-3',
    title: 'Launch SaaS AI Product',
    description: 'Design, develop and release MVP to first 100 beta customers.',
    category: 'Career',
    targetDate: getTodayString(40),
    currentProgress: 50,
    status: 'in-progress',
    targetMetric: '100 Active Users',
    createdAt: getTodayString(-45),
    milestones: [
      { id: 'm9', title: 'Finalize UX wireframes and user flow', completed: true },
      { id: 'm10', title: 'Implement core AI engine integration', completed: true },
      { id: 'm11', title: 'Launch landing page waitlist', completed: false, dueDate: getTodayString(10) },
      { id: 'm12', title: 'Stripe payments and beta cohort launch', completed: false, dueDate: getTodayString(35) }
    ]
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Review Q3 budget allocation with accountant',
    description: 'Ensure tax write-offs and annual IRA contribution limits are met.',
    priority: 'high',
    status: 'todo',
    dueDate: getTodayString(0),
    category: 'Finance',
    linkedGoalId: 'goal-2',
    createdAt: getTodayString(-1)
  },
  {
    id: 'task-2',
    title: 'Complete 8km interval endurance training',
    description: '400m repeats with 90s recovery.',
    priority: 'medium',
    status: 'todo',
    dueDate: getTodayString(0),
    category: 'Health',
    linkedGoalId: 'goal-1',
    createdAt: getTodayString(-2)
  },
  {
    id: 'task-3',
    title: 'Ship LOTAI multi-modal voice processing module',
    description: 'Test Web Speech API fallback and offline token classification.',
    priority: 'urgent',
    status: 'in-progress',
    dueDate: getTodayString(1),
    category: 'Career',
    linkedGoalId: 'goal-3',
    createdAt: getTodayString(-3)
  },
  {
    id: 'task-4',
    title: 'Buy fresh produce & electrolyte hydration packs',
    description: 'Organic greens, bananas, magnesium glycinate.',
    priority: 'low',
    status: 'done',
    dueDate: getTodayString(-1),
    category: 'Health',
    createdAt: getTodayString(-2)
  }
];

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-1',
    title: 'Morning Sunlight & 15m Meditation',
    category: 'Personal',
    frequency: 'daily',
    timeOfDay: 'morning',
    targetCount: 1,
    currentStreak: 12,
    bestStreak: 24,
    color: '#6366f1',
    createdAt: getTodayString(-30),
    history: {
      [getTodayString(-4)]: true,
      [getTodayString(-3)]: true,
      [getTodayString(-2)]: true,
      [getTodayString(-1)]: true,
      [getTodayString(0)]: true
    }
  },
  {
    id: 'habit-2',
    title: 'Hydration: Drink 2.5L Water',
    category: 'Health',
    frequency: 'daily',
    timeOfDay: 'anytime',
    targetCount: 1,
    currentStreak: 8,
    bestStreak: 15,
    color: '#06b6d4',
    createdAt: getTodayString(-20),
    history: {
      [getTodayString(-3)]: true,
      [getTodayString(-2)]: true,
      [getTodayString(-1)]: true,
      [getTodayString(0)]: false
    }
  },
  {
    id: 'habit-3',
    title: 'Read 20 Pages of Non-Fiction',
    category: 'Learning',
    frequency: 'daily',
    timeOfDay: 'evening',
    targetCount: 1,
    currentStreak: 5,
    bestStreak: 18,
    color: '#10b981',
    createdAt: getTodayString(-25),
    history: {
      [getTodayString(-2)]: true,
      [getTodayString(-1)]: true,
      [getTodayString(0)]: false
    }
  },
  {
    id: 'habit-4',
    title: 'Zero Mindless Screen Time Before Bed',
    category: 'Health',
    frequency: 'daily',
    timeOfDay: 'evening',
    targetCount: 1,
    currentStreak: 6,
    bestStreak: 14,
    color: '#8b5cf6',
    createdAt: getTodayString(-14),
    history: {
      [getTodayString(-3)]: true,
      [getTodayString(-2)]: true,
      [getTodayString(-1)]: true,
      [getTodayString(0)]: false
    }
  }
];

export const INITIAL_FINANCES: FinanceRecord[] = [
  {
    id: 'fin-1',
    type: 'income',
    amount: 5400,
    category: 'Salary & Earnings',
    description: 'Senior Software Architect Monthly Retainer',
    date: getTodayString(-15),
    paymentMethod: 'Direct Deposit',
    createdAt: getTodayString(-15)
  },
  {
    id: 'fin-2',
    type: 'expense',
    amount: 1450,
    category: 'Housing & Rent',
    description: 'Modern Loft Apartment Monthly Rent',
    date: getTodayString(-14),
    paymentMethod: 'Bank Transfer',
    createdAt: getTodayString(-14)
  },
  {
    id: 'fin-3',
    type: 'expense',
    amount: 120,
    category: 'Food & Dining',
    description: 'Weekly Organic Grocery Haul',
    date: getTodayString(-3),
    paymentMethod: 'Apple Pay',
    createdAt: getTodayString(-3)
  },
  {
    id: 'fin-4',
    type: 'expense',
    amount: 45,
    category: 'Food & Dining',
    description: 'Dinner with colleagues',
    date: getTodayString(-1),
    paymentMethod: 'Credit Card',
    createdAt: getTodayString(-1)
  },
  {
    id: 'fin-5',
    type: 'expense',
    amount: 750,
    category: 'Investment & Savings',
    description: 'Automated High-Yield Index Fund Contribution',
    date: getTodayString(-5),
    paymentMethod: 'Direct Debit',
    createdAt: getTodayString(-5)
  },
  {
    id: 'fin-6',
    type: 'expense',
    amount: 14.99,
    category: 'Utilities',
    description: 'Cloud Infrastructure Subscription',
    date: getTodayString(0),
    paymentMethod: 'Credit Card',
    createdAt: getTodayString(0)
  }
];

export const INITIAL_HEALTH: HealthLog[] = [
  {
    id: 'health-3',
    date: getTodayString(-2),
    waterIntakeMl: 2600,
    sleepHours: 8.2,
    sleepQuality: 'optimal',
    workoutMinutes: 50,
    workoutType: 'Zone 2 Cardio Run',
    caloriesBurned: 480,
    energyLevel: 5,
    notes: 'Woke up completely refreshed.'
  },
  {
    id: 'health-2',
    date: getTodayString(-1),
    waterIntakeMl: 2300,
    sleepHours: 7.4,
    sleepQuality: 'good',
    workoutMinutes: 45,
    workoutType: 'Strength & Core',
    caloriesBurned: 390,
    energyLevel: 4,
    notes: 'Strong bench press session.'
  },
  {
    id: 'health-1',
    date: getTodayString(0),
    waterIntakeMl: 1750,
    sleepHours: 7.8,
    sleepQuality: 'good',
    workoutMinutes: 30,
    workoutType: 'HIIT & Mobility',
    caloriesBurned: 280,
    energyLevel: 4,
    notes: 'Solid mental stamina today.'
  }
];

export const INITIAL_JOURNAL: JournalEntry[] = [
  {
    id: 'j-1',
    date: getTodayString(-1),
    mood: 'productive',
    title: 'Flow state achieved & clear milestone hit',
    content: 'Locked in 4 hours of deep uninterrupted work today. Cleared off the biggest blockers in the project roadmap. Realizing that disconnecting from phone notifications before noon doubles cognitive output.',
    gratitude: 'Grateful for crisp morning coffee and the ability to build things that solve real human problems.',
    tags: ['deep-work', 'clarity', 'focus'],
    aiSentiment: 'positive',
    aiReflection: 'Superb momentum! Notice how establishing phone-free mornings correlates with your highest rated productive days.',
    createdAt: getTodayString(-1)
  },
  {
    id: 'j-2',
    date: getTodayString(0),
    mood: 'joyful',
    title: 'Energized by progress and new ideas',
    content: 'Had an invigorating run this morning. Brain felt super sharp. Ready to deploy the new LOTAI features and refine the life balance analytics.',
    gratitude: 'Grateful for good health, strong lungs, and supportive peers.',
    tags: ['energy', 'optimism', 'growth'],
    aiSentiment: 'positive',
    aiReflection: 'Your physical activity directly primed your positive mental state today.',
    createdAt: getTodayString(0)
  }
];
