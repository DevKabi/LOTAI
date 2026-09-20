import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TransactionType, FinanceCategory } from '../../types';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { EmptyState } from '../common/EmptyState';
import { 
  DollarSign, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Trash2, 
  Wallet,
  ShoppingBag,
  Home,
  Car,
  UtensilsCrossed,
  Film,
  HeartPulse,
  GraduationCap,
  Briefcase,
  CreditCard,
  PiggyBank,
  Plane,
  Zap,
  Tag
} from 'lucide-react';
import { FinanceCategoryPicker } from '../finance/FinanceCategoryPicker';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';

export const FinanceView: React.FC = () => {
  const { finances, addFinance, deleteFinance, settings, isDataLoading } = useApp();
  const [filterType, setFilterType] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<FinanceCategory>('Food & Dining');
  const [subcategory, setSubcategory] = useState<string | undefined>('Restaurant');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<string>('Credit / Debit Card');

  // Aggregate totals
  const totalIncome = finances
    .filter(f => f.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = finances
    .filter(f => f.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netSavings = totalIncome - totalExpense;

  // Category Breakdown for Pie Chart
  const expenseByCategory = finances
    .filter(f => f.type === 'expense')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({
    name,
    value: Math.round(value)
  }));

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#f43f5e', '#64748b'];

  // Cashflow comparison bar data
  const cashflowData = [
    { name: 'Income', amount: totalIncome, fill: '#10b981' },
    { name: 'Expenses', amount: totalExpense, fill: '#f43f5e' },
    { name: 'Net', amount: Math.max(0, netSavings), fill: '#6366f1' }
  ];

  const filteredFinances = filterType === 'all'
    ? finances
    : finances.filter(f => f.type === filterType);

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    const finalDesc = description.trim() 
      ? description.trim()
      : (subcategory ? `${subcategory} (${category})` : `${category} ${type}`);

    addFinance({
      type,
      amount: parsedAmount,
      category,
      subcategory,
      description: finalDesc,
      date,
      paymentMethod
    });

    setAmount('');
    setDescription('');
    setIsAddModalOpen(false);
  };

  const getCategoryIcon = (cat: FinanceCategory) => {
    switch (cat) {
      case 'Food & Dining': return <UtensilsCrossed className="w-4 h-4 text-emerald-400" />;
      case 'Transportation': return <Car className="w-4 h-4 text-cyan-400" />;
      case 'Health & Medical': return <HeartPulse className="w-4 h-4 text-rose-400" />;
      case 'Housing & Utilities':
      case 'Housing & Rent': return <Home className="w-4 h-4 text-indigo-400" />;
      case 'Shopping':
      case 'Shopping & Groceries': return <ShoppingBag className="w-4 h-4 text-pink-400" />;
      case 'Education & Learning': return <GraduationCap className="w-4 h-4 text-purple-400" />;
      case 'Business Expenses': return <Briefcase className="w-4 h-4 text-blue-400" />;
      case 'Financial Obligations': return <CreditCard className="w-4 h-4 text-amber-400" />;
      case 'Investments & Savings':
      case 'Investment & Savings': return <PiggyBank className="w-4 h-4 text-teal-400" />;
      case 'Entertainment': return <Film className="w-4 h-4 text-fuchsia-400" />;
      case 'Travel': return <Plane className="w-4 h-4 text-sky-400" />;
      case 'Salary':
      case 'Salary & Earnings': return <Wallet className="w-4 h-4 text-emerald-400" />;
      case 'Business Revenue': return <TrendingUp className="w-4 h-4 text-blue-400" />;
      case 'Utilities': return <Zap className="w-4 h-4 text-yellow-400" />;
      default: return <Tag className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white">Finance & Wealth</h1>
            <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Master your cashflow, monitor spending by category, and maintain fiscal freedom.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-lg shadow-emerald-600/30 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Loading Skeleton */}
      {isDataLoading && <LoadingSkeleton rows={4} />}

      {!isDataLoading && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Income Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Inflow</span>
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-2 truncate">
                {settings.currency}{totalIncome.toLocaleString()}
              </h2>
              <p className="text-[11px] text-emerald-400 mt-1 font-medium">Income streams recorded</p>
            </div>

            {/* Expense Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Outflow</span>
                <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                  <TrendingDown className="w-4 h-4" />
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-2 truncate">
                {settings.currency}{totalExpense.toLocaleString()}
              </h2>
              <p className="text-[11px] text-slate-400 mt-1 truncate">
                Budget limit: {settings.currency}{settings.monthlyBudget.toLocaleString()}
              </p>
            </div>

            {/* Net Savings Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Net Cashflow</span>
                <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Wallet className="w-4 h-4" />
                </span>
              </div>
              <h2 className={`text-xl sm:text-2xl font-black mt-2 truncate ${netSavings >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {settings.currency}{netSavings.toLocaleString()}
              </h2>
              <p className="text-[11px] text-slate-400 mt-1">
                {netSavings >= 0 ? 'Surplus retained' : 'Deficit alert'}
              </p>
            </div>
          </div>

          {/* Visualizations Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Spending By Category Donut */}
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-3 sm:mb-4">Expenses by Category</h3>
              {pieData.length === 0 ? (
                <div className="h-48 sm:h-60 flex items-center justify-center text-slate-500 text-xs">
                  No expense records logged yet
                </div>
              ) : (
                <div className="h-56 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '12px' }}
                        formatter={(val: any) => [`${settings.currency}${val}`, 'Amount']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-2 mt-1 sm:mt-2">
                    {pieData.slice(0, 5).map((entry, idx) => (
                      <span key={idx} className="text-[10px] sm:text-[11px] text-slate-400 flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                        <span>{entry.name}: {settings.currency}{entry.value}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cashflow Bar Overview */}
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-3 sm:mb-4">Inflow vs Outflow</h3>
              <div className="h-56 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cashflowData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '12px' }}
                      formatter={(val: any) => [`${settings.currency}${val}`, 'Amount']}
                    />
                    <Bar dataKey="amount" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Recent Transactions</h3>
              <div className="flex space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {['all', 'expense', 'income'].map(ft => (
                  <button
                    key={ft}
                    onClick={() => setFilterType(ft)}
                    className={`text-xs capitalize px-2.5 sm:px-3 py-1 rounded-lg font-medium transition ${
                      filterType === ft ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {ft}
                  </button>
                ))}
              </div>
            </div>

            {filteredFinances.length === 0 ? (
              <EmptyState
                icon={DollarSign}
                title="No Transactions Logged"
                description={filterType === 'all' ? "Keep tabs on your cashflow and maintain your budget. Start by logging your first transaction." : `No ${filterType} transactions recorded yet.`}
                actionLabel="Add Transaction"
                onAction={() => setIsAddModalOpen(true)}
                accentColor="emerald"
              />
            ) : (
              <div className="divide-y divide-slate-800 overflow-x-auto">
                {filteredFinances.map(record => (
                  <div key={record.id} className="py-3 flex items-center justify-between space-x-3 sm:space-x-4">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 shrink-0">
                        {getCategoryIcon(record.category)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-slate-100 truncate">
                          {record.description}
                        </h4>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mt-0.5">
                          <span className="text-[11px] sm:text-xs text-slate-400 font-medium truncate">
                            {record.category}
                          </span>
                          {record.subcategory && (
                            <>
                              <span className="text-slate-600 text-xs hidden sm:inline">&gt;</span>
                              <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] sm:text-[11px] text-emerald-300 font-medium">
                                {record.subcategory}
                              </span>
                            </>
                          )}
                          <span className="text-slate-600 text-xs hidden sm:inline">•</span>
                          <span className="text-[11px] sm:text-xs text-slate-500">{record.date}</span>
                          {record.paymentMethod && (
                            <span className="hidden md:inline px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700/60 font-medium">
                              {record.paymentMethod}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
                      <span className={`text-sm font-bold ${record.type === 'income' ? 'text-emerald-400' : 'text-slate-200'}`}>
                        {record.type === 'income' ? '+' : '-'}{settings.currency}{record.amount.toFixed(2)}
                      </span>
                      <button
                        onClick={() => deleteFinance(record.id)}
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 active:scale-95 transition"
                        title="Delete Transaction"
                        aria-label="Delete Transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Add Transaction Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white">Log Transaction</h2>
            <form onSubmit={handleCreateTransaction} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setType('expense');
                    setCategory('Food & Dining');
                    setSubcategory('Restaurant');
                  }}
                  className={`py-2 rounded-lg text-xs font-bold transition ${
                    type === 'expense' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType('income');
                    setCategory('Salary');
                    setSubcategory(undefined);
                  }}
                  className={`py-2 rounded-lg text-xs font-bold transition ${
                    type === 'income' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Income
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Amount ({settings.currency}) *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center font-bold text-slate-400 text-sm pointer-events-none select-none">
                    {settings.currency}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Description / Note</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Hospital expense, Groceries, Paid EMI..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Hierarchical Category & Subcategory Picker */}
              <FinanceCategoryPicker
                type={type}
                category={category}
                subcategory={subcategory}
                onChange={(cat, sub) => {
                  setCategory(cat as FinanceCategory);
                  setSubcategory(sub);
                }}
                descriptionText={description}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Credit / Debit Card">Credit / Debit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="UPI / Instant Pay">UPI / Instant Pay</option>
                    <option value="Digital Wallet">Digital Wallet (Apple / Google Pay)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-md shadow-emerald-600/30 min-h-[44px]"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
