import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Edit3, 
  Check, 
  X, 
  Sparkles, 
  DollarSign, 
  CheckSquare, 
  Repeat, 
  HeartPulse, 
  Target, 
  BookOpen, 
  ShieldCheck, 
  Database, 
  Lightbulb 
} from 'lucide-react';
import { 
  OmniCaptureResult, 
  OmniCaptureFields, 
  LifeModule, 
  MasterCategory, 
  DestinationTable, 
  FinanceSubType, 
  TaskPriority, 
  JournalMood, 
  HealthMetricType 
} from '../../types';
import { MASTER_CATEGORY_MAP } from '../../services/intentDataset';
import { useApp } from '../../context/AppContext';
import { FinanceCategoryPicker } from '../finance/FinanceCategoryPicker';

interface OmniCaptureCardProps {
  capture: OmniCaptureResult;
  onSave: (editedCapture: OmniCaptureResult) => void;
  onDismiss: () => void;
  isSaving?: boolean;
}

export const OmniCaptureCard: React.FC<OmniCaptureCardProps> = ({
  capture,
  onSave,
  onDismiss,
  isSaving = false
}) => {
  const { settings } = useApp();
  const activeCurrency = capture.fields?.currencySymbol || settings.currency || '₹';

  // Category & Routing State
  const initialCategory: MasterCategory = capture.masterCategory || 'TASKS';
  const [selectedCategory, setSelectedCategory] = useState<MasterCategory>(initialCategory);
  const [selectedModule, setSelectedModule] = useState<LifeModule>(capture.module || MASTER_CATEGORY_MAP[initialCategory]?.defaultModule || 'tasks');
  const [destinationTable, setDestinationTable] = useState<DestinationTable>(capture.destinationTable || MASTER_CATEGORY_MAP[initialCategory]?.destinationTable || 'tasks');

  // Mode: if low confidence or uncertain, start in 'review' mode; otherwise start in 'confirm' mode
  const [isEditing, setIsEditing] = useState<boolean>(capture.confidenceTier === 'low' || capture.isUncertain);
  const [fields, setFields] = useState<OmniCaptureFields>({ ...capture.fields });

  // Sync state if capture prop changes
  useEffect(() => {
    const cat = capture.masterCategory || 'TASKS';
    setSelectedCategory(cat);
    setSelectedModule(capture.module || MASTER_CATEGORY_MAP[cat]?.defaultModule || 'tasks');
    setDestinationTable(capture.destinationTable || MASTER_CATEGORY_MAP[cat]?.destinationTable || 'tasks');
    setIsEditing(capture.confidenceTier === 'low' || capture.isUncertain);
    setFields({ ...capture.fields });
  }, [capture]);

  const handleFieldChange = (key: keyof OmniCaptureFields, value: any) => {
    setFields(prev => ({ ...prev, [key]: value }));
  };

  const handleSwitchCategory = (newCat: MasterCategory) => {
    setSelectedCategory(newCat);
    const meta = MASTER_CATEGORY_MAP[newCat];
    setSelectedModule(meta.defaultModule);
    setDestinationTable(meta.destinationTable);

    // Auto-adjust default fields
    const updatedFields: OmniCaptureFields = {
      ...fields,
      masterCategory: newCat,
      destinationTable: meta.destinationTable
    };

    if (newCat === 'FINANCE' && !updatedFields.amount) {
      updatedFields.amount = 0;
      updatedFields.financeSubType = 'expense';
      updatedFields.category = 'Food & Dining';
    } else if (newCat === 'TASKS' && !updatedFields.title) {
      updatedFields.title = capture.rawInput;
      updatedFields.priority = 'medium';
    } else if (newCat === 'HABITS' && !updatedFields.habitName) {
      updatedFields.habitName = capture.rawInput;
    } else if (newCat === 'MIND_NOTES') {
      updatedFields.mindNoteCategory = updatedFields.mindNoteCategory || 'Startup Idea';
      updatedFields.title = updatedFields.title || capture.rawInput;
      updatedFields.content = capture.rawInput;
    } else if (newCat === 'JOURNAL') {
      updatedFields.content = capture.rawInput;
      updatedFields.mood = updatedFields.mood || 'productive';
    }

    setFields(updatedFields);
  };

  const handleConfirmSave = () => {
    const updatedCapture: OmniCaptureResult = {
      ...capture,
      masterCategory: selectedCategory,
      destinationTable,
      module: selectedModule,
      fields: {
        ...fields,
        masterCategory: selectedCategory,
        destinationTable
      },
      isUncertain: false
    };
    onSave(updatedCapture);
  };

  const confidencePercent = Math.round(capture.confidence * 100);

  const getConfidenceBadge = () => {
    if (confidencePercent >= 90) {
      return (
        <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-sm shadow-emerald-500/10">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{confidencePercent}% High Confidence</span>
        </span>
      );
    } else if (confidencePercent >= 70) {
      return (
        <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>{confidencePercent}% Medium Confidence</span>
        </span>
      );
    } else {
      return (
        <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold animate-pulse">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          <span>{confidencePercent}% Low Confidence — Review</span>
        </span>
      );
    }
  };

  const getCategoryTheme = (cat: MasterCategory) => {
    switch (cat) {
      case 'FINANCE':
        return {
          icon: <DollarSign className="w-4 h-4 text-emerald-400" />,
          badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          accent: 'text-emerald-400'
        };
      case 'HEALTH_FITNESS':
        return {
          icon: <HeartPulse className="w-4 h-4 text-rose-400" />,
          badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
          accent: 'text-rose-400'
        };
      case 'HABITS':
        return {
          icon: <Repeat className="w-4 h-4 text-amber-400" />,
          badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          accent: 'text-amber-400'
        };
      case 'TASKS':
        return {
          icon: <CheckSquare className="w-4 h-4 text-blue-400" />,
          badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
          accent: 'text-blue-400'
        };
      case 'GOALS':
        return {
          icon: <Target className="w-4 h-4 text-purple-400" />,
          badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
          accent: 'text-purple-400'
        };
      case 'JOURNAL':
        return {
          icon: <BookOpen className="w-4 h-4 text-indigo-400" />,
          badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
          accent: 'text-indigo-400'
        };
      case 'MIND_NOTES':
        return {
          icon: <Lightbulb className="w-4 h-4 text-cyan-400" />,
          badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
          accent: 'text-cyan-400'
        };
    }
  };

  const currentTheme = getCategoryTheme(selectedCategory);

  const categoriesList: { id: MasterCategory; label: string; table: DestinationTable }[] = [
    { id: 'FINANCE', label: 'Finance', table: 'finance_transactions' },
    { id: 'HEALTH_FITNESS', label: 'Health & Fitness', table: 'health_logs' },
    { id: 'HABITS', label: 'Habits', table: 'habits' },
    { id: 'TASKS', label: 'Tasks', table: 'tasks' },
    { id: 'GOALS', label: 'Goals', table: 'goals' },
    { id: 'JOURNAL', label: 'Journal', table: 'journal_entries' },
    { id: 'MIND_NOTES', label: 'Mind Notes', table: 'mind_notes' }
  ];

  return (
    <div className="rounded-2xl bg-slate-900/95 border border-indigo-500/40 p-5 sm:p-6 shadow-2xl space-y-5 animate-fadeIn backdrop-blur-xl">
      {/* Header Bar: Category + Destination Table + Confidence Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-start sm:items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 shadow-inner">
            {currentTheme.icon}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wide border ${currentTheme.badge}`}>
                {MASTER_CATEGORY_MAP[selectedCategory]?.label || selectedCategory}
              </span>
              
              {/* Destination Table Pill */}
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-mono">
                <Database className="w-3 h-3 text-indigo-400" />
                <span>{destinationTable}</span>
              </span>

              {getConfidenceBadge()}
            </div>
            
            <p className="text-xs text-slate-400 mt-1.5 line-clamp-1">
              Input: &ldquo;<span className="text-slate-200 italic font-medium">{capture.rawInput}</span>&rdquo;
            </p>
          </div>
        </div>

        {/* Top Action Tools */}
        <div className="flex items-center space-x-2 self-end sm:self-auto">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition"
              title="Edit fields before saving"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          )}
          <button
            onClick={onDismiss}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition"
            title="Dismiss card"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* LOW CONFIDENCE DISAMBIGUATION PROMPT (< 70%) */}
      {capture.confidenceTier === 'low' && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-indigo-500/10 border border-rose-500/30 space-y-3 animate-fadeIn">
          <div className="flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {capture.uncertainReason || 'Should I save this as a Task, Journal, or Mind Note?'}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Low confidence classification. Tap the correct category below:
              </p>
            </div>
          </div>

          {/* 1-Tap Category Pickers */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleSwitchCategory('TASKS')}
              className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
                selectedCategory === 'TASKS' 
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30' 
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-blue-500/40 hover:bg-slate-800'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 text-blue-400" />
              <span>📋 Task</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchCategory('JOURNAL')}
              className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
                selectedCategory === 'JOURNAL' 
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30' 
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-indigo-500/40 hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>📖 Journal</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchCategory('MIND_NOTES')}
              className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
                selectedCategory === 'MIND_NOTES' 
                  ? 'bg-cyan-600 text-white border-cyan-500 shadow-md shadow-cyan-600/30' 
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
              <span>💡 Mind Note</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchCategory('FINANCE')}
              className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
                selectedCategory === 'FINANCE' 
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30' 
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>💵 Finance</span>
            </button>
          </div>
        </div>
      )}

      {/* MEDIUM CONFIDENCE CONFIRMATION PILL (70% - 89%) */}
      {capture.confidenceTier === 'medium' && !isEditing && (
        <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Classified as <strong>{MASTER_CATEGORY_MAP[selectedCategory]?.label}</strong>. Need to change?</span>
          </div>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-xs text-indigo-400 hover:text-white underline font-semibold ml-2"
          >
            Switch Category
          </button>
        </div>
      )}

      {/* EDIT MODE: Category Switcher & Specific Field Inputs */}
      {isEditing ? (
        <div className="space-y-4 pt-1">
          {/* Master Category Selector Tabs */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Change Master Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
              {categoriesList.map(cat => {
                const isSelected = selectedCategory === cat.id;
                const theme = getCategoryTheme(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSwitchCategory(cat.id)}
                    className={`flex items-center justify-center space-x-1.5 py-2 px-2 rounded-xl text-xs font-bold border transition ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {theme.icon}
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields for Selected Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            {/* 1. FINANCE FIELDS */}
            {selectedCategory === 'FINANCE' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Amount ({activeCurrency})</label>
                  <input
                    type="number"
                    value={fields.amount !== undefined ? fields.amount : ''}
                    onChange={(e) => handleFieldChange('amount', parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                    placeholder="e.g. 700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Sub-Type</label>
                  <select
                    value={fields.financeSubType || 'expense'}
                    onChange={(e) => {
                      const st = e.target.value as FinanceSubType;
                      handleFieldChange('financeSubType', st);
                      handleFieldChange('transactionType', st === 'income' ? 'income' : 'expense');
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="expense">Expense (Outflow)</option>
                    <option value="income">Income (Inflow)</option>
                    <option value="investment">Investment (SIP / Stocks)</option>
                    <option value="emi">Loan / EMI Payment</option>
                    <option value="loan">Personal / Car Loan</option>
                    <option value="savings">Savings Transfer</option>
                    <option value="transfer">Bank Transfer</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
                  <input
                    type="text"
                    value={fields.description || ''}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Hospital expense, Groceries, Paid EMI..."
                  />
                </div>
                <div className="sm:col-span-2">
                  <FinanceCategoryPicker
                    type={fields.financeSubType === 'income' ? 'income' : 'expense'}
                    category={fields.category || (fields.financeSubType === 'income' ? 'Salary' : 'Food & Dining')}
                    subcategory={fields.subcategory}
                    onChange={(cat, sub) => {
                      handleFieldChange('category', cat);
                      handleFieldChange('subcategory', sub);
                    }}
                    descriptionText={fields.description || capture.rawInput}
                  />
                </div>
              </>
            )}

            {/* 2. HEALTH & FITNESS FIELDS */}
            {selectedCategory === 'HEALTH_FITNESS' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Metric Type</label>
                  <select
                    value={fields.healthMetricType || (fields.weightKg ? 'weight' : (fields.waterIntakeMl ? 'water' : 'workout'))}
                    onChange={(e) => handleFieldChange('healthMetricType', e.target.value as HealthMetricType)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="weight">Body Weight (kg)</option>
                    <option value="water">Water Intake (ml)</option>
                    <option value="sleep">Sleep (hours)</option>
                    <option value="workout">Workout / Fitness</option>
                    <option value="steps">Daily Steps</option>
                    <option value="bp">Blood Pressure</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Primary Value</label>
                  {(!fields.healthMetricType || fields.healthMetricType === 'weight') && (
                    <input
                      type="number"
                      step="0.1"
                      value={fields.weightKg || ''}
                      onChange={(e) => handleFieldChange('weightKg', parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. 54 kg"
                    />
                  )}
                  {fields.healthMetricType === 'water' && (
                    <input
                      type="number"
                      value={fields.waterIntakeMl || ''}
                      onChange={(e) => handleFieldChange('waterIntakeMl', parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. 500 ml"
                    />
                  )}
                  {fields.healthMetricType === 'sleep' && (
                    <input
                      type="number"
                      step="0.5"
                      value={fields.sleepHours || ''}
                      onChange={(e) => handleFieldChange('sleepHours', parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. 7.5 hours"
                    />
                  )}
                  {fields.healthMetricType === 'workout' && (
                    <input
                      type="text"
                      value={fields.workoutType || 'Running'}
                      onChange={(e) => handleFieldChange('workoutType', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. Running, Yoga, Gym"
                    />
                  )}
                  {fields.healthMetricType === 'steps' && (
                    <input
                      type="number"
                      value={fields.steps || ''}
                      onChange={(e) => handleFieldChange('steps', parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. 10000"
                    />
                  )}
                  {fields.healthMetricType === 'bp' && (
                    <input
                      type="text"
                      value={fields.bloodPressure || ''}
                      onChange={(e) => handleFieldChange('bloodPressure', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. 120/80"
                    />
                  )}
                </div>
              </>
            )}

            {/* 3. TASKS FIELDS */}
            {selectedCategory === 'TASKS' && (
              <>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Task Title</label>
                  <input
                    type="text"
                    value={fields.title || ''}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Tomorrow call 10 prospects"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={fields.dueDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleFieldChange('dueDate', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Priority</label>
                  <select
                    value={fields.priority || 'medium'}
                    onChange={(e) => handleFieldChange('priority', e.target.value as TaskPriority)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </>
            )}

            {/* 4. HABITS FIELDS */}
            {selectedCategory === 'HABITS' && (
              <>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Habit Title</label>
                  <input
                    type="text"
                    value={fields.habitName || fields.title || ''}
                    onChange={(e) => handleFieldChange('habitName', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Completed meditation today"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Cadence</label>
                  <span className="inline-block mt-2 text-xs font-bold text-amber-400">
                    Daily Routine (1 check-in/day)
                  </span>
                </div>
              </>
            )}

            {/* 5. GOALS FIELDS */}
            {selectedCategory === 'GOALS' && (
              <>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Life Goal Title</label>
                  <input
                    type="text"
                    value={fields.title || ''}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Reach ₹1 crore revenue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Target Metric / Value</label>
                  <input
                    type="text"
                    value={fields.targetMetric || ''}
                    onChange={(e) => handleFieldChange('targetMetric', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    placeholder="₹1 Crore, 10kg, 100k ARR"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Target Completion Date</label>
                  <input
                    type="date"
                    value={fields.targetDate || new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0]}
                    onChange={(e) => handleFieldChange('targetDate', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </>
            )}

            {/* 6. JOURNAL FIELDS */}
            {selectedCategory === 'JOURNAL' && (
              <>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Journal Reflection</label>
                  <textarea
                    rows={3}
                    value={fields.content || ''}
                    onChange={(e) => handleFieldChange('content', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    placeholder="Today I felt productive..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Emotional State / Mood</label>
                  <select
                    value={fields.mood || 'productive'}
                    onChange={(e) => handleFieldChange('mood', e.target.value as JournalMood)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="productive">Productive ⚡</option>
                    <option value="joyful">Joyful / Happy ✨</option>
                    <option value="calm">Calm / Peaceful 🌿</option>
                    <option value="anxious">Anxious / Stressed 🌊</option>
                    <option value="tired">Tired / Drained 💤</option>
                    <option value="neutral">Neutral ⚪</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Gratitude (Optional)</label>
                  <input
                    type="text"
                    value={fields.gratitude || ''}
                    onChange={(e) => handleFieldChange('gratitude', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    placeholder="Grateful for..."
                  />
                </div>
              </>
            )}

            {/* 7. MIND NOTES FIELDS */}
            {selectedCategory === 'MIND_NOTES' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Concept Type</label>
                  <select
                    value={fields.mindNoteCategory || 'Startup Idea'}
                    onChange={(e) => handleFieldChange('mindNoteCategory', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Startup Idea">Startup Idea 🚀</option>
                    <option value="SaaS">SaaS Concept 💻</option>
                    <option value="Podcast">Podcast Topic 🎙️</option>
                    <option value="Thought">Thought / Mindset 🧠</option>
                    <option value="Concept">Creative Concept 🎨</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Note Title</label>
                  <input
                    type="text"
                    value={fields.title || ''}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. AI Tax Prep for Freelancers"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Idea Details & Thoughts</label>
                  <textarea
                    rows={3}
                    value={fields.content || ''}
                    onChange={(e) => handleFieldChange('content', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    placeholder="Full idea description..."
                  />
                </div>
              </>
            )}
          </div>

          {/* Action buttons in Edit Mode */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmSave}
              disabled={isSaving}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition active:scale-95 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Confirm & Save'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* PREVIEW SCREEN BEFORE SAVE (High & Medium Confidence Mode) */
        <div className="space-y-4">
          {/* Extracted Structured Data Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            {/* Field 1: Primary Value */}
            {selectedCategory === 'FINANCE' && (
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Amount</span>
                <p className="text-lg font-black text-emerald-400">
                  {fields.currencySymbol || activeCurrency}{fields.amount !== undefined ? fields.amount.toLocaleString() : '0'}
                </p>
              </div>
            )}
            {selectedCategory === 'HEALTH_FITNESS' && (
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {fields.healthMetricType ? fields.healthMetricType.toUpperCase() : (fields.weightKg ? 'WEIGHT' : 'METRIC')}
                </span>
                <p className="text-lg font-black text-rose-400">
                  {fields.weightKg ? `${fields.weightKg} kg` : (fields.waterIntakeMl ? `${fields.waterIntakeMl} ml` : (fields.sleepHours ? `${fields.sleepHours} hrs` : (fields.steps ? `${fields.steps.toLocaleString()} steps` : (fields.bloodPressure ? `${fields.bloodPressure} mmHg` : `${fields.workoutMinutes || 30} mins`))))}
                </p>
              </div>
            )}
            {selectedCategory === 'TASKS' && (
              <div className="space-y-0.5 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Task Title</span>
                <p className="text-sm font-bold text-white truncate">{fields.title || capture.rawInput}</p>
              </div>
            )}
            {selectedCategory === 'HABITS' && (
              <div className="space-y-0.5 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Habit</span>
                <p className="text-sm font-bold text-amber-400">{fields.habitName || fields.title || 'Meditation'}</p>
              </div>
            )}
            {selectedCategory === 'GOALS' && (
              <div className="space-y-0.5 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Life Goal</span>
                <p className="text-sm font-bold text-purple-400">{fields.title || capture.rawInput}</p>
              </div>
            )}
            {selectedCategory === 'JOURNAL' && (
              <div className="space-y-0.5 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mood</span>
                <p className="text-sm font-bold text-indigo-400 capitalize">{fields.mood || 'productive'} ⚡</p>
              </div>
            )}
            {selectedCategory === 'MIND_NOTES' && (
              <div className="space-y-0.5 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Concept</span>
                <p className="text-sm font-bold text-cyan-400 truncate">{fields.title || capture.rawInput}</p>
              </div>
            )}

            {/* Field 2: Sub-Type or Category */}
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {selectedCategory === 'FINANCE' ? 'Category & Subcategory' : (selectedCategory === 'TASKS' ? 'Priority' : 'Category')}
              </span>
              {selectedCategory === 'FINANCE' ? (
                <div className="flex flex-wrap items-center gap-1 text-sm font-semibold text-slate-200">
                  <span>{fields.category || 'Food & Dining'}</span>
                  {fields.subcategory && (
                    <>
                      <span className="text-slate-600 text-xs">&gt;</span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/15 border border-emerald-500/30 text-[11px] text-emerald-300 font-bold">
                        {fields.subcategory}
                      </span>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-sm font-semibold text-slate-200 capitalize">
                  {selectedCategory === 'TASKS' 
                    ? (fields.priority || 'medium') 
                    : (selectedCategory === 'MIND_NOTES' 
                        ? (fields.mindNoteCategory || 'Idea') 
                        : (fields.category || 'General'))}
                </p>
              )}
            </div>

            {/* Field 3: Date */}
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {selectedCategory === 'TASKS' ? 'Due Date' : (selectedCategory === 'GOALS' ? 'Target Date' : 'Date')}
              </span>
              <p className="text-sm font-semibold text-slate-200">
                {fields.dueDate ? (fields.dueDate === new Date().toISOString().split('T')[0] ? 'Today' : fields.dueDate) : (fields.targetDate ? fields.targetDate : 'Today')}
              </p>
            </div>

            {/* Field 4: Destination Table Badge */}
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Destination Table</span>
              <p className="text-xs font-mono font-bold text-indigo-300 flex items-center space-x-1">
                <Database className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">{destinationTable}</span>
              </p>
            </div>
          </div>

          {/* AI Category Detected Badge for Finance with override option */}
          {selectedCategory === 'FINANCE' && fields.category && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 animate-fadeIn">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  AI Suggestion: <strong className="text-white">{fields.category}</strong>
                  {fields.subcategory ? <> &gt; <strong className="text-emerald-300">{fields.subcategory}</strong></> : ''}
                  <span className="text-emerald-400/80 ml-1.5 font-bold">
                    ({Math.round((fields.aiConfidence || capture.confidence) * 100)}% confidence)
                  </span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-xs text-emerald-400 hover:text-white underline font-semibold ml-2 shrink-0"
              >
                Override
              </button>
            </div>
          )}

          {/* Action Row: Summary + [Edit Details] + [Save to Supabase] */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <p className="text-xs text-slate-400 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{capture.summary}</span>
            </p>

            <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition"
              >
                Edit Details
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                disabled={isSaving}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/30 transition active:scale-95 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Confirm & Save'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
