import { ExpenseCategory, IncomeCategory } from '../types';

export interface CategoryDefinition {
  category: ExpenseCategory;
  subcategories: string[];
  iconName: string;
  color: string;
}

export const EXPENSE_TAXONOMY: Record<ExpenseCategory, CategoryDefinition> = {
  'Food & Dining': {
    category: 'Food & Dining',
    subcategories: ['Restaurant', 'Cafe', 'Groceries', 'Snacks', 'Food Delivery'],
    iconName: 'UtensilsCrossed',
    color: '#10B981'
  },
  'Transportation': {
    category: 'Transportation',
    subcategories: ['Fuel', 'Cab', 'Auto Rickshaw', 'Bus', 'Train', 'Flight', 'Parking'],
    iconName: 'Car',
    color: '#06B6D4'
  },
  'Health & Medical': {
    category: 'Health & Medical',
    subcategories: ['Doctor', 'Hospital', 'Medicine', 'Lab Tests', 'Health Insurance', 'Supplements'],
    iconName: 'HeartPulse',
    color: '#F43F5E'
  },
  'Housing & Utilities': {
    category: 'Housing & Utilities',
    subcategories: ['Rent', 'Electricity', 'Water', 'Internet', 'Mobile Recharge', 'Maintenance'],
    iconName: 'Home',
    color: '#6366F1'
  },
  'Shopping': {
    category: 'Shopping',
    subcategories: ['Clothing', 'Electronics', 'Home Items', 'Personal Care'],
    iconName: 'ShoppingBag',
    color: '#EC4899'
  },
  'Education & Learning': {
    category: 'Education & Learning',
    subcategories: ['Books', 'Courses', 'Coaching', 'Certifications'],
    iconName: 'GraduationCap',
    color: '#8B5CF6'
  },
  'Business Expenses': {
    category: 'Business Expenses',
    subcategories: ['Software', 'Advertising', 'Marketing', 'Team Salary', 'Freelancers', 'Office Expenses', 'Domain & Hosting'],
    iconName: 'Briefcase',
    color: '#3B82F6'
  },
  'Financial Obligations': {
    category: 'Financial Obligations',
    subcategories: ['EMI', 'Loan Payment', 'Credit Card Payment', 'Insurance Premium'],
    iconName: 'CreditCard',
    color: '#F59E0B'
  },
  'Investments & Savings': {
    category: 'Investments & Savings',
    subcategories: ['Mutual Funds', 'Stocks', 'Gold', 'Crypto', 'Fixed Deposit', 'Savings Transfer'],
    iconName: 'PiggyBank',
    color: '#14B8A6'
  },
  'Entertainment': {
    category: 'Entertainment',
    subcategories: ['Movies', 'OTT', 'Events', 'Gaming'],
    iconName: 'Film',
    color: '#A855F7'
  },
  'Travel': {
    category: 'Travel',
    subcategories: ['Hotels', 'Vacation', 'Tourism'],
    iconName: 'Plane',
    color: '#0EA5E9'
  },
  'Miscellaneous': {
    category: 'Miscellaneous',
    subcategories: ['Donations', 'Gifts', 'Other'],
    iconName: 'MoreHorizontal',
    color: '#94A3B8'
  }
};

export const INCOME_TAXONOMY: { category: IncomeCategory; iconName: string; color: string }[] = [
  { category: 'Salary', iconName: 'Wallet', color: '#10B981' },
  { category: 'Business Revenue', iconName: 'TrendingUp', color: '#3B82F6' },
  { category: 'Freelancing', iconName: 'Laptop', color: '#8B5CF6' },
  { category: 'Consulting', iconName: 'Users', color: '#6366F1' },
  { category: 'Commission', iconName: 'Coins', color: '#F59E0B' },
  { category: 'Affiliate Income', iconName: 'Link2', color: '#EC4899' },
  { category: 'Investment Income', iconName: 'PiggyBank', color: '#14B8A6' },
  { category: 'Rental Income', iconName: 'Home', color: '#06B6D4' },
  { category: 'Interest Income', iconName: 'Percent', color: '#10B981' },
  { category: 'Refunds', iconName: 'RotateCcw', color: '#0EA5E9' },
  { category: 'Other Income', iconName: 'PlusCircle', color: '#94A3B8' }
];

export interface CategorizationResult {
  category: string;
  subcategory?: string;
  confidence: number;
  reason: string;
}

/**
 * Real-time AI rule & keyword-based auto-categorizer
 */
