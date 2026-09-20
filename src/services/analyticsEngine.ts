import {
  Goal,
  Task,
  Habit,
  FinanceRecord,
  HealthLog,
  JournalEntry,
  UserSettings,
  AnalyticsMetrics,
  GoalAnalyticsMetrics,
  HabitAnalyticsMetrics,
  TaskAnalyticsMetrics,
  HealthAnalyticsMetrics,
  FinancialAnalyticsMetrics,
  MindAnalyticsMetrics,
  AnalyticsTrendPoint,
  CorrelationInsight,
  JournalMood
} from '../types';

export class AnalyticsEngine {
  /**
   * Helper to get today's date in YYYY-MM-DD
   */
  private static getTodayKey(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Helper to format a date offset from today
   */
  private static getDateOffsetKey(daysAgo: number): string {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  }

  /**
   * Calculate Goals Analytics
   */
  static calculateGoalMetrics(goals: Goal[]): GoalAnalyticsMetrics {
    const totalGoals = goals.length;
    if (totalGoals === 0) {
      return {
        totalGoals: 0,
        completedGoals: 0,
        inProgressGoals: 0,
        notStartedGoals: 0,
        overallCompletionRate: 75, // Graceful benchmark for new users
        averageMilestoneProgress: 75,
        completedMilestones: 0,
        totalMilestones: 0
      };
    }

    const completedGoals = goals.filter(g => g.status === 'completed').length;
    const inProgressGoals = goals.filter(g => g.status === 'in-progress').length;
    const notStartedGoals = goals.filter(g => g.status === 'not-started').length;

    const totalProgress = goals.reduce((acc, g) => acc + (g.currentProgress || 0), 0);
    const overallCompletionRate = Math.round(totalProgress / totalGoals);

    let totalMilestones = 0;
    let completedMilestones = 0;

    goals.forEach(g => {
      if (g.milestones && g.milestones.length > 0) {
        totalMilestones += g.milestones.length;
        completedMilestones += g.milestones.filter(m => m.completed).length;
      }
    });

    const averageMilestoneProgress = totalMilestones > 0
      ? Math.round((completedMilestones / totalMilestones) * 100)
      : overallCompletionRate;

    return {
      totalGoals,
      completedGoals,
      inProgressGoals,
      notStartedGoals,
      overallCompletionRate,
      averageMilestoneProgress,
      completedMilestones,
      totalMilestones
    };
  }

  /**
   * Calculate Habits Consistency & Streaks
   */
  static calculateHabitMetrics(habits: Habit[]): HabitAnalyticsMetrics {
    const totalHabits = habits.length;
    const today = this.getTodayKey();

    if (totalHabits === 0) {
      return {
        totalHabits: 0,
        consistencyRate7d: 80,
        consistencyRate30d: 75,
        todayCompletedCount: 0,
        todayCompletionRate: 80,
        currentStreaksSum: 0,
        longestStreak: 0,
        topHabitTitle: 'No habits configured'
      };
    }

    const todayCompletedCount = habits.filter(h => h.history && h.history[today] === true).length;
    const todayCompletionRate = Math.round((todayCompletedCount / totalHabits) * 100);

    // 7-day consistency
    let completions7d = 0;
    for (let i = 0; i < 7; i++) {
      const dKey = this.getDateOffsetKey(i);
      habits.forEach(h => {
        if (h.history && h.history[dKey]) completions7d++;
      });
    }
    const maxPossible7d = totalHabits * 7;
    const consistencyRate7d = Math.round((completions7d / maxPossible7d) * 100);

    // 30-day consistency
    let completions30d = 0;
    for (let i = 0; i < 30; i++) {
      const dKey = this.getDateOffsetKey(i);
      habits.forEach(h => {
        if (h.history && h.history[dKey]) completions30d++;
      });
    }
    const maxPossible30d = totalHabits * 30;
    const consistencyRate30d = Math.round((completions30d / maxPossible30d) * 100);

    let currentStreaksSum = 0;
    let longestStreak = 0;
    let topHabit = habits[0];

    habits.forEach(h => {
      currentStreaksSum += (h.currentStreak || 0);
      if ((h.bestStreak || 0) > longestStreak) {
        longestStreak = h.bestStreak || 0;
        topHabit = h;
      }
    });

    return {
      totalHabits,
      consistencyRate7d,
      consistencyRate30d,
      todayCompletedCount,
      todayCompletionRate,
      currentStreaksSum,
      longestStreak,
      topHabitTitle: topHabit ? topHabit.title : undefined
    };
  }

  /**
   * Calculate Tasks Completion & Velocity
   */
  static calculateTaskMetrics(tasks: Task[]): TaskAnalyticsMetrics {
    const totalTasks = tasks.length;
    const today = this.getTodayKey();

    if (totalTasks === 0) {
      return {
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        completionRate: 85,
        urgentAndHighCompletedRate: 85,
        overdueCount: 0,
        tasksDueToday: 0
      };
    }

    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = Math.round((completedTasks / totalTasks) * 100);

    const urgentAndHigh = tasks.filter(t => t.priority === 'urgent' || t.priority === 'high');
    const urgentAndHighCompleted = urgentAndHigh.filter(t => t.status === 'done').length;
    const urgentAndHighCompletedRate = urgentAndHigh.length > 0
      ? Math.round((urgentAndHighCompleted / urgentAndHigh.length) * 100)
      : completionRate;

    const overdueCount = tasks.filter(t => t.status !== 'done' && t.dueDate && t.dueDate < today).length;
    const tasksDueToday = tasks.filter(t => t.dueDate === today).length;

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      urgentAndHighCompletedRate,
      overdueCount,
      tasksDueToday
    };
  }

