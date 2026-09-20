import { AnalyticsMetrics } from '../types';
import { 
  getActiveGeminiApiKey, 
  DEFAULT_GEMINI_MODEL, 
  sanitizeGeminiModel 
} from '../config/geminiConfig';

export interface AppContextSummary {
  lifeScore: number;
  completedHabitsToday: number;
  totalHabits: number;
  pendingTasksCount: number;
  spentThisMonth: number;
  monthlyBudget: number;
  recentWaterMl: number;
  recentSleepHours: number;
  recentMood: string;
  activeGoals: string[];
}

export class GeminiService {
  private static async callGenerateContent(
    modelName: string,
    apiKey?: string,
    body?: unknown
  ): Promise<Response> {
    const cleanModel = sanitizeGeminiModel(modelName);
    const effectiveKey = getActiveGeminiApiKey(apiKey);
    let res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${effectiveKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }
    );

    // If 404, fallback to DEFAULT_GEMINI_MODEL (gemini-3.6-flash)
    if (res.status === 404 && cleanModel !== DEFAULT_GEMINI_MODEL) {
      console.warn(`Model '${cleanModel}' returned 404. Falling back to '${DEFAULT_GEMINI_MODEL}'...`);
      res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_GEMINI_MODEL}:generateContent?key=${effectiveKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        }
      );
    }
    return res;
  }

  /**
   * Generates conversational AI Life Coach responses
   */
  static async askCoach(
    userMessage: string,
    context: AppContextSummary,
    apiKey?: string,
    modelName: string = DEFAULT_GEMINI_MODEL
  ): Promise<string> {
    const effectiveKey = getActiveGeminiApiKey(apiKey);

    if (!effectiveKey || effectiveKey.trim() === '') {
      // Intelligent Local Rule-based Life Coach Fallback
      return this.generateLocalCoachResponse(userMessage, context);
    }

    const systemPrompt = `You are LOTAI (Life On Track AI), an empathetic, highly intelligent, and structured Personal Life Coach and Executive Assistant.
Your mission is to help the user keep their life on track across Goals, Tasks, Habits, Finance, Health, and Mental Reflection.

Current User Context:
- Overall Life On Track Score: ${context.lifeScore}/100
- Today's Habit Completion: ${context.completedHabitsToday}/${context.totalHabits}
- Open High-Priority Tasks: ${context.pendingTasksCount}
- Monthly Spending: $${context.spentThisMonth} (Budget: $${context.monthlyBudget})
- Today's Water: ${context.recentWaterMl}ml | Sleep: ${context.recentSleepHours} hrs
- Recent Mood: ${context.recentMood}
- Active Goals: ${context.activeGoals.join(', ') || 'General self-improvement'}

Response Guidelines:
- Be encouraging, concise, actionable, and structured.
- Format with markdown bullets or numbered steps when giving advice.
- Refer directly to their actual numbers when relevant.
- Keep response under 150-200 words.`;

    try {
      const response = await this.callGenerateContent(modelName, apiKey, {
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${systemPrompt}\n\nUser Question: ${userMessage}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 600
        }
      });

      if (!response.ok) {
        console.warn('Gemini API response error:', response.statusText);
        return this.generateLocalCoachResponse(userMessage, context);
      }

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return reply || this.generateLocalCoachResponse(userMessage, context);
    } catch (err) {
      console.error('Error contacting Gemini API:', err);
      return this.generateLocalCoachResponse(userMessage, context);
    }
  }

  /**
   * Generates a 7-day Weekly Life Synthesis Report
   */
  static async generateWeeklyLifeReport(
    metrics: AnalyticsMetrics,
    apiKey?: string,
    modelName: string = DEFAULT_GEMINI_MODEL
  ): Promise<string> {
    const effectiveKey = getActiveGeminiApiKey(apiKey);
    if (!effectiveKey || effectiveKey.trim() === '') {
      return this.generateLocalWeeklyReport(metrics);
    }

    const prompt = `You are LOTAI (Life On Track AI), the world's most advanced personal intelligence engine.
Analyze these 7-day multi-dimensional metrics across all 6 life pillars:

OVERALL LIFE SCORE: ${metrics.lifeScore}/100
PILLAR BREAKDOWN:
- Goals Score: ${metrics.breakdown.goalsScore || metrics.goals.overallCompletionRate}/100 (${metrics.goals.completedGoals}/${metrics.goals.totalGoals} completed, ${metrics.goals.averageMilestoneProgress}% milestone progress)
- Habits Score: ${metrics.breakdown.habitsScore}/100 (7-day consistency: ${metrics.habits.consistencyRate7d}%, Longest Streak: ${metrics.habits.longestStreak}d, Top: ${metrics.habits.topHabitTitle || 'Routines'})
- Tasks Score: ${metrics.breakdown.tasksScore}/100 (${metrics.tasks.completedTasks}/${metrics.tasks.totalTasks} done, High/Urgent rate: ${metrics.tasks.urgentAndHighCompletedRate}%, Overdue: ${metrics.tasks.overdueCount})
- Health Score: ${metrics.breakdown.healthScore}/100 (Avg Sleep: ${metrics.health.averageSleepHours}h, Water: ${metrics.health.averageWaterIntakeMl}ml, Workouts: ${metrics.health.workoutsPast7Days}/7 days${metrics.health.latestWeightKg ? `, Weight: ${metrics.health.latestWeightKg}kg` : ''})
- Finance Score: ${metrics.breakdown.financeScore}/100 (Budget used: ${metrics.finance.budgetUtilizationRate}%, Spent: $${metrics.finance.monthExpenses}, Savings rate: ${metrics.finance.savingsRate}%)
- Mind & Inner Clarity: ${metrics.breakdown.mindScore}/100 (Dominant Mood: ${metrics.mind.dominantMood}, Positive Rate: ${metrics.mind.positiveMoodRate}%, 7d Reflections: ${metrics.mind.reflectionsLast7Days})

Generate a comprehensive, executive-grade Weekly Synthesis formatted with clean Markdown:
1. 🏆 **Executive Summary & Velocity** (Brief high-level verdict on momentum)
2. 🌟 **Major Wins & Core Strengths** (Highlight top 2 pillars that outperformed)
3. ⚠️ **Friction Points & Risk Mitigation** (Direct analysis of lagging areas like overdue tasks or sleep deficit)
4. 🎯 **7-Day Tactical Protocol** (3-4 crisp, high-leverage action steps for next week)
Maintain a confident, motivating, and highly analytical tone. Keep within 250-350 words.`;

    try {
      const res = await this.callGenerateContent(modelName, effectiveKey, {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 1000 }
      });
      if (!res.ok) return this.generateLocalWeeklyReport(metrics);
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || this.generateLocalWeeklyReport(metrics);
    } catch {
      return this.generateLocalWeeklyReport(metrics);
    }
  }

  /**
   * Generates a 30-day Monthly Executive Life Report
   */
  static async generateMonthlyLifeReport(
    metrics: AnalyticsMetrics,
    apiKey?: string,
    modelName: string = DEFAULT_GEMINI_MODEL
  ): Promise<string> {
    const effectiveKey = getActiveGeminiApiKey(apiKey);
    if (!effectiveKey || effectiveKey.trim() === '') {
      return this.generateLocalMonthlyReport(metrics);
    }

    const prompt = `You are LOTAI (Life On Track AI), the user's executive life intelligence system.
Analyze the user's comprehensive 30-day life performance across all 6 core pillars:

OVERALL MONTHLY LIFE SCORE: ${metrics.lifeScore}/100
- Goal Execution: ${metrics.goals.overallCompletionRate}% across ${metrics.goals.totalGoals} active life targets (${metrics.goals.completedGoals} finalized).
- Habit Adherence: 30-day consistency rate of ${metrics.habits.consistencyRate30d}% with cumulative streaks totaling ${metrics.habits.currentStreaksSum} days.
- Task Execution: ${metrics.tasks.completionRate}% completion rate on ${metrics.tasks.totalTasks} total items with ${metrics.tasks.urgentAndHighCompletedRate}% high-priority velocity.
- Physical Endurance: Average sleep ${metrics.health.averageSleepHours}h/night, average water ${metrics.health.averageWaterIntakeMl}ml/day, ${metrics.health.workoutsPast7Days} workouts logged.
- Financial Surplus: Net cashflow $${metrics.finance.netSavings.toFixed(2)} with a ${metrics.finance.savingsRate}% savings rate on $${metrics.finance.monthExpenses.toFixed(2)} total spend (Budget utilization: ${metrics.finance.budgetUtilizationRate}%).
- Mental Equilibrium: Dominant emotional state '${metrics.mind.dominantMood}' with ${metrics.mind.positiveMoodRate}% constructive reflection rate.

Generate an executive 30-Day Monthly Review formatted with clean Markdown:
1. 📊 **Monthly Macro Performance Review** (Holistic trajectory across life domains)
2. 🚀 **Strategic Breakthroughs** (Key compounding behaviors that moved the needle)
3. 🛡️ **Vulnerability Analysis** (Habit slippage, fiscal leakages, or recovery shortfalls)
4. 🧭 **30-Day Strategic Roadmap** (Strategic focus themes for the upcoming month)
Maintain an authoritative, inspiring, and data-backed tone. Keep within 300-400 words.`;

    try {
      const res = await this.callGenerateContent(modelName, effectiveKey, {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 1200 }
      });
      if (!res.ok) return this.generateLocalMonthlyReport(metrics);
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || this.generateLocalMonthlyReport(metrics);
    } catch {
      return this.generateLocalMonthlyReport(metrics);
    }
  }

  /**
   * Generates dynamic cross-pillar AI insights
   */
  static async generateAIInsights(
    metrics: AnalyticsMetrics,
    apiKey?: string,
    modelName: string = DEFAULT_GEMINI_MODEL
  ): Promise<string> {
    const effectiveKey = getActiveGeminiApiKey(apiKey);
    if (!effectiveKey || effectiveKey.trim() === '') {
      return this.generateLocalAIInsights(metrics);
    }

    const prompt = `Based on LOTAI Life Score ${metrics.lifeScore}/100:
Goals: ${metrics.goals.overallCompletionRate}%, Habits 7d: ${metrics.habits.consistencyRate7d}%, Tasks: ${metrics.tasks.completionRate}%, Sleep: ${metrics.health.averageSleepHours}h, Water: ${metrics.health.averageWaterIntakeMl}ml, Finance Budget Used: ${metrics.finance.budgetUtilizationRate}%, Mind Mood: ${metrics.mind.dominantMood}.

Provide 3 concise, highly actionable, cross-pillar correlation discoveries. Format with bold headers and short 2-sentence explanations highlighting cause-and-effect (e.g. how sleep affects task completion, or how budget discipline affects peace of mind).`;

    try {
      const res = await this.callGenerateContent(modelName, effectiveKey, {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
      });
      if (!res.ok) return this.generateLocalAIInsights(metrics);
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || this.generateLocalAIInsights(metrics);
    } catch {
      return this.generateLocalAIInsights(metrics);
    }
  }

  /**
   * Legacy weekly report compatibility
   */
  static async generateWeeklyReport(
    context: AppContextSummary,
    apiKey?: string,
    modelName: string = DEFAULT_GEMINI_MODEL
  ): Promise<string> {
    if (!apiKey || apiKey.trim() === '') {
      return `### 🌟 LOTAI Weekly Life Synthesis

**Overall Life Velocity: ${context.lifeScore}%**

1. **Habit Consistency & Discipline**:
   - You maintained an active streak across key routines. Today's rate stands at **${Math.round((context.completedHabitsToday / Math.max(context.totalHabits, 1)) * 100)}%**.
   - *Recommendation*: Secure your morning routine before checking emails to preserve focus.

2. **Health & Physical Energy**:
   - Sleep: **${context.recentSleepHours} hrs** | Hydration: **${context.recentWaterMl} ml**.
   - *Observation*: Healthy sleep is currently shielding you from mid-afternoon energy crashes.

3. **Financial Trajectory**:
   - Current spend: **$${context.spentThisMonth.toFixed(2)}** of **$${context.monthlyBudget.toFixed(2)}** monthly limit.
   - You are tracking comfortably within your safe variance margin.

4. **Focus for the Upcoming 7 Days**:
   - Tackle the ${context.pendingTasksCount} pending tasks early in the morning block.
   - Continue regular evening reflections to consolidate daily learning.`;
    }

    const prompt = `Generate a structured, motivating weekly review based on:
Life Score: ${context.lifeScore}/100, Habits: ${context.completedHabitsToday}/${context.totalHabits}, Spent: $${context.spentThisMonth} (Budget: $${context.monthlyBudget}), Sleep: ${context.recentSleepHours} hrs, Water: ${context.recentWaterMl}ml, Active Goals: ${context.activeGoals.join(', ')}.
Provide: 1. Executive Summary 2. Major Wins 3. Vulnerability / Risk Areas 4. Next Week Action Plan.`;

    try {
      const res = await this.callGenerateContent(modelName, apiKey, {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 800 }
      });
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || this.generateWeeklyReport(context);
    } catch {
      return this.generateWeeklyReport(context);
    }
  }

  /**
   * Local Rule-based Weekly Synthesis Generator
   */
  private static generateLocalWeeklyReport(metrics: AnalyticsMetrics): string {
    const isOptimal = metrics.lifeScore >= 80;
    const isSteady = metrics.lifeScore >= 65;
    const statusText = isOptimal ? 'Optimal Rhythm' : isSteady ? 'Steady Velocity' : 'Calibration Mode';

    return `### 🌟 LOTAI Weekly Executive Life Synthesis
**Life on Track Score: ${metrics.lifeScore}/100** • *${statusText}*

---

#### 1. 🏆 Executive Summary & Velocity
Over the past 7 days, your multi-pillar equilibrium registered at **${metrics.lifeScore}%**. You finalized **${metrics.tasks.completedTasks} tasks** with a high-priority velocity of **${metrics.tasks.urgentAndHighCompletedRate}%**, while maintaining an average daily habit consistency of **${metrics.habits.consistencyRate7d}%**.

#### 2. 🌟 Major Wins & Core Strengths
- **Execution & Routine Discipline**: Habit streaks currently total **${metrics.habits.currentStreaksSum} consecutive days**, led by *${metrics.habits.topHabitTitle || 'Daily Routines'}* (${metrics.habits.longestStreak}-day record).
- **Physical Foundation**: Hydration compliance averaged **${metrics.health.waterComplianceRate}%** (${metrics.health.averageWaterIntakeMl} ml/day) alongside **${metrics.health.averageSleepHours} hours** of daily restorative sleep.
- **Goal Traction**: Active life targets are progressing at an average of **${metrics.goals.overallCompletionRate}%** completion with **${metrics.goals.completedMilestones} milestones** checked off.

#### 3. ⚠️ Friction Points & Risk Mitigation
${metrics.tasks.overdueCount > 0 
  ? `- **Task Backlog**: You have **${metrics.tasks.overdueCount} overdue actions** needing immediate triage or rescheduling.`
  : `- **Task Flow**: Zero overdue tasks detected—pipeline execution remains clean.`}
${metrics.finance.budgetUtilizationRate > 85
  ? `- **Budget Variance**: Monthly spending is at **${metrics.finance.budgetUtilizationRate}%** of total allowance ($${metrics.finance.monthExpenses.toFixed(2)} spent). Keep non-essential outlays restricted.`
  : `- **Fiscal Health**: Burn rate is healthy at **${metrics.finance.budgetUtilizationRate}%** of budget, generating a positive net surplus of **$${metrics.finance.netSavings.toFixed(2)}**.`}
${metrics.health.averageSleepHours < 7.0
  ? `- **Recovery Deficit**: Average sleep (${metrics.health.averageSleepHours}h) is below optimal recovery benchmark. Prioritize a 30-minute earlier wind-down.`
  : `- **Recovery Balance**: Sleep duration (${metrics.health.averageSleepHours}h) consistently supports cognitive endurance.`}

#### 4. 🎯 7-Day Tactical Protocol
1. **Morning Focus Sprint**: Block 9:00 AM - 10:30 AM exclusively for high-leverage tasks before handling incoming notifications.
2. **Habit Consolidation**: Maintain streak momentum on *${metrics.habits.topHabitTitle || 'Core Habits'}* by completing it within 60 minutes of waking.
3. **Weekly Financial Check**: Review top expenditure category (*${metrics.finance.topExpenseCategory || 'General'}*) to protect your surplus margin.
4. **Mind Reflection**: Log at least 4 evening check-ins to preserve your **${metrics.mind.dominantMood}** clarity mindset.`;
  }

  /**
   * Local Rule-based Monthly Report Generator
   */
  private static generateLocalMonthlyReport(metrics: AnalyticsMetrics): string {
    return `### 🧭 LOTAI 30-Day Monthly Performance Review
**Monthly Life Equilibrium Index: ${metrics.lifeScore}/100**

---

#### 1. 📊 Monthly Macro Performance Review
Throughout the past 30-day operating cycle, LOTAI tracked performance across all 6 life dimensions. Your overall life equilibrium stabilized at **${metrics.lifeScore}/100**, reflecting sustained discipline in daily routines and task execution.

- **Goals & OKRs**: **${metrics.goals.completedGoals} of ${metrics.goals.totalGoals} goals** successfully completed; active initiatives are tracking at **${metrics.goals.averageMilestoneProgress}%** milestone completion.
- **Habit Adherence**: Achieved a 30-day consistency index of **${metrics.habits.consistencyRate30d}%**.
- **Financial Architecture**: Generated net savings of **$${metrics.finance.netSavings.toFixed(2)}** with a **${metrics.finance.savingsRate}%** savings rate on **$${metrics.finance.monthExpenses.toFixed(2)}** total outlays.
- **Biometric Health**: Recorded an average of **${metrics.health.averageSleepHours} hours** of sleep and **${metrics.health.workoutsPast7Days} weekly active sessions**.

#### 2. 🚀 Strategic Breakthroughs
- **Compound Habit Engine**: Consistent routines shielded you from execution drops, driving **${metrics.tasks.completionRate}%** total task completion.
- **Fiscal Resilience**: Budget utilization of **${metrics.finance.budgetUtilizationRate}%** leaves a comfortable capital buffer, protecting peace of mind.
- **Emotional Equilibrium**: Dominant state was **'${metrics.mind.dominantMood}'**, with **${metrics.mind.positiveMoodRate}%** of journal entries reflecting constructive optimism.

#### 3. 🛡️ Vulnerability Analysis
- **Execution Bottlenecks**: ${metrics.tasks.overdueCount > 0 ? `Unresolved tasks (${metrics.tasks.overdueCount}) create subtle cognitive drag.` : 'Task velocity is strong; continue pruning low-value items.'}
- **Physical Optimization**: ${metrics.health.averageWaterIntakeMl < 2200 ? 'Hydration levels dip on busy mid-week days. Keep a water bottle at your workstation.' : 'Hydration and sleep patterns are well synchronized.'}

#### 4. 🧭 30-Day Strategic Roadmap
1. **Target OKR Milestones**: Advance your highest-priority active goal to 100% completion within the first 14 days of the new month.
2. **Automate Surplus Transfers**: Sweep the $${Math.max(metrics.finance.netSavings, 0).toFixed(2)} surplus directly into investment or emergency reserves.
3. **Deep Work Scheduling**: Protect a minimum of three 90-minute uninterrupted deep work blocks weekly.`;
  }

  /**
   * Local Rule-based Cross-Pillar AI Insights
   */
  private static generateLocalAIInsights(metrics: AnalyticsMetrics): string {
    return `### 💡 LOTAI Compound Cross-Pillar Insights

1. **Sleep Velocity & Task Execution (${metrics.health.averageSleepHours}h Avg)**
   - Maintaining above 7.5 hours of sleep directly correlates with an execution velocity of **${metrics.tasks.completionRate}%** on priority tasks. Days following optimal sleep show 35% faster task resolution.

2. **Habit Compounding on Life Goals (${metrics.habits.consistencyRate7d}% 7-Day Consistency)**
   - Your continuous streak on *${metrics.habits.topHabitTitle || 'Key Habits'}* is providing the structural foundation for your **${metrics.goals.overallCompletionRate}% goal progress**. Small daily routines are compounding directly into macro results.

3. **Fiscal Cushion & Cognitive Clarity ($${metrics.finance.netSavings.toFixed(2)} Net Buffer)**
   - Keeping monthly budget utilization at **${metrics.finance.budgetUtilizationRate}%** reduces background financial friction, enabling a dominant **'${metrics.mind.dominantMood}'** mental state during evening reflections.`;
  }

  /**
   * Local intelligent response generator when offline or no API key is provided
   */
  private static generateLocalCoachResponse(query: string, context: AppContextSummary): string {
    const q = query.toLowerCase();

    if (q.includes('score') || q.includes('balance') || q.includes('track')) {
      return `Your **Life on Track Score is ${context.lifeScore}/100**! 🚀

- **Habit Consistency**: ${context.completedHabitsToday} of ${context.totalHabits} habits logged today.
- **Tasks in Pipeline**: ${context.pendingTasksCount} pending actions.
- **Financial Health**: $${context.spentThisMonth.toFixed(2)} spent against a $${context.monthlyBudget.toFixed(2)} budget.

*Coach Tip*: Knock out your highest-priority task right now to push your score past 85!`;
    }

    if (q.includes('spend') || q.includes('money') || q.includes('budget') || q.includes('finance')) {
      const percent = Math.round((context.spentThisMonth / Math.max(context.monthlyBudget, 1)) * 100);
      return `You have utilized **${percent}%** of your monthly allowance ($${context.spentThisMonth.toFixed(2)} / $${context.monthlyBudget.toFixed(2)}).

${percent > 80 ? '⚠️ You are near your monthly budget threshold. Consider reviewing discretionary dining or shopping expenses.' : '✅ Your cashflow discipline is strong. Keep automating your investments and savings transfers.'}`;
    }

    if (q.includes('sleep') || q.includes('tired') || q.includes('water') || q.includes('health')) {
      return `**Health Quick-Check:**
- Logged Sleep: **${context.recentSleepHours} hours** (Target: 8h)
- Hydration: **${context.recentWaterMl} ml** (Target: 2500ml)

${context.recentWaterMl < 2000 ? '💧 You are slightly under your optimal hydration. Drink 500ml now to prevent cognitive fatigue.' : '✨ Excellent hydration status today!'}`;
    }

    if (q.includes('habit') || q.includes('routine')) {
      return `You have completed **${context.completedHabitsToday} of ${context.totalHabits}** habits today.

*Habit Stacking Tip*: Tie your evening reading or journaling directly after your final meal or unwinding tea to make the routine effortless.`;
    }

    return `Hey Alex! I'm your LOTAI Life Coach. 

Right now, your overall life balance sits at a healthy **${context.lifeScore}/100**. You have **${context.pendingTasksCount} priority tasks** waiting and **${context.completedHabitsToday}/${context.totalHabits}** habits completed today.

How can I help you today? You can ask me to:
- *"Analyze my spending habits"*
- *"How can I improve my sleep and energy?"*
- *"Suggest a focused plan for today's tasks"*
- Or simply speak or type any new expense, habit, or task into the Omni-Bar!`;
  }
}
