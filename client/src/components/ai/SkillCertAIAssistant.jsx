import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  RotateCcw,
  Maximize2,
  Minimize2,
  Settings,
  Bot,
  User,
  HelpCircle,
  Copy,
  Check,
  AlertCircle,
  BookOpen,
  Mic,
  MicOff,
  Flame,
  KeyRound,
  ExternalLink,
} from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { AISettingsModal } from './AISettingsModal';
import { InteractiveQuizCard } from './InteractiveQuizCard';
import {
  sendChatMessage,
  generateQuizQuestions,
  getStoredApiKey,
  getStoredModel,
  getAIStatus,
} from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';

const STARTER_PROMPTS = [
  {
    icon: '🎓',
    title: 'Career Roadmap',
    prompt: 'Suggest a complete learning roadmap to become a certified Full Stack Web Developer on SkillCert.',
  },
  {
    icon: '🧪',
    title: 'Practice Quiz',
    prompt: 'Can you give me 3 practice multiple choice questions on React and Node.js with explanations?',
    isQuizTrigger: true,
    skill: 'React and Node.js',
  },
  {
    icon: '📜',
    title: 'Certification Tips',
    prompt: 'What are the best tips to score 70% or above in the SkillCert certification exam?',
  },
  {
    icon: '💡',
    title: 'Explain Async/Await',
    prompt: 'Explain JavaScript Promises and Async/Await with clean code examples.',
  },
];

