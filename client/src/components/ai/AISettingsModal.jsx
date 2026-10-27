import React, { useState, useEffect } from 'react';
import {
  X,
  KeyRound,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ShieldCheck,
  Cpu,
  Trash2,
} from 'lucide-react';
import {
  getStoredApiKey,
  setStoredApiKey,
  clearStoredApiKey,
  getStoredModel,
  setStoredModel,
  validateApiKey,
  getAIStatus,
} from '../../services/aiService';

export const AISettingsModal = ({ isOpen, onClose, onConfigSaved }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-3.8-flash');
  const [serverHasKey, setServerHasKey] = useState(false);
  const [testingKey, setTestingKey] = useState(false);
  const [testResult, setTestResult] = useState(null); // { success, message }
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getStoredApiKey());
      setSelectedModel(getStoredModel());
      setTestResult(null);
      setSaveSuccess(false);

      // Check server status
      getAIStatus().then((status) => {
        setServerHasKey(Boolean(status?.hasServerKey));
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    const keyToTest = apiKey.trim();
    if (!keyToTest) {
      setTestResult({
        success: false,
        message: 'Please paste your Gemini API key first.',
      });
      return;
    }

    setTestingKey(true);
    setTestResult(null);
    try {
      const res = await validateApiKey(keyToTest);
      if (res.valid) {
        setTestResult({
          success: true,
          message: 'Success! Your Gemini API key is valid and connected.',
        });
      } else {
        setTestResult({
          success: false,
          message: res.message || 'Validation failed. Check your API key.',
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: err.message || 'Failed to connect to Gemini API.',
      });
    } finally {
      setTestingKey(false);
    }
  };

  const handleSave = () => {
    setStoredApiKey(apiKey.trim());
    setStoredModel(selectedModel);
    setSaveSuccess(true);
    if (onConfigSaved) {
      onConfigSaved({ apiKey: apiKey.trim(), model: selectedModel });
    }
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleClear = () => {
    clearStoredApiKey();
    setApiKey('');
    setTestResult(null);
    setSaveSuccess(false);
    if (onConfigSaved) {
      onConfigSaved({ apiKey: '', model: selectedModel });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-brand-50/50 via-indigo-50/30 to-transparent dark:from-brand-950/40 dark:via-indigo-950/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-brand-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Gemini AI Configuration
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/60 dark:text-brand-300">
                  Direct API
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure your Google Gemini API key and model
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Server Key Status Banner */}
          {serverHasKey && (
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                Backend server already has a default <strong>GEMINI_API_KEY</strong> configured. You can still use your personal key below to override it.
              </span>
            </div>
          )}

          {/* Model Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-brand-500" />
              Gemini AI Model
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                {
                  id: 'gemini-3.8-flash',
                  name: 'Gemini 3.8 Flash',
                  badge: 'Latest & Recommended',
                  desc: 'High-speed multimodal performance and real-time reasoning',
                },
                {
                  id: 'gemini-flash-latest',
                  name: 'Gemini Flash Latest',
                  badge: 'Auto-Updated',
                  desc: 'Always uses the latest production flash version',
                },
                {
                  id: 'gemini-3.7-flash',
                  name: 'Gemini 3.7 Flash',
                  badge: 'Hybrid Reasoning',
                  desc: 'Advanced problem solving and architectural insights',
                },
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  className={`cursor-pointer p-3 rounded-xl border text-left transition-all ${
                    selectedModel === m.id
                      ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/40 shadow-sm ring-1 ring-brand-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {m.name}
                    </span>
                  </div>
                  <span className="inline-block text-[10px] font-semibold text-brand-600 dark:text-brand-400 bg-brand-100/70 dark:bg-brand-900/60 px-1.5 py-0.5 rounded mb-1">
                    {m.badge}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    {m.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Gemini API Key Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-brand-500" />
                Google Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                Get Free API Key
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setTestResult(null);
                }}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-mono transition-all pr-20"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 transition-colors"
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>

            <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              🔑 You can generate a 100% free API key from{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-brand-600 dark:text-brand-400 underline font-medium"
              >
                Google AI Studio
              </a>
              . Your key is securely stored in your local browser storage or can be added to <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[10px]">server/.env</code> as <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[10px]">GEMINI_API_KEY=...</code>.
            </p>
          </div>

          {/* Test Connection Button & Result */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleTestKey}
                disabled={testingKey || !apiKey.trim()}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1.5 transition-colors"
              >
                {testingKey ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Validating with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                    <span>Test Connection</span>
                  </>
                )}
              </button>

              {apiKey && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center space-x-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Key</span>
                </button>
              )}
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-xl text-xs flex items-start space-x-2.5 transition-all ${
                  testResult.success
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-300'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span className="leading-relaxed">{testResult.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <span className="text-xs text-slate-500">
            {saveSuccess && (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Settings Saved!
              </span>
            )}
          </span>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
