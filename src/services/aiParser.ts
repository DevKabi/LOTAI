import { ParsedIntentResult, FinanceCategory, TaskPriority, GoalCategory, JournalMood } from '../types';

export class AIParserService {
  /**
   * Intelligently parses user input (voice or typed) into structured intent and payloads
   */
  static parseInput(rawInput: string): ParsedIntentResult {
    const text = rawInput.trim();
    const lower = text.toLowerCase();

    // 1. Water Intake Check
    // e.g. "drank 500ml water", "had 2 glasses of water", "water 750 ml", "drank 1L water"
    if (lower.includes('water') || lower.includes('drank') || lower.includes('hydrated') || lower.includes('hydrate')) {
      let amountMl = 250; // default 1 glass
      const mlMatch = lower.match(/(\d+)\s*(ml|milliliters)/);
      const literMatch = lower.match(/(\d+(\.\d+)?)\s*(l|liters|litre)/);
      const glassMatch = lower.match(/(\d+)\s*(glass|glasses|cup|cups)/);
      const plainNumMatch = lower.match(/(\d+)\s*(water)/);

      if (mlMatch) {
        amountMl = parseInt(mlMatch[1], 10);
      } else if (literMatch) {
        amountMl = Math.round(parseFloat(literMatch[1]) * 1000);
      } else if (glassMatch) {
        amountMl = parseInt(glassMatch[1], 10) * 250;
      } else if (plainNumMatch) {
        amountMl = parseInt(plainNumMatch[1], 10);
      }

      return {
        intent: 'LOG_WATER',
        confidence: 0.95,
        summary: `Log ${amountMl}ml of water intake`,
        suggestedModule: 'health',
        payload: { amountMl }
      };
    }

    // 2. Sleep Logging Check
    // e.g. "slept 8 hours", "slept for 7.5 hrs feeling optimal", "sleep 6 hours"
    if (lower.includes('slept') || lower.includes('sleep')) {
      const hoursMatch = lower.match(/(\d+(\.\d+)?)\s*(h|hr|hrs|hour|hours)/);
      const hours = hoursMatch ? parseFloat(hoursMatch[1]) : 7.5;
      
      let quality: 'poor' | 'fair' | 'good' | 'optimal' = 'good';
      if (lower.includes('optimal') || lower.includes('amazing') || lower.includes('great') || lower.includes('refreshed')) {
        quality = 'optimal';
      } else if (lower.includes('poor') || lower.includes('bad') || lower.includes('terrible') || lower.includes('tired')) {
        quality = 'poor';
      } else if (lower.includes('fair') || lower.includes('okay') || lower.includes('decent')) {
        quality = 'fair';
      }

      return {
        intent: 'LOG_SLEEP',
        confidence: 0.92,
        summary: `Log ${hours} hours of sleep (${quality} quality)`,
        suggestedModule: 'health',
        payload: { hours, quality }
      };
    }

    // 3. Workout / Fitness Check
    // e.g. "worked out for 45 minutes", "ran 5km", "gym 60 mins", "did 30 min yoga"
    if (
      lower.includes('workout') || 
      lower.includes('worked out') || 
      lower.includes('ran ') || 
      lower.includes('run ') || 
      lower.includes('gym') || 
      lower.includes('cycling') || 
      lower.includes('swimming') ||
      lower.includes('yoga')
    ) {
      let minutes = 30;
      const minMatch = lower.match(/(\d+)\s*(m|min|mins|minute|minutes)/);
      const hrMatch = lower.match(/(\d+(\.\d+)?)\s*(h|hr|hrs|hour|hours)/);
      if (minMatch) {
        minutes = parseInt(minMatch[1], 10);
      } else if (hrMatch) {
        minutes = Math.round(parseFloat(hrMatch[1]) * 60);
      }

      let workoutType = 'Workout';
      if (lower.includes('run') || lower.includes('ran')) workoutType = 'Running';
      else if (lower.includes('gym') || lower.includes('lift') || lower.includes('weights')) workoutType = 'Strength Training';
      else if (lower.includes('yoga')) workoutType = 'Yoga';
      else if (lower.includes('cycling') || lower.includes('bike')) workoutType = 'Cycling';
      else if (lower.includes('swimming')) workoutType = 'Swimming';

      const estimatedCalories = Math.round(minutes * 7.5);

      return {
        intent: 'LOG_WORKOUT',
        confidence: 0.93,
        summary: `Log ${minutes} min ${workoutType} (~${estimatedCalories} kcal)`,
        suggestedModule: 'health',
        payload: { minutes, workoutType, estimatedCalories }
      };
    }

    // 4. Financial Income Check
    // e.g. "received $3000 salary", "got paid $450 for design", "income 200 freelance"
    const isIncome = lower.includes('received') || lower.includes('got paid') || lower.includes('income') || lower.includes('salary') || lower.includes('earned');
    const moneyMatch = text.match(/(?:\$|£|€|¥|₹)?\s*(\d+(?:\.\d{1,2})?)\s*(?:dollars|bucks|usd|eur|inr)?/i);

    if (isIncome && moneyMatch) {
      const amount = parseFloat(moneyMatch[1]);
      return {
        intent: 'ADD_FINANCE_INCOME',
        confidence: 0.94,
        summary: `Add Income of $${amount.toFixed(2)}`,
        suggestedModule: 'finance',
        payload: {
          amount,
          type: 'income',
          category: 'Salary & Earnings' as FinanceCategory,
          description: text.replace(/(received|got paid|income|salary|earned)/gi, '').trim() || 'Income',
          date: new Date().toISOString().split('T')[0]
        }
      };
    }

    // 5. Financial Expense Check
    // e.g. "spent $45 on groceries", "lunch $14.50", "bought book for $20", "coffee $4"
    const isExpense = lower.includes('spent') || lower.includes('bought') || lower.includes('paid') || lower.includes('cost') || lower.includes('expense') || moneyMatch !== null;
    
    // Check if it's explicitly a task (e.g. "Task: buy milk $5")
    const isExplicitTask = lower.startsWith('task') || lower.startsWith('todo') || lower.startsWith('remind me');

    if (isExpense && moneyMatch && !isExplicitTask) {
      const amount = parseFloat(moneyMatch[1]);
      let category: FinanceCategory = 'Other';

      if (/grocery|groceries|supermarket|market|whole foods|trader joe/i.test(lower)) {
        category = 'Shopping & Groceries';
      } else if (/lunch|dinner|breakfast|food|coffee|starbucks|restaurant|uber eats|doordash|sushi|pizza|cafe|burger/i.test(lower)) {
        category = 'Food & Dining';
      } else if (/rent|mortgage|apartment|lease/i.test(lower)) {
        category = 'Housing & Rent';
      } else if (/uber|lyft|taxi|gas|fuel|bus|metro|subway|train/i.test(lower)) {
        category = 'Transportation';
      } else if (/movie|cinema|netflix|spotify|game|concert|steam/i.test(lower)) {
        category = 'Entertainment';
      } else if (/doctor|medicine|pharmacy|dentist|health|supplement/i.test(lower)) {
        category = 'Health & Medical';
      } else if (/electricity|water bill|wifi|internet|aws|subscription/i.test(lower)) {
        category = 'Utilities';
      } else if (/invest|stocks|crypto|index fund|savings/i.test(lower)) {
        category = 'Investment & Savings';
      }

      // Clean up description
      let cleanDesc = text
        .replace(/spent|bought|paid|cost|for|on|\$/gi, '')
        .replace(new RegExp(amount.toString(), 'g'), '')
        .trim();
      
      if (!cleanDesc) cleanDesc = `${category} expense`;

      return {
        intent: 'ADD_FINANCE_EXPENSE',
        confidence: 0.92,
        summary: `Add Expense of $${amount.toFixed(2)} (${category})`,
        suggestedModule: 'finance',
        payload: {
          amount,
          type: 'expense',
          category,
          description: cleanDesc.charAt(0).toUpperCase() + cleanDesc.slice(1),
          date: new Date().toISOString().split('T')[0]
        }
      };
    }

    // 6. Habit Completion Check
    // e.g. "completed meditation", "did my morning workout", "finished reading", "did meditation habit"
    if (lower.startsWith('completed habit') || lower.startsWith('finished habit') || lower.includes('habit done') || lower.includes('did habit') || lower.includes('meditation done')) {
      const habitName = text.replace(/(completed habit|finished habit|habit done|did habit|done)/gi, '').trim();
      return {
        intent: 'COMPLETE_HABIT',
        confidence: 0.91,
        summary: `Mark habit completed: ${habitName || 'Daily Habit'}`,
        suggestedModule: 'habits',
        payload: { habitName }
      };
    }

    // 7. Goal Addition Check
    // e.g. "goal: Save $20,000 by end of year", "new goal: Run 10k"
    if (lower.startsWith('goal:') || lower.startsWith('new goal') || lower.startsWith('target:')) {
      const goalTitle = text.replace(/^(goal:|new goal:|new goal|target:)/i, '').trim();
      let category: GoalCategory = 'Personal';
      if (/save|money|invest|dollar|\$|budget|debt/i.test(lower)) category = 'Finance';
      else if (/run|marathon|weight|muscle|gym|fit|health/i.test(lower)) category = 'Health';
      else if (/career|job|promotion|launch|product|business|saas|client/i.test(lower)) category = 'Career';
      else if (/read|learn|study|exam|course|book|degree/i.test(lower)) category = 'Learning';

      return {
        intent: 'ADD_GOAL',
        confidence: 0.94,
        summary: `Create New Goal: "${goalTitle}" (${category})`,
        suggestedModule: 'goals',
        payload: {
          title: goalTitle,
          category,
          targetDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0]
        }
      };
    }