export const SkillCertAIAssistant = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [currentModel, setCurrentModel] = useState('gemini-3.8-flash');

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorAlert, setErrorAlert] = useState(null);
  const [copiedMsgId, setCopiedMsgId] = useState(null);

  // Active quiz state
  const [activeQuiz, setActiveQuiz] = useState(null);

  // Voice speech recognition
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Conversation history
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('skillcert_ai_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Sync messages to localStorage
  useEffect(() => {
    localStorage.setItem('skillcert_ai_chat_history', JSON.stringify(messages));
  }, [messages]);

  // Check connection status & model
  useEffect(() => {
    const key = getStoredApiKey();
    setCurrentModel(getStoredModel());

    getAIStatus().then((status) => {
      setHasApiKey(Boolean(key || status?.hasServerKey));
    });
  }, [isOpen, isSettingsOpen]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, activeQuiz, isOpen]);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    setErrorAlert(null);
    setInputMessage('');

    // Append user message
    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await sendChatMessage({
        messages: newMessages.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          content: m.content,
        })),
        model: currentModel,
      });

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.reply,
        model: response.model || currentModel,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      if (err.code === 'NO_API_KEY' || err.message?.includes('API key')) {
        setErrorAlert({
          type: 'NO_API_KEY',
          message: 'Google Gemini API key is missing. Click below to add your free key.',
        });
      } else {
        setErrorAlert({
          type: 'GENERAL_ERROR',
          message: err.message || 'Failed to connect with Gemini AI. Please try again.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerQuiz = async (skillName = 'Full Stack Web Development') => {
    setErrorAlert(null);
    setLoading(true);

    const userPrompt = `Generate a 3-question practice quiz on ${skillName}`;
    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: userPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await generateQuizQuestions({
        skillName,
        difficulty: 'medium',
        count: 3,
        model: currentModel,
      });

      if (res.questions && res.questions.length > 0) {
        setActiveQuiz({
          skillName,
          questions: res.questions,
        });

        const aiMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Here is your interactive 3-question practice quiz for **${skillName}**! Answer each question below to test your certification readiness:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err) {
      if (err.code === 'NO_API_KEY') {
        setErrorAlert({
          type: 'NO_API_KEY',
          message: 'Google Gemini API key is missing. Add your free key to generate quizzes.',
        });
      } else {
        setErrorAlert({
          type: 'GENERAL_ERROR',
          message: err.message || 'Failed to generate quiz questions.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear your AI chat history?')) {
      setMessages([]);
      setActiveQuiz(null);
      setErrorAlert(null);
      localStorage.removeItem('skillcert_ai_chat_history');
    }
  };

  const handleCopyMessage = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleRegenerate = () => {
    if (messages.length === 0) return;
    // Find last user message
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      // Remove last assistant message if present
      const cleaned = messages[messages.length - 1].role === 'assistant' ? messages.slice(0, -1) : messages;
      setMessages(cleaned);
      handleSendMessage(lastUserMsg.content);
    }
  };

  return (
    <>
      {/* Floating Launcher Action Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center group">
          {/* Tooltip Pill */}
          <div className="mr-3 hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 shadow-lg text-xs font-semibold text-slate-800 dark:text-slate-200 opacity-90 group-hover:opacity-100 transition-opacity pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ask SkillCert AI</span>
          </div>

          <button
            type="button"
            id="skillcert-ai-assistant-btn"
            onClick={() => setIsOpen(true)}
            className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-brand-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 group-hover:shadow-brand-500/40"
            aria-label="Open SkillCert AI Assistant"
          >
            <Sparkles className="w-6 h-6 animate-pulse" />

            {/* Sparkle badge */}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full" />
          </button>
        </div>
      )}

      {/* Assistant Chat Panel */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ease-in-out flex flex-col ${
            isExpanded
              ? 'inset-3 sm:inset-8 md:inset-12 max-w-5xl mx-auto rounded-3xl'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[440px] md:w-[480px] h-[640px] max-h-[88vh] rounded-3xl'
          } bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden`}
        >
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800 bg-gradient-to-r from-brand-50/60 via-indigo-50/40 to-transparent dark:from-brand-950/60 dark:via-indigo-950/30 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    SkillCert AI Assistant
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/60 dark:text-brand-300">
                    Gemini Direct
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <span>Model:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 font-mono">
                    {currentModel}
                  </span>
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                title="Configure Gemini API Key"
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleClearChat}
                title="Clear Conversation"
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Minimize Window' : 'Expand Window'}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:block"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Error / Key Alert */}
          {errorAlert && (
            <div className="px-4 py-2.5 bg-amber-50 dark:bg-amber-950/60 border-b border-amber-200 dark:border-amber-900/60 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 animate-fadeIn shrink-0">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>{errorAlert.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="ml-3 px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shrink-0 transition-colors"
              >
                Setup API Key
              </button>
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
            {/* Empty State / Welcome Screen */}
            {messages.length === 0 && (
              <div className="py-6 px-2 text-center space-y-5 animate-fadeIn">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-brand-500/25">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    Hello{user?.name ? `, ${user.name}` : ''}! How can I help you excel?
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                    I am directly integrated with <strong>Google Gemini API</strong> to help you prepare for SkillCert exams, clarify doubts, and generate practice quizzes.
                  </p>
                </div>

                {/* Prompt Starter Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left pt-2">
                  {STARTER_PROMPTS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (item.isQuizTrigger) {
                          handleTriggerQuiz(item.skill);
                        } else {
                          handleSendMessage(item.prompt);
                        }
                      }}
                      className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-brand-500 dark:hover:border-brand-500 hover:bg-brand-50/40 dark:hover:bg-brand-950/40 transition-all group"
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-base">{item.icon}</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                        {item.prompt}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Conversation Messages */}
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              const isCopied = copiedMsgId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2.5 animate-fadeIn ${
                    isUser ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                      isUser
                        ? 'bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-sm'
                        : 'bg-gradient-to-tr from-purple-600 via-indigo-600 to-brand-600 text-white shadow-sm'
                    }`}
                  >
                    {isUser ? (
                      user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`max-w-[85%] sm:max-w-[80%] space-y-1`}>
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        isUser
                          ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-tr-none'
                          : 'bg-slate-100/90 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <MarkdownRenderer content={msg.content} />
                      )}
                    </div>

                    {/* Metadata & Actions */}
                    <div
                      className={`flex items-center space-x-2 text-[10px] text-slate-400 dark:text-slate-500 px-1 ${
                        isUser ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {!isUser && (
                        <>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() => handleCopyMessage(msg.content, msg.id)}
                            className="hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-0.5 transition-colors"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span className="text-emerald-500">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Interactive Quiz if triggered */}
            {activeQuiz && (
              <InteractiveQuizCard
                quizData={activeQuiz}
                onClose={() => setActiveQuiz(null)}
              />
            )}

            {/* Loading / Thinking shimmer */}
            {loading && (
              <div className="flex items-start space-x-2.5 animate-fadeIn">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-brand-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-2xl rounded-tl-none bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 text-xs flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                    Gemini is thinking...
                  </span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Action Chips Bar */}
          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center space-x-1.5 overflow-x-auto no-scrollbar shrink-0">
            <button
              type="button"
              onClick={() => handleTriggerQuiz('Full Stack Web Development')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-300 shrink-0 transition-colors flex items-center gap-1"
            >
              <span>🎯 Practice Quiz</span>
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('Give me 5 essential exam tips to pass the SkillCert certification on the first try.')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-300 shrink-0 transition-colors flex items-center gap-1"
            >
              <span>💡 Exam Tips</span>
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('Create a 30-day preparation timetable for Data Structures & Algorithms.')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-300 shrink-0 transition-colors flex items-center gap-1"
            >
              <span>📅 30-Day Roadmap</span>
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('How does the SkillCert certificate verification via QR code and Verification ID work?')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-300 shrink-0 transition-colors flex items-center gap-1"
            >
              <span>📜 Certificate Verification</span>
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('How can I optimize my tech resume to score 90%+ on ATS scanners, and what are the best action verbs and formatting rules?')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-300 shrink-0 transition-colors flex items-center gap-1"
            >
              <span>📄 ATS Resume Tips</span>
            </button>
          </div>

          {/* Input Form */}
          <div className="p-3.5 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2"
            >
              {/* Voice Input Button */}
              <button
                type="button"
                onClick={toggleListening}
                title={isListening ? 'Stop listening' : 'Speak to AI'}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isListening
                    ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border-slate-200 dark:border-slate-700'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Text Input */}
              <input
                ref={textareaRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? 'Listening to your voice...' : 'Ask Gemini anything about skills, exams, code...'}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className="p-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-brand-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-slate-400">
              <span>Press <kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">Enter</kbd> to send</span>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="hover:text-brand-600 dark:hover:text-brand-400 underline transition-colors"
              >
                Gemini API Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <AISettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onConfigSaved={({ apiKey, model }) => {
          setHasApiKey(Boolean(apiKey));
          if (model) setCurrentModel(model);
        }}
      />
    </>
  );
};
