import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
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
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Layers, 
  TrendingUp, 
  Compass, 
  Check, 
  X 
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { signInAsDemoUser } = useAuth();
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

  // Multi-Page Slide Presentation State
  const [activeSlide, setActiveSlide] = useState(0);
  const totalSlides = 6;

  const slideNames = [
    "Hero & Omni Capture",
    "8 Core Modules",
    "How to Use",
    "Real-Life Use Cases",
    "Comparison Matrix",
    "Get Started"
  ];

  const nextSlide = () => {
    setActiveSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  };

  const prevSlide = () => {
    setActiveSlide((prev) => Math.max(prev - 1, 0));
  };

  const goToSlide = (idx: number) => {
    setActiveSlide(idx);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Touch swipe support for mobile/tablets
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 45) {
      if (deltaX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
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
        { label: "Category", value: "Business Revenue" },
        { label: "Status", value: "Recorded to Ledger" }
      ],
      icon: TrendingUp
    },
    {
      text: "My weight is 54kg",
      module: "HEALTH_FITNESS",
      moduleLabel: "Health & Vitality",
      category: "Body Composition Metric",
      color: "rose",
      badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      confidence: "97%",
      fields: [
        { label: "Metric", value: "Body Weight" },
        { label: "Value", value: "54.0 kg" },
        { label: "Date", value: "Today" },
        { label: "Trend", value: "Logged to Health Timeline" }
      ],
      icon: HeartPulse
    },
    {
      text: "Completed meditation today",
      module: "HABITS",
      moduleLabel: "Habits & Consistency",
      category: "Mindfulness Routine",
      color: "indigo",
      badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      confidence: "99%",
      fields: [
        { label: "Habit", value: "Daily Meditation" },
        { label: "Status", value: "Completed Today" },
        { label: "Streak", value: "7 Days Active 🔥" },
        { label: "Life Score", value: "+3 Pts Boost" }
      ],
      icon: Repeat
    },
    {
      text: "Tomorrow call 10 prospects",
      module: "TASKS",
      moduleLabel: "Tasks & Focus",
      category: "Eisenhower Urgent Q1",
      color: "blue",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      confidence: "96%",
      fields: [
        { label: "Task", value: "Call 10 prospects" },
        { label: "Due Date", value: "Tomorrow" },
        { label: "Priority", value: "Urgent" },
        { label: "Lane", value: "Kanban To Do" }
      ],
      icon: CheckSquare
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
      border: "border-indigo-500/30",
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
      border: "border-purple-500/30",
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
      border: "border-blue-500/30",
      pillText: "Eisenhower Matrix",
      features: ["Urgent / High / Low priority tagging", "Kanban drag & snap columns", "1-tap completion toggles", "Due date timeline reminders"]
    },
    {
      id: "habits-streaks",
      title: "Habit Mastery & Streaks",
      subtitle: "Atomic Consistency That Compounds",
      desc: "Build routines that stick. Track daily repetitions, maintain unbroken streak counts, and visualize progress with high-impact consistency heatmaps.",
      icon: Repeat,
      color: "from-teal-600 to-emerald-600",
      border: "border-teal-500/30",
      pillText: "Atomic Habits",
      features: ["Streak counters with fire badges", "Daily 1-tap check-ins", "Consistency rating breakdown", "Habit-score synergy"]
    },
    {
      id: "finance-wealth",
      title: "Personal Finance & Wealth",
      subtitle: "Master Cashflow & Category Breakdown",
      desc: "A structured 12-category personal finance taxonomy. Track income, monitor expenses by subcategory, and visualize monthly inflow vs outflow.",
      icon: DollarSign,
      color: "from-emerald-600 to-green-600",
      border: "border-emerald-500/30",
      pillText: "Taxonomy Optimized",
      features: ["12 structured categories & subcategories", "Interactive donut & bar visualizations", "Multi-currency symbol support (₹, $, €, £, ¥, AED)", "Net savings calculation"]
    },
    {
      id: "health-vitality",
      title: "Health & Physical Vitality",
      subtitle: "Optimize Sleep, Hydration & Workouts",
      desc: "Log daily water intake with target ml counters, record sleep duration with quality assessments, track body weight trends, and log workouts in seconds.",
      icon: HeartPulse,
      color: "from-rose-600 to-red-600",
      border: "border-rose-500/30",
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
      border: "border-amber-500/30",
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
      border: "border-cyan-500/30",
      pillText: "Executive Dashboard",
      features: ["Unified 0-100 Life Score", "Pillar-by-pillar health scoring", "Automated weekly report cards", "AI-powered strategic recommendations"]
    }
  ];

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden bg-[#050816] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-indigo-500 selection:text-white"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ========================================================================= */}
      {/* FLOATING LEFT & RIGHT ARROW CONTROLS (NAVIGATE THROUGH SECTIONS) */}
      {/* ========================================================================= */}
      {activeSlide > 0 && (
        <button
          onClick={prevSlide}
          className="fixed left-2 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-slate-900/90 hover:bg-indigo-600 border border-slate-700/80 hover:border-indigo-500 text-white shadow-2xl backdrop-blur-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group cursor-pointer"
          aria-label="Previous Section"
          title="Previous Section (Left Arrow)"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      )}

      {activeSlide < totalSlides - 1 && (
        <button
          onClick={nextSlide}
          className="fixed right-2 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-slate-900/90 hover:bg-indigo-600 border border-slate-700/80 hover:border-indigo-500 text-white shadow-2xl backdrop-blur-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group cursor-pointer"
          aria-label="Next Section"
          title="Next Section (Right Arrow)"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}

      {/* ========================================================================= */}
      {/* FLOATING BOTTOM ACTION BAR (PERSISTENT ON ALL SECTIONS, MOBILE OPTIMIZED) */}
      {/* ========================================================================= */}
      <div className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl bg-slate-950/95 border border-slate-800/90 backdrop-blur-2xl shadow-2xl shadow-black/80 max-w-[95vw]">
        <button
          onClick={() => openAuth('login')}
          className="px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-slate-900/95 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700/80 active:scale-95 transition min-h-[40px] flex items-center justify-center shadow-sm"
        >
          Sign In
        </button>

        <button
          onClick={() => openAuth('signup')}
          className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#6D5DFE] hover:bg-[#5a4ae6] text-white text-xs font-bold shadow-lg shadow-indigo-600/40 active:scale-95 transition min-h-[40px] flex items-center justify-center whitespace-nowrap"
        >
          Sign Up Free
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 sm:px-3 sm:py-2.5 rounded-xl sm:rounded-2xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 active:scale-95 transition flex items-center justify-center space-x-1.5 min-h-[40px] min-w-[40px]"
          title="Install LOTAI App & PWA Options"
          aria-label="PWA Options"
        >
          <Download className="w-4 h-4 text-purple-300" />
          <span className="hidden md:inline text-xs font-semibold">Install App</span>
        </button>
      </div>

      {/* Floating Slide Progress Dots */}
      <div className="fixed bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-40 flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 border border-slate-800/80 backdrop-blur-md shadow-xl">
        {slideNames.map((name, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`transition-all duration-300 rounded-full ${
              activeSlide === idx 
                ? 'w-6 sm:w-7 h-2 bg-indigo-500 shadow-md shadow-indigo-500/50' 
                : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'
            }`}
            title={`Slide ${idx + 1}: ${name}`}
            aria-label={`Slide ${idx + 1}: ${name}`}
          />
        ))}
        <span className="text-[10px] text-slate-400 font-mono pl-1.5 hidden xs:inline">
          {activeSlide + 1} / {totalSlides}
        </span>
      </div>

      {/* ========================================================================= */}
      {/* HORIZONTAL MULTI-PAGE SLIDE CONTAINER */}
      {/* ========================================================================= */}
      <div 
        className="flex w-full h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${activeSlide * 100}%)` }}
      >
        {/* ======================================================================= */}
        {/* PAGE 1: HERO & INTERACTIVE OMNI CAPTURE LIFE SIMULATOR */}
        {/* ======================================================================= */}
        <div className="w-screen h-screen shrink-0 overflow-y-auto px-3.5 sm:px-14 md:px-20 lg:px-24 pt-6 pb-28 sm:pb-32 flex flex-col justify-between">
          <div className="w-full max-w-[1600px] mx-auto space-y-6 sm:space-y-8 my-auto">
            {/* Minimal Brand Identifier (Slide-internal, no sticky header) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-black tracking-tight text-white">LOTAI</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Life On Track AI
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => openAuth('login')}
                  className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuth('signup')}
                  className="text-xs font-bold text-white px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition"
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* Hero Headline & Pitch */}
            <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
              <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI-Powered Personal Life Operating System</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
                Your Entire Life, <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                  Organised by Artificial Intelligence.
                </span>
              </h1>

              <p className="text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
                Stop juggling fragmented apps for tasks, finances, habits, workouts, goals, and reflections. 
                Speak or type anything naturally—LOTAI classifies your intent, extracts data fields, and keeps your entire life on track.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <button
                  onClick={() => openAuth('signup')}
                  className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition active:scale-95 flex items-center space-x-2 min-h-[44px]"
                >
                  <span>Start Your Journey Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={signInAsDemoUser}
                  className="px-5 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-indigo-300 hover:text-white border border-indigo-500/30 font-semibold text-xs sm:text-sm transition active:scale-95 flex items-center space-x-2 min-h-[44px]"
                >
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Launch Live Interactive Demo</span>
                </button>
              </div>
            </div>

            {/* Omni Capture Live Simulator Card */}
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
                            : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                        }`}
                      >
                        "{p.text}"
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Real-Time Processing Simulation Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 text-slate-200 text-xs sm:text-sm font-semibold">
                    <span className="text-slate-500 text-xs">User Input:</span>
                    <span className="text-white italic font-mono">"{activePrompt.text}"</span>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${activePrompt.badgeColor}`}>
                    AI Confidence: {activePrompt.confidence}
                  </span>
                </div>

                {/* Extracted Architecture Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Target Module</span>
                    <div className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-white">
                      <activePrompt.icon className="w-4 h-4 text-indigo-400" />
                      <span>{activePrompt.moduleLabel} ({activePrompt.module})</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Taxonomy Classification</span>
                    <div className="text-xs sm:text-sm font-semibold text-indigo-300">
                      {activePrompt.category}
                    </div>
                  </div>
                </div>

                {/* Extracted Database Fields */}
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
                  <span className="text-slate-500 font-mono">DB: Supabase Live</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* PAGE 2: THE 8 CORE FUNCTIONAL MODULES */}
        {/* ======================================================================= */}
        <div className="w-screen h-screen shrink-0 overflow-y-auto px-3.5 sm:px-14 md:px-20 lg:px-24 pt-6 pb-28 sm:pb-32 flex flex-col justify-between">
          <div className="w-full max-w-[1600px] mx-auto space-y-6 my-auto">
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

            {/* 8 Module Cards in Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {coreModules.map((m, idx) => {
                const Icon = m.icon;
                return (
                  <div
                    key={m.id}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3 shadow-lg relative group"
                  >
                    <div className="space-y-2.5">
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
                        <h3 className="text-base font-bold text-white leading-tight">{m.title}</h3>
                        <p className="text-[11px] font-medium text-slate-400">{m.subtitle}</p>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {m.desc}
                      </p>

                      <ul className="space-y-1 text-[11px] text-slate-300 pt-1">
                        {m.features.slice(0, 2).map((feat, fi) => (
                          <li key={fi} className="flex items-center space-x-1.5">
                            <Check className="w-3 h-3 text-indigo-400 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <button
                        onClick={() => openAuth('signup')}
                        className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                      >
                        <span>Try {m.title.split(' ')[0]}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={signInAsDemoUser}
                        className="text-[11px] text-slate-400 hover:text-slate-200"
                      >
                        Demo
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* PAGE 3: HOW TO USE & IMPLEMENT */}
        {/* ======================================================================= */}
        <div className="w-screen h-screen shrink-0 overflow-y-auto px-3.5 sm:px-14 md:px-20 lg:px-24 pt-6 pb-28 sm:pb-32 flex flex-col justify-between">
          <div className="w-full max-w-[1600px] mx-auto space-y-6 my-auto">
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
                  <h3 className="text-base font-bold text-white mt-0.5">Mindful Zen Reflection</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Enter full-screen Zen mode. Write your daily gratitude, express wins and lessons, and let AI sentiment reinforce your mental clarity.
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
          </div>
        </div>

        {/* ======================================================================= */}
        {/* PAGE 4: REAL-LIFE USE CASES */}
        {/* ======================================================================= */}
        <div className="w-screen h-screen shrink-0 overflow-y-auto px-3.5 sm:px-14 md:px-20 lg:px-24 pt-6 pb-28 sm:pb-32 flex flex-col justify-between">
          <div className="w-full max-w-[1600px] mx-auto space-y-6 my-auto">
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
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">Priority Kanban</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">Revenue OKRs</span>
                </div>
              </div>

              {/* Persona 2 */}
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm">
                    CP
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white">The Corporate High-Performer</h3>
                    <p className="text-xs text-slate-400">Excelling in career goals while protecting work-life boundaries</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "The Eisenhower focus view keeps my day centered on strategic needle-movers rather than busywork. Tracking my career milestones and habit streaks keeps my Life Score consistently above 85."
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">Eisenhower Matrix</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">Quarterly OKRs</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">Life Score™</span>
                </div>
              </div>

              {/* Persona 3 */}
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold text-sm">
                    FA
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white">The Health & Fitness Enthusiast</h3>
                    <p className="text-xs text-slate-400">Optimizing body composition, sleep recovery & consistency</p>
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
          </div>
        </div>

        {/* ======================================================================= */}
        {/* PAGE 5: COMPARISON MATRIX */}
        {/* ======================================================================= */}
        <div className="w-screen h-screen shrink-0 overflow-y-auto px-3.5 sm:px-14 md:px-20 lg:px-24 pt-6 pb-28 sm:pb-32 flex flex-col justify-between">
          <div className="w-full max-w-[1600px] mx-auto space-y-6 my-auto">
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
                    <td className="py-3.5 px-4 text-emerald-400 font-bold">100% Free & Open</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-white">Input Speed</td>
                    <td className="py-3.5 px-4 text-slate-400">Open 6 separate apps, click 15 buttons</td>
                    <td className="py-3.5 px-4 text-indigo-300 font-semibold">1-Tap Voice or Text Omni Capture</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-white">Unified Life Score™</td>
                    <td className="py-3.5 px-4 text-rose-400 flex items-center space-x-1.5">
                      <X className="w-4 h-4 text-rose-500" />
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
          </div>
        </div>

        {/* ======================================================================= */}
        {/* PAGE 6: GRAND FINALE CTA & GET STARTED */}
        {/* ======================================================================= */}
        <div className="w-screen h-screen shrink-0 overflow-y-auto px-3.5 sm:px-14 md:px-20 lg:px-24 pt-6 pb-28 sm:pb-32 flex flex-col justify-between">
          <div className="w-full max-w-[1600px] mx-auto space-y-6 my-auto">
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

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => openAuth('signup')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-600/30 transition active:scale-95 flex items-center justify-center space-x-2 min-h-[48px]"
                >
                  <span>Create Free Account</span>
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
                  <button onClick={signInAsDemoUser} className="hover:text-indigo-400 transition">
                    Interactive Demo
                  </button>
                  <span>•</span>
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
          </div>
        </div>
      </div>

      {/* In-Place Auth Popup Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialTab={authTab}
      />

      {/* Guided PWA Install Modal */}
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