    // 8. Journal Entry Check
    // e.g. "journal: feeling calm and satisfied today", "feeling anxious about the presentation"
    if (
      lower.startsWith('journal:') || 
      lower.startsWith('reflection:') || 
      lower.startsWith('feeling ') || 
      lower.startsWith('i feel ') ||
      lower.startsWith('grateful for')
    ) {
      let mood: JournalMood = 'neutral';
      if (/happy|joy|great|amazing|proud|excited|blessed/i.test(lower)) mood = 'joyful';
      else if (/calm|peaceful|relaxed|serene|balanced/i.test(lower)) mood = 'calm';
      else if (/productive|flow|focused|accomplished|crushed/i.test(lower)) mood = 'productive';
      else if (/anxious|worried|stressed|overwhelmed|nervous/i.test(lower)) mood = 'anxious';
      else if (/tired|exhausted|drained|burnout/i.test(lower)) mood = 'tired';
      else if (/sad|down|unhappy|depressed/i.test(lower)) mood = 'sad';

      const journalContent = text.replace(/^(journal:|reflection:)/i, '').trim();

      return {
        intent: 'ADD_JOURNAL',
        confidence: 0.90,
        summary: `Save Journal Entry (Mood: ${mood})`,
        suggestedModule: 'journal',
        payload: {
          content: journalContent,
          mood,
          date: new Date().toISOString().split('T')[0],
          gratitude: lower.includes('grateful for') ? journalContent : ''
        }
      };
    }