export function autoCategorizeTransaction(
  input: string,
  type: 'expense' | 'income' = 'expense'
): CategorizationResult | null {
  const text = (input || '').trim();
  if (!text || text.length < 2) return null;
  const lower = text.toLowerCase();

  // --------------------------------------------------------------------------
  // INCOME AUTO-CATEGORIZATION
  // --------------------------------------------------------------------------
  if (type === 'income' || /\b(received|got paid|salary credited|client payment|earned|bonus|commission|refund|dividend)\b/i.test(lower)) {
    if (/\b(salary|payroll|paycheck|monthly salary)\b/i.test(lower)) {
      return { category: 'Salary', confidence: 0.98, reason: 'Salary keyword matched' };
    }
    if (/\b(client payment|client|customer payment|business revenue|stripe|invoice paid|sales)\b/i.test(lower)) {
      return { category: 'Business Revenue', confidence: 0.98, reason: 'Client / revenue keywords matched' };
    }
    if (/\b(freelance|freelancing|upwork|fiverr|gig|project payment)\b/i.test(lower)) {
      return { category: 'Freelancing', confidence: 0.98, reason: 'Freelancing keywords matched' };
    }
    if (/\b(consulting|advisory|hourly advisory)\b/i.test(lower)) {
      return { category: 'Consulting', confidence: 0.98, reason: 'Consulting keywords matched' };
    }
    if (/\b(commission|brokerage)\b/i.test(lower)) {
      return { category: 'Commission', confidence: 0.98, reason: 'Commission keywords matched' };
    }
    if (/\b(affiliate|referral|amazon affiliate)\b/i.test(lower)) {
      return { category: 'Affiliate Income', confidence: 0.98, reason: 'Affiliate keywords matched' };
    }
    if (/\b(dividend|capital gains|portfolio profit)\b/i.test(lower)) {
      return { category: 'Investment Income', confidence: 0.98, reason: 'Investment income keywords matched' };
    }
    if (/\b(tenant|rental|house rent received)\b/i.test(lower)) {
      return { category: 'Rental Income', confidence: 0.98, reason: 'Rental income keywords matched' };
    }
    if (/\b(interest|fd interest|savings interest)\b/i.test(lower)) {
      return { category: 'Interest Income', confidence: 0.98, reason: 'Interest keywords matched' };
    }
    if (/\b(refund|refunded|cashback|reimbursement)\b/i.test(lower)) {
      return { category: 'Refunds', confidence: 0.98, reason: 'Refund / cashback keywords matched' };
    }
    if (type === 'income') {
      return { category: 'Other Income', confidence: 0.85, reason: 'General income' };
    }
  }

  // --------------------------------------------------------------------------
  // EXPENSE AUTO-CATEGORIZATION (Subcategory Level)
  // --------------------------------------------------------------------------

  // 1. Health & Medical
  if (/\b(hospital|emergency room|admitted|icu|surgery|clinic)\b/i.test(lower)) {
    return { category: 'Health & Medical', subcategory: 'Hospital', confidence: 0.98, reason: 'Hospital matched' };
  }
  if (/\b(medicine|medicines|pharmacy|tablets|pills|syrup|chemist|drugs)\b/i.test(lower)) {
    return { category: 'Health & Medical', subcategory: 'Medicine', confidence: 0.98, reason: 'Medicine matched' };
  }
  if (/\b(doctor|physician|consultation fee|dentist|eye check|dermatologist|pediatrician)\b/i.test(lower)) {
    return { category: 'Health & Medical', subcategory: 'Doctor', confidence: 0.98, reason: 'Doctor matched' };
  }
  if (/\b(lab test|blood test|mri|x-ray|scan|pathology|diagnostic)\b/i.test(lower)) {
    return { category: 'Health & Medical', subcategory: 'Lab Tests', confidence: 0.98, reason: 'Lab test matched' };
  }
  if (/\b(health insurance|mediclaim|star health|hdfc ergo health)\b/i.test(lower)) {
    return { category: 'Health & Medical', subcategory: 'Health Insurance', confidence: 0.98, reason: 'Health insurance matched' };
  }
  if (/\b(supplements|whey protein|vitamins|creatine|multivitamin|omega 3)\b/i.test(lower)) {
    return { category: 'Health & Medical', subcategory: 'Supplements', confidence: 0.98, reason: 'Supplements matched' };
  }

  // 2. Financial Obligations
  if (/\b(emi|monthly installment|loan emi|car emi|home emi)\b/i.test(lower)) {
    return { category: 'Financial Obligations', subcategory: 'EMI', confidence: 0.98, reason: 'EMI matched' };
  }
  if (/\b(loan payment|personal loan|home loan|car loan|education loan)\b/i.test(lower)) {
    return { category: 'Financial Obligations', subcategory: 'Loan Payment', confidence: 0.98, reason: 'Loan payment matched' };
  }
  if (/\b(credit card payment|credit card bill|card bill|cc bill)\b/i.test(lower)) {
    return { category: 'Financial Obligations', subcategory: 'Credit Card Payment', confidence: 0.98, reason: 'Credit card payment matched' };
  }
  if (/\b(insurance premium|term insurance|lic premium|life insurance)\b/i.test(lower)) {
    return { category: 'Financial Obligations', subcategory: 'Insurance Premium', confidence: 0.98, reason: 'Insurance premium matched' };
  }

  // 3. Business Expenses
  if (/\b(facebook ads|meta ads|google ads|ad campaign|advertising|linkedin ads|instagram ads|twitter ads)\b/i.test(lower)) {
    return { category: 'Business Expenses', subcategory: 'Advertising', confidence: 0.98, reason: 'Advertising matched' };
  }
  if (/\b(software|saas|aws|github|notion|chatgpt|openai|cursor|adobe|slack|zoom)\b/i.test(lower)) {
    return { category: 'Business Expenses', subcategory: 'Software', confidence: 0.98, reason: 'Software subscription matched' };
  }
  if (/\b(marketing|pr|seo|branding|influencer)\b/i.test(lower)) {
    return { category: 'Business Expenses', subcategory: 'Marketing', confidence: 0.98, reason: 'Marketing matched' };
  }
  if (/\b(team salary|employee salary|payroll|staff payout)\b/i.test(lower)) {
    return { category: 'Business Expenses', subcategory: 'Team Salary', confidence: 0.98, reason: 'Team salary matched' };
  }
  if (/\b(freelancers|contractor|upwork freelancer|designer payout|developer payout)\b/i.test(lower)) {
    return { category: 'Business Expenses', subcategory: 'Freelancers', confidence: 0.98, reason: 'Freelancers matched' };
  }
  if (/\b(office expenses|coworking|wework|office rent|office supplies)\b/i.test(lower)) {
    return { category: 'Business Expenses', subcategory: 'Office Expenses', confidence: 0.98, reason: 'Office expenses matched' };
  }
  if (/\b(domain|hosting|godaddy|namecheap|vercel|cloudflare|digitalocean)\b/i.test(lower)) {
    return { category: 'Business Expenses', subcategory: 'Domain & Hosting', confidence: 0.98, reason: 'Domain & Hosting matched' };
  }

  // 4. Transportation
  if (/\b(fuel|petrol|diesel|gas refill|cng)\b/i.test(lower)) {
    return { category: 'Transportation', subcategory: 'Fuel', confidence: 0.98, reason: 'Fuel matched' };
  }
  if (/\b(uber|ola|cab|taxi|lyft)\b/i.test(lower)) {
    return { category: 'Transportation', subcategory: 'Cab', confidence: 0.98, reason: 'Cab matched' };
  }
  if (/\b(auto rickshaw|auto fare|tuk tuk|auto)\b/i.test(lower)) {
    return { category: 'Transportation', subcategory: 'Auto Rickshaw', confidence: 0.98, reason: 'Auto rickshaw matched' };
  }
  if (/\b(bus|bus ticket|bus pass|transit)\b/i.test(lower)) {
    return { category: 'Transportation', subcategory: 'Bus', confidence: 0.98, reason: 'Bus matched' };
  }
  if (/\b(train|metro|railway|irctc|subway pass)\b/i.test(lower)) {
    return { category: 'Transportation', subcategory: 'Train', confidence: 0.98, reason: 'Train matched' };
  }
  if (/\b(flight|air ticket|airline|indigo|air india|boarding pass)\b/i.test(lower)) {
    return { category: 'Transportation', subcategory: 'Flight', confidence: 0.98, reason: 'Flight matched' };
  }
  if (/\b(parking|parking fee|valet)\b/i.test(lower)) {
    return { category: 'Transportation', subcategory: 'Parking', confidence: 0.98, reason: 'Parking matched' };
  }
  if (/\b(transportation|transit|commute)\b/i.test(lower)) {
    return { category: 'Transportation', subcategory: 'Fuel', confidence: 0.92, reason: 'General transportation' };
  }

  // 5. Investments & Savings
  if (/\b(mutual fund|mutual funds|sip|zerodha coin|groww sip)\b/i.test(lower)) {
    return { category: 'Investments & Savings', subcategory: 'Mutual Funds', confidence: 0.98, reason: 'Mutual funds matched' };
  }
  if (/\b(stocks|shares|equity|zerodha kite|angelone|trading)\b/i.test(lower)) {
    return { category: 'Investments & Savings', subcategory: 'Stocks', confidence: 0.98, reason: 'Stocks matched' };
  }
  if (/\b(gold|sovereign gold bond|sgb|digital gold)\b/i.test(lower)) {
    return { category: 'Investments & Savings', subcategory: 'Gold', confidence: 0.98, reason: 'Gold matched' };
  }
  if (/\b(crypto|bitcoin|ethereum|solana|binance)\b/i.test(lower)) {
    return { category: 'Investments & Savings', subcategory: 'Crypto', confidence: 0.98, reason: 'Crypto matched' };
  }
  if (/\b(fixed deposit|fd|recurring deposit|rd)\b/i.test(lower)) {
    return { category: 'Investments & Savings', subcategory: 'Fixed Deposit', confidence: 0.98, reason: 'Fixed deposit matched' };
  }
  if (/\b(savings transfer|saved|transferred to savings|emergency fund)\b/i.test(lower)) {
    return { category: 'Investments & Savings', subcategory: 'Savings Transfer', confidence: 0.98, reason: 'Savings transfer matched' };
  }

  // 6. Food & Dining
  if (/\b(restaurant|dinner|lunch|dining|bistro|buffet|fine dining)\b/i.test(lower)) {
    return { category: 'Food & Dining', subcategory: 'Restaurant', confidence: 0.98, reason: 'Restaurant matched' };
  }
  if (/\b(cafe|coffee|starbucks|ccd|espresso|latte|tea|chai)\b/i.test(lower)) {
    return { category: 'Food & Dining', subcategory: 'Cafe', confidence: 0.98, reason: 'Cafe matched' };
  }
  if (/\b(groceries|grocery|supermarket|vegetables|fruits|milk|zepto|blinkit|instamart)\b/i.test(lower)) {
    return { category: 'Food & Dining', subcategory: 'Groceries', confidence: 0.98, reason: 'Groceries matched' };
  }
  if (/\b(food delivery|swiggy|zomato|ubereats|doordash)\b/i.test(lower)) {
    return { category: 'Food & Dining', subcategory: 'Food Delivery', confidence: 0.98, reason: 'Food delivery matched' };
  }
  if (/\b(snacks|chips|cookies|dessert|ice cream)\b/i.test(lower)) {
    return { category: 'Food & Dining', subcategory: 'Snacks', confidence: 0.98, reason: 'Snacks matched' };
  }

  // 7. Housing & Utilities
  if (/\b(rent|apartment rent|house rent|flat rent)\b/i.test(lower)) {
    return { category: 'Housing & Utilities', subcategory: 'Rent', confidence: 0.98, reason: 'Rent matched' };
  }
  if (/\b(electricity|power bill|electric bill|bescom|tneb|mseb)\b/i.test(lower)) {
    return { category: 'Housing & Utilities', subcategory: 'Electricity', confidence: 0.98, reason: 'Electricity matched' };
  }
  if (/\b(water bill|water tanker|water charge)\b/i.test(lower)) {
    return { category: 'Housing & Utilities', subcategory: 'Water', confidence: 0.98, reason: 'Water matched' };
  }
  if (/\b(internet|wifi|broadband|fiber|airtel fiber|jiofiber)\b/i.test(lower)) {
    return { category: 'Housing & Utilities', subcategory: 'Internet', confidence: 0.98, reason: 'Internet matched' };
  }
  if (/\b(mobile recharge|phone bill|postpaid|airtel recharge|jio recharge)\b/i.test(lower)) {
    return { category: 'Housing & Utilities', subcategory: 'Mobile Recharge', confidence: 0.98, reason: 'Mobile recharge matched' };
  }
  if (/\b(maintenance|society maintenance|building maintenance)\b/i.test(lower)) {
    return { category: 'Housing & Utilities', subcategory: 'Maintenance', confidence: 0.98, reason: 'Maintenance matched' };
  }

  // 8. Shopping
  if (/\b(clothing|clothes|shirt|pants|dress|zara|h&m|shoes|sneakers)\b/i.test(lower)) {
    return { category: 'Shopping', subcategory: 'Clothing', confidence: 0.98, reason: 'Clothing matched' };
  }
  if (/\b(electronics|gadget|laptop|iphone|macbook|ipad|headphones|charger)\b/i.test(lower)) {
    return { category: 'Shopping', subcategory: 'Electronics', confidence: 0.98, reason: 'Electronics matched' };
  }
  if (/\b(home items|furniture|ikea|decor|curtains|bedsheet|kitchenware)\b/i.test(lower)) {
    return { category: 'Shopping', subcategory: 'Home Items', confidence: 0.98, reason: 'Home items matched' };
  }
  if (/\b(personal care|skincare|haircut|salon|cosmetics|perfume|spa)\b/i.test(lower)) {
    return { category: 'Shopping', subcategory: 'Personal Care', confidence: 0.98, reason: 'Personal care matched' };
  }

  // 9. Education & Learning
  if (/\b(books|book|kindle|audiobook|audible)\b/i.test(lower)) {
    return { category: 'Education & Learning', subcategory: 'Books', confidence: 0.98, reason: 'Books matched' };
  }
  if (/\b(courses|course|udemy|coursera|masterclass|bootcamp)\b/i.test(lower)) {
    return { category: 'Education & Learning', subcategory: 'Courses', confidence: 0.98, reason: 'Courses matched' };
  }
  if (/\b(coaching|mentor|tutoring|consultancy)\b/i.test(lower)) {
    return { category: 'Education & Learning', subcategory: 'Coaching', confidence: 0.98, reason: 'Coaching matched' };
  }
  if (/\b(certifications|certification|exam fee|aws exam|gcp exam)\b/i.test(lower)) {
    return { category: 'Education & Learning', subcategory: 'Certifications', confidence: 0.98, reason: 'Certifications matched' };
  }

  // 10. Entertainment
  if (/\b(movies|movie|cinema|pvr|imax|theatre ticket)\b/i.test(lower)) {
    return { category: 'Entertainment', subcategory: 'Movies', confidence: 0.98, reason: 'Movies matched' };
  }
  if (/\b(netflix|prime video|disney\+|hotstar|ott|spotify|apple music|youtube premium)\b/i.test(lower)) {
    return { category: 'Entertainment', subcategory: 'OTT', confidence: 0.98, reason: 'OTT matched' };
  }
  if (/\b(concert|event|show|festival|standup comedy|match ticket)\b/i.test(lower)) {
    return { category: 'Entertainment', subcategory: 'Events', confidence: 0.98, reason: 'Events matched' };
  }
  if (/\b(gaming|steam|playstation|xbox|nintendo|game pass)\b/i.test(lower)) {
    return { category: 'Entertainment', subcategory: 'Gaming', confidence: 0.98, reason: 'Gaming matched' };
  }

  // 11. Travel
  if (/\b(hotels|hotel|airbnb|resort|homestay|booking\.com)\b/i.test(lower)) {
    return { category: 'Travel', subcategory: 'Hotels', confidence: 0.98, reason: 'Hotels matched' };
  }
  if (/\b(vacation|holiday trip|weekend getaway|retreat)\b/i.test(lower)) {
    return { category: 'Travel', subcategory: 'Vacation', confidence: 0.98, reason: 'Vacation matched' };
  }
  if (/\b(tourism|sightseeing|museum ticket|tour guide)\b/i.test(lower)) {
    return { category: 'Travel', subcategory: 'Tourism', confidence: 0.98, reason: 'Tourism matched' };
  }

  // 12. Miscellaneous
  if (/\b(donation|charity|temple|ngo|relief fund|donate)\b/i.test(lower)) {
    return { category: 'Miscellaneous', subcategory: 'Donations', confidence: 0.98, reason: 'Donations matched' };
  }
  if (/\b(gift|gifts|birthday present|anniversary gift|flowers)\b/i.test(lower)) {
    return { category: 'Miscellaneous', subcategory: 'Gifts', confidence: 0.98, reason: 'Gifts matched' };
  }

  return { category: 'Miscellaneous', subcategory: 'Other', confidence: 0.70, reason: 'Default fallback' };
}

