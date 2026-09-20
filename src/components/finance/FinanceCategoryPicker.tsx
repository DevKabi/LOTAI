import React, { useState, useEffect, useRef } from 'react';
import { 
  UtensilsCrossed, 
  Car, 
  HeartPulse, 
  Home, 
  ShoppingBag, 
  GraduationCap, 
  Briefcase, 
  CreditCard, 
  PiggyBank, 
  Film, 
  Plane, 
  MoreHorizontal, 
  Sparkles, 
  Search, 
  Check, 
  ChevronDown, 
  History, 
  Wallet, 
  TrendingUp, 
  Laptop, 
  Users, 
  Coins, 
  Link2, 
  Percent, 
  RotateCcw, 
  PlusCircle, 
  X 
} from 'lucide-react';
import { ExpenseCategory } from '../../types';
import { 
  EXPENSE_TAXONOMY, 
  INCOME_TAXONOMY, 
  autoCategorizeTransaction, 
  searchTaxonomy 
} from '../../services/financeTaxonomy';

interface RecentCategoryItem {
  category: string;
  subcategory?: string;
  type: 'expense' | 'income';
}

interface FinanceCategoryPickerProps {
  type: 'expense' | 'income';
  category: string;
  subcategory?: string;
  onChange: (category: string, subcategory?: string) => void;
  descriptionText?: string;
  aiSuggestion?: {
    category: string;
    subcategory?: string;
    confidence: number;
    reason?: string;
  } | null;
}