    // 9. Life Coach Question / Inquiry
    // e.g. "How is my life balance?", "Why is my sleep low?", "Analyze my spending"
    if (
      lower.startsWith('how') || 
      lower.startsWith('why') || 
      lower.startsWith('what') || 
      lower.startsWith('analyze') || 
      lower.startsWith('coach') || 
      lower.endsWith('?') ||
      lower.includes('advice')
    ) {
      return {
        intent: 'COACH_QUESTION',
        confidence: 0.88,
        summary: `Ask AI Life Coach: "${text}"`,
        suggestedModule: 'analytics',
        payload: { question: text }
      };
    }

    // 10. Default / Fallback: Create Task
    // e.g. "Call the doctor", "Need to finish slides", "task: send report"
    let priority: TaskPriority = 'medium';
    if (/urgent|asap|critical|emergency|immediately/i.test(lower)) {
      priority = 'urgent';
    } else if (/high priority|important|must do|vital/i.test(lower)) {
      priority = 'high';
    } else if (/low priority|someday|whenever|optional/i.test(lower)) {
      priority = 'low';
    }

    const cleanTaskTitle = text
      .replace(/^(task:|todo:|remind me to|need to|remember to)/i, '')
      .replace(/(urgent|asap|high priority|low priority)/gi, '')
      .trim();

    return {
      intent: 'ADD_TASK',
      confidence: 0.85,
      summary: `Add Task: "${cleanTaskTitle}" (${priority} priority)`,
      suggestedModule: 'tasks',
      payload: {
        title: cleanTaskTitle.charAt(0).toUpperCase() + cleanTaskTitle.slice(1),
        priority,
        dueDate: new Date().toISOString().split('T')[0],
        category: 'Personal' as GoalCategory
      }
    };
  }
}
