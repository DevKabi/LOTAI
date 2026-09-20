import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { GeminiService } from '../../services/geminiService';
import { AnalyticsEngine } from '../../services/analyticsEngine';
import { AnalyticsTimeRange, GeneratedReport } from '../../types';
import { 
  PieChart, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck, 
  Flame, 
  Droplet,
  Target,
  CheckSquare,
  Repeat,
  HeartPulse,
  DollarSign,
  Brain,
  Calendar,
  TrendingUp,
  Download,
  Copy,
  Check,
  X,
  FileText,
  Award
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Pie,
  Cell
} from 'recharts';

export const AnalyticsView: React.FC = () => {
  const { 
    analyticsMetrics, 
    habits, 
    tasks, 
    finances, 
    health, 
    journal, 
    settings 
  } = useApp();

  const [timeRange, setTimeRange] = useState<AnalyticsTimeRange>('7d');
  const [activeReport, setActiveReport] = useState<GeneratedReport | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);
  const [aiInsightNotes, setAiInsightNotes] = useState<string | null>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  // Determine number of trend days
  const daysCount = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 14;

  // Generate daily time-series data for charts
  const trendData = useMemo(() => {
    return AnalyticsEngine.generateTrendSeries(daysCount, habits, tasks, health, finances);
  }, [daysCount, habits, tasks, health, finances]);

  // Generate correlation insights
  const correlationInsights = useMemo(() => {
    return AnalyticsEngine.generateCorrelationInsights(analyticsMetrics);
  }, [analyticsMetrics]);

  // 6-Pillar Radar Data
  const radarData = [
    { subject: 'Goals', value: analyticsMetrics.breakdown.goalsScore || analyticsMetrics.goals.overallCompletionRate, fullMark: 100 },
    { subject: 'Tasks', value: analyticsMetrics.breakdown.tasksScore, fullMark: 100 },
    { subject: 'Habits', value: analyticsMetrics.breakdown.habitsScore, fullMark: 100 },
    { subject: 'Health', value: analyticsMetrics.breakdown.healthScore, fullMark: 100 },
    { subject: 'Finance', value: analyticsMetrics.breakdown.financeScore, fullMark: 100 },
    { subject: 'Mind', value: analyticsMetrics.breakdown.mindScore, fullMark: 100 }
  ];

  // Mood Pie Data
  const moodDistributionData = useMemo(() => {
    const counts: Record<string, number> = {
      joyful: 0,
      productive: 0,
      calm: 0,
      neutral: 0,
      tired: 0,
      anxious: 0,
      sad: 0
    };
    journal.forEach(j => {
      if (j.mood && counts[j.mood] !== undefined) {
        counts[j.mood]++;
      }
    });

    const colors: Record<string, string> = {
      joyful: '#eab308',
      productive: '#6366f1',
      calm: '#06b6d4',
      neutral: '#94a3b8',
      tired: '#f97316',
      anxious: '#ec4899',
      sad: '#64748b'
    };

    return Object.entries(counts)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
        color: colors[name] || '#6366f1'
      }));
  }, [journal]);

  // Handler: Generate Weekly Report
  const handleGenerateWeeklyReport = async () => {
    setIsGeneratingReport(true);
    try {
      const markdown = await GeminiService.generateWeeklyLifeReport(
        analyticsMetrics,
        settings.geminiApiKey,
        settings.geminiModel
      );

      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoStr = weekAgo.toISOString().split('T')[0];

      setActiveReport({
        id: 'report-weekly-' + Date.now(),
        type: 'weekly',
        title: 'LOTAI 7-Day Executive Life Review',
        dateRange: `${weekAgoStr} to ${today}`,
        generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        summary: `Life Score of ${analyticsMetrics.lifeScore}/100 across ${analyticsMetrics.tasks.completedTasks} completed tasks and ${analyticsMetrics.habits.consistencyRate7d}% habit consistency.`,
        metricsSnapshot: {
          lifeScore: analyticsMetrics.lifeScore,
          goalRate: analyticsMetrics.goals.overallCompletionRate,
          habitRate: analyticsMetrics.habits.consistencyRate7d,
          taskRate: analyticsMetrics.tasks.completionRate,
          healthScore: analyticsMetrics.health.healthScore,
          financeScore: analyticsMetrics.finance.financialHealthScore
        },
        contentMarkdown: markdown
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Handler: Generate Monthly Report
  const handleGenerateMonthlyReport = async () => {
    setIsGeneratingReport(true);
    try {
      const markdown = await GeminiService.generateMonthlyLifeReport(
        analyticsMetrics,
        settings.geminiApiKey,
        settings.geminiModel
      );

      const today = new Date().toISOString().split('T')[0];
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      const monthAgoStr = monthAgo.toISOString().split('T')[0];

      setActiveReport({
        id: 'report-monthly-' + Date.now(),
        type: 'monthly',
        title: 'LOTAI 30-Day Monthly Performance Synthesis',
        dateRange: `${monthAgoStr} to ${today}`,
        generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        summary: `30-Day Macro Review: Life Score ${analyticsMetrics.lifeScore}/100, ${settings.currency}${analyticsMetrics.finance.netSavings.toFixed(0)} net surplus, and ${analyticsMetrics.habits.consistencyRate30d}% routine adherence.`,
        metricsSnapshot: {
          lifeScore: analyticsMetrics.lifeScore,
          goalRate: analyticsMetrics.goals.overallCompletionRate,
          habitRate: analyticsMetrics.habits.consistencyRate30d,
          taskRate: analyticsMetrics.tasks.completionRate,
          healthScore: analyticsMetrics.health.healthScore,
          financeScore: analyticsMetrics.finance.financialHealthScore
        },
        contentMarkdown: markdown
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Handler: Refresh AI Insights
  const handleRefreshAIInsights = async () => {
    setIsGeneratingInsights(true);
    try {
      const result = await GeminiService.generateAIInsights(
        analyticsMetrics,
        settings.geminiApiKey,
        settings.geminiModel
      );
      setAiInsightNotes(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  // Copy report to clipboard
  const handleCopyReport = () => {
    if (!activeReport) return;
    navigator.clipboard.writeText(activeReport.contentMarkdown);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  // Download report as markdown file
  const handleDownloadReport = () => {
    if (!activeReport) return;
    const blob = new Blob([activeReport.contentMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `LOTAI-${activeReport.type}-report-${new Date().toISOString().split('T')[0]}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getLifeScoreBadge = (score: number) => {
    if (score >= 85) return { label: 'Optimal Rhythm', bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
    if (score >= 70) return { label: 'Steady Momentum', bg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30' };
    if (score >= 50) return { label: 'Moderate Focus', bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30' };
    return { label: 'Calibration Needed', bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30' };
  };

  const scoreBadge = getLifeScoreBadge(analyticsMetrics.lifeScore);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Header & Report Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-400">
              <PieChart className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  LOTAI Analytics Engine
                </h1>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${scoreBadge.bg}`}>
                  {scoreBadge.label}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Multi-dimensional life intelligence across Goals, Tasks, Habits, Finance, Health, and Inner Mind.
              </p>
            </div>
          </div>
        </div>

        {/* Time Horizon Pills & AI Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time Range Selector */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                timeRange === '7d' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                timeRange === '30d' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                timeRange === 'all' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Time
            </button>
          </div>

          {/* Weekly Report Button */}
          <button
            onClick={handleGenerateWeeklyReport}
            disabled={isGeneratingReport}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition active:scale-95 disabled:opacity-50"
          >
            {isGeneratingReport ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
            ) : (
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            )}
            <span>Weekly Report</span>
          </button>

          {/* Monthly Report Button */}
          <button
            onClick={handleGenerateMonthlyReport}
            disabled={isGeneratingReport}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition active:scale-95 disabled:opacity-50"
          >
            {isGeneratingReport ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>Monthly Review</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. EXECUTIVE 6-PILLAR SCORE DASHBOARD CARDS                               */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 1. Life Score */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-indigo-950/40 via-slate-900/90 to-slate-900 border border-indigo-500/30 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Life Score</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-black text-white tracking-tight">{analyticsMetrics.lifeScore}</span>
              <span className="text-sm font-semibold text-slate-400">/ 100</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700" 
                style={{ width: `${analyticsMetrics.lifeScore}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
            <span>6 Pillars Balance</span>
            <span className="font-semibold text-indigo-400">Weighted</span>
          </div>
        </div>

        {/* 2. Goal Completion Rate */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 transition shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Goals</span>
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-black text-white tracking-tight">
                {analyticsMetrics.goals.overallCompletionRate}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-purple-500 rounded-full transition-all duration-700" 
                style={{ width: `${analyticsMetrics.goals.overallCompletionRate}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
            <span>{analyticsMetrics.goals.completedGoals} / {analyticsMetrics.goals.totalGoals} Finalized</span>
            <span className="font-semibold text-purple-400">{analyticsMetrics.goals.averageMilestoneProgress}% steps</span>
          </div>
        </div>

        {/* 3. Habit Consistency */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Habits</span>
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Repeat className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-black text-white tracking-tight">
                {timeRange === '30d' ? analyticsMetrics.habits.consistencyRate30d : analyticsMetrics.habits.consistencyRate7d}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full transition-all duration-700" 
                style={{ width: `${timeRange === '30d' ? analyticsMetrics.habits.consistencyRate30d : analyticsMetrics.habits.consistencyRate7d}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
            <span>Today: {analyticsMetrics.habits.todayCompletedCount}/{analyticsMetrics.habits.totalHabits}</span>
            <span className="font-semibold text-amber-400">{analyticsMetrics.habits.longestStreak}d record</span>
          </div>
        </div>

        {/* 4. Task Completion Velocity */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 transition shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tasks</span>
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-black text-white tracking-tight">
                {analyticsMetrics.tasks.completionRate}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-700" 
                style={{ width: `${analyticsMetrics.tasks.completionRate}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
            <span>{analyticsMetrics.tasks.completedTasks} / {analyticsMetrics.tasks.totalTasks} Done</span>
            {analyticsMetrics.tasks.overdueCount > 0 ? (
              <span className="font-semibold text-rose-400">{analyticsMetrics.tasks.overdueCount} overdue</span>
            ) : (
              <span className="font-semibold text-emerald-400">On Track</span>
            )}
          </div>
        </div>

        {/* 5. Health Score */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/40 transition shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Health</span>
            <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
              <HeartPulse className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-black text-white tracking-tight">
                {analyticsMetrics.health.healthScore}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-rose-500 rounded-full transition-all duration-700" 
                style={{ width: `${analyticsMetrics.health.healthScore}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
            <span>{analyticsMetrics.health.averageSleepHours}h Sleep</span>
            <span className="font-semibold text-rose-400">{analyticsMetrics.health.waterComplianceRate}% Water</span>
          </div>
        </div>

        {/* 6. Financial Health Score */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Finance</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-black text-white tracking-tight">
                {analyticsMetrics.finance.financialHealthScore}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-700" 
                style={{ width: `${analyticsMetrics.finance.financialHealthScore}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
            <span>Surplus: {settings.currency}{analyticsMetrics.finance.netSavings.toFixed(0)}</span>
            <span className="font-semibold text-emerald-400">{analyticsMetrics.finance.budgetUtilizationRate}% Used</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. VISUAL CHARTS DASHBOARDS (RECHARTS)                                    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Holistic Life Equilibrium Radar Chart (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">6-Pillar Equilibrium Wheel</h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
                Radar View
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Visualizes equilibrium balance across Goals, Tasks, Habits, Health, Wealth, and Mind.
            </p>
          </div>

          <div className="h-72 my-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#334155" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={10} />
                <Radar
                  name="Life Equilibrium"
                  dataKey="value"
                  stroke="#818cf8"
                  strokeWidth={2}
                  fill="#6366f1"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-center">
            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Goals</span>
              <span className="text-xs font-bold text-purple-400">{analyticsMetrics.goals.overallCompletionRate}%</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Habits</span>
              <span className="text-xs font-bold text-amber-400">{analyticsMetrics.habits.consistencyRate7d}%</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Health</span>
              <span className="text-xs font-bold text-rose-400">{analyticsMetrics.health.healthScore}%</span>
            </div>
          </div>
        </div>

        {/* Life Score & Velocity Progression Trend (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Daily Life Score & Habit Progression</h3>
              </div>
              <span className="text-xs text-slate-400">
                {timeRange === '7d' ? 'Last 7 Days' : timeRange === '30d' ? 'Last 30 Days' : 'All-Time Trend'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Synchronized tracking of overall Life Score alongside daily routine completion rates.
            </p>
          </div>

          <div className="h-72 my-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLifeScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorHabits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="lifeScore" 
                  name="Life Score" 
                  stroke="#6366f1" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorLifeScore)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="habitsRate" 
                  name="Habit Rate (%)" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  strokeDasharray="4 4" 
                  fillOpacity={1} 
                  fill="url(#colorHabits)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
                <span className="text-slate-300">Life Score</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span className="text-slate-300">Habit Adherence</span>
              </span>
            </div>
            <span className="text-slate-400">
              Avg: <strong className="text-indigo-400">{analyticsMetrics.lifeScore}%</strong>
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MULTI-MODULE DETAILED VISUALIZERS                                     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Financial Flow Bar Chart */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <DollarSign className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Daily Financial Activity</h3>
              </div>
              <span className="text-xs font-semibold text-emerald-400">
                +{settings.currency}{analyticsMetrics.finance.netSavings.toFixed(0)} net
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Expenses vs. income timeline over the selected horizon.
            </p>
          </div>

          <div className="h-52 my-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="label" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Bar dataKey="expenseAmount" name={`Expense (${settings.currency})`} fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="incomeAmount" name={`Income (${settings.currency})`} fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Budget: {settings.currency}{analyticsMetrics.finance.monthlyBudget}</span>
            <span className="text-slate-300 font-semibold">{analyticsMetrics.finance.savingsRate}% Savings Rate</span>
          </div>
        </div>

        {/* Health Sleep & Hydration Line Chart */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Sleep & Hydration Curve</h3>
              </div>
              <span className="text-xs font-semibold text-rose-400">
                {analyticsMetrics.health.averageSleepHours}h avg
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Sleep duration vs. daily hydration progress.
            </p>
          </div>

          <div className="h-52 my-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="label" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis yAxisId="left" stroke="#64748b" fontSize={10} tickLine={false} domain={[4, 10]} />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={10} tickLine={false} domain={[1000, 3500]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Line yAxisId="left" type="monotone" dataKey="sleepHrs" name="Sleep (hrs)" stroke="#f43f5e" strokeWidth={2} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="waterMl" name="Water (ml)" stroke="#06b6d4" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Water Avg: {analyticsMetrics.health.averageWaterIntakeMl} ml</span>
            <span className="text-rose-400 font-semibold">{analyticsMetrics.health.workoutsPast7Days} workouts/wk</span>
          </div>
        </div>

        {/* Mind & Mood Distribution Donut Chart */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Brain className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Inner Mind & Mood Spectrum</h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-semibold capitalize border border-cyan-500/20">
                {analyticsMetrics.mind.dominantMood}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Emotional state distribution from reflective journal entries.
            </p>
          </div>

          <div className="h-52 my-3 flex items-center justify-center">
            {moodDistributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={moodDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {moodDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-slate-500 text-xs">
                No mood reflections logged yet.
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>{analyticsMetrics.mind.totalReflections} Total Entries</span>
            <span className="text-cyan-400 font-semibold">{analyticsMetrics.mind.positiveMoodRate}% Positive</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. COMPOUND CROSS-PILLAR AI CORRELATIONS & INSIGHTS                       */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Compound Cross-Pillar Life Insights</h3>
              <p className="text-xs text-slate-400">
                Dynamic correlational discoveries revealing how your habits, rest, spending, and execution interconnect.
              </p>
            </div>
          </div>

          <button
            onClick={handleRefreshAIInsights}
            disabled={isGeneratingInsights}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingInsights ? 'animate-spin text-indigo-400' : ''}`} />
            <span>{isGeneratingInsights ? 'Analyzing...' : 'Refresh AI'}</span>
          </button>
        </div>

        {/* AI Insight Dynamic Banner if refreshed */}
        {aiInsightNotes && (
          <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-sm text-slate-200 whitespace-pre-line leading-relaxed">
            {aiInsightNotes}
          </div>
        )}

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {correlationInsights.map((insight) => {
            const Icon = 
              insight.iconName === 'Flame' ? Flame :
              insight.iconName === 'Droplet' ? Droplet :
              insight.iconName === 'ShieldCheck' ? ShieldCheck :
              insight.iconName === 'TrendingUp' ? TrendingUp :
              insight.iconName === 'Brain' ? Brain : Sparkles;

            const iconColors = {
              productivity: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
              vitality: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
              discipline: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
              wealth: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
              clarity: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
            };

            return (
              <div 
                key={insight.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-indigo-500/40 transition flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg border ${iconColors[insight.category]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                    {insight.impactBadge}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">{insight.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. GENERATED REPORT MODAL / DRAWER                                        */}
      {/* ========================================================================= */}
      {activeReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-black text-white">{activeReport.title}</h2>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold uppercase">
                      {activeReport.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Period: {activeReport.dateRange} • Generated at {activeReport.generatedAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyReport}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center space-x-1"
                  title="Copy Report to Clipboard"
                >
                  {copiedReport ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleDownloadReport}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center space-x-1"
                  title="Download Markdown Report"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveReport(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                  title="Close Report"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Metrics Snapshot Banner */}
            <div className="px-6 py-3 bg-slate-950/80 border-b border-slate-800 grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Life Score</span>
                <strong className="text-indigo-400 font-bold text-sm">{activeReport.metricsSnapshot.lifeScore}%</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Goals</span>
                <strong className="text-purple-400 font-bold text-sm">{activeReport.metricsSnapshot.goalRate}%</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Habits</span>
                <strong className="text-amber-400 font-bold text-sm">{activeReport.metricsSnapshot.habitRate}%</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Tasks</span>
                <strong className="text-blue-400 font-bold text-sm">{activeReport.metricsSnapshot.taskRate}%</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Health</span>
                <strong className="text-rose-400 font-bold text-sm">{activeReport.metricsSnapshot.healthScore}%</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Finance</span>
                <strong className="text-emerald-400 font-bold text-sm">{activeReport.metricsSnapshot.financeScore}%</strong>
              </div>
            </div>

            {/* Report Content Markdown Viewer */}
            <div className="p-6 overflow-y-auto space-y-4 text-slate-300 text-sm leading-relaxed whitespace-pre-line font-normal">
              {activeReport.contentMarkdown}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/50">
              <span className="text-xs text-slate-500 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Powered by LOTAI Intelligence Engine</span>
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyReport}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                >
                  {copiedReport ? 'Copied!' : 'Copy to Clipboard'}
                </button>
                <button
                  onClick={() => setActiveReport(null)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-md shadow-indigo-600/30"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