export const FinanceCategoryPicker: React.FC<FinanceCategoryPickerProps> = ({
  type,
  category,
  subcategory,
  onChange,
  descriptionText = '',
  aiSuggestion: externalAiSuggestion
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [recentList, setRecentList] = useState<RecentCategoryItem[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Auto-computed AI suggestion based on descriptionText
  const [liveAiSuggestion, setLiveAiSuggestion] = useState<{
    category: string;
    subcategory?: string;
    confidence: number;
  } | null>(null);

  // Load recents on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('lotai_recent_finance_categories');
      if (stored) {
        setRecentList(JSON.parse(stored));
      }
    } catch {}
  }, []);

  // Compute live AI suggestion as description changes
  useEffect(() => {
    if (externalAiSuggestion) {
      setLiveAiSuggestion(externalAiSuggestion);
    } else if (descriptionText.trim().length >= 3) {
      const detected = autoCategorizeTransaction(descriptionText, type);
      if (detected && detected.confidence >= 0.75) {
        setLiveAiSuggestion(detected);
      } else {
        setLiveAiSuggestion(null);
      }
    } else {
      setLiveAiSuggestion(null);
    }
  }, [descriptionText, type, externalAiSuggestion]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveToRecent = (cat: string, sub?: string) => {
    try {
      const current = recentList.filter(
        item => !(item.category === cat && item.subcategory === sub && item.type === type)
      );
      const updated: RecentCategoryItem[] = [{ category: cat, subcategory: sub, type }, ...current].slice(0, 4);
      setRecentList(updated);
      localStorage.setItem('lotai_recent_finance_categories', JSON.stringify(updated));
    } catch {}
  };

  const handleSelectCategory = (cat: string) => {
    let defaultSub: string | undefined = undefined;
    if (type === 'expense' && EXPENSE_TAXONOMY[cat as ExpenseCategory]) {
      defaultSub = EXPENSE_TAXONOMY[cat as ExpenseCategory].subcategories[0];
    }
    onChange(cat, defaultSub);
    saveToRecent(cat, defaultSub);
  };

  const handleSelectSubcategory = (sub: string) => {
    onChange(category, sub);
    saveToRecent(category, sub);
  };

  const handleApplyAiSuggestion = () => {
    if (!liveAiSuggestion) return;
    onChange(liveAiSuggestion.category, liveAiSuggestion.subcategory);
    saveToRecent(liveAiSuggestion.category, liveAiSuggestion.subcategory);
  };

  const handleSelectSearchResult = (cat: string, sub?: string) => {
    onChange(cat, sub);
    saveToRecent(cat, sub);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const getCategoryIcon = (catName: string) => {
    switch (catName) {
      case 'Food & Dining': return <UtensilsCrossed className="w-4 h-4 text-emerald-400" />;
      case 'Transportation': return <Car className="w-4 h-4 text-cyan-400" />;
      case 'Health & Medical': return <HeartPulse className="w-4 h-4 text-rose-400" />;
      case 'Housing & Utilities': return <Home className="w-4 h-4 text-indigo-400" />;
      case 'Shopping': return <ShoppingBag className="w-4 h-4 text-pink-400" />;
      case 'Education & Learning': return <GraduationCap className="w-4 h-4 text-purple-400" />;
      case 'Business Expenses': return <Briefcase className="w-4 h-4 text-blue-400" />;
      case 'Financial Obligations': return <CreditCard className="w-4 h-4 text-amber-400" />;
      case 'Investments & Savings': return <PiggyBank className="w-4 h-4 text-teal-400" />;
      case 'Entertainment': return <Film className="w-4 h-4 text-purple-400" />;
      case 'Travel': return <Plane className="w-4 h-4 text-sky-400" />;
      case 'Salary': return <Wallet className="w-4 h-4 text-emerald-400" />;
      case 'Business Revenue': return <TrendingUp className="w-4 h-4 text-blue-400" />;
      case 'Freelancing': return <Laptop className="w-4 h-4 text-purple-400" />;
      case 'Consulting': return <Users className="w-4 h-4 text-indigo-400" />;
      case 'Commission': return <Coins className="w-4 h-4 text-amber-400" />;
      case 'Affiliate Income': return <Link2 className="w-4 h-4 text-pink-400" />;
      case 'Investment Income': return <PiggyBank className="w-4 h-4 text-teal-400" />;
      case 'Rental Income': return <Home className="w-4 h-4 text-cyan-400" />;
      case 'Interest Income': return <Percent className="w-4 h-4 text-emerald-400" />;
      case 'Refunds': return <RotateCcw className="w-4 h-4 text-sky-400" />;
      case 'Other Income': return <PlusCircle className="w-4 h-4 text-slate-400" />;
      default: return <MoreHorizontal className="w-4 h-4 text-slate-400" />;
    }
  };

  const filteredRecents = recentList.filter(item => item.type === type);
  const searchResults = searchTaxonomy(searchQuery, type);
  const currentExpenseDef = type === 'expense' ? EXPENSE_TAXONOMY[category as ExpenseCategory] : null;

  const isAiApplied = liveAiSuggestion && 
    liveAiSuggestion.category === category && 
    (!liveAiSuggestion.subcategory || liveAiSuggestion.subcategory === subcategory);

  return (
    <div className="space-y-3">
      {/* 1. AI SUGGESTION BADGE */}
      {liveAiSuggestion && (
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-slate-900 border border-indigo-500/30 text-xs animate-fadeIn">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse shrink-0" />
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-300 mr-1.5">
                AI Suggestion:
              </span>
              <span className="font-bold text-white">
                {liveAiSuggestion.category}
                {liveAiSuggestion.subcategory ? ` > ${liveAiSuggestion.subcategory}` : ''}
              </span>
              <span className="text-emerald-400 font-bold ml-1.5">
                ({Math.round(liveAiSuggestion.confidence * 100)}% confidence)
              </span>
            </div>
          </div>

          {!isAiApplied ? (
            <button
              type="button"
              onClick={handleApplyAiSuggestion}
              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold shadow-sm transition shrink-0 ml-2"
            >
              Apply
            </button>
          ) : (
            <span className="flex items-center space-x-1 text-emerald-400 text-[11px] font-bold shrink-0 ml-2">
              <Check className="w-3.5 h-3.5" />
              <span>Applied</span>
            </span>
          )}
        </div>
      )}

      {/* 2. RECENT CATEGORIES QUICK PILLS */}
      {filteredRecents.length > 0 && (
        <div>
          <div className="flex items-center space-x-1 text-[11px] font-semibold text-slate-400 mb-1.5">
            <History className="w-3 h-3 text-slate-500" />
            <span>Recent:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {filteredRecents.map((item, idx) => {
              const isSelected = item.category === category && (!item.subcategory || item.subcategory === subcategory);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onChange(item.category, item.subcategory);
                  }}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                  }`}
                >
                  {getCategoryIcon(item.category)}
                  <span>{item.category}</span>
                  {item.subcategory && (
                    <span className="text-slate-400 text-[10px]">
                      › {item.subcategory}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. INSTANT SEARCH BOX */}
      <div ref={searchContainerRef} className="relative">
        <div className="relative">
          <Search className="absolute inset-y-0 left-3 my-auto w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsSearchOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            placeholder="Search category or subcategory (e.g. Fuel, Hospital, Ads, EMI)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-8 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute inset-y-0 right-2.5 my-auto text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search Results Flyout */}
        {isSearchOpen && searchQuery.trim() && (
          <div className="absolute z-50 left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-xl bg-slate-900 border border-indigo-500/30 p-1.5 shadow-2xl space-y-1 backdrop-blur-xl">
            {searchResults.length > 0 ? (
              searchResults.map((res, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSearchResult(res.category, res.subcategory)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-slate-800 text-xs transition group"
                >
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(res.category)}
                    <div>
                      <span className="font-bold text-white group-hover:text-indigo-300">
                        {res.category}
                      </span>
                      {res.subcategory && (
                        <span className="text-slate-400 ml-1.5">
                          › <strong className="text-emerald-400 font-semibold">{res.subcategory}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 group-hover:text-indigo-400">
                    Select
                  </span>
                </button>
              ))
            ) : (
              <div className="p-3 text-center text-xs text-slate-500">
                No matching category or subcategory found for &ldquo;{searchQuery}&rdquo;.
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. TWO-TIER DROPDOWNS: CATEGORY & SUBCATEGORY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Primary Category Select */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Category
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              {getCategoryIcon(category)}
            </div>
            <select
              value={category}
              onChange={(e) => handleSelectCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-8 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 appearance-none font-medium cursor-pointer"
            >
              {type === 'expense' ? (
                Object.keys(EXPENSE_TAXONOMY).map(catName => (
                  <option key={catName} value={catName}>
                    {catName}
                  </option>
                ))
              ) : (
                INCOME_TAXONOMY.map(inc => (
                  <option key={inc.category} value={inc.category}>
                    {inc.category}
                  </option>
                ))
              )}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute inset-y-0 right-3 my-auto pointer-events-none" />
          </div>
        </div>

        {/* Subcategory Select (for Expense) or Sub-stream / Notes (for Income) */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Subcategory
          </label>
          {type === 'expense' && currentExpenseDef ? (
            <div className="relative">
              <select
                value={subcategory || currentExpenseDef.subcategories[0]}
                onChange={(e) => handleSelectSubcategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 pr-8 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 appearance-none font-medium cursor-pointer"
              >
                {currentExpenseDef.subcategories.map(subName => (
                  <option key={subName} value={subName}>
                    {subName}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute inset-y-0 right-3 my-auto pointer-events-none" />
            </div>
          ) : (
            <div className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 font-medium">
              Direct Inflow Category
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