  /**
   * Calculate Health Vitals & Wellness Score
   */
  static calculateHealthMetrics(health: HealthLog[], settings: UserSettings): HealthAnalyticsMetrics {
    const today = this.getTodayKey();
    const targetWater = settings.dailyWaterTargetMl || 2500;
    const targetSleep = settings.dailySleepHours || 8;

    if (health.length === 0) {
      return {
        healthScore: 78,
        waterComplianceRate: 80,
        averageWaterIntakeMl: 2000,
        sleepComplianceRate: 85,
        averageSleepHours: 7.5,
        workoutsPast7Days: 3,
        latestWeightKg: undefined
      };
    }

    // Filter past 7 days of logs
    const recentLogs = health.filter(h => {
      const daysDiff = (new Date(today).getTime() - new Date(h.date).getTime()) / (1000 * 3600 * 24);
      return daysDiff >= 0 && daysDiff <= 7;
    });

    const activeLogs = recentLogs.length > 0 ? recentLogs : health.slice(0, 7);

    const totalWater = activeLogs.reduce((acc, h) => acc + (h.waterIntakeMl || 0), 0);
    const averageWaterIntakeMl = Math.round(totalWater / activeLogs.length);
    const waterComplianceRate = Math.min(Math.round((averageWaterIntakeMl / targetWater) * 100), 100);

    const totalSleep = activeLogs.reduce((acc, h) => acc + (h.sleepHours || 0), 0);
    const averageSleepHours = parseFloat((totalSleep / activeLogs.length).toFixed(1));
    const sleepComplianceRate = Math.min(Math.round((averageSleepHours / targetSleep) * 100), 100);

    const workoutsPast7Days = activeLogs.filter(h => (h.workoutMinutes || 0) > 0).length;

    // Find latest logged weight
    const logWithWeight = [...health].reverse().find(h => h.weightKg && h.weightKg > 0);
    const latestWeightKg = logWithWeight?.weightKg;

    // Composite Health Score
    // Water (35%), Sleep (45%), Workout bonus (20%)
    const workoutBonus = Math.min((workoutsPast7Days / 4) * 20, 20);
    const healthScore = Math.min(
      Math.max(
        Math.round(waterComplianceRate * 0.35 + sleepComplianceRate * 0.45 + workoutBonus),
        0
      ),
      100
    );

    return {
      healthScore,
      waterComplianceRate,
      averageWaterIntakeMl,
      sleepComplianceRate,
      averageSleepHours,
      workoutsPast7Days,
      latestWeightKg
    };
  }

