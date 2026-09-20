import { 
  OmniCaptureResult, 
  ConfidenceTier, 
  FinanceSubType, 
  FinanceCategory, 
  GoalCategory, 
  TaskPriority, 
  JournalMood 
} from '../types';
import { autoCategorizeTransaction } from './financeTaxonomy';

export class IntentRouter {
  /**
   * Main Router: Classifies user input using strict priority arbitration rules
   */
  static routeInput(rawInput: string): OmniCaptureResult {
    const text = rawInput.trim();
    if (!text) {
      return this.createEmptyResult();
    }

    const lower = text.toLowerCase();
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

    // Helper: Detect currency
    const detectedCurrency = this.detectCurrency(lower);

    // ========================================================================
    // PRIORITY RULE 1: MONEY / FINANCIAL MOVEMENT (Classify FINANCE FIRST!)
    // Must be evaluated BEFORE Health/Workout or Tasks to prevent bugs like:
    // - "today my transportation expense 700 rupees" -> NOT workout
    // - "Hospital expense ₹5000" -> NOT task
    // ========================================================================
    const financeCandidate = this.evaluateFinanceRule(text, lower, todayStr, detectedCurrency);
    if (financeCandidate) {
      return financeCandidate;
    }

    // ========================================================================
    // PRIORITY RULE 2: PHYSICAL BIOMETRICS & HEALTH (Vitals, Water, Sleep, Workout)
    // Uses strict whole-word boundaries so 'transportation' never matches 'ran'!
    // ========================================================================
    const healthCandidate = this.evaluateHealthRule(text, lower, todayStr);
    if (healthCandidate) {
      return healthCandidate;
    }

    // ========================================================================
    // PRIORITY RULE 3: RECURRING FREQUENCY & HABITS
    // ========================================================================
    const habitCandidate = this.evaluateHabitRule(text, lower, todayStr);
    if (habitCandidate) {
      return habitCandidate;
    }

    // ========================================================================
    // PRIORITY RULE 4: FUTURE ACTION ITEMS & TASKS
    // ========================================================================
    const taskCandidate = this.evaluateTaskRule(text, lower, todayStr, tomorrowStr);
    if (taskCandidate) {
      return taskCandidate;
    }

    // ========================================================================
    // PRIORITY RULE 5: MACRO LONG-TERM OUTCOMES & GOALS
    // ========================================================================
    const goalCandidate = this.evaluateGoalRule(text, lower, detectedCurrency);
    if (goalCandidate) {
      return goalCandidate;
    }

    // ========================================================================
    // PRIORITY RULE 6: REFLECTIONS, FEELINGS & JOURNAL
    // ========================================================================
    const journalCandidate = this.evaluateJournalRule(text, lower, todayStr);
    if (journalCandidate) {
      return journalCandidate;
    }

    // ========================================================================
    // PRIORITY RULE 7: IDEAS, CONCEPTS & MIND NOTES
    // ========================================================================
    const mindNoteCandidate = this.evaluateMindNotesRule(text, lower, todayStr);
    if (mindNoteCandidate) {
      return mindNoteCandidate;
    }

    // ========================================================================
    // FALLBACK / LOW CONFIDENCE ARBITRATION (< 70%)
    // Trigger user prompt: "Should I save this as a Task, Journal, or Mind Note?"
    // ========================================================================
    return this.createLowConfidenceFallback(text, todayStr);
  }

