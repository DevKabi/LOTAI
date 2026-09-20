import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings, 
  Key, 
  Download, 
  Upload, 
  RotateCcw, 
  ShieldCheck, 
  Volume2, 
  User, 
  DollarSign, 
  Droplet, 
  Moon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Loader2
} from 'lucide-react';

export interface GeminiModelOption {
  id: string;
  displayName: string;
  description?: string;
  isRecommended?: boolean;
}

const DEFAULT_GEMINI_MODELS: GeminiModelOption[] = [
  { 
    id: 'gemini-2.0-flash', 
    displayName: 'Gemini 2.0 Flash', 
    description: 'Next-gen, multimodal, ultra-fast & recommended', 
    isRecommended: true 
  },
  { 
    id: 'gemini-2.0-flash-lite', 
    displayName: 'Gemini 2.0 Flash Lite', 
    description: 'Lightweight & cost-efficient' 
  },
  { 
    id: 'gemini-1.5-flash', 
    displayName: 'Gemini 1.5 Flash', 
    description: 'Standard high-speed production model' 
  },
  { 
    id: 'gemini-1.5-pro', 
    displayName: 'Gemini 1.5 Pro', 
    description: 'Deep analytical reasoning & large context' 
  }
];

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, exportData, importData, resetToSampleData, showToast } = useApp();
  
  // Local form state
  const [userName, setUserName] = useState(settings.userName);
  const [currency, setCurrency] = useState(settings.currency);
  const [monthlyBudget, setMonthlyBudget] = useState(settings.monthlyBudget.toString());
  const [waterTarget, setWaterTarget] = useState(settings.dailyWaterTargetMl.toString());
  const [sleepTarget, setSleepTarget] = useState(settings.dailySleepHours.toString());
  
  // AI Key & Model Discovery state
  const [apiKey, setApiKey] = useState(settings.geminiApiKey || '');
  const initialModel = (!settings.geminiModel || settings.geminiModel === 'gemini-2.5-flash')
    ? 'gemini-2.0-flash'
    : settings.geminiModel.replace(/^models\//, '');
  const [selectedModel, setSelectedModel] = useState(initialModel);
  const [availableModels, setAvailableModels] = useState<GeminiModelOption[]>(DEFAULT_GEMINI_MODELS);
  const [isDiscoveringModels, setIsDiscoveringModels] = useState(false);
  const [discoverySummary, setDiscoverySummary] = useState<string | null>(null);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [testResult, setTestResult] = useState<{
    status: 'success' | 'error';
    message: string;
    modelTested?: string;
    latencyMs?: number;
    sampleReply?: string;
  } | null>(null);

  // Auto-discover available models on mount if key exists
  useEffect(() => {
    if (settings.geminiApiKey && settings.geminiApiKey.trim().length >= 20) {
      fetchAvailableModels(settings.geminiApiKey, false);
    }
  }, []);

  const fetchAvailableModels = async (keyToUse: string, autoSwitchToRecommended = false) => {
    const cleanKey = keyToUse.trim();
    if (!cleanKey || cleanKey.length < 15) return;

    setIsDiscoveringModels(true);
    setDiscoverySummary(null);

    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`);
      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data?.error?.message || `Google API Error (${res.status})`;
        console.warn('Google Models API error:', errorMsg);
        setDiscoverySummary(`Discovery Notice: ${errorMsg}`);
        return;
      }

      if (Array.isArray(data.models) && data.models.length > 0) {
        const validModels: GeminiModelOption[] = data.models
          .filter((m: { supportedGenerationMethods?: string[] }) =>
            m.supportedGenerationMethods?.includes('generateContent')
          )
          .map((m: { name: string; displayName?: string; description?: string }) => {
            const cleanId = m.name.replace(/^models\//, '');
            return {
              id: cleanId,
              displayName: m.displayName || cleanId,
              description: m.description,
              isRecommended: cleanId === 'gemini-2.0-flash'
            };
          });

        const rank: Record<string, number> = {
          'gemini-2.0-flash': 1,
          'gemini-2.0-flash-lite': 2,
          'gemini-1.5-flash': 3,
          'gemini-1.5-flash-8b': 4,
          'gemini-1.5-pro': 5
        };

        validModels.sort((a, b) => (rank[a.id] || 99) - (rank[b.id] || 99));

        if (validModels.length > 0) {
          setAvailableModels(validModels);
          setDiscoverySummary(`Discovered ${validModels.length} compatible models from Google API`);

          if (autoSwitchToRecommended || !validModels.some(m => m.id === selectedModel)) {
            const preferred = validModels.find(m => m.id === 'gemini-2.0-flash')?.id || validModels[0].id;
            setSelectedModel(preferred);
          }
        }
      }
    } catch (err: any) {
      console.warn('Network error discovering Gemini models:', err);
      setDiscoverySummary('Network error querying Google models endpoint.');
    } finally {
      setIsDiscoveringModels(false);
    }
  };

  // Import file ref
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      userName,
      currency,
      monthlyBudget: parseFloat(monthlyBudget) || 3000,
      dailyWaterTargetMl: parseInt(waterTarget, 10) || 2500,
      dailySleepHours: parseFloat(sleepTarget) || 8,
      geminiApiKey: apiKey.trim(),
      geminiModel: selectedModel
    });
    showToast('Preferences Saved', `Profile targets and AI model (${selectedModel}) updated successfully.`);
  };

  const handleTestKey = async () => {
    const cleanKey = apiKey.trim();
    if (!cleanKey) {
      showToast('No API Key', 'Please enter a Gemini API key first.', 'warning');
      return;
    }
    setIsTestingKey(true);
    setTestResult(null);

    // Auto-discover models in parallel if not yet loaded from API
    if (!discoverySummary?.startsWith('Discovered')) {
      fetchAvailableModels(cleanKey, false);
    }

    let activeModel = (selectedModel || 'gemini-2.0-flash').replace(/^models\//, '');
    if (activeModel === 'gemini-2.5-flash') {
      activeModel = 'gemini-2.0-flash';
      setSelectedModel('gemini-2.0-flash');
    }

    const startTime = performance.now();
    try {
      let res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${cleanKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: 'Hello! Respond with OK.' }] }]
          })
        }
      );

      let data = await res.json().catch(() => null);

      // If model returned 404 (not found), attempt automated fallback probe with gemini-2.0-flash
      if (res.status === 404 && activeModel !== 'gemini-2.0-flash') {
        const fallbackRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${cleanKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: 'Hello! Respond with OK.' }] }]
            })
          }
        );
        if (fallbackRes.ok) {
          res = fallbackRes;
          data = await fallbackRes.json().catch(() => null);
          setSelectedModel('gemini-2.0-flash');
          activeModel = 'gemini-2.0-flash';
        }
      }

      const latencyMs = Math.round(performance.now() - startTime);

      if (res.ok) {
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'OK';
        setTestResult({
          status: 'success',
          message: `Connection verified! Model '${activeModel}' is active and responding.`,
          modelTested: activeModel,
          latencyMs,
          sampleReply: reply
        });
        showToast('Gemini Connected!', `${activeModel} responded in ${latencyMs}ms.`);
      } else {
        const errorMsg = data?.error?.message || `HTTP ${res.status}: ${res.statusText}`;
        setTestResult({
          status: 'error',
          message: errorMsg,
          modelTested: activeModel
        });
        showToast('Connection Failed', errorMsg, 'warning');
      }
    } catch (err: any) {
      setTestResult({
        status: 'error',
        message: err?.message || 'Could not connect to Google Gemini endpoint. Please check your network connection.'
      });
      showToast('Connection Failed', 'Could not reach Google Gemini endpoint.', 'warning');
    } finally {
      setIsTestingKey(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importData(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 max-w-4xl animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl sm:text-3xl font-black text-white">Settings & Preferences</h1>
          <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Settings className="w-5 h-5" />
          </span>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          Customize your life targets, configure the Gemini AI Engine, manage backups, and toggle voice.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Gemini AI Configuration Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-indigo-950/20 via-slate-900 to-slate-900 border border-indigo-500/20 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Google Gemini AI Engine (BYOK)</h3>
              <p className="text-xs text-slate-400">
                LOTAI runs seamlessly offline with built-in heuristic NLP. Add your Gemini API key for deep coaching & synthesis.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-400">Gemini API Key</label>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 transition"
                >
                  <span>Get Free Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => {
                    const newKey = e.target.value;
                    setApiKey(newKey);
                    setTestResult(null);
                    // Automatically discover models when a full key is pasted
                    if (newKey.trim().length >= 35) {
                      fetchAvailableModels(newKey.trim(), true);
                    }
                  }}
                  onBlur={() => {
                    if (apiKey.trim().length >= 20 && !discoverySummary?.startsWith('Discovered')) {
                      fetchAvailableModels(apiKey.trim(), false);
                    }
                  }}
                  placeholder="AIzaSy..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fetchAvailableModels(apiKey.trim(), true)}
                    disabled={isDiscoveringModels || !apiKey.trim()}
                    title="Query Google Generative Language API for the latest active models"
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 disabled:opacity-40 transition flex items-center space-x-1.5 shrink-0"
                  >
                    {isDiscoveringModels ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                    )}
                    <span>{isDiscoveringModels ? 'Scanning...' : 'Find Models'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleTestKey}
                    disabled={isTestingKey || !apiKey.trim()}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 disabled:opacity-40 transition flex items-center space-x-1.5 shrink-0"
                  >
                    {isTestingKey ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    <span>{isTestingKey ? 'Testing...' : 'Test Connection'}</span>
                  </button>
                </div>
              </div>

              {/* Discovery notification badge */}
              {discoverySummary && (
                <div className={`mt-2 px-3 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                  discoverySummary.startsWith('Discovered')
                    ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
                    : 'bg-amber-950/40 text-amber-300 border border-amber-800/40'
                }`}>
                  <span>{discoverySummary}</span>
                  {discoverySummary.startsWith('Discovered') && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                      Live Sync
                    </span>
                  )}
                </div>
              )}

              {/* Live Connection Test Results */}
              {testResult && testResult.status === 'success' && (
                <div className="mt-3 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/50 text-xs text-emerald-300 space-y-1">
                  <div className="flex items-center space-x-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{testResult.message}</span>
                    {testResult.latencyMs !== undefined && (
                      <span className="text-[11px] px-1.5 py-0.2 rounded bg-emerald-900/60 text-emerald-200 border border-emerald-700/50 font-mono ml-auto">
                        {testResult.latencyMs}ms
                      </span>
                    )}
                  </div>
                  {testResult.sampleReply && (
                    <div className="text-[11px] text-emerald-400/80 pl-6 italic">
                      Live response: &quot;{testResult.sampleReply}&quot;
                    </div>
                  )}
                </div>
              )}

              {testResult && testResult.status === 'error' && (
                <div className="mt-3 p-3 rounded-xl bg-rose-950/30 border border-rose-800/50 text-xs text-rose-300 space-y-1">
                  <div className="flex items-start space-x-2 font-semibold">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold text-rose-200">Google Gemini API Connection Failed</p>
                      <p className="text-[11px] text-rose-300 font-mono break-all">{testResult.message}</p>
                      <p className="text-[11px] text-rose-400/90 font-normal">
                        Tip: Verify your key has Google Generative Language API enabled. You can generate a free Gemini key in Google AI Studio.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* AI Model Selector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-400">
                  AI Model
                </label>
                <span className="text-[11px] text-indigo-400/80 font-medium">
                  {availableModels.some(m => m.id === selectedModel)
                    ? `Active: ${selectedModel}`
                    : 'Custom Model'}
                </span>
              </div>

              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-medium"
              >
                {availableModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.displayName} {model.isRecommended ? '⭐ (Recommended)' : ''} — {model.id}
                  </option>
                ))}
              </select>

              {/* Quick Model Selector Pills */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {[
                  { id: 'gemini-2.0-flash', label: '2.0 Flash (Fastest)' },
                  { id: 'gemini-2.0-flash-lite', label: '2.0 Flash Lite' },
                  { id: 'gemini-1.5-flash', label: '1.5 Flash' },
                  { id: 'gemini-1.5-pro', label: '1.5 Pro (Deep)' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedModel(item.id);
                      setTestResult(null);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                      selectedModel === item.id
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-600/30 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Model Description text */}
              {availableModels.find(m => m.id === selectedModel)?.description && (
                <p className="text-[11px] text-slate-400 mt-2 italic">
                  {availableModels.find(m => m.id === selectedModel)?.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Life Targets & Profile */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Profile & Life Targets</h3>
              <p className="text-xs text-slate-400">Baseline thresholds for Life on Track scoring.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Your Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Currency & Payment Symbol Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400">
                Currency & Payment Symbol
              </label>

              {/* Main Currency Dropdown */}
              <select
                value={
                  [
                    { code: 'USD', symbol: '$' },
                    { code: 'EUR', symbol: '€' },
                    { code: 'AED', symbol: 'AED' },
                    { code: 'INR', symbol: '₹' },
                    { code: 'JPY', symbol: '¥' },
                    { code: 'GBP', symbol: '£' },
                    { code: 'CAD', symbol: 'C$' },
                    { code: 'AUD', symbol: 'A$' },
                    { code: 'CHF', symbol: 'CHF' },
                    { code: 'SGD', symbol: 'S$' }
                  ].some(c => c.symbol.toLowerCase() === currency.toLowerCase() || c.code.toLowerCase() === currency.toLowerCase())
                    ? [
                        { code: 'USD', symbol: '$' },
                        { code: 'EUR', symbol: '€' },
                        { code: 'AED', symbol: 'AED' },
                        { code: 'INR', symbol: '₹' },
                        { code: 'JPY', symbol: '¥' },
                        { code: 'GBP', symbol: '£' },
                        { code: 'CAD', symbol: 'C$' },
                        { code: 'AUD', symbol: 'A$' },
                        { code: 'CHF', symbol: 'CHF' },
                        { code: 'SGD', symbol: 'S$' }
                      ].find(c => c.symbol.toLowerCase() === currency.toLowerCase() || c.code.toLowerCase() === currency.toLowerCase())?.code
                    : 'CUSTOM'
                }
                onChange={(e) => {
                  const map: Record<string, string> = {
                    USD: '$',
                    EUR: '€',
                    AED: 'AED',
                    INR: '₹',
                    JPY: '¥',
                    GBP: '£',
                    CAD: 'C$',
                    AUD: 'A$',
                    CHF: 'CHF',
                    SGD: 'S$'
                  };
                  if (map[e.target.value]) {
                    setCurrency(map[e.target.value]);
                  }
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="USD">$ — US Dollar (USD)</option>
                <option value="EUR">€ — Euro (EUR)</option>
                <option value="AED">AED — UAE Dirham (د.إ)</option>
                <option value="INR">₹ — Indian Rupee (INR)</option>
                <option value="JPY">¥ — Japanese Yen (JPY)</option>
                <option value="GBP">£ — British Pound (GBP)</option>
                <option value="CAD">C$ — Canadian Dollar (CAD)</option>
                <option value="AUD">A$ — Australian Dollar (AUD)</option>
                <option value="CHF">CHF — Swiss Franc (CHF)</option>
                <option value="SGD">S$ — Singapore Dollar (SGD)</option>
                <option value="CUSTOM">Custom Currency...</option>
              </select>

              {/* 1-Tap Quick Pick Pills for Popular Currencies */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {[
                  { symbol: '$', label: '$ USD' },
                  { symbol: '€', label: '€ EUR' },
                  { symbol: 'AED', label: 'AED UAE' },
                  { symbol: '₹', label: '₹ INR' },
                  { symbol: '¥', label: '¥ JPY' },
                  { symbol: '£', label: '£ GBP' }
                ].map(item => (
                  <button
                    key={item.symbol}
                    type="button"
                    onClick={() => setCurrency(item.symbol)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                      currency === item.symbol || (item.symbol === '₹' && currency.toLowerCase() === 'inr')
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-600/30'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Active Symbol Display / Custom Input */}
              <div className="flex items-center space-x-2 pt-1">
                <span className="text-[11px] text-slate-500 font-medium">Active Symbol:</span>
                <input
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  placeholder="e.g. ₹, $, AED"
                  className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-indigo-400 font-bold focus:outline-none focus:border-indigo-500 text-center"
                />
                <span className="text-[11px] text-slate-500">Applied across all finance & target views.</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center space-x-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Monthly Budget Allowance ({currency})</span>
              </label>
              <input
                type="number"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center space-x-1">
                <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                <span>Daily Water Intake Target (ml)</span>
              </label>
              <input
                type="number"
                value={waterTarget}
                onChange={(e) => setWaterTarget(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center space-x-1">
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Daily Sleep Goal (hours)</span>
              </label>
              <input
                type="number"
                step="0.5"
                value={sleepTarget}
                onChange={(e) => setSleepTarget(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 self-end">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-medium text-slate-300">Voice Assistant Feedback</span>
              </div>
              <input
                type="checkbox"
                checked={settings.voiceFeedback}
                onChange={(e) => updateSettings({ voiceFeedback: e.target.checked })}
                className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </form>

      {/* Data Sovereignty & Portability Card */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Data Sovereignty & Backups</h3>
            <p className="text-xs text-slate-400">Your life data belongs to you. Export or restore at any time.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Export JSON */}
          <button
            onClick={exportData}
            className="flex items-center justify-center space-x-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Download JSON Backup</span>
          </button>

          {/* Import JSON */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center space-x-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition"
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Restore From Backup</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Reset Demo Data */}
          <button
            onClick={() => {
              if (window.confirm('Reset all modules back to the sample demo data? Any custom logs will be overwritten.')) {
                resetToSampleData();
              }
            }}
            className="flex items-center justify-center space-x-2 p-3 rounded-xl bg-rose-950/30 hover:bg-rose-950/50 text-rose-300 border border-rose-800/40 font-semibold text-xs transition"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
