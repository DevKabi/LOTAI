import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { PWAInstallModal } from '../pwa/PWAInstallModal';
import { AuthModal } from '../auth/AuthModal';
import { 
  Sparkles, 
  Mic, 
  ArrowRight, 
  Download, 
  Target, 
  CheckSquare, 
  Repeat, 
  DollarSign, 
  HeartPulse, 
  BookOpen, 
  PieChart, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Compass, 
  Check,
  Smartphone,
  WifiOff,
  HelpCircle
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { 
    promptInstall, 
    isModalOpen, 
    setIsModalOpen, 
    isIOS, 
    isMobile, 
    hasNativePrompt 
  } = usePWAInstall();

  // Auth modal state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('signup');

  const openAuth = (tab: 'login' | 'signup') => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  };

  // Interactive Omni Simulator State
  const simulatorPrompts = [
    {
      text: "Spent ₹500 on lunch",
      module: "FINANCE",
      moduleLabel: "Finance & Wealth",
      category: "Food & Dining > Restaurant",
      color: "emerald",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      confidence: "98%",
      fields: [
        { label: "Type", value: "Expense" },
        { label: "Amount", value: "₹500.00" },
        { label: "Category", value: "Food & Dining" },
        { label: "Subcategory", value: "Restaurant" }
      ],
      icon: DollarSign
    },
    {
      text: "Received ₹20,000 from client",
      module: "FINANCE",
      moduleLabel: "Finance & Wealth",
      category: "Salary & Business Revenue",
      color: "emerald",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      confidence: "99%",
      fields: [
        { label: "Type", value: "Income / Inflow" },
        { label: "Amount", value: "₹20,000.00" },
        { label: "Category", value: "Salary & Business" },
        { label: "Payment Mode", value: "Bank Transfer" }
      ],
      icon: DollarSign
    },
    {
      text: "Hit 45 min strength workout and 3L water",
      module: "HEALTH",
      moduleLabel: "Health & Vitality",
      category: "Fitness & Physical Wellness",
      color: "rose",
      badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      confidence: "96%",
      fields: [
        { label: "Activity", value: "Strength Training" },
        { label: "Duration", value: "45 Minutes" },
        { label: "Hydration", value: "+3000 ml Logged" },
        { label: "Health Score", value: "+4 Points Boost" }
      ],
      icon: HeartPulse
    },
    {
      text: "Meditated for 20 minutes today",
      module: "HABITS",
      moduleLabel: "Habits & Consistency",
      category: "Daily Mindfulness Habit",
      color: "cyan",
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      confidence: "97%",
      fields: [
        { label: "Habit", value: "Daily Meditation" },
        { label: "Status", value: "Completed ✓" },
        { label: "Streak", value: "14 Days Active 🔥" },
        { label: "Consistency", value: "100% This Week" }
      ],
      icon: Repeat
    },
    {
      text: "Create a goal to reach ₹1 crore revenue",
      module: "GOALS",
      moduleLabel: "Goals & OKRs",
      category: "Visionary Benchmark OKR",
      color: "purple",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      confidence: "98%",
      fields: [
        { label: "Objective", value: "Reach ₹1 Crore Revenue" },
        { label: "Benchmark", value: "₹1,00,00,000 Target" },
        { label: "Category", value: "Finance & Wealth" },
        { label: "Milestones", value: "4 Phased Targets Created" }
      ],
      icon: Target
    },
    {
      text: "Today I felt productive and closed two clients",
      module: "JOURNAL",
      moduleLabel: "Mind & Reflection",
      category: "Daily Win & Sentiment Analysis",
      color: "amber",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      confidence: "95%",
      fields: [
        { label: "Mood", value: "Productive ⚡" },
        { label: "AI Sentiment", value: "Positive & Victorious" },
        { label: "AI Reflection", value: "Reinforces execution confidence" },
        { label: "Gratitude", value: "Client growth momentum" }
      ],
      icon: BookOpen
    }
  ];

  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const activePrompt = simulatorPrompts[activePromptIndex];

  // Auto-cycle prompts every 6 seconds unless clicked
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePromptIndex((prev) => (prev + 1) % simulatorPrompts.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [simulatorPrompts.length]);

  const coreModules = [
    {
      id: "omni-capture",
      title: "Omni Capture AI Engine",
      subtitle: "Universal Voice & Text Life Input",
      desc: "Speak naturally or type a quick thought. LOTAI's intent classifier detects modules, parses currencies, dates, and numbers, and files records without friction.",
      icon: Mic,
      color: "from-indigo-600 to-purple-600",
      pillText: "Gemini 2.5 / 3.0 Powered",
      features: ["Real-time voice capture", "Zero manual data entry", "Instant intent routing", "Confidence score verification"]
    },
    {
      id: "goals-okrs",
      title: "Goals & Visionary OKRs",
      subtitle: "Turn Ambition into Measurable Roadmaps",
      desc: "Set high-stakes benchmarks across Career, Finance, Health, and Personal growth. Break each vision into actionable milestones with visual progress tracks.",
      icon: Target,
      color: "from-purple-600 to-pink-600",
      pillText: "Strategic Execution",
      features: ["Benchmark target metrics", "Sub-milestone completion loops", "Dynamic progress %", "Goal-linked daily tasks"]
    },
    {
      id: "tasks-focus",
      title: "Tasks & Focus Kanban",
      subtitle: "Relentless Daily Execution",
      desc: "Organize daily priorities using Eisenhower matrices. Switch effortlessly between structured checklist rows and smooth horizontal-snap Kanban lanes.",
      icon: CheckSquare,
      color: "from-blue-600 to-indigo-600",
      pillText: "Eisenhower Matrix",
      features: ["Urgent / High / Low priority tagging", "Kanban drag & snap columns", "1-tap completion toggles", "Due date timeline reminders"]
    },
    {
      id: "habits-streaks",
      title: "Habits & Consistency Streaks",
      subtitle: "Build Atomic Habits That Stick",
      desc: "Track daily positive and negative habits. Watch your streak count grow with gamified visual rings, milestone celebrations, and weekly consistency analytics.",
      icon: Repeat,
      color: "from-cyan-600 to-blue-600",
      pillText: "Atomic Habits System",
      features: ["Daily streak visual counter", "One-tap completion toggles", "Best streak personal records", "Weekly consistency %"]
    },
    {
      id: "finance-wealth",
      title: "Personal Finance & Wealth",
      subtitle: "Hyper-Structured Multi-Tier Taxonomy",
      desc: "Manage expenses, income inflows, budget allocations, and net cashflow across 10 top-level categories and 40+ granular subcategories with zero effort.",
      icon: DollarSign,
      color: "from-emerald-600 to-teal-600",
      pillText: "Autonomous Bookkeeping",
      features: ["40+ granular expense subcategories", "Instant receipt & bill parsing", "Income vs expense analytics", "Monthly budget burn tracker"]
    },
    {
      id: "health-vitality",
      title: "Health & Physical Vitality",
      subtitle: "Optimize Sleep, Hydration & Workouts",
      desc: "Log daily water intake with target ml counters, record sleep duration with quality assessments, track body weight trends, and log workouts in seconds.",
      icon: HeartPulse,
      color: "from-rose-600 to-red-600",
      pillText: "Vitality Tracker",
      features: ["1-tap hydration logging", "Sleep restorative score", "Weight trajectory graph", "Workout & calorie logs"]
    },
    {
      id: "journal-mind",
      title: "Mind & Zen Journaling",
      subtitle: "Distraction-Free Emotional Clarity",
      desc: "Capture daily lessons, express gratitude, and reflect in full-screen distraction-free Zen mode. AI sentiment analysis detects emotional patterns over time.",
      icon: BookOpen,
      color: "from-amber-600 to-orange-600",
      pillText: "Zen Mode Writing",
      features: ["Full-screen Zen focus mode", "AI sentiment analysis & reflections", "Daily gratitude prompts", "Mood tagging & tag filters"]
    },
    {
      id: "life-score-analytics",
      title: "Life Score™ & Analytics",
      subtitle: "Holistic 0-100 Life Metric",
      desc: "Synthesize all six pillars of your life into an actionable single score. Uncover blindspots, celebrate momentum, and receive weekly AI coaching summaries.",
      icon: PieChart,
      color: "from-indigo-600 to-cyan-600",
      pillText: "Executive Dashboard",
      features: ["Unified 0-100 Life Score", "Pillar-by-pillar health scoring", "Automated weekly report cards", "AI-powered strategic recommendations"]
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#050816] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-indigo-500 selection:text-white flex flex-col overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* STICKY TOP HEADER (COVERS HEADER COMPLETELY, ONE-LINE ACTIONS ON MOBILE)   */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 w-full bg-[#050816]/95 backdrop-blur-2xl border-b border-slate-800/80 px-2.5 sm:px-6 lg:px-12 py-2 sm:py-3.5">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-1.5 sm:gap-2">
          {/* Brand */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm sm:text-lg font-black tracking-tight text-white">LOTAI</span>
              <span className="hidden md:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Life On Track AI
              </span>
            </div>
          </div>

          {/* Actions: Strictly ONE SINGLE LINE on mobile & desktop */}
          <div className="flex items-center space-x-1 sm:space-x-3 shrink-0 flex-nowrap whitespace-nowrap">
            <button
              onClick={() => openAuth('login')}
              className="px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700/80 active:scale-95 transition whitespace-nowrap"
            >
              Sign In
            </button>

            <button
              onClick={() => openAuth('signup')}
              className="px-2.5 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-[#6D5DFE] hover:bg-[#5a4ae6] text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 active:scale-95 transition whitespace-nowrap flex items-center space-x-1"
            >
              <span className="hidden min-[380px]:inline">Start Your Journey</span>
              <span className="min-[380px]:hidden">Start Journey</span>
              <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 active:scale-95 transition flex items-center space-x-1.5 text-xs sm:text-sm font-semibold whitespace-nowrap"
              title="Install LOTAI App & PWA Options"
              aria-label="Install App"
            >
              <Download className="w-3.5 h-3.5 text-purple-300" />
              <span className="hidden sm:inline">Install App</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Single-Page Canvas (max-w-[1800px] Wide-Angle Layout) */}
      <main className="flex-1 w-full space-y-16 sm:space-y-24">

        {/* ======================================================================= */}
        {/* 1800 x 720 WIDE-ANGLE FIRST VIEWPORT (HERO & OMNI CAPTURE SIMULATOR)    */}
        {/* ======================================================================= */}
        <section className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 sm:pt-10 pb-8 lg:min-h-[720px] flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column (lg:col-span-6): Hero Pitch & Single CTA */}
            <div className="lg:col-span-6 space-y-5 sm:space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI-Powered Personal Life Operating System</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.12]">
                Your Entire Life, <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                  Organised by Artificial Intelligence.
                </span>
              </h1>

              <p className="text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Stop juggling fragmented apps for tasks, finances, habits, workouts, goals, and reflections. 
                Speak or type anything naturally—LOTAI classifies your intent, extracts data fields, and keeps your entire life on track.
              </p>

              {/* Primary Call-to-Action & PWA Quick Install */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <button
                  onClick={() => openAuth('signup')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#6D5DFE] hover:bg-[#5a4ae6] text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-600/30 transition active:scale-95 flex items-center justify-center space-x-2 min-h-[48px]"
                >
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={promptInstall}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/30 font-bold text-sm sm:text-base shadow-lg transition active:scale-95 flex items-center justify-center space-x-2 min-h-[48px]"
                  title="Install LOTAI PWA directly on your device"
                >
                  <Download className="w-4 h-4 text-purple-300" />
                  <span>{isIOS ? 'Add to Home Screen' : 'Install PWA App'}</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 pt-2 text-[11px] text-slate-400">
                <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Zero Manual Tagging</span>
                </span>
                <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800">
                  <Check className="w-3.5 h-3.5 text-indigo-400" />
                  <span>8 Interconnected Pillars</span>
                </span>
                <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800">
                  <Check className="w-3.5 h-3.5 text-purple-400" />
                  <span>100% Private & PWA Offline</span>
                </span>
              </div>
            </div>

            {/* Right Column (lg:col-span-6): Interactive Omni Capture Simulator */}
            <div className="lg:col-span-6 w-full">
              <div className="w-full p-5 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <Mic className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white">Omni Capture Live Simulator</h3>
                      <p className="text-xs text-slate-400">Click any natural prompt below to watch the Gemini AI Intent Router in action</p>
                    </div>
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold self-start sm:self-auto">
                    Live Engine Active
                  </span>
                </div>

                {/* Prompt Selector Pills */}
                <div className="py-3">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">Select a Life Input Example:</p>
                  <div className="flex flex-wrap gap-2">
                    {simulatorPrompts.map((p, idx) => {
                      const isSelected = idx === activePromptIndex;
                      return (
                        <button
                          key={idx}
                          onClick={() => setActivePromptIndex(idx)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border select-none ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30 scale-[1.02]'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          "{p.text}"
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Processing Preview Box */}
                <div className="mt-2 p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3.5">
                  <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
                    <div className="flex items-center space-x-2 truncate">
                      <span className="text-slate-400 font-medium">Input Captured:</span>
                      <span className="text-white font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800 truncate">
                        "{activePrompt.text}"
                      </span>
                    </div>
                    <span className="text-emerald-400 text-[11px] font-bold shrink-0 ml-2">
                      {activePrompt.confidence} Intent Accuracy
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Target Life Pillar</span>
                      <div className="flex items-center space-x-2 text-sm font-bold text-white">
                        <span className={`px-2 py-0.5 rounded border text-xs font-semibold ${activePrompt.badgeColor}`}>
                          {activePrompt.module}
                        </span>
                        <span>{activePrompt.moduleLabel}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Taxonomy Classification</span>
                      <div className="text-xs sm:text-sm font-semibold text-indigo-300">
                        {activePrompt.category}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Automated Structured Database Fields</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {activePrompt.fields.map((f, i) => (
                        <div key={i} className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                          <span className="text-[10px] text-slate-400 block">{f.label}</span>
                          <span className="font-semibold text-slate-200 truncate block">{f.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center space-x-1 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Zero Manual Tagging Required • Automatically Routed</span>
                    </span>
                    <span className="text-slate-500 font-mono">DB: Live</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* PWA INSTALLATION & CONTEXT HUB (EMBEDDED IN FIRST SECTION)              */}
          {/* ======================================================================= */}
          <div className="mt-8 lg:mt-12 p-5 sm:p-7 lg:p-8 rounded-3xl bg-slate-900/80 border border-indigo-500/30 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
                  <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                  <span>Progressive Web App • Native Performance With Zero App Store Overhead</span>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                  Install LOTAI PWA on Your Mobile & Desktop
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  LOTAI runs as a Progressive Web App (PWA) directly from your mobile home screen or computer dock. 
                  Experience <strong className="text-white">100% offline access</strong>, zero App Store storage bloat, instant 1-tap launch speeds, and distraction-free full-screen focus.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto shrink-0">
                <button
                  onClick={promptInstall}
                  className="flex-1 sm:flex-initial px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-[#6D5DFE] to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-bold shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2 active:scale-95 transition min-h-[44px]"
                >
                  <Download className="w-4 h-4" />
                  <span>{isIOS ? 'Add to Home Screen' : 'Install App Now'}</span>
                </button>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex-1 sm:flex-initial px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 active:scale-95 transition min-h-[44px]"
                >
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  <span>Installation Guide</span>
                </button>
              </div>
            </div>

            {/* 3 Pillars of PWA Context */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              {/* Context 1 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                  <Zap className="w-4 h-4 text-indigo-400" />
                  <span>Instant 1-Tap Launch</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">Zero App Store Clutter</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  No 150MB App Store downloads or slow store updates. Tap the icon on your phone dock or desktop to launch immediately in full-screen native mode.
                </p>
              </div>

              {/* Context 2 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <WifiOff className="w-4 h-4 text-emerald-400" />
                  <span>100% Offline Capability</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">Works Anywhere, Anytime</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Fly on airplanes, commute through tunnels, or work without cellular data. All your tasks, habits, and reflections stay locally cached and synced.
                </p>
              </div>

              {/* Context 3 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center space-x-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                  <Mic className="w-4 h-4 text-purple-400" />
                  <span>Omni Voice Direct Capture</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">Fast Micro-Interactions</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Speak an expense or task on the move. Your microphone connects directly without browser address bar clutter or navigation bars getting in the way.
                </p>
              </div>
            </div>

            {/* Quick Device Help Instructions */}
            <div className="mt-5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-start sm:items-center space-x-2">
                <span className="font-bold text-white shrink-0">Quick Tip:</span>
                <span className="text-indigo-300">
                  {isIOS 
                    ? 'On iPhone/iPad: Tap the Safari Share button ⎋ at bottom, then select "Add to Home Screen" ⊞.'
                    : isMobile 
                      ? 'On Android: Tap "Install App Now" above or tap ⋮ in Chrome → "Install App".'
                      : 'On Desktop (Chrome/Edge): Click "Install App Now" or the ⊕ icon in your browser address bar to install to Dock/Taskbar.'}
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-2 shrink-0"
              >
                View full step-by-step visual guide →
              </button>
            </div>
          </div>
        </section>

        {/* ======================================================================= */}
        {/* SECTION 2: THE 8 CORE FUNCTIONAL MODULES                                */}
        {/* ======================================================================= */}
        <section className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>Comprehensive Life Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              The 8 Core Functional Modules
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Eight interconnected intelligence pillars designed to manage every dimension of your life seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {coreModules.map((m, idx) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.id}
                  className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4 shadow-lg group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${m.color} flex items-center justify-center text-white shadow-md`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                        0{idx + 1}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">{m.pillText}</span>
                      <h3 className="text-base font-bold text-white leading-tight mt-0.5">{m.title}</h3>
                      <p className="text-xs font-medium text-slate-400">{m.subtitle}</p>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {m.desc}
                    </p>

                    <ul className="space-y-1.5 text-xs text-slate-300 pt-1">
                      {m.features.slice(0, 2).map((feat, fi) => (
                        <li key={fi} className="flex items-center space-x-1.5">
                          <Check className="w-3 h-3 text-indigo-400 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => openAuth('signup')}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                    >
                      <span>Explore {m.title.split(' ')[0]}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ======================================================================= */}
        {/* SECTION 3: HOW TO USE LOTAI (4-PHASE OPERATING RHYTHM)                  */}
        {/* ======================================================================= */}
        <section className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>Peak Performance Blueprint</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              How to Use LOTAI for Maximum Results
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              A frictionless, 4-phase daily operating rhythm that compounds into extraordinary life momentum.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Step 1 */}
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 relative">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs">
                01
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Morning (8:00 AM)</span>
                <h3 className="text-base font-bold text-white mt-0.5">Prime Your Focus</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Open LifeHub. Check your top 3 Eisenhower Urgent tasks, review active habit streaks, and hydrate with your morning target log.
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                💡 <em>Result: Zero decision fatigue starting your morning.</em>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 relative">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs">
                02
              </div>
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Midday (On-The-Go)</span>
                <h3 className="text-base font-bold text-white mt-0.5">Omni Instant Capture</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Whenever you pay an expense, receive income, remember an errand, or hit a workout, tap the microphone and speak. LOTAI handles the rest.
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                💡 <em>Result: Real-time bookkeeping and task capture in under 3 seconds.</em>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 relative">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs">
                03
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Evening (9:30 PM)</span>
                <h3 className="text-base font-bold text-white mt-0.5">Zen Reflection & Wind-Down</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Switch to full-screen Zen mode. Jot down 3 daily gratitudes, log sleep duration, and let Gemini AI summarize your daily emotional sentiment.
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                💡 <em>Result: Clear mental slate, deep emotional peace, restorative sleep.</em>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 relative">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold text-xs">
                04
              </div>
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Sunday (Weekly Review)</span>
                <h3 className="text-base font-bold text-white mt-0.5">Life Score Calibration</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Check your Life Score breakdown across all 6 pillars. Review weekly financial surplus and chat with the AI Coach on tactical adjustments.
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                💡 <em>Result: Unstoppable compound progress week over week.</em>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================================= */}
        {/* SECTION 4: REAL-LIFE USE CASES                                          */}
        {/* ======================================================================= */}
        <section className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>Versatile Life Scenarios</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              Designed for Real People with High Ambitions
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              See how high achievers tailor LOTAI to their unique daily rhythms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Persona 1 */}
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-sm">
                  EF
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">The Entrepreneur & Agency Founder</h3>
                  <p className="text-xs text-slate-400">Juggling client deliverables, team roadmaps & cashflow</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "I used to lose track of client invoices and random project tasks. With LOTAI, I just say: 'Received ₹1,50,000 from Acme Corp' or 'Remind me to send deck at 3 PM'. It categorizes everything immediately."
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">Finance Cashflow</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">Eisenhower Tasks</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">Milestone OKRs</span>
              </div>
            </div>

            {/* Persona 2 */}
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-sm">
                  PL
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">The Corporate High-Performer</h3>
                  <p className="text-xs text-slate-400">Managing career growth, daily fitness & mindfulness</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "Between back-to-back meetings and evening gym sessions, LOTAI is my cognitive anchor. The habit streak counters make sure I never skip meditation or mobility training."
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">Habit Streaks</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">Productivity Analytics</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">Pillar Health</span>
              </div>
            </div>

            {/* Persona 3 */}
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold text-sm">
                  HW
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">The Health & Fitness Optimizer</h3>
                  <p className="text-xs text-slate-400">Balancing nutrition, workout metrics & recovery sleep</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "I love that I don't need a clunky fitness app. Logging water intake takes 1 second, and saying 'My weight is 72kg' or 'Completed 45m strength session' automatically updates my health score."
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">Hydration Target</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">Sleep Quality</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">Weight Metric</span>
              </div>
            </div>

            {/* Persona 4 */}
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-sm">
                  MC
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">The Mindful Creator & Writer</h3>
                  <p className="text-xs text-slate-400">Cultivating daily mental clarity, deep gratitude & ideas</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "The full-screen Zen mode on mobile is a sanctuary. No notifications, just words and gratitude. Plus, the AI coach acts as a thoughtful sparring partner when I reflect on challenges."
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">Zen Mode Journal</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">AI Sentiment</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">AI Sparring Coach</span>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================================= */}
        {/* SECTION 5: COMPARISON MATRIX                                            */}
        {/* ======================================================================= */}
        <section className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Why LOTAI Wins</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              Fragmented Apps vs. One Unified Brain
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Why pay for 6 separate subscriptions when one intelligent operating system unifies everything?
            </p>
          </div>

          <div className="flex items-center justify-center text-[11px] text-slate-400 sm:hidden gap-1 font-medium">
            <span>← Swipe table horizontally to compare →</span>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/70 p-4 sm:p-6">
            <table className="w-full text-left border-collapse min-w-[580px]">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Feature / Capability</th>
                  <th className="py-3 px-4 text-rose-400">6 Fragmented Apps</th>
                  <th className="py-3 px-4 text-indigo-400 font-black">LOTAI Unified OS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Monthly Subscription Cost</td>
                  <td className="py-3.5 px-4 text-slate-400">$45 – $70 / month</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">Included in Open Platform</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Input Speed</td>
                  <td className="py-3.5 px-4 text-slate-400">Open 6 separate apps, click 15 buttons</td>
                  <td className="py-3.5 px-4 text-indigo-300 font-semibold">1-Tap Voice or Text Omni Capture</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Unified Life Score™</td>
                  <td className="py-3.5 px-4 text-rose-400 flex items-center space-x-1.5">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Impossible (Data Siloed)</span>
                  </td>
                  <td className="py-3.5 px-4 text-emerald-400 font-semibold flex items-center space-x-1.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Synthesized 0-100 across 6 pillars</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">AI Context Intelligence</td>
                  <td className="py-3.5 px-4 text-slate-400">No cross-app awareness</td>
                  <td className="py-3.5 px-4 text-indigo-300 font-semibold">Gemini knows goals, budget & tasks</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">PWA / Offline Support</td>
                  <td className="py-3.5 px-4 text-slate-400">Requires 6 app store downloads</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-semibold">Instant 1-tap install on iOS & Android</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Distraction-Free Zen Mode</td>
                  <td className="py-3.5 px-4 text-slate-400">Rare / Requires separate writing app</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-semibold">Built-in with AI Sentiment analysis</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ======================================================================= */}
        {/* SECTION 6: GRAND FINALE CTA CARD                                        */}
        {/* ======================================================================= */}
        <section className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 pb-16">
          <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/30">
              <Sparkles className="w-7 h-7 text-white" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Ready to Put Your Life on Track?
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Join high achievers, entrepreneurs, and mindful leaders executing their visionary lives with LOTAI.
              </p>
            </div>

            {/* Final CTAs: Only "Start Your Journey" and "Install PWA App" (NO Demo buttons!) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => openAuth('signup')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#6D5DFE] hover:bg-[#5a4ae6] text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-600/30 transition active:scale-95 flex items-center justify-center space-x-2 min-h-[48px]"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => openAuth('login')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm sm:text-base transition active:scale-95 min-h-[48px]"
              >
                Sign In
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-semibold text-sm sm:text-base transition active:scale-95 flex items-center justify-center space-x-2 min-h-[48px]"
              >
                <Download className="w-4 h-4" />
                <span>Install PWA App</span>
              </button>
            </div>

            <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-400">LOTAI</span>
                <span>•</span>
                <span>Life On Track AI v1.0</span>
              </div>

              <div className="flex items-center space-x-4">
                <button onClick={() => openAuth('login')} className="hover:text-indigo-400 transition">
                  Account Sign In
                </button>
                <span>•</span>
                <button onClick={() => openAuth('signup')} className="hover:text-indigo-400 transition">
                  New Registration
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* In-Place Auth Popup Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialTab={authTab}
      />

      {/* Guided PWA Install Modal (Step-by-step) */}
      <PWAInstallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInstall={promptInstall}
        isIOS={isIOS}
        isMobile={isMobile}
        hasNativePrompt={hasNativePrompt}
      />
    </div>
  );
};