  // --------------------------------------------------------------------------
  // RULE 1: Finance Evaluation
  // --------------------------------------------------------------------------
  private static evaluateFinanceRule(
    text: string, 
    lower: string, 
    todayStr: string, 
    currencySymbol: string
  ): OmniCaptureResult | null {
    // If the input explicitly declares a goal (e.g. "Create a goal to reach ₹1 crore revenue", "Goal: Save 10 lakhs")
    // do not treat as an immediate daily financial transaction!
    if (/^(create a goal|set a goal|new goal:|goal:|goal to|i want to earn|i want to reach)\b/i.test(lower)) {
      return null;
    }

    // Financial indicator keywords
    const hasCurrencySymbol = /[₹$€£¥]|\b(rs\.?|inr|usd|eur|gbp|aed|rupees?)\b/i.test(lower);
    const hasFinanceKeywords = /\b(expense|expenses|spent|spend|spending|bought|purchased|paid|pay|cost|bill|receipt|received|got paid|credited|earned|salary|bonus|dividend|loan|emi|installment|invested|investment|mutual fund|sip|stocks|shares|savings|transferred|groceries|transportation|petrol|fuel|rent|hospital expense|cashback)\b/i.test(lower);

    // Extract numeric amount
    const amount = this.extractNumericAmount(text);

    if (!hasFinanceKeywords && !hasCurrencySymbol) {
      return null;
    }

    // If there's an amount OR strong financial action verb
    if (amount !== null || hasFinanceKeywords) {
      const isIncome = /\b(received|got paid|salary|credited|earned|bonus|dividend|cashback|inflow)\b/i.test(lower);
      const isInvestment = /\b(invested|investment|sip|mutual fund|stocks|shares|crypto|portfolio|bonds)\b/i.test(lower);
      const isLoanOrEmi = /\b(emi|loan|home loan|car loan|personal loan|installment|mortgage)\b/i.test(lower);
      const isTransfer = /\b(transferred|transfer|wire|sent money)\b/i.test(lower);
      const isSavings = /\b(savings|saved money|transferred to savings)\b/i.test(lower);

      let financeSubType: FinanceSubType = 'expense';
      let title = 'Expense Saved';
      let intent: any = 'ADD_FINANCE_EXPENSE';

      if (isIncome) {
        financeSubType = 'income';
        title = 'Income Recorded';
        intent = 'ADD_FINANCE_INCOME';
      } else if (isInvestment) {
        financeSubType = 'investment';
        title = 'Investment Logged';
        intent = 'ADD_FINANCE_INVESTMENT';
      } else if (isLoanOrEmi) {
        financeSubType = isLoanOrEmi ? 'emi' : 'loan';
        title = 'EMI / Loan Recorded';
        intent = 'ADD_FINANCE_LOAN_EMI';
      } else if (isTransfer) {
        financeSubType = 'transfer';
        title = 'Transfer Recorded';
        intent = 'ADD_FINANCE_EXPENSE';
      } else if (isSavings) {
        financeSubType = 'savings';
        title = 'Savings Saved';
        intent = 'ADD_FINANCE_INVESTMENT';
      }

      // Determine Finance Category & Subcategory using structured taxonomy
      const autoCat = autoCategorizeTransaction(text, financeSubType === 'income' ? 'income' : 'expense');
      const category: FinanceCategory = (autoCat?.category as FinanceCategory) || this.detectFinanceCategory(lower, financeSubType);
      const subcategory = autoCat?.subcategory;

      // Clean item title / description
      let cleanDescription = text
        .replace(/^(today|yesterday|just|please|log|record)\b/gi, '')
        .replace(/\b(my transportation expense|transportation expense|expense|spent|bought|paid|received|got paid|salary|credited|emi|loan)\b/gi, '')
        .replace(/[₹$€£¥]|\b(rs\.?|inr|usd|rupees?|rupee)\b/gi, '')
        .replace(/[\d,.]+/g, '')
        .trim();

      if (!cleanDescription || cleanDescription.length < 2) {
        if (/transportation|petrol|fuel|uber|ola|cab/i.test(lower)) cleanDescription = 'Transportation Expense';
        else if (/hospital|doctor|medicine|medical/i.test(lower)) cleanDescription = 'Hospital Expense';
        else if (/grocery|groceries|supermarket/i.test(lower)) cleanDescription = 'Grocery Shopping';
        else if (/lunch|dinner|breakfast|food/i.test(lower)) cleanDescription = 'Meal Expense';
        else if (isLoanOrEmi) cleanDescription = 'Loan EMI Payment';
        else if (isInvestment) cleanDescription = 'SIP Investment';
        else if (isIncome) cleanDescription = 'Client / Salary Income';
        else cleanDescription = subcategory || category;
      }
      cleanDescription = cleanDescription.charAt(0).toUpperCase() + cleanDescription.slice(1);

      const resolvedAmount = amount || 0;
      const formattedAmount = `${currencySymbol}${resolvedAmount.toLocaleString()}`;

      let summaryText = `Spent ${formattedAmount} on ${cleanDescription}`;
      if (subcategory) {
        summaryText = `Spent ${formattedAmount} on ${subcategory} (${category})`;
      } else if (financeSubType === 'income') {
        summaryText = `Received ${formattedAmount} (${category})`;
      } else if (financeSubType === 'investment') {
        summaryText = `Invested ${formattedAmount} in ${cleanDescription}`;
      } else if (financeSubType === 'emi') {
        summaryText = `Paid ${formattedAmount} for ${cleanDescription}`;
      }

      const baseConfidence = resolvedAmount > 0 ? 0.96 : 0.88;
      const confidence = autoCat ? Math.max(autoCat.confidence, baseConfidence) : baseConfidence;
      const confidenceTier: ConfidenceTier = confidence >= 0.90 ? 'high' : 'medium';

      return {
        id: 'capture-' + Date.now(),
        rawInput: text,
        module: 'finance',
        masterCategory: 'FINANCE',
        destinationTable: 'finance_transactions',
        intent,
        confidence,
        confidenceTier,
        isUncertain: false,
        title,
        summary: summaryText,
        fields: {
          masterCategory: 'FINANCE',
          destinationTable: 'finance_transactions',
          amount: resolvedAmount,
          transactionType: financeSubType === 'income' ? 'income' : 'expense',
          financeSubType,
          category,
          subcategory,
          aiConfidence: confidence,
          isAiCategorized: !!autoCat,
          description: cleanDescription,
          currencySymbol,
          date: todayStr
        }
      };
    }

    return null;
  }