const SEARCH_ALIASES: Record<string, { category: string; subcategory?: string }> = {
  'ad': { category: 'Business Expenses', subcategory: 'Advertising' },
  'ads': { category: 'Business Expenses', subcategory: 'Advertising' },
  'doc': { category: 'Health & Medical', subcategory: 'Doctor' },
  'meds': { category: 'Health & Medical', subcategory: 'Medicine' },
  'petrol': { category: 'Transportation', subcategory: 'Fuel' },
  'diesel': { category: 'Transportation', subcategory: 'Fuel' },
  'gas': { category: 'Transportation', subcategory: 'Fuel' },
  'uber': { category: 'Transportation', subcategory: 'Cab' },
  'ola': { category: 'Transportation', subcategory: 'Cab' },
  'taxi': { category: 'Transportation', subcategory: 'Cab' },
  'auto': { category: 'Transportation', subcategory: 'Auto Rickshaw' },
  'rickshaw': { category: 'Transportation', subcategory: 'Auto Rickshaw' },
  'train': { category: 'Transportation', subcategory: 'Train' },
  'metro': { category: 'Transportation', subcategory: 'Train' },
  'flight': { category: 'Transportation', subcategory: 'Flight' },
  'plane': { category: 'Transportation', subcategory: 'Flight' },
  'wifi': { category: 'Housing & Utilities', subcategory: 'Internet' },
  'broadband': { category: 'Housing & Utilities', subcategory: 'Internet' },
  'phone': { category: 'Housing & Utilities', subcategory: 'Mobile Recharge' },
  'recharge': { category: 'Housing & Utilities', subcategory: 'Mobile Recharge' },
  'elec': { category: 'Housing & Utilities', subcategory: 'Electricity' },
  'power': { category: 'Housing & Utilities', subcategory: 'Electricity' },
  'bill': { category: 'Housing & Utilities', subcategory: 'Electricity' },
  'cc': { category: 'Financial Obligations', subcategory: 'Credit Card Payment' },
  'card': { category: 'Financial Obligations', subcategory: 'Credit Card Payment' },
  'sip': { category: 'Investments & Savings', subcategory: 'Mutual Funds' },
  'mf': { category: 'Investments & Savings', subcategory: 'Mutual Funds' },
  'fd': { category: 'Investments & Savings', subcategory: 'Fixed Deposit' },
  'btc': { category: 'Investments & Savings', subcategory: 'Crypto' },
  'eth': { category: 'Investments & Savings', subcategory: 'Crypto' },
  'netflix': { category: 'Entertainment', subcategory: 'OTT' },
  'spotify': { category: 'Entertainment', subcategory: 'OTT' },
  'movie': { category: 'Entertainment', subcategory: 'Movies' },
  'cinema': { category: 'Entertainment', subcategory: 'Movies' },
  'gym': { category: 'Health & Medical', subcategory: 'Supplements' },
  'protein': { category: 'Health & Medical', subcategory: 'Supplements' },
  'hotel': { category: 'Travel', subcategory: 'Hotels' },
  'stay': { category: 'Travel', subcategory: 'Hotels' }
};

