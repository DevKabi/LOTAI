import { 
  OmniCaptureResult, 
  LifeModule, 
  AIIntentType, 
  MasterCategory, 
  DestinationTable, 
  ConfidenceTier 
} from '../types';
import { IntentRouter } from './intentRouter';
import { getFewShotPromptSamples, MASTER_CATEGORY_MAP } from './intentDataset';
import { 
  getActiveGeminiApiKey, 
  DEFAULT_GEMINI_MODEL, 
  sanitizeGeminiModel 
} from '../config/geminiConfig';

export class OmniCaptureService {
  /**
   * Primary entry point: Analyze natural user text or voice transcript
   */
  static async analyzeInput(
    rawInput: string,
    apiKey?: string,
    modelName: string = DEFAULT_GEMINI_MODEL
  ): Promise<OmniCaptureResult> {
    const text = rawInput.trim();
    if (!text) {
      return IntentRouter.routeInput('');
    }

    const effectiveKey = getActiveGeminiApiKey(apiKey);
    const cleanModel = sanitizeGeminiModel(modelName);

    // Always attempt Gemini AI parsing first using the active key
    if (effectiveKey && effectiveKey.trim() !== '') {
      try {
        const geminiResult = await this.callGeminiParser(text, effectiveKey, cleanModel);
        if (geminiResult) {
          return geminiResult;
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local IntentRouter:', err);
      }
    }

    // Intelligent Local Intent Router (Priority Rule Pipeline) fallback
    return this.parseLocalHeuristic(text);
  }

  /**
   * Call Google Gemini API for structured JSON intent and entity extraction
   */
  private static async callGeminiParser(
    rawInput: string,
    apiKey: string,
    modelName: string = 'gemini-2.0-flash'
  ): Promise<OmniCaptureResult | null> {
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

    const fewShotExamples = getFewShotPromptSamples();

    const systemPrompt = `You are the LOTAI (Life On Track AI) Intelligent Life Intent Router.
Analyze the user's natural language input (from typing or voice) and classify it into ONE primary Master Category before extracting structured entities.
Today is: ${todayStr} (Tomorrow is: ${tomorrowStr}).

LOTAI MASTER CATEGORIES & DESTINATION TABLES:
1. GOALS -> Destination table: "goals" (Long-term outcomes, revenue targets, OKRs, milestones)
2. TASKS -> Destination table: "tasks" (Specific actionable items, errands, tomorrow's todos, deadlines)
3. HABITS -> Destination table: "habits" (Daily routines, recurring behaviors, streaks)
4. FINANCE -> Destination table: "finance_transactions" (Money movement: Income, Expense, Investment, Loan, EMI, Transfer, Savings)
5. HEALTH_FITNESS -> Destination table: "health_logs" (Biometrics: weight, water, sleep, workout, steps, bp, calories)
6. JOURNAL -> Destination table: "journal_entries" (Reflections, feelings, emotional states, lessons, gratitude)
7. MIND_NOTES -> Destination table: "mind_notes" (Ideas, SaaS concepts, podcast topics, thoughts, brainstorms)

PRIORITY CLASSIFICATION RULES:
- RULE 1: If input contains money, currency (₹, Rs, Rupees, $, €, £, AED, ¥), or financial movement (expense, spent, paid, bought, received, loan, emi, investment, savings, bill, transportation expense, groceries) -> CLASSIFY AS "FINANCE" FIRST! Do NOT classify as workout or task.
- RULE 2: If input contains biometrics (weight, sleep, water, steps, calories, bp) or fitness activities (running, gym, yoga, workout) -> CLASSIFY AS "HEALTH_FITNESS". (Word boundary: "transportation" is NEVER workout!).
- RULE 3: If input specifies recurring frequency (daily, every day, every morning, routine, habit) -> CLASSIFY AS "HABITS".
- RULE 4: If input is a future action item (tomorrow, by Friday, call, meet, send, follow up) -> CLASSIFY AS "TASKS".
- RULE 5: Macro long-term outcomes (want to earn ₹1 crore, lose 10kg by summer) -> CLASSIFY AS "GOALS".
- RULE 6: Mental reflections or gratitude (felt productive, grateful for family) -> CLASSIFY AS "JOURNAL".
- RULE 7: Concepts, topics, or brainstorms (AI startup idea, podcast topic) -> CLASSIFY AS "MIND_NOTES".

TRAINING EXAMPLES:
${fewShotExamples}

CONFIDENCE SCORING RULES:
- High (0.90 - 1.00): Strong match with explicit category indicators.
- Medium (0.70 - 0.89): Plausible match, but slight ambiguity.
- Low (< 0.70): Vague or cryptic input (1-2 words). Prompt: "Should I save this as a Task, Journal, or Mind Note?".

Output strictly valid JSON with no markdown wrapping matching this schema:
{
  "masterCategory": "GOALS" | "TASKS" | "HABITS" | "FINANCE" | "HEALTH_FITNESS" | "JOURNAL" | "MIND_NOTES",
  "destinationTable": "goals" | "tasks" | "habits" | "finance_transactions" | "health_logs" | "journal_entries" | "mind_notes",
  "module": "goals" | "tasks" | "habits" | "finance" | "health" | "journal",
  "intent": "ADD_FINANCE_EXPENSE" | "ADD_FINANCE_INCOME" | "ADD_FINANCE_INVESTMENT" | "ADD_FINANCE_LOAN_EMI" | "ADD_TASK" | "COMPLETE_HABIT" | "LOG_WEIGHT" | "LOG_WATER" | "LOG_SLEEP" | "LOG_WORKOUT" | "LOG_BP" | "LOG_STEPS" | "ADD_GOAL" | "ADD_JOURNAL" | "ADD_MIND_NOTE",
  "confidence": 0.95,
  "confidenceTier": "high" | "medium" | "low",
  "isUncertain": false,
  "suggestedCategories": ["TASKS", "JOURNAL", "MIND_NOTES"],
  "title": "Expense Saved",
  "summary": "Spent ₹700 on Transportation Expense",
  "uncertainReason": "Optional string if uncertain",
  "fields": {
    "title": "Item title",
    "description": "Optional details",
    "date": "YYYY-MM-DD",
    "category": "Standard category name",
    "amount": 700,
    "transactionType": "expense" | "income",
    "financeSubType": "expense" | "income" | "investment" | "loan" | "emi" | "transfer" | "savings",
    "currencySymbol": "₹",
    "priority": "urgent" | "high" | "medium" | "low",
    "dueDate": "YYYY-MM-DD",
    "habitName": "Habit title",
    "isCompleted": true,
    "healthMetricType": "weight" | "water" | "sleep" | "workout" | "steps" | "bp" | "calories",
    "weightKg": 54,
    "waterIntakeMl": 250,
    "sleepHours": 8,
    "sleepQuality": "optimal" | "good" | "fair" | "poor",
    "workoutMinutes": 30,
    "workoutType": "Running",
    "steps": 10000,
    "bloodPressure": "120/80",
    "targetDate": "YYYY-MM-DD",
    "targetMetric": "Optional metric",
    "milestones": ["milestone 1", "milestone 2"],
    "content": "Full reflection content",
    "mood": "productive" | "joyful" | "calm" | "neutral" | "anxious" | "tired" | "sad",
    "gratitude": "Gratitude statement",
    "mindNoteCategory": "Startup Idea" | "Podcast" | "SaaS" | "Thought" | "Concept",
    "tags": ["tag1", "tag2"]
  }
}`;

    const cleanModel = sanitizeGeminiModel(modelName);
    const effectiveKey = getActiveGeminiApiKey(apiKey);

    const requestBody = JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nUser Input to Analyze:\n"${rawInput}"` }]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 800,
        responseMimeType: 'application/json'
      }
    });

    let res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${effectiveKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody
      }
    );

    // Defensive fallback if 404
    if (res.status === 404 && cleanModel !== DEFAULT_GEMINI_MODEL) {
      console.warn(`OmniCapture: Model '${cleanModel}' returned 404. Retrying with '${DEFAULT_GEMINI_MODEL}'...`);
      res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_GEMINI_MODEL}:generateContent?key=${effectiveKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: requestBody
        }
      );
    }

    if (!res.ok) {
      console.warn('Gemini parser HTTP error:', res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textOutput) return null;

    try {
      const parsed = JSON.parse(textOutput);
      const confidence = typeof parsed.confidence === 'number' ? parsed.confidence : 0.88;
      const confidenceTier: ConfidenceTier = confidence >= 0.90 ? 'high' : (confidence >= 0.70 ? 'medium' : 'low');
      const isUncertain = parsed.isUncertain === true || confidence < 0.70;

      // Infer / validate masterCategory and destinationTable
      let masterCat: MasterCategory = parsed.masterCategory;
      if (!masterCat || !MASTER_CATEGORY_MAP[masterCat]) {
        if (parsed.module === 'finance') masterCat = 'FINANCE';
        else if (parsed.module === 'health') masterCat = 'HEALTH_FITNESS';
        else if (parsed.module === 'habits') masterCat = 'HABITS';
        else if (parsed.module === 'goals') masterCat = 'GOALS';
        else if (parsed.module === 'journal') masterCat = parsed.intent === 'ADD_MIND_NOTE' ? 'MIND_NOTES' : 'JOURNAL';
        else masterCat = 'TASKS';
      }

      const destTable: DestinationTable = MASTER_CATEGORY_MAP[masterCat].destinationTable;
      const module: LifeModule = MASTER_CATEGORY_MAP[masterCat].defaultModule;

      return {
        id: 'capture-' + Date.now(),
        rawInput,
        module,
        masterCategory: masterCat,
        destinationTable: destTable,
        intent: parsed.intent || 'ADD_TASK',
        confidence,
        confidenceTier,
        isUncertain,
        suggestedCategories: parsed.suggestedCategories || (confidenceTier === 'low' ? ['TASKS', 'JOURNAL', 'MIND_NOTES'] : undefined),
        title: parsed.title || this.getDefaultTitle(masterCat, parsed.intent),
        summary: parsed.summary || rawInput,
        uncertainReason: parsed.uncertainReason || (confidenceTier === 'low' ? 'Should I save this as a Task, Journal, or Mind Note?' : undefined),
        fields: {
          ...parsed.fields,
          masterCategory: masterCat,
          destinationTable: destTable,
          date: parsed.fields?.date || todayStr
        }
      };
    } catch (parseError) {
      console.error('Failed to parse Gemini JSON output:', parseError, textOutput);
      return null;
    }
  }

  /**
   * Local intelligent heuristic parser powered by the Priority-Ordered IntentRouter
   */
  static parseLocalHeuristic(rawInput: string): OmniCaptureResult {
    return IntentRouter.routeInput(rawInput);
  }

  private static getDefaultTitle(category?: MasterCategory, intent?: AIIntentType): string {
    switch (category) {
      case 'FINANCE': 
        if (intent === 'ADD_FINANCE_INCOME') return 'Income Recorded';
        if (intent === 'ADD_FINANCE_INVESTMENT') return 'Investment Logged';
        if (intent === 'ADD_FINANCE_LOAN_EMI') return 'EMI / Loan Recorded';
        return 'Expense Saved';
      case 'HEALTH_FITNESS': 
        if (intent === 'LOG_WEIGHT') return 'Weight Logged';
        if (intent === 'LOG_WATER') return 'Hydration Logged';
        if (intent === 'LOG_SLEEP') return 'Sleep Logged';
        if (intent === 'LOG_BP') return 'Blood Pressure Logged';
        if (intent === 'LOG_STEPS') return 'Steps Recorded';
        return 'Workout Recorded';
      case 'HABITS': return 'Habit Completed';
      case 'GOALS': return 'Goal Created';
      case 'JOURNAL': return 'Reflection Saved';
      case 'MIND_NOTES': return 'Mind Note Captured';
      case 'TASKS':
      default: return 'Task Created';
    }
  }
}