  // --------------------------------------------------------------------------
  // RULE 2: Health & Fitness Evaluation
  // --------------------------------------------------------------------------
  private static evaluateHealthRule(
    text: string, 
    lower: string, 
    todayStr: string
  ): OmniCaptureResult | null {
    // 1. Weight Check
    const weightMatch = lower.match(/\b(?:weight|weighed|weigh|wt)\s*(?:is|was|:)?\s*(\d+(?:\.\d+)?)\s*(?:kg|kgs|kilos|kilo|lbs)?\b/i) ||
                        lower.match(/\b(\d+(?:\.\d+)?)\s*(?:kg|kgs|kilos)\s*(?:weight)\b/i);
    if (weightMatch) {
      const weightKg = parseFloat(weightMatch[1]);
      return {
        id: 'capture-' + Date.now(),
        rawInput: text,
        module: 'health',
        masterCategory: 'HEALTH_FITNESS',
        destinationTable: 'health_logs',
        intent: 'LOG_WEIGHT',
        confidence: 0.96,
        confidenceTier: 'high',
        isUncertain: false,
        title: 'Weight Logged',
        summary: `Body weight recorded: ${weightKg} kg`,
        fields: {
          masterCategory: 'HEALTH_FITNESS',
          destinationTable: 'health_logs',
          healthMetricType: 'weight',
          weightKg,
          date: todayStr,
          category: 'Vitals',
          description: `Body weight measurement: ${weightKg} kg`
        }
      };
    }

    // 2. Hydration Check
    if (/\b(water|hydration|drank)\b/i.test(lower)) {
      let amountMl = 250;
      const mlMatch = lower.match(/(\d+)\s*(ml|milliliters)/i);
      const literMatch = lower.match(/(\d+(?:\.\d+)?)\s*(l|liters|litre)/i);
      const glassMatch = lower.match(/(\d+)\s*(glass|glasses|cup|cups)/i);
      if (mlMatch) amountMl = parseInt(mlMatch[1], 10);
      else if (literMatch) amountMl = Math.round(parseFloat(literMatch[1]) * 1000);
      else if (glassMatch) amountMl = parseInt(glassMatch[1], 10) * 250;

      return {
        id: 'capture-' + Date.now(),
        rawInput: text,
        module: 'health',
        masterCategory: 'HEALTH_FITNESS',
        destinationTable: 'health_logs',
        intent: 'LOG_WATER',
        confidence: 0.95,
        confidenceTier: 'high',
        isUncertain: false,
        title: 'Hydration Logged',
        summary: `Added ${amountMl} ml of water intake`,
        fields: {
          masterCategory: 'HEALTH_FITNESS',
          destinationTable: 'health_logs',
          healthMetricType: 'water',
          waterIntakeMl: amountMl,
          date: todayStr,
          category: 'Hydration'
        }
      };
    }

    // 3. Sleep Check
    if (/\b(slept|sleep)\b/i.test(lower)) {
      const hoursMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:h|hr|hrs|hour|hours)/i);
      const hours = hoursMatch ? parseFloat(hoursMatch[1]) : 7.5;
      let quality: 'poor' | 'fair' | 'good' | 'optimal' = 'good';
      if (/optimal|great|refreshed|amazing|fantastic|deep/.test(lower)) quality = 'optimal';
      else if (/poor|terrible|bad|exhausted|rough|tired/.test(lower)) quality = 'poor';
      else if (/fair|okay|decent/.test(lower)) quality = 'fair';