/**
 * Instant fuzzy search across all categories and subcategories
 */
export function searchTaxonomy(
  query: string,
  type: 'expense' | 'income' = 'expense'
): { category: string; subcategory?: string; matchType: 'category' | 'subcategory' }[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: { category: string; subcategory?: string; matchType: 'category' | 'subcategory' }[] = [];
  const added = new Set<string>();

  const addResult = (cat: string, sub?: string, mType: 'category' | 'subcategory' = 'subcategory') => {
    const key = `${cat}:::${sub || ''}`;
    if (!added.has(key)) {
      added.add(key);
      results.push({ category: cat, subcategory: sub, matchType: mType });
    }
  };

  // Check aliases first
  if (SEARCH_ALIASES[q]) {
    const alias = SEARCH_ALIASES[q];
    addResult(alias.category, alias.subcategory, alias.subcategory ? 'subcategory' : 'category');
  }

  if (type === 'income') {
    INCOME_TAXONOMY.forEach(inc => {
      if (inc.category.toLowerCase().includes(q)) {
        addResult(inc.category, undefined, 'category');
      }
    });
    return results.slice(0, 8);
  }

  Object.values(EXPENSE_TAXONOMY).forEach(def => {
    // Check if category matches
    if (def.category.toLowerCase().includes(q)) {
      addResult(def.category, undefined, 'category');
    }

    // Check subcategories
    def.subcategories.forEach(sub => {
      if (sub.toLowerCase().includes(q)) {
        addResult(def.category, sub, 'subcategory');
      }
    });
  });

  return results.slice(0, 8);
}
