import { MasterCategory, DestinationTable, AIIntentType } from '../types';

export interface IntentTrainingExample {
  utterance: string;
  category: MasterCategory;
  destinationTable: DestinationTable;
  intent: AIIntentType;
  subTypeOrMetric?: string;
  keyEntities?: Record<string, any>;
}

export const INTENT_DATASET: IntentTrainingExample[] = [
  // ==========================================================================
  // 1. GOALS (32 Examples) - Long-term outcomes, big targets, OKRs
  // Destination Table: 'goals'
  // ==========================================================================
  { utterance: "I want to earn ₹1 crore.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Revenue', keyEntities: { target: '₹1 Crore' } },
  { utterance: "Create a goal to lose 10kg.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Fitness', keyEntities: { target: '10kg loss' } },
  { utterance: "Create a goal to reach ₹1 crore revenue.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Revenue', keyEntities: { target: '₹1 Crore revenue' } },
  { utterance: "Reach $100k ARR by December.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Revenue', keyEntities: { target: '$100k ARR' } },
  { utterance: "Goal: Save 10 lakhs for down payment on house.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Savings', keyEntities: { target: '₹10 Lakhs' } },
  { utterance: "Run a full 42km marathon next year.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Health', keyEntities: { target: '42km marathon' } },
  { utterance: "Launch my SaaS product in Q3.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Career', keyEntities: { target: 'SaaS Launch' } },
  { utterance: "Read 50 books this year.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Learning', keyEntities: { target: '50 books' } },
  { utterance: "Hit 100k subscribers on YouTube.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Audience', keyEntities: { target: '100k subs' } },
  { utterance: "Buy our dream home by 2027.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Personal', keyEntities: { target: 'Dream home' } },
  { utterance: "Master Spanish to C1 fluency.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Learning', keyEntities: { target: 'Spanish C1' } },
  { utterance: "Build a $1M investment portfolio.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Finance', keyEntities: { target: '$1M portfolio' } },
  { utterance: "Goal to achieve 15% body fat.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Health', keyEntities: { target: '15% body fat' } },
  { utterance: "Hire 5 senior engineers for the core team.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Career', keyEntities: { target: '5 engineers' } },
  { utterance: "Publish my first book on personal growth.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Personal', keyEntities: { target: 'Book publishing' } },
  { utterance: "Pay off entire home mortgage by 2028.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Finance', keyEntities: { target: 'Debt free' } },
  { utterance: "Achieve financial independence and retire early.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Finance', keyEntities: { target: 'FIRE' } },
  { utterance: "Bench press 100kg with clean form.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Health', keyEntities: { target: '100kg bench' } },
  { utterance: "Scale my newsletter to 25,000 active readers.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Career', keyEntities: { target: '25k readers' } },
  { utterance: "Complete Ironman triathlon before 35.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Health', keyEntities: { target: 'Ironman' } },
  { utterance: "Goal: Travel to 12 new countries in 2 years.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Personal', keyEntities: { target: '12 countries' } },
  { utterance: "Establish an emergency fund of 6 months expenses.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Finance', keyEntities: { target: '6 mo emergency fund' } },
  { utterance: "Get promoted to VP of Engineering.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Career', keyEntities: { target: 'VP promotion' } },
  { utterance: "Learn to play acoustic guitar fingerstyle.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Learning', keyEntities: { target: 'Guitar mastery' } },
  { utterance: "Reduce screen time to under 2 hours daily.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Health', keyEntities: { target: '<2h screen time' } },
  { utterance: "New goal: Build $10k monthly passive income.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Finance', keyEntities: { target: '$10k/mo passive' } },
  { utterance: "Acquire AWS Certified Solutions Architect credential.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Learning', keyEntities: { target: 'AWS Architect' } },
  { utterance: "Goal: Grow company revenue to 50 crores by 2030.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Revenue', keyEntities: { target: '₹50 Crores' } },
  { utterance: "Meditate 365 consecutive days.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Personal', keyEntities: { target: '365 days meditation' } },
  { utterance: "Sell 10,000 copies of our online masterclass.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Career', keyEntities: { target: '10k copies' } },
  { utterance: "Achieve a sub-20 minute 5k run time.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Health', keyEntities: { target: 'Sub-20m 5k' } },
  { utterance: "Set a goal to mentor 20 young entrepreneurs.", category: 'GOALS', destinationTable: 'goals', intent: 'ADD_GOAL', subTypeOrMetric: 'Personal', keyEntities: { target: '20 mentees' } },

  // ==========================================================================
  // 2. TASKS (32 Examples) - Actionable todos, errands, deadlines
  // Destination Table: 'tasks'
  // ==========================================================================
  { utterance: "Tomorrow call 10 prospects.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { due: 'tomorrow', title: 'Call 10 prospects' } },
  { utterance: "Submit taxes before Friday.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { due: 'Friday', title: 'Submit taxes' } },
  { utterance: "Send sales proposal to client Acme Corp.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { title: 'Send sales proposal' } },
  { utterance: "Schedule dentist appointment for next Tuesday.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { title: 'Dentist appointment' } },
  { utterance: "Remind me to call accountant at 4pm.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { title: 'Call accountant' } },
  { utterance: "Fix payment gateway timeout bug in checkout.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { priority: 'high', title: 'Fix payment timeout' } },
  { utterance: "Review pull request #142 from Sarah.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { title: 'Review PR #142' } },
  { utterance: "Prepare slides for Monday team all-hands.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { due: 'Monday', title: 'Prepare all-hands slides' } },
  { utterance: "Buy fresh organic vegetables and milk tonight.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { title: 'Buy groceries' } },
  { utterance: "Renew passport and submit visa documents.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { title: 'Renew passport' } },
  { utterance: "Follow up with Priya regarding the marketing contract.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { title: 'Follow up with Priya' } },
  { utterance: "Book flight tickets to Bengaluru for next weekend.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { title: 'Book flight tickets' } },
  { utterance: "Order new ergonomic office chair.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { title: 'Order office chair' } },
  { utterance: "Clean car and check tyre pressure tomorrow morning.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { due: 'tomorrow', title: 'Clean car' } },
  { utterance: "Send quarterly invoice to Microsoft partner manager.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { title: 'Send quarterly invoice' } },
  { utterance: "Draft blog post on AI workflow automation.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { title: 'Draft blog post' } },
  { utterance: "Pick up laundry from dry cleaner by 6pm.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { title: 'Pick up laundry' } },
  { utterance: "Call plumber to repair kitchen sink leak.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { priority: 'high', title: 'Call plumber' } },
  { utterance: "Email onboarding checklist to new hires.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { title: 'Email onboarding checklist' } },
  { utterance: "Prepare quarterly OKR report for leadership.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { title: 'Prepare OKR report' } },
  { utterance: "Update LinkedIn headline and resume profile.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { title: 'Update LinkedIn profile' } },
  { utterance: "Deliver birthday gift to Mom on Saturday.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { due: 'Saturday', title: 'Deliver Mom gift' } },
  { utterance: "Pay internet WiFi bill before midnight.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { priority: 'high', title: 'Pay WiFi bill' } },
  { utterance: "Backup Mac workstation to external SSD.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { title: 'Backup workstation' } },
  { utterance: "Cancel gym membership auto-renewal.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { title: 'Cancel gym membership' } },
  { utterance: "Write weekly status report for client.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { title: 'Weekly status report' } },
  { utterance: "Schedule 1-on-1 sync with Dev team lead.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { title: '1-on-1 Dev sync' } },
  { utterance: "Recharge metro card for transit next week.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { title: 'Recharge metro card' } },
  { utterance: "Urgent: Fix production SSL certificate expiry.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { priority: 'urgent', title: 'Fix SSL certificate' } },
  { utterance: "Buy birthday card and flowers for Sarah.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { title: 'Buy card and flowers' } },
  { utterance: "Organize digital receipts for tax filing.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { title: 'Organize tax receipts' } },
  { utterance: "Send thank you note to event organizers.", category: 'TASKS', destinationTable: 'tasks', intent: 'ADD_TASK', keyEntities: { title: 'Send thank you note' } },

  // ==========================================================================
  // 3. HABITS (30 Examples) - Recurring behaviors, routines, streaks
  // Destination Table: 'habits'
  // ==========================================================================
  { utterance: "Completed meditation today.", category: 'HABITS', destinationTable: 'habits', intent: 'COMPLETE_HABIT', subTypeOrMetric: 'Meditation' },
  { utterance: "Drink 3L water daily.", category: 'HABITS', destinationTable: 'habits', intent: 'COMPLETE_HABIT', subTypeOrMetric: 'Hydration' },
  { utterance: "Read 20 pages every morning.", category: 'HABITS', destinationTable: 'habits', intent: 'COMPLETE_HABIT', subTypeOrMetric: 'Reading' },
  { utterance: "Go to gym 5 days a week routine.", category: 'HABITS', destinationTable: 'habits', intent: 'COMPLETE_HABIT', subTypeOrMetric: 'Fitness' },
  { utterance: "Daily 10 minute cold shower habit.", category: 'HABITS', destinationTable: 'habits', intent: 'COMPLETE_HABIT', subTypeOrMetric: 'Wellness' },
  { utterance: "Completed 15 minutes of mindfulness meditation.", category: 'HABITS', destinationTable: 'habits', intent: 'COMPLETE_HABIT', subTypeOrMetric: 'Meditation' },
  { utterance: "Floss teeth every night before sleep.", category: 'HABITS', destinationTable: 'habits', intent: 'COMPLETE_HABIT', subTypeOrMetric: 'Hygiene' },
  { utterance: "Daily morning journal routine completed.", category: 'HABITS', destinationTable: 'habits', intent: 'COMPLETE_HABIT', subTypeOrMetric: 'Journaling' },
  { utterance: "Walk 10,000 steps every day habit.", category: 'HABITS', destinationTable: 'habits', intent: 'COMPLETE_HABIT', subTypeOrMetric: 'Steps' },
  { utterance: "Wake up at 6:00 AM every morning.", category: 'HABITS', destinationTable: 'habits', intent: 'COMPLETE_HABIT', subTypeOrMetric: 'Sleep/Wake' },
  { utterance: "Finished my daily Spanish lesson on Duolingo.", category: 'HABITS', destinationTable: 'habits', intent: 'COMPLETE_HABIT', subTypeOrMetric: 'Learning' },
  { utterance: "No screen time 1 hour before bed routine.", category: 'HABITS', destinationTable: 'habits', intent: 'COMPLETE_HABIT', subTypeOrMetric: 'Sleep Hygiene' },
  { utterance: "Completed daily pushups streak.", category: 'HABITS', destinationTable: 'habits', intent: 'COMPLETE_HABIT', subTypeOrMetric: 'Workout' },
  { utterance: "Practice coding on LeetCode every day.", category: 'HABITS', destinationTable: 'habits', intent: 'COMPLETE_HABIT', subTypeOrMetric: 'Coding' },
  { utterance: "Daily gratitude journaling completed.", category: 'HABITS', destinationTable: 'habits', intent: 'COMPLETE_HABIT', subTypeOrMetric: 'Mindfulness' },
  { utterance: "Take daily multivitamin and fish oil.", category: 'HABITS', destinationTable: 'habits', intent: 'COMPLETE_HABIT', subTypeOrMetric: 'Nutrition' },
  { utterance: "Stretching and foam rolling every evening.", category: 'HABITS', destinationTable: 'habits', intent: 'COMPLETE_HABIT', subTypeOrMetric: 'Mobility' },
  { utterance: "Check off my daily reading habit.", category: 'HABITS', destinationTable: 'habits', intent: 'COMPLETE_HABIT', subTypeOrMetric: 'Reading' },
  { utterance: "Write 500 words daily for my novel.", category: 'HABITS', destinationTable: 'habits', intent: 'COMPLETE_HABIT', subTypeOrMetric: 'Writing' },
  { utterance: "Zero sugar diet routine maintained today.", category: 'HABITS', destinationTable: 'habits', intent: 'COMPLETE_HABIT', subTypeOrMetric: 'Diet' },
  { utterance: "Daily 20-minute breathwork completed.", category: 'HABITS', destinationTable: 'habits', intent: 'COMPLETE_HABIT', subTypeOrMetric: 'Breathwork' },
  { utterance: "Walk the dog every morning habit checked.", category: 'HABITS', destinationTable: 'habits', intent: 'COMPLETE_HABIT', subTypeOrMetric: 'Pets' },
  { utterance: "Intermittent fasting 16:8 routine today.", category: 'HABITS', destinationTable: 'habits', intent: 'COMPLETE_HABIT', subTypeOrMetric: 'Nutrition' },
  { utterance: "Daily deep work 90 minute block done.", category: 'HABITS', destinationTable: 'habits', intent: 'COMPLETE_HABIT', subTypeOrMetric: 'Focus' },
  { utterance: "Habit check-in: drank green tea this morning.", category: 'HABITS', destinationTable: 'habits', intent: 'COMPLETE_HABIT', subTypeOrMetric: 'Wellness' },
  { utterance: "Maintain daily evening house tidy habit.", category: 'HABITS', destinationTable: 'habits', intent: 'COMPLETE_HABIT', subTypeOrMetric: 'Home' },
  { utterance: "Daily sunscreen application done.", category: 'HABITS', destinationTable: 'habits', intent: 'COMPLETE_HABIT', subTypeOrMetric: 'Skincare' },
  { utterance: "30 minutes posture correction exercises every day.", category: 'HABITS', destinationTable: 'habits', intent: 'COMPLETE_HABIT', subTypeOrMetric: 'Health' },
  { utterance: "Daily review of calendar and goals habit.", category: 'HABITS', destinationTable: 'habits', intent: 'COMPLETE_HABIT', subTypeOrMetric: 'Productivity' },
  { utterance: "Completed my piano practice routine today.", category: 'HABITS', destinationTable: 'habits', intent: 'COMPLETE_HABIT', subTypeOrMetric: 'Music' },

  // ==========================================================================
  // 4. FINANCE (36 Examples) - Priority #1: Money movements, expenses, bills, loans
  // Destination Table: 'finance_transactions'
  // ==========================================================================
  { utterance: "Spent ₹500 on lunch.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_EXPENSE', subTypeOrMetric: 'expense', keyEntities: { amount: 500, category: 'Food & Dining' } },
  { utterance: "today my transportation expense 700 rupees", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_EXPENSE', subTypeOrMetric: 'expense', keyEntities: { amount: 700, category: 'Transportation' } },
  { utterance: "Hospital expense ₹5000", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_EXPENSE', subTypeOrMetric: 'expense', keyEntities: { amount: 5000, category: 'Health & Medical' } },
  { utterance: "Received ₹20,000 from client.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_INCOME', subTypeOrMetric: 'income', keyEntities: { amount: 20000, category: 'Salary & Earnings' } },
  { utterance: "Car loan EMI 12000 paid.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_LOAN_EMI', subTypeOrMetric: 'emi', keyEntities: { amount: 12000, category: 'Utilities' } },
  { utterance: "Home loan EMI ₹45,000 debited.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_LOAN_EMI', subTypeOrMetric: 'emi', keyEntities: { amount: 45000, category: 'Housing & Rent' } },
  { utterance: "Bought groceries for ₹2,450 at supermarket.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_EXPENSE', subTypeOrMetric: 'expense', keyEntities: { amount: 2450, category: 'Shopping & Groceries' } },
  { utterance: "Invested ₹50,000 in Nifty 50 mutual fund.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_INVESTMENT', subTypeOrMetric: 'investment', keyEntities: { amount: 50000, category: 'Investment & Savings' } },
  { utterance: "Salary ₹85,000 credited to HDFC bank account.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_INCOME', subTypeOrMetric: 'income', keyEntities: { amount: 85000, category: 'Salary & Earnings' } },
  { utterance: "Transferred $500 to savings account.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_EXPENSE', subTypeOrMetric: 'savings', keyEntities: { amount: 500, category: 'Investment & Savings' } },
  { utterance: "Paid electricity bill ₹3,200 online.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_EXPENSE', subTypeOrMetric: 'expense', keyEntities: { amount: 3200, category: 'Utilities' } },
  { utterance: "Monthly apartment rent $1,800 paid.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_EXPENSE', subTypeOrMetric: 'expense', keyEntities: { amount: 1800, category: 'Housing & Rent' } },
  { utterance: "Uber ride to airport ₹650.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_EXPENSE', subTypeOrMetric: 'expense', keyEntities: { amount: 650, category: 'Transportation' } },
  { utterance: "Paid ₹1,500 for petrol refill in car.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_EXPENSE', subTypeOrMetric: 'expense', keyEntities: { amount: 1500, category: 'Transportation' } },
  { utterance: "Dinner with friends ₹2,800 at Italian restaurant.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_EXPENSE', subTypeOrMetric: 'expense', keyEntities: { amount: 2800, category: 'Food & Dining' } },
  { utterance: "Coffee at Starbucks $7.50.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_EXPENSE', subTypeOrMetric: 'expense', keyEntities: { amount: 7.5, category: 'Food & Dining' } },
  { utterance: "Paid doctor consultation fee ₹800.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_EXPENSE', subTypeOrMetric: 'expense', keyEntities: { amount: 800, category: 'Health & Medical' } },
  { utterance: "Bought pharmacy medicines ₹1,240.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_EXPENSE', subTypeOrMetric: 'expense', keyEntities: { amount: 1240, category: 'Health & Medical' } },
  { utterance: "Personal loan payment ₹8,500 done.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_LOAN_EMI', subTypeOrMetric: 'loan', keyEntities: { amount: 8500, category: 'Utilities' } },
  { utterance: "SIP investment ₹10,000 executed today.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_INVESTMENT', subTypeOrMetric: 'investment', keyEntities: { amount: 10000, category: 'Investment & Savings' } },
  { utterance: "Received dividend payment of ₹3,400.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_INCOME', subTypeOrMetric: 'income', keyEntities: { amount: 3400, category: 'Investment & Savings' } },
  { utterance: "Netflix and Spotify subscriptions $28.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_EXPENSE', subTypeOrMetric: 'expense', keyEntities: { amount: 28, category: 'Entertainment' } },
  { utterance: "Purchased new shoes ₹4,999 on Amazon.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_EXPENSE', subTypeOrMetric: 'expense', keyEntities: { amount: 4999, category: 'Shopping & Groceries' } },
  { utterance: "Transferred ₹15,000 to Mom for monthly support.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_EXPENSE', subTypeOrMetric: 'transfer', keyEntities: { amount: 15000, category: 'Other' } },
  { utterance: "Flight tickets to Mumbai ₹8,200 paid.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_EXPENSE', subTypeOrMetric: 'expense', keyEntities: { amount: 8200, category: 'Transportation' } },
  { utterance: "Freelance design work payment $1,200 received.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_INCOME', subTypeOrMetric: 'income', keyEntities: { amount: 1200, category: 'Salary & Earnings' } },
  { utterance: "Gas cylinder refill payment ₹950.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_EXPENSE', subTypeOrMetric: 'expense', keyEntities: { amount: 950, category: 'Utilities' } },
  { utterance: "Annual car insurance premium ₹18,000 paid.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_EXPENSE', subTypeOrMetric: 'expense', keyEntities: { amount: 18000, category: 'Utilities' } },
  { utterance: "Movie tickets and snacks ₹1,100.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_EXPENSE', subTypeOrMetric: 'expense', keyEntities: { amount: 1100, category: 'Entertainment' } },
  { utterance: "Consulting advisory fee ₹40,000 received.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_INCOME', subTypeOrMetric: 'income', keyEntities: { amount: 40000, category: 'Salary & Earnings' } },
  { utterance: "WiFi broadband bill ₹1,179 paid.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_EXPENSE', subTypeOrMetric: 'expense', keyEntities: { amount: 1179, category: 'Utilities' } },
  { utterance: "Bought books ₹850 on Kindle.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_EXPENSE', subTypeOrMetric: 'expense', keyEntities: { amount: 850, category: 'Shopping & Groceries' } },
  { utterance: "Education loan EMI ₹7,000 paid.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_LOAN_EMI', subTypeOrMetric: 'emi', keyEntities: { amount: 7000, category: 'Utilities' } },
  { utterance: "Cash withdrawal from ATM ₹5,000.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_EXPENSE', subTypeOrMetric: 'expense', keyEntities: { amount: 5000, category: 'Other' } },
  { utterance: "Got ₹5,000 cashback bonus on credit card.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_INCOME', subTypeOrMetric: 'income', keyEntities: { amount: 5000, category: 'Salary & Earnings' } },
  { utterance: "Office stationery expense ₹620.", category: 'FINANCE', destinationTable: 'finance_transactions', intent: 'ADD_FINANCE_EXPENSE', subTypeOrMetric: 'expense', keyEntities: { amount: 620, category: 'Other' } },

  // ==========================================================================
  // 5. HEALTH_FITNESS (32 Examples) - Biometrics, physical vitals, workouts
  // Destination Table: 'health_logs'
  // ==========================================================================
  { utterance: "My weight is 54kg.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_WEIGHT', subTypeOrMetric: 'weight', keyEntities: { weightKg: 54 } },
  { utterance: "Weighed 72.5 kg this morning.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_WEIGHT', subTypeOrMetric: 'weight', keyEntities: { weightKg: 72.5 } },
  { utterance: "Weight today 68 kg.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_WEIGHT', subTypeOrMetric: 'weight', keyEntities: { weightKg: 68 } },
  { utterance: "Ran 5km in 28 minutes.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_WORKOUT', subTypeOrMetric: 'workout', keyEntities: { workoutType: 'Running', minutes: 28 } },
  { utterance: "Slept 7.5 hours feeling refreshed.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_SLEEP', subTypeOrMetric: 'sleep', keyEntities: { sleepHours: 7.5, sleepQuality: 'optimal' } },
  { utterance: "Slept 6 hours, woke up tired.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_SLEEP', subTypeOrMetric: 'sleep', keyEntities: { sleepHours: 6, sleepQuality: 'fair' } },
  { utterance: "Drank 2.5L water today.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_WATER', subTypeOrMetric: 'water', keyEntities: { waterMl: 2500 } },
  { utterance: "Drank 500ml water after workout.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_WATER', subTypeOrMetric: 'water', keyEntities: { waterMl: 500 } },
  { utterance: "Blood pressure reading 120/80.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_BP', subTypeOrMetric: 'bp', keyEntities: { bp: '120/80' } },
  { utterance: "BP check: 118/76 mmHg.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_BP', subTypeOrMetric: 'bp', keyEntities: { bp: '118/76' } },
  { utterance: "Walked 10,500 steps today.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_STEPS', subTypeOrMetric: 'steps', keyEntities: { steps: 10500 } },
  { utterance: "Completed 8,200 steps so far.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_STEPS', subTypeOrMetric: 'steps', keyEntities: { steps: 8200 } },
  { utterance: "Burned 450 calories during strength training.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_WORKOUT', subTypeOrMetric: 'calories', keyEntities: { calories: 450 } },
  { utterance: "Gym strength workout 50 minutes.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_WORKOUT', subTypeOrMetric: 'workout', keyEntities: { workoutType: 'Strength Training', minutes: 50 } },
  { utterance: "Did 35 minutes of Vinyasa yoga.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_WORKOUT', subTypeOrMetric: 'workout', keyEntities: { workoutType: 'Yoga', minutes: 35 } },
  { utterance: "Cycling session 45 minutes outdoors.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_WORKOUT', subTypeOrMetric: 'workout', keyEntities: { workoutType: 'Cycling', minutes: 45 } },
  { utterance: "Swimming 40 laps in 30 minutes.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_WORKOUT', subTypeOrMetric: 'workout', keyEntities: { workoutType: 'Swimming', minutes: 30 } },
  { utterance: "Body weight check: 78.2 kg.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_WEIGHT', subTypeOrMetric: 'weight', keyEntities: { weightKg: 78.2 } },
  { utterance: "Had 8 glasses of water today.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_WATER', subTypeOrMetric: 'water', keyEntities: { waterMl: 2000 } },
  { utterance: "Slept 8 hours optimal deep sleep.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_SLEEP', subTypeOrMetric: 'sleep', keyEntities: { sleepHours: 8, sleepQuality: 'optimal' } },
  { utterance: "Resting heart rate 58 bpm.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_HEALTH', subTypeOrMetric: 'vitals', keyEntities: { hr: 58 } },
  { utterance: "Fasting blood sugar 94 mg/dL.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_HEALTH', subTypeOrMetric: 'vitals', keyEntities: { sugar: 94 } },
  { utterance: "Intense HIIT training for 25 minutes.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_WORKOUT', subTypeOrMetric: 'workout', keyEntities: { workoutType: 'HIIT', minutes: 25 } },
  { utterance: "Walked 12,000 steps around the city.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_STEPS', subTypeOrMetric: 'steps', keyEntities: { steps: 12000 } },
  { utterance: "Logged 1.5L of water intake.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_WATER', subTypeOrMetric: 'water', keyEntities: { waterMl: 1500 } },
  { utterance: "Only 4.5 hours sleep due to travel fatigue.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_SLEEP', subTypeOrMetric: 'sleep', keyEntities: { sleepHours: 4.5, sleepQuality: 'poor' } },
  { utterance: "Current weight is 62.3 kilograms.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_WEIGHT', subTypeOrMetric: 'weight', keyEntities: { weightKg: 62.3 } },
  { utterance: "Pilates core workout 40 minutes.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_WORKOUT', subTypeOrMetric: 'workout', keyEntities: { workoutType: 'Pilates', minutes: 40 } },
  { utterance: "Logged 600 calories burned in crossfit.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_WORKOUT', subTypeOrMetric: 'calories', keyEntities: { calories: 600 } },
  { utterance: "Blood pressure 130/85 slightly elevated.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_BP', subTypeOrMetric: 'bp', keyEntities: { bp: '130/85' } },
  { utterance: "Evening recovery jog 20 minutes.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_WORKOUT', subTypeOrMetric: 'workout', keyEntities: { workoutType: 'Running', minutes: 20 } },
  { utterance: "Total water consumed: 3000ml.", category: 'HEALTH_FITNESS', destinationTable: 'health_logs', intent: 'LOG_WATER', subTypeOrMetric: 'water', keyEntities: { waterMl: 3000 } },

  // ==========================================================================
  // 6. JOURNAL (30 Examples) - Reflections, feelings, emotions, gratitude
  // Destination Table: 'journal_entries'
  // ==========================================================================
  { utterance: "Today I felt productive and closed two clients.", category: 'JOURNAL', destinationTable: 'journal_entries', intent: 'ADD_JOURNAL', subTypeOrMetric: 'reflection', keyEntities: { mood: 'productive' } },
  { utterance: "Grateful for family time and quiet evening walks.", category: 'JOURNAL', destinationTable: 'journal_entries', intent: 'ADD_JOURNAL', subTypeOrMetric: 'gratitude', keyEntities: { mood: 'joyful' } },
  { utterance: "Feeling calm and centered after long meditation.", category: 'JOURNAL', destinationTable: 'journal_entries', intent: 'ADD_JOURNAL', subTypeOrMetric: 'reflection', keyEntities: { mood: 'calm' } },
  { utterance: "Felt overwhelmed with work deadlines today.", category: 'JOURNAL', destinationTable: 'journal_entries', intent: 'ADD_JOURNAL', subTypeOrMetric: 'reflection', keyEntities: { mood: 'anxious' } },
  { utterance: "Reflecting on lessons from last month's project failure.", category: 'JOURNAL', destinationTable: 'journal_entries', intent: 'ADD_JOURNAL', subTypeOrMetric: 'reflection', keyEntities: { mood: 'calm' } },
  { utterance: "Proud of our team's resilience under high pressure.", category: 'JOURNAL', destinationTable: 'journal_entries', intent: 'ADD_JOURNAL', subTypeOrMetric: 'reflection', keyEntities: { mood: 'productive' } },
  { utterance: "Feeling energized and optimistic about the upcoming launch.", category: 'JOURNAL', destinationTable: 'journal_entries', intent: 'ADD_JOURNAL', subTypeOrMetric: 'reflection', keyEntities: { mood: 'joyful' } },
  { utterance: "A peaceful Sunday with tea and quiet thoughts.", category: 'JOURNAL', destinationTable: 'journal_entries', intent: 'ADD_JOURNAL', subTypeOrMetric: 'reflection', keyEntities: { mood: 'calm' } },
  { utterance: "Today was exhausting, need to prioritize deep rest.", category: 'JOURNAL', destinationTable: 'journal_entries', intent: 'ADD_JOURNAL', subTypeOrMetric: 'reflection', keyEntities: { mood: 'tired' } },
  { utterance: "Grateful for mentorship and guidance from senior leaders.", category: 'JOURNAL', destinationTable: 'journal_entries', intent: 'ADD_JOURNAL', subTypeOrMetric: 'gratitude', keyEntities: { mood: 'joyful' } },
  { utterance: "Journal entry: Dealing with imposter syndrome at work.", category: 'JOURNAL', destinationTable: 'journal_entries', intent: 'ADD_JOURNAL', subTypeOrMetric: 'reflection', keyEntities: { mood: 'anxious' } },
  { utterance: "Feeling immense gratitude for health and clean air.", category: 'JOURNAL', destinationTable: 'journal_entries', intent: 'ADD_JOURNAL', subTypeOrMetric: 'gratitude', keyEntities: { mood: 'joyful' } },
  { utterance: "Struggled with procrastination this morning but bounced back.", category: 'JOURNAL', destinationTable: 'journal_entries', intent: 'ADD_JOURNAL', subTypeOrMetric: 'reflection', keyEntities: { mood: 'productive' } },
  { utterance: "Deep sense of peace watching the sunset.", category: 'JOURNAL', destinationTable: 'journal_entries', intent: 'ADD_JOURNAL', subTypeOrMetric: 'reflection', keyEntities: { mood: 'calm' } },
  { utterance: "Today taught me patience is a competitive advantage.", category: 'JOURNAL', destinationTable: 'journal_entries', intent: 'ADD_JOURNAL', subTypeOrMetric: 'reflection', keyEntities: { mood: 'calm' } },
  { utterance: "Felt joyful celebrating our team milestone.", category: 'JOURNAL', destinationTable: 'journal_entries', intent: 'ADD_JOURNAL', subTypeOrMetric: 'reflection', keyEntities: { mood: 'joyful' } },
  { utterance: "Frustrated with lack of communication from leadership.", category: 'JOURNAL', destinationTable: 'journal_entries', intent: 'ADD_JOURNAL', subTypeOrMetric: 'reflection', keyEntities: { mood: 'anxious' } },
  { utterance: "Gratitude note: A warm home and supportive partner.", category: 'JOURNAL', destinationTable: 'journal_entries', intent: 'ADD_JOURNAL', subTypeOrMetric: 'gratitude', keyEntities: { mood: 'joyful' } },
  { utterance: "Reflecting on where I want to be 5 years from now.", category: 'JOURNAL', destinationTable: 'journal_entries', intent: 'ADD_JOURNAL', subTypeOrMetric: 'reflection', keyEntities: { mood: 'calm' } },
  { utterance: "Excited about the progress on our AI engine prototype.", category: 'JOURNAL', destinationTable: 'journal_entries', intent: 'ADD_JOURNAL', subTypeOrMetric: 'reflection', keyEntities: { mood: 'productive' } },
  { utterance: "Felt nervous before the presentation, but it went great.", category: 'JOURNAL', destinationTable: 'journal_entries', intent: 'ADD_JOURNAL', subTypeOrMetric: 'reflection', keyEntities: { mood: 'productive' } },
  { utterance: "A quiet moment of solitude and gratitude.", category: 'JOURNAL', destinationTable: 'journal_entries', intent: 'ADD_JOURNAL', subTypeOrMetric: 'gratitude', keyEntities: { mood: 'calm' } },
  { utterance: "Emotional check-in: Feeling centered and focused today.", category: 'JOURNAL', destinationTable: 'journal_entries', intent: 'ADD_JOURNAL', subTypeOrMetric: 'reflection', keyEntities: { mood: 'productive' } },
  { utterance: "Heartfelt gratitude for my mother's unconditional support.", category: 'JOURNAL', destinationTable: 'journal_entries', intent: 'ADD_JOURNAL', subTypeOrMetric: 'gratitude', keyEntities: { mood: 'joyful' } },
  { utterance: "Mindset reflection: Focus on inputs, detach from outputs.", category: 'JOURNAL', destinationTable: 'journal_entries', intent: 'ADD_JOURNAL', subTypeOrMetric: 'reflection', keyEntities: { mood: 'calm' } },
  { utterance: "Today was one of those golden flow-state days.", category: 'JOURNAL', destinationTable: 'journal_entries', intent: 'ADD_JOURNAL', subTypeOrMetric: 'reflection', keyEntities: { mood: 'productive' } },
  { utterance: "Felt anxious about financial market volatility today.", category: 'JOURNAL', destinationTable: 'journal_entries', intent: 'ADD_JOURNAL', subTypeOrMetric: 'reflection', keyEntities: { mood: 'anxious' } },
  { utterance: "Reconnecting with an old friend brought so much joy.", category: 'JOURNAL', destinationTable: 'journal_entries', intent: 'ADD_JOURNAL', subTypeOrMetric: 'reflection', keyEntities: { mood: 'joyful' } },
  { utterance: "Evening debrief: Handled difficult conversations with grace.", category: 'JOURNAL', destinationTable: 'journal_entries', intent: 'ADD_JOURNAL', subTypeOrMetric: 'reflection', keyEntities: { mood: 'calm' } },
  { utterance: "Grateful for another healthy day of life and learning.", category: 'JOURNAL', destinationTable: 'journal_entries', intent: 'ADD_JOURNAL', subTypeOrMetric: 'gratitude', keyEntities: { mood: 'joyful' } },

  // ==========================================================================
  // 7. MIND_NOTES (30 Examples) - Ideas, thoughts, concepts, brainstorming
  // Destination Table: 'mind_notes'
  // ==========================================================================
  { utterance: "AI startup idea: automated tax prep for freelancers.", category: 'MIND_NOTES', destinationTable: 'mind_notes', intent: 'ADD_MIND_NOTE', subTypeOrMetric: 'Startup Idea', keyEntities: { topic: 'AI Tax Prep' } },
  { utterance: "Podcast topic: discipline vs motivation in high performers.", category: 'MIND_NOTES', destinationTable: 'mind_notes', intent: 'ADD_MIND_NOTE', subTypeOrMetric: 'Podcast', keyEntities: { topic: 'Discipline vs Motivation' } },
  { utterance: "SaaS concept: micro-invoicing and escrow for creators.", category: 'MIND_NOTES', destinationTable: 'mind_notes', intent: 'ADD_MIND_NOTE', subTypeOrMetric: 'SaaS', keyEntities: { topic: 'Creator Escrow' } },
  { utterance: "Business idea: organic cold-pressed oil subscription box.", category: 'MIND_NOTES', destinationTable: 'mind_notes', intent: 'ADD_MIND_NOTE', subTypeOrMetric: 'Startup Idea', keyEntities: { topic: 'Cold-pressed Oil' } },
  { utterance: "Book title idea: The Operating System of Focus.", category: 'MIND_NOTES', destinationTable: 'mind_notes', intent: 'ADD_MIND_NOTE', subTypeOrMetric: 'Thought', keyEntities: { topic: 'Book Title' } },
  { utterance: "Thought: consistency compounds faster than raw talent.", category: 'MIND_NOTES', destinationTable: 'mind_notes', intent: 'ADD_MIND_NOTE', subTypeOrMetric: 'Thought', keyEntities: { topic: 'Consistency Principle' } },
  { utterance: "Video concept: How I organize my entire life with AI in 2026.", category: 'MIND_NOTES', destinationTable: 'mind_notes', intent: 'ADD_MIND_NOTE', subTypeOrMetric: 'Concept', keyEntities: { topic: 'Life OS Video' } },
  { utterance: "App feature idea: voice-based life command center.", category: 'MIND_NOTES', destinationTable: 'mind_notes', intent: 'ADD_MIND_NOTE', subTypeOrMetric: 'SaaS', keyEntities: { topic: 'Voice Command Center' } },
  { utterance: "Concept: Asynchronous daily standup bot for remote teams.", category: 'MIND_NOTES', destinationTable: 'mind_notes', intent: 'ADD_MIND_NOTE', subTypeOrMetric: 'SaaS', keyEntities: { topic: 'Standup Bot' } },
  { utterance: "Note to self: Never make permanent decisions on temporary emotions.", category: 'MIND_NOTES', destinationTable: 'mind_notes', intent: 'ADD_MIND_NOTE', subTypeOrMetric: 'Thought', keyEntities: { topic: 'Decision Wisdom' } },
  { utterance: "Newsletter topic: Why 90% of habit trackers fail users.", category: 'MIND_NOTES', destinationTable: 'mind_notes', intent: 'ADD_MIND_NOTE', subTypeOrMetric: 'Podcast', keyEntities: { topic: 'Habit Tracker Psychology' } },
  { utterance: "Product idea: Smart ring that monitors hydration levels.", category: 'MIND_NOTES', destinationTable: 'mind_notes', intent: 'ADD_MIND_NOTE', subTypeOrMetric: 'Startup Idea', keyEntities: { topic: 'Hydration Ring' } },
  { utterance: "Brainstorming monetization models for open source dev tools.", category: 'MIND_NOTES', destinationTable: 'mind_notes', intent: 'ADD_MIND_NOTE', subTypeOrMetric: 'Concept', keyEntities: { topic: 'OSS Monetization' } },
  { utterance: "Thought: The highest ROI skill in 2026 is prompt engineering and agent orchestration.", category: 'MIND_NOTES', destinationTable: 'mind_notes', intent: 'ADD_MIND_NOTE', subTypeOrMetric: 'Thought', keyEntities: { topic: 'AI ROI Skill' } },
  { utterance: "Podcast interview questions for bootstrapped founders.", category: 'MIND_NOTES', destinationTable: 'mind_notes', intent: 'ADD_MIND_NOTE', subTypeOrMetric: 'Podcast', keyEntities: { topic: 'Founder Questions' } },
  { utterance: "SaaS idea: AI legal contract redliner for small agencies.", category: 'MIND_NOTES', destinationTable: 'mind_notes', intent: 'ADD_MIND_NOTE', subTypeOrMetric: 'SaaS', keyEntities: { topic: 'Contract Redliner' } },
  { utterance: "Concept: Decentralized peer-to-peer fitness accountability groups.", category: 'MIND_NOTES', destinationTable: 'mind_notes', intent: 'ADD_MIND_NOTE', subTypeOrMetric: 'Concept', keyEntities: { topic: 'P2P Accountability' } },
  { utterance: "Note: Deep work blocks should precede communication blocks.", category: 'MIND_NOTES', destinationTable: 'mind_notes', intent: 'ADD_MIND_NOTE', subTypeOrMetric: 'Thought', keyEntities: { topic: 'Time Architecture' } },
  { utterance: "Article angle: The death of traditional dashboards in the AI era.", category: 'MIND_NOTES', destinationTable: 'mind_notes', intent: 'ADD_MIND_NOTE', subTypeOrMetric: 'Concept', keyEntities: { topic: 'Death of Dashboards' } },
  { utterance: "Startup concept: On-demand mobile car detailing subscription.", category: 'MIND_NOTES', destinationTable: 'mind_notes', intent: 'ADD_MIND_NOTE', subTypeOrMetric: 'Startup Idea', keyEntities: { topic: 'Mobile Detailing' } },
  { utterance: "Thought: Simplicity is not the absence of clutter, it is the presence of purpose.", category: 'MIND_NOTES', destinationTable: 'mind_notes', intent: 'ADD_MIND_NOTE', subTypeOrMetric: 'Thought', keyEntities: { topic: 'Simplicity Design' } },
  { utterance: "YouTube script idea: 5 Mental Models That Changed How I Build Software.", category: 'MIND_NOTES', destinationTable: 'mind_notes', intent: 'ADD_MIND_NOTE', subTypeOrMetric: 'Concept', keyEntities: { topic: 'Mental Models Video' } },
  { utterance: "Business concept: Zero-waste grocery delivery in reusable glass jars.", category: 'MIND_NOTES', destinationTable: 'mind_notes', intent: 'ADD_MIND_NOTE', subTypeOrMetric: 'Startup Idea', keyEntities: { topic: 'Zero Waste Grocery' } },
  { utterance: "Thought: If you do not schedule your priorities, someone else will schedule theirs for you.", category: 'MIND_NOTES', destinationTable: 'mind_notes', intent: 'ADD_MIND_NOTE', subTypeOrMetric: 'Thought', keyEntities: { topic: 'Calendar Priority' } },
  { utterance: "Keynote topic: Autonomous AI agents as executive co-founders.", category: 'MIND_NOTES', destinationTable: 'mind_notes', intent: 'ADD_MIND_NOTE', subTypeOrMetric: 'Podcast', keyEntities: { topic: 'AI Co-founders' } },
  { utterance: "App concept: Micro-journaling via WhatsApp voice notes.", category: 'MIND_NOTES', destinationTable: 'mind_notes', intent: 'ADD_MIND_NOTE', subTypeOrMetric: 'SaaS', keyEntities: { topic: 'Voice Journaling' } },
  { utterance: "Note to self: Optimize for learning velocity, not just speed.", category: 'MIND_NOTES', destinationTable: 'mind_notes', intent: 'ADD_MIND_NOTE', subTypeOrMetric: 'Thought', keyEntities: { topic: 'Learning Velocity' } },
  { utterance: "Design idea: Ambient sound reactive life HUD with glassmorphism.", category: 'MIND_NOTES', destinationTable: 'mind_notes', intent: 'ADD_MIND_NOTE', subTypeOrMetric: 'Concept', keyEntities: { topic: 'Glassmorphism HUD' } },
  { utterance: "SaaS idea: AI-powered resume tailor tailored to individual job descriptions.", category: 'MIND_NOTES', destinationTable: 'mind_notes', intent: 'ADD_MIND_NOTE', subTypeOrMetric: 'SaaS', keyEntities: { topic: 'Resume Tailor' } },
  { utterance: "Thought: High agency individuals view constraints as puzzle pieces rather than roadblocks.", category: 'MIND_NOTES', destinationTable: 'mind_notes', intent: 'ADD_MIND_NOTE', subTypeOrMetric: 'Thought', keyEntities: { topic: 'High Agency' } }
];

export const MASTER_CATEGORY_MAP: Record<MasterCategory, {
  label: string;
  destinationTable: DestinationTable;
  description: string;
  defaultModule: any;
}> = {
  GOALS: { label: 'Life Goals', destinationTable: 'goals', description: 'Long-term outcomes and OKRs', defaultModule: 'goals' },
  TASKS: { label: 'Action Tasks', destinationTable: 'tasks', description: 'Specific actionable items and errands', defaultModule: 'tasks' },
  HABITS: { label: 'Daily Habits', destinationTable: 'habits', description: 'Recurring behaviors and routines', defaultModule: 'habits' },
  FINANCE: { label: 'Finance & Money', destinationTable: 'finance_transactions', description: 'Money movement, expenses, income, EMI, investments', defaultModule: 'finance' },
  HEALTH_FITNESS: { label: 'Health & Fitness', destinationTable: 'health_logs', description: 'Physical vitals, sleep, water, workouts, biometrics', defaultModule: 'health' },
  JOURNAL: { label: 'Journal & Mind', destinationTable: 'journal_entries', description: 'Reflections, feelings, emotional states, gratitude', defaultModule: 'journal' },
  MIND_NOTES: { label: 'Mind Notes & Ideas', destinationTable: 'mind_notes', description: 'Startup concepts, podcast topics, SaaS ideas, thoughts', defaultModule: 'journal' }
};

/**
 * Returns a few-shot training string for Gemini LLM system prompt
 */
export function getFewShotPromptSamples(): string {
  const selected = [
    INTENT_DATASET[0],  // Goal (₹1 crore)
    INTENT_DATASET[1],  // Goal (lose 10kg)
    INTENT_DATASET[32], // Task (call 10 prospects)
    INTENT_DATASET[33], // Task (submit taxes)
    INTENT_DATASET[64], // Habit (meditation)
    INTENT_DATASET[65], // Habit (3L water)
    INTENT_DATASET[94], // Finance (spent ₹500 on lunch)
    INTENT_DATASET[95], // Finance (today my transportation expense 700 rupees)
    INTENT_DATASET[96], // Finance (Hospital expense ₹5000)
    INTENT_DATASET[97], // Finance (Received ₹20,000 from client)
    INTENT_DATASET[98], // Finance (Car loan EMI 12000 paid)
    INTENT_DATASET[130], // Health (weight 54kg)
    INTENT_DATASET[133], // Health (ran 5km in 28 mins)
    INTENT_DATASET[134], // Health (slept 7.5h)
    INTENT_DATASET[162], // Journal (productive and closed two clients)
    INTENT_DATASET[163], // Journal (grateful for family)
    INTENT_DATASET[192], // Mind Notes (AI startup idea)
    INTENT_DATASET[193]  // Mind Notes (podcast topic)
  ];

  return selected.map(ex => 
    `Input: "${ex.utterance}" -> MasterCategory: "${ex.category}", Table: "${ex.destinationTable}", Intent: "${ex.intent}"`
  ).join('\n');
}