      return {
        id: 'capture-' + Date.now(),
        rawInput: text,
        module: 'health',
        masterCategory: 'HEALTH_FITNESS',
        destinationTable: 'health_logs',
        intent: 'LOG_SLEEP',
        confidence: 0.95,
        confidenceTier: 'high',
        isUncertain: false,
        title: 'Sleep Logged',
        summary: `Recorded ${hours}h sleep (${quality} quality)`,
        fields: {
          masterCategory: 'HEALTH_FITNESS',
          destinationTable: 'health_logs',
          healthMetricType: 'sleep',
          sleepHours: hours,
          sleepQuality: quality,
          date: todayStr,
          category: 'Rest'
        }
      };
    }

    // 4. Blood Pressure Check
    const bpMatch = lower.match(/\b(?:bp|blood pressure)\s*(?:is|reading|:)?\s*(\d{2,3}\s*\/\s*\d{2,3})/i) ||
                    lower.match(/\b(\d{2,3}\s*\/\s*\d{2,3})\s*(?:mmhg|bp)/i);
    if (bpMatch) {
      const bpVal = bpMatch[1].replace(/\s+/g, '');
      return {
        id: 'capture-' + Date.now(),
        rawInput: text,
        module: 'health',
        masterCategory: 'HEALTH_FITNESS',
        destinationTable: 'health_logs',
        intent: 'LOG_BP',
        confidence: 0.96,
        confidenceTier: 'high',
        isUncertain: false,
        title: 'Blood Pressure Logged',
        summary: `Recorded BP: ${bpVal} mmHg`,
        fields: {
          masterCategory: 'HEALTH_FITNESS',
          destinationTable: 'health_logs',
          healthMetricType: 'bp',
          bloodPressure: bpVal,
          date: todayStr,
          category: 'Vitals'
        }
      };
    }

    // 5. Steps Check
    const stepsMatch = lower.match(/\b(\d[\d,]*)\s*(?:steps|walked steps)\b/i) ||
                        lower.match(/\bwalked\s+(\d[\d,]*)\s*steps\b/i);
    if (stepsMatch) {
      const steps = parseInt(stepsMatch[1].replace(/,/g, ''), 10);
      return {
        id: 'capture-' + Date.now(),
        rawInput: text,
        module: 'health',
        masterCategory: 'HEALTH_FITNESS',
        destinationTable: 'health_logs',
        intent: 'LOG_STEPS',
        confidence: 0.95,
        confidenceTier: 'high',
        isUncertain: false,
        title: 'Steps Recorded',
        summary: `Walked ${steps.toLocaleString()} steps today`,
        fields: {
          masterCategory: 'HEALTH_FITNESS',
          destinationTable: 'health_logs',
          healthMetricType: 'steps',
          steps,
          date: todayStr,
          category: 'Activity'
        }
      };
    }

    // 6. Workout / Exercise Check (Strict whole word boundaries: \bran\b, \bgym\b)
    const isWorkout = /\b(workout|worked out|gym|exercise|yoga|cycling|swimming|pilates|hiit|crossfit|lifted|jog|jogging|pushups)\b/i.test(lower) ||
                      /\b(ran|running)\b/i.test(lower);

    if (isWorkout) {
      let minutes = 30;
      const minMatch = lower.match(/(\d+)\s*(?:m|min|mins|minute|minutes)\b/i);
      if (minMatch) minutes = parseInt(minMatch[1], 10);

      let workoutType = 'Workout';
      if (/\b(ran|running)\b/i.test(lower)) workoutType = 'Running';
      else if (/\b(gym|strength|lifted)\b/i.test(lower)) workoutType = 'Strength Training';
      else if (/\b(yoga)\b/i.test(lower)) workoutType = 'Yoga';
      else if (/\b(cycling|bike)\b/i.test(lower)) workoutType = 'Cycling';
      else if (/\b(swimming|laps)\b/i.test(lower)) workoutType = 'Swimming';
      else if (/\b(hiit)\b/i.test(lower)) workoutType = 'HIIT Training';
      else if (/\b(pilates)\b/i.test(lower)) workoutType = 'Pilates';

      const caloriesMatch = lower.match(/(\d+)\s*(?:calories|kcal|cal)\b/i);
      const caloriesBurned = caloriesMatch ? parseInt(caloriesMatch[1], 10) : Math.round(minutes * 7.5);

      return {
        id: 'capture-' + Date.now(),
        rawInput: text,
        module: 'health',
        masterCategory: 'HEALTH_FITNESS',
        destinationTable: 'health_logs',
        intent: 'LOG_WORKOUT',
        confidence: 0.94,
        confidenceTier: 'high',
        isUncertain: false,
        title: 'Workout Recorded',
        summary: `Logged ${minutes}m ${workoutType} (~${caloriesBurned} kcal)`,
        fields: {
          masterCategory: 'HEALTH_FITNESS',
          destinationTable: 'health_logs',
          healthMetricType: 'workout',
          workoutMinutes: minutes,
          workoutType,
          caloriesBurned,
          date: todayStr,
          category: 'Fitness'
        }
      };
    }

    return null;
  }

  // --------------------------------------------------------------------------
  // RULE 3: Habits Evaluation
  // --------------------------------------------------------------------------
  private static evaluateHabitRule(
    text: string, 
    lower: string, 
    todayStr: string
  ): OmniCaptureResult | null {
    const isHabitCadence = /\b(daily|every day|every morning|every night|every evening|routine|habit|habit completed|completed habit|streak)\b/i.test(lower);
    const isCompletedHabit = /\b(completed meditation|finished meditation|meditation today|did meditation|reading habit|daily routine|completed streak)\b/i.test(lower);

    if (isHabitCadence || isCompletedHabit) {
      let habitName = text
        .replace(/^(completed|finished|did|maintain|check off|habit check-in:)\s*/gi, '')
        .replace(/\b(daily|every day|every morning|every night|routine|habit|today|streak)\b/gi, '')
        .trim();

      if (!habitName || habitName.length < 2) {
        if (/meditation/i.test(lower)) habitName = 'Meditation';
        else if (/reading|pages|book/i.test(lower)) habitName = 'Daily Reading';
        else if (/water/i.test(lower)) habitName = 'Hydration Routine';
        else if (/gym|workout|pushups/i.test(lower)) habitName = 'Daily Fitness';
        else if (/code|coding|leetcode/i.test(lower)) habitName = 'Coding Practice';
        else habitName = 'Daily Habit';
      }
      habitName = habitName.charAt(0).toUpperCase() + habitName.slice(1);

      return {
        id: 'capture-' + Date.now(),
        rawInput: text,
        module: 'habits',
        masterCategory: 'HABITS',
        destinationTable: 'habits',
        intent: 'COMPLETE_HABIT',
        confidence: 0.94,
        confidenceTier: 'high',
        isUncertain: false,
        title: 'Habit Completed',
        summary: `Marked "${habitName}" habit completed today`,
        fields: {
          masterCategory: 'HABITS',
          destinationTable: 'habits',
          habitName,
          isCompleted: true,
          frequency: 'daily',
          date: todayStr,
          category: 'Personal'
        }
      };
    }

    return null;
  }

  // --------------------------------------------------------------------------
  // RULE 4: Tasks Evaluation
  // --------------------------------------------------------------------------
  private static evaluateTaskRule(
    text: string, 
    lower: string, 
    todayStr: string, 
    tomorrowStr: string
  ): OmniCaptureResult | null {
    const isTomorrow = /\btomorrow\b/i.test(lower);
    const hasDeadline = /\b(by friday|by monday|by tuesday|by wednesday|by thursday|by sunday|by saturday|tonight|before midnight|deadline|due)\b/i.test(lower);
    const hasTaskAction = /^(task:|todo:|remind me to|schedule|call|submit|send|email|review|fix|book|order|pick up|draft|clean|cancel|prepare|organize)\b/i.test(lower);

    if (isTomorrow || hasDeadline || hasTaskAction) {
      const dueDate = isTomorrow ? tomorrowStr : todayStr;

      let priority: TaskPriority = 'medium';
      if (/\b(urgent|asap|critical|immediate|emergency)\b/i.test(lower)) priority = 'urgent';
      else if (/\b(high priority|important|client|prospects|leadership)\b/i.test(lower)) priority = 'high';
      else if (/\b(low priority|whenever|someday|minor)\b/i.test(lower)) priority = 'low';

      let cleanTitle = text
        .replace(/^(task:|todo:|remind me to|urgent:|high priority:)\s*/gi, '')
        .replace(/\btomorrow\b/gi, '')
        .trim();
      cleanTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);

      return {
        id: 'capture-' + Date.now(),
        rawInput: text,
        module: 'tasks',
        masterCategory: 'TASKS',
        destinationTable: 'tasks',
        intent: 'ADD_TASK',
        confidence: isTomorrow || hasDeadline ? 0.93 : 0.90,
        confidenceTier: 'high',
        isUncertain: false,
        title: 'Task Created',
        summary: `${cleanTitle} (Due: ${isTomorrow ? 'Tomorrow' : 'Today'}, Priority: ${priority})`,
        fields: {
          masterCategory: 'TASKS',
          destinationTable: 'tasks',
          title: cleanTitle || text,
          priority,
          dueDate,
          category: /\b(prospects|client|work|office|code|project|lead|sales)\b/i.test(lower) ? 'Career' : 'Personal'
        }
      };
    }

    return null;
  }

  // --------------------------------------------------------------------------
  // RULE 5: Goals Evaluation
  // --------------------------------------------------------------------------
  private static evaluateGoalRule(
    text: string, 
    lower: string, 
    currencySymbol: string
  ): OmniCaptureResult | null {
    const isGoalPhrase = lower.startsWith('goal') || 
                         lower.startsWith('create a goal') || 
                         lower.startsWith('set a goal') ||
                         lower.startsWith('new goal') ||
                         /\b(want to earn|want to reach|want to achieve|retire early|financial independence|marathon next year|by 2026|by 2027|by 2028|by 2030)\b/i.test(lower);

    if (isGoalPhrase) {
      let cleanGoal = text
        .replace(/^(create a goal to|create a goal|set a goal to|set a goal|new goal:|goal:|goal to|i want to)\s*/gi, '')
        .trim();
      cleanGoal = cleanGoal.charAt(0).toUpperCase() + cleanGoal.slice(1);

      let category: GoalCategory = 'Career';
      if (/\b(revenue|crore|lakh|earn|save|money|net worth|portfolio|portfolio)\b/i.test(lower)) category = 'Finance';
      else if (/\b(weight|muscle|lose|marathon|triathlon|fit|fat)\b/i.test(lower)) category = 'Health';
      else if (/\b(learn|study|degree|exam|course|read|spanish|language)\b/i.test(lower)) category = 'Learning';

      // Target metric extraction
      let targetMetric: string | undefined = undefined;
      const croreMatch = cleanGoal.match(/(\d+(?:\.\d+)?)\s*(?:cr|crore|crores)/i);
      if (croreMatch) {
        targetMetric = `${currencySymbol}${croreMatch[1]} Crore (${currencySymbol}${(parseFloat(croreMatch[1]) * 10000000).toLocaleString()})`;
      }

      return {
        id: 'capture-' + Date.now(),
        rawInput: text,
        module: 'goals',
        masterCategory: 'GOALS',
        destinationTable: 'goals',
        intent: 'ADD_GOAL',
        confidence: 0.94,
        confidenceTier: 'high',
        isUncertain: false,
        title: 'Goal Created',
        summary: `New Life Goal: "${cleanGoal}"`,
        fields: {
          masterCategory: 'GOALS',
          destinationTable: 'goals',
          title: cleanGoal,
          category,
          targetMetric,
          targetDate: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
          milestones: [
            `Define initial roadmap for ${cleanGoal}`,
            `Reach 50% midpoint milestone`,
            `Achieve target standard`
          ]
        }
      };
    }

    return null;
  }

  // --------------------------------------------------------------------------
  // RULE 6: Journal Evaluation
  // --------------------------------------------------------------------------
  private static evaluateJournalRule(
    text: string, 
    lower: string, 
    todayStr: string
  ): OmniCaptureResult | null {
    const isJournal = /\b(felt productive|i feel|feeling|today was|grateful for|gratitude|journal|reflection|mindset|proud of|overwhelmed|peaceful|joyful|exhausted|dealing with)\b/i.test(lower);

    if (isJournal) {
      let mood: JournalMood = 'neutral';
      if (/\b(productive|closed|accomplished|crushed|flow|executed|focus|focused)\b/i.test(lower)) mood = 'productive';
      else if (/\b(joy|joyful|happy|great|amazing|awesome|blessed|grateful)\b/i.test(lower)) mood = 'joyful';
      else if (/\b(calm|peaceful|serene|balanced|centered|quiet)\b/i.test(lower)) mood = 'calm';
      else if (/\b(anxious|worried|stressed|nervous|overwhelmed|frustrated)\b/i.test(lower)) mood = 'anxious';
      else if (/\b(tired|exhausted|drained|sleepy)\b/i.test(lower)) mood = 'tired';

      const tags = ['daily-reflection'];
      if (/\b(client|sales|work|team|pressure)\b/i.test(lower)) tags.push('career');
      if (/\b(family|friend|friends)\b/i.test(lower)) tags.push('relationships');
      if (mood === 'productive') tags.push('deep-work');

      return {
        id: 'capture-' + Date.now(),
        rawInput: text,
        module: 'journal',
        masterCategory: 'JOURNAL',
        destinationTable: 'journal_entries',
        intent: 'ADD_JOURNAL',
        confidence: 0.93,
        confidenceTier: 'high',
        isUncertain: false,
        title: 'Reflection Saved',
        summary: `Logged reflection (Mood: ${mood})`,
        fields: {
          masterCategory: 'JOURNAL',
          destinationTable: 'journal_entries',
          content: text,
          mood,
          tags,
          date: todayStr,
          gratitude: lower.includes('grateful') || lower.includes('gratitude') ? text : undefined
        }
      };
    }

    return null;
  }

  // --------------------------------------------------------------------------
  // RULE 7: Mind Notes Evaluation
  // --------------------------------------------------------------------------
  private static evaluateMindNotesRule(
    text: string, 
    lower: string, 
    todayStr: string
  ): OmniCaptureResult | null {
    const isMindNote = /\b(startup idea|saas concept|saas idea|podcast topic|business idea|business concept|thought:|concept:|book title|video concept|app feature idea|brainstorm|note to self|idea:)\b/i.test(lower);

    if (isMindNote) {
      let category = 'Idea';
      if (/startup|business/i.test(lower)) category = 'Startup Idea';
      else if (/saas|app feature/i.test(lower)) category = 'SaaS';
      else if (/podcast|keynote|newsletter/i.test(lower)) category = 'Podcast';
      else if (/thought|note to self/i.test(lower)) category = 'Thought';
      else if (/concept|video|design/i.test(lower)) category = 'Concept';

      let cleanTitle = text
        .replace(/^(ai startup idea:|startup idea:|saas concept:|podcast topic:|business idea:|thought:|concept:|book title idea:|video concept:|app feature idea:|note to self:)\s*/gi, '')
        .trim();
      cleanTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);

      return {
        id: 'capture-' + Date.now(),
        rawInput: text,
        module: 'journal',
        masterCategory: 'MIND_NOTES',
        destinationTable: 'mind_notes',
        intent: 'ADD_MIND_NOTE',
        confidence: 0.93,
        confidenceTier: 'high',
        isUncertain: false,
        title: 'Mind Note Captured',
        summary: `${category}: "${cleanTitle.slice(0, 50)}${cleanTitle.length > 50 ? '...' : ''}"`,
        fields: {
          masterCategory: 'MIND_NOTES',
          destinationTable: 'mind_notes',
          mindNoteCategory: category,
          title: cleanTitle || text,
          content: text,
          tags: ['mind-note', category.toLowerCase().replace(/\s+/g, '-')],
          date: todayStr
        }
      };
    }

    return null;
  }

  // --------------------------------------------------------------------------
  // Low Confidence (< 70%) Disambiguation Builder
  // --------------------------------------------------------------------------
  private static createLowConfidenceFallback(text: string, todayStr: string): OmniCaptureResult {
    // Determine the most plausible guess based on length
    const words = text.split(/\s+/);
    const isVeryShort = words.length <= 3;

    return {
      id: 'capture-' + Date.now(),
      rawInput: text,
      module: 'tasks',
      masterCategory: 'TASKS',
      destinationTable: 'tasks',
      intent: 'ADD_TASK',
      confidence: isVeryShort ? 0.60 : 0.68,
      confidenceTier: 'low',
      isUncertain: true,
      suggestedCategories: ['TASKS', 'JOURNAL', 'MIND_NOTES'],
      uncertainReason: 'Should I save this as a Task, Journal, or Mind Note?',
      title: 'Choose Category to Save',
      summary: `Input needs category verification: "${text}"`,
      fields: {
        masterCategory: 'TASKS',
        destinationTable: 'tasks',
        title: text.charAt(0).toUpperCase() + text.slice(1),
        priority: 'medium',
        dueDate: todayStr,
        content: text,
        date: todayStr
      }
    };
  }

  // --------------------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------------------
  private static detectCurrency(lower: string): string {
    if (lower.includes('₹') || lower.includes('rs') || lower.includes('inr') || lower.includes('rupee')) return '₹';
    if (lower.includes('$') || lower.includes('usd')) return '$';
    if (lower.includes('€') || lower.includes('eur')) return '€';
    if (lower.includes('£') || lower.includes('gbp')) return '£';
    if (lower.includes('aed') || lower.includes('dirham')) return 'AED';
    if (lower.includes('¥') || lower.includes('yen')) return '¥';
    return '₹';
  }

  private static detectFinanceCategory(lower: string, subType: FinanceSubType): FinanceCategory {
    if (subType === 'income') return 'Salary';
    if (subType === 'investment' || subType === 'savings') return 'Investments & Savings';
    if (subType === 'emi' || subType === 'loan') return 'Financial Obligations';

    if (/lunch|dinner|breakfast|food|coffee|restaurant|cafe|burger|pizza|sushi|subway|biryani/i.test(lower)) {
      return 'Food & Dining';
    } else if (/grocery|groceries|supermarket|vegetables|milk|supplies/i.test(lower)) {
      return 'Food & Dining';
    } else if (/uber|ola|cab|taxi|gas|petrol|fuel|bus|metro|auto|transportation|flight/i.test(lower)) {
      return 'Transportation';
    } else if (/rent|maintenance|wifi|electricity|water bill/i.test(lower)) {
      return 'Housing & Utilities';
    } else if (/doctor|medicine|tablets|pharmacy|clinic|hospital/i.test(lower)) {
      return 'Health & Medical';
    } else if (/movie|netflix|game|cinema|entertainment|spotify/i.test(lower)) {
      return 'Entertainment';
    } else if (/bill|recharge|broadband/i.test(lower)) {
      return 'Housing & Utilities';
    }
    return 'Miscellaneous';
  }

  private static extractNumericAmount(text: string): number | null {
    const lower = text.toLowerCase();

    // Crore
    const croreMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:cr|crore|crores)\b/i);
    if (croreMatch) return Math.round(parseFloat(croreMatch[1]) * 10000000);

    // Lakh
    const lakhMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs)\b/i);
    if (lakhMatch) return Math.round(parseFloat(lakhMatch[1]) * 100000);

    // Thousand (k)
    const kMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:k|thousand)\b/i);
    if (kMatch) return Math.round(parseFloat(kMatch[1]) * 1000);

    // Currency prefixed/suffixed numbers: e.g. "₹500", "700 rupees", "expense 700", "₹5000", "$45.50"
    const prefixMatch = text.match(/(?:₹|rs\.?|inr|\$|€|£|aed|¥)\s*([\d,]+(?:\.\d+)?)/i);
    if (prefixMatch && prefixMatch[1]) {
      const val = parseFloat(prefixMatch[1].replace(/,/g, ''));
      if (!isNaN(val) && val > 0) return val;
    }

    const suffixMatch = text.match(/([\d,]+(?:\.\d+)?)\s*(?:₹|rs\.?|inr|usd|rupees?|rupee|dollars?|euros?)/i);
    if (suffixMatch && suffixMatch[1]) {
      const val = parseFloat(suffixMatch[1].replace(/,/g, ''));
      if (!isNaN(val) && val > 0) return val;
    }

    // Generic number near finance words: e.g. "expense 700", "spent 500", "paid 12000", "emi 12000"
    const nearFinanceMatch = text.match(/(?:expense|spent|paid|cost|for|of|emi|loan|bill)\s+([\d,]+(?:\.\d+)?)/i);
    if (nearFinanceMatch && nearFinanceMatch[1]) {
      const val = parseFloat(nearFinanceMatch[1].replace(/,/g, ''));
      if (!isNaN(val) && val > 0) return val;
    }

    // Number followed by paid / debited / credited: e.g. "12000 paid", "45000 debited"
    const followFinanceMatch = text.match(/([\d,]+(?:\.\d+)?)\s*(?:paid|debited|credited|spent|invested)/i);
    if (followFinanceMatch && followFinanceMatch[1]) {
      const val = parseFloat(followFinanceMatch[1].replace(/,/g, ''));
      if (!isNaN(val) && val > 0) return val;
    }

    return null;
  }

  private static createEmptyResult(): OmniCaptureResult {
    return {
      id: 'capture-empty',
      rawInput: '',
      module: 'tasks',
      masterCategory: 'TASKS',
      destinationTable: 'tasks',
      intent: 'UNKNOWN',
      confidence: 0,
      confidenceTier: 'low',
      isUncertain: true,
      suggestedCategories: ['TASKS', 'JOURNAL', 'MIND_NOTES'],
      title: 'Empty Input',
      summary: 'Please enter or dictate a life update.',
      fields: {}
    };
  }
}