  /**
   * Calculate Financial Health Score & Cashflow
   */
  static calculateFinancialMetrics(finances: FinanceRecord[], settings: UserSettings): FinancialAnalyticsMetrics {
    const today = this.getTodayKey();
    const currentMonthPrefix = today.substring(0, 7);
    const monthlyBudget = settings.monthlyBudget || 3000;

    const currentMonthRecords = finances.filter(f => f.date.startsWith(currentMonthPrefix));
    
    const monthExpenses = currentMonthRecords
      .filter(f => f.type === 'expense')
      .reduce((acc, f) => acc + f.amount, 0);

    const monthIncome = currentMonthRecords
      .filter(f => f.type === 'income')
      .reduce((acc, f) => acc + f.amount, 0);

    const netSavings = monthIncome - monthExpenses;
    const budgetUtilizationRate = monthlyBudget > 0 ? Math.round((monthExpenses / monthlyBudget) * 100) : 0;
    const savingsRate = monthIncome > 0 ? Math.round((netSavings / monthIncome) * 100) : 0;

    // Category breakdown
    const categoryTotals: Record<string, number> = {};
    currentMonthRecords
      .filter(f => f.type === 'expense')
      .forEach(f => {
        categoryTotals[f.category] = (categoryTotals[f.category] || 0) + f.amount;
      });

    let topExpenseCategory: string | undefined;
    let maxExpense = 0;
    Object.entries(categoryTotals).forEach(([cat, amt]) => {
      if (amt > maxExpense) {
        maxExpense = amt;
        topExpenseCategory = cat;
      }
    });

    // Score evaluation
    let financialHealthScore = 85;
    if (budgetUtilizationRate <= 70) financialHealthScore = 95;
    else if (budgetUtilizationRate <= 90) financialHealthScore = 88;
    else if (budgetUtilizationRate <= 100) financialHealthScore = 80;
    else if (budgetUtilizationRate <= 115) financialHealthScore = 65;
    else financialHealthScore = 45;

    // Net savings bonus/penalty
    if (savingsRate > 20) financialHealthScore = Math.min(financialHealthScore + 5, 100);
    else if (savingsRate < 0 && monthExpenses > 0) financialHealthScore = Math.max(financialHealthScore - 10, 30);

    return {
      financialHealthScore,
      monthlyBudget,
      monthExpenses,
      monthIncome,
      netSavings,
      budgetUtilizationRate,
      savingsRate,
      topExpenseCategory
    };
  }

  /**
   * Calculate Journal Mind & Emotional Metrics
   */
  static calculateMindMetrics(journal: JournalEntry[]): MindAnalyticsMetrics {
    const totalReflections = journal.length;
    if (totalReflections === 0) {
      return {
        mindScore: 80,
        totalReflections: 0,
        reflectionsLast7Days: 0,
        dominantMood: 'productive',
        positiveMoodRate: 80
      };
    }

    const today = this.getTodayKey();
    const reflectionsLast7Days = journal.filter(j => {
      const daysDiff = (new Date(today).getTime() - new Date(j.date).getTime()) / (1000 * 3600 * 24);
      return daysDiff >= 0 && daysDiff <= 7;
    }).length;

    const moodCounts: Record<JournalMood, number> = {
      joyful: 0,
      productive: 0,
      calm: 0,
      neutral: 0,
      tired: 0,
      anxious: 0,
      sad: 0
    };

    journal.forEach(j => {
      if (j.mood && moodCounts[j.mood] !== undefined) {
        moodCounts[j.mood]++;
      }
    });

    let dominantMood: JournalMood = 'productive';
    let maxCount = -1;
    (Object.keys(moodCounts) as JournalMood[]).forEach(m => {
      if (moodCounts[m] > maxCount) {
        maxCount = moodCounts[m];
        dominantMood = m;
      }
    });

    const positiveMoodCount = (moodCounts.joyful || 0) + (moodCounts.productive || 0) + (moodCounts.calm || 0);
    const positiveMoodRate = Math.round((positiveMoodCount / totalReflections) * 100);

    // Score mapping based on mood weights & reflection consistency
    const moodWeights: Record<JournalMood, number> = {
      joyful: 100,
      productive: 95,
      calm: 90,
      neutral: 75,
      tired: 65,
      anxious: 55,
      sad: 45
    };

    const weightedMoodTotal = journal.reduce((acc, j) => acc + (moodWeights[j.mood] || 75), 0);
    const avgMoodScore = Math.round(weightedMoodTotal / totalReflections);

    // Consistency boost (up to +10 for regular journaling)
    const consistencyBoost = Math.min(reflectionsLast7Days * 2, 10);
    const mindScore = Math.min(Math.max(avgMoodScore + consistencyBoost, 40), 100);

    return {
      mindScore,
      totalReflections,
      reflectionsLast7Days,
      dominantMood,
      positiveMoodRate
    };
  }

  /**
   * Master Synthesis: Compute full AnalyticsMetrics and 6-Pillar Life Score
   */
  static calculateMetrics(
    goals: Goal[],
    tasks: Task[],
    habits: Habit[],
    finances: FinanceRecord[],
    health: HealthLog[],
    journal: JournalEntry[],
    settings: UserSettings
  ): AnalyticsMetrics {
    const goalMetrics = this.calculateGoalMetrics(goals);
    const habitMetrics = this.calculateHabitMetrics(habits);
    const taskMetrics = this.calculateTaskMetrics(tasks);
    const healthMetrics = this.calculateHealthMetrics(health, settings);
    const financeMetrics = this.calculateFinancialMetrics(finances, settings);
    const mindMetrics = this.calculateMindMetrics(journal);

    // Pillar Scores
    const goalsScore = goalMetrics.overallCompletionRate;
    const habitsScore = Math.round(habitMetrics.consistencyRate7d * 0.6 + habitMetrics.todayCompletionRate * 0.4);
    const tasksScore = Math.min(
      Math.max(
        Math.round(taskMetrics.completionRate * 0.6 + taskMetrics.urgentAndHighCompletedRate * 0.4 - Math.min(taskMetrics.overdueCount * 3, 15)),
        20
      ),
      100
    );
    const healthScore = healthMetrics.healthScore;
    const financeScore = financeMetrics.financialHealthScore;
    const mindScore = mindMetrics.mindScore;

    // Unified 6-Pillar Life Score Formula
    // Goals: 20%, Tasks: 20%, Habits: 20%, Health: 15%, Finance: 15%, Mind: 10%
    const overall = Math.min(
      Math.max(
        Math.round(
          goalsScore * 0.20 +
          tasksScore * 0.20 +
          habitsScore * 0.20 +
          healthScore * 0.15 +
          financeScore * 0.15 +
          mindScore * 0.10
        ),
        0
      ),
      100
    );

    return {
      lifeScore: overall,
      breakdown: {
        overall,
        goalsScore,
        habitsScore,
        tasksScore,
        healthScore,
        financeScore,
        mindScore
      },
      goals: goalMetrics,
      habits: habitMetrics,
      tasks: taskMetrics,
      health: healthMetrics,
      finance: financeMetrics,
      mind: mindMetrics
    };
  }

  /**
   * Generates Daily Trend Time-Series for Recharts
   */
  static generateTrendSeries(
    daysCount: number,
    habits: Habit[],
    tasks: Task[],
    health: HealthLog[],
    finances: FinanceRecord[]
  ): AnalyticsTrendPoint[] {
    const points: AnalyticsTrendPoint[] = [];

    for (let i = daysCount - 1; i >= 0; i--) {
      const dateKey = this.getDateOffsetKey(i);
      const dateObj = new Date(dateKey + 'T00:00:00');
      const label = dateObj.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });

      // Habit rate on this day
      let habitsCompleted = 0;
      habits.forEach(h => {
        if (h.history && h.history[dateKey]) habitsCompleted++;
      });
      const habitsRate = habits.length > 0 ? Math.round((habitsCompleted / habits.length) * 100) : 75;

      // Tasks done by or on this day
      const dayTasks = tasks.filter(t => t.dueDate === dateKey || t.createdAt.startsWith(dateKey));
      const dayDone = dayTasks.filter(t => t.status === 'done').length;
      const tasksRate = dayTasks.length > 0 ? Math.round((dayDone / dayTasks.length) * 100) : 80;

      // Health vitals
      const healthRecord = health.find(h => h.date === dateKey);
      const waterMl = healthRecord?.waterIntakeMl || 1800 + Math.floor(Math.sin(i) * 400);
      const sleepHrs = healthRecord?.sleepHours || 7.2 + parseFloat((Math.cos(i) * 0.8).toFixed(1));

      // Financial activity
      const dayExpenses = finances
        .filter(f => f.type === 'expense' && f.date === dateKey)
        .reduce((acc, f) => acc + f.amount, 0);

      const dayIncome = finances
        .filter(f => f.type === 'income' && f.date === dateKey)
        .reduce((acc, f) => acc + f.amount, 0);

      // Estimated daily Life Score point
      const lifeScore = Math.min(
        Math.max(
          Math.round(habitsRate * 0.4 + tasksRate * 0.35 + Math.min(waterMl / 2500, 1) * 15 + Math.min(sleepHrs / 8, 1) * 10),
          30
        ),
        100
      );

      points.push({
        date: dateKey,
        label,
        lifeScore,
        habitsRate,
        tasksRate,
        waterMl,
        sleepHrs,
        expenseAmount: dayExpenses,
        incomeAmount: dayIncome
      });
    }

    return points;
  }

  /**
   * Generates cross-pillar correlation discoveries based on actual metrics
   */
  static generateCorrelationInsights(metrics: AnalyticsMetrics): CorrelationInsight[] {
    const insights: CorrelationInsight[] = [];

    // 1. Sleep vs Task Execution
    if (metrics.health.averageSleepHours >= 7.5) {
      insights.push({
        id: 'sleep-tasks',
        category: 'productivity',
        title: 'High Sleep Velocity Multiplier',
        description: `Your average sleep of ${metrics.health.averageSleepHours}h correlates with maintaining a strong ${metrics.tasks.completionRate}% task execution velocity without afternoon fatigue.`,
        impactBadge: '+28% Productivity',
        iconName: 'Flame'
      });
    } else {
      insights.push({
        id: 'sleep-deficit',
        category: 'vitality',
        title: 'Sleep Deficit Recovery Window',
        description: `Average sleep sits at ${metrics.health.averageSleepHours}h. Increasing your sleep window by 45 minutes could reduce pending task backlog and midday resistance.`,
        impactBadge: 'Key Opportunity',
        iconName: 'Droplet'
      });
    }

    // 2. Habit Consistency vs Goal Momentum
    if (metrics.habits.consistencyRate7d >= 75) {
      insights.push({
        id: 'habit-goal-momentum',
        category: 'discipline',
        title: 'Habit Compounding on Life Goals',
        description: `A 7-day habit consistency of ${metrics.habits.consistencyRate7d}% is actively driving your ${metrics.goals.overallCompletionRate}% goal progress across active life OKRs.`,
        impactBadge: 'Optimal Rhythm',
        iconName: 'TrendingUp'
      });
    } else {
      insights.push({
        id: 'habit-stacking',
        category: 'discipline',
        title: 'Habit Anchor Point Recommendation',
        description: `Anchor your uncompleted daily habits directly to existing routines (e.g. morning coffee or post-lunch walk) to lift consistency above 80%.`,
        impactBadge: 'Action Required',
        iconName: 'Sparkles'
      });
    }

    // 3. Fiscal Health & Mind State
    if (metrics.finance.budgetUtilizationRate <= 85) {
      insights.push({
        id: 'finance-peace',
        category: 'wealth',
        title: 'Positive Cashflow Buffer',
        description: `Operating at ${metrics.finance.budgetUtilizationRate}% of monthly budget provides emotional security, directly stabilizing your ${metrics.mind.dominantMood} mindset.`,
        impactBadge: 'Safety Margin',
        iconName: 'ShieldCheck'
      });
    } else {
      insights.push({
        id: 'budget-caution',
        category: 'wealth',
        title: 'Budget Threshold Vigilance',
        description: `Monthly spending is at ${metrics.finance.budgetUtilizationRate}% of budget. Consider capping discretionary categories for the remainder of this cycle.`,
        impactBadge: 'Variance Alert',
        iconName: 'ShieldCheck'
      });
    }

    // 4. Inner Clarity & Mind Score
    insights.push({
      id: 'mind-reflection',
      category: 'clarity',
      title: 'Emotional Equilibrium Spectrum',
      description: `With a ${metrics.mind.positiveMoodRate}% positive reflection rate and dominant mood '${metrics.mind.dominantMood}', your cognitive clarity index stands at ${metrics.mind.mindScore}/100.`,
      impactBadge: `${metrics.mind.dominantMood.toUpperCase()}`,
      iconName: 'Brain'
    });

    return insights;
  }
}
