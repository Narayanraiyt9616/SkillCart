import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Clock, Bookmark, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, HelpCircle, Sparkles, Award } from 'lucide-react';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/common/Modal';

export const AssessmentPage = () => {
  const params = useParams();
  const targetCourseId = params.courseId || params.certificationId || params.id;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const difficultyMode = searchParams.get('difficultyMode') || 'mixed';
  const skillParam = searchParams.get('skill') || '';

  const [attemptId, setAttemptId] = useState(null);
  const [courseInfo, setCourseInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: selectedValue }
  const [flagged, setFlagged] = useState(new Set());

  const [timeLeft, setTimeLeft] = useState(3600); // In seconds
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const startTimeRef = useRef(Date.now());

  // 1. Initialize Assessment Attempt
  useEffect(() => {
    const initAssessment = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await API.post('/assessments/start', {
          courseId: targetCourseId,
          skill: skillParam,
          difficultyMode,
        });
        if (res.data.success) {
          setAttemptId(res.data.attemptId);
          setCourseInfo(res.data.course);
          // Cap at max 25 questions
          setQuestions((res.data.questions || []).slice(0, 25));
          setTimeLeft((res.data.course.duration || 60) * 60);
          startTimeRef.current = Date.now();
        }
      } catch (err) {
        console.error('[Start Assessment Error]', err);
        if (err.response?.status === 402 || err.response?.data?.paymentRequired) {
          addToast('Payment required before taking this certification assessment!', 'warning');
          navigate(`/payment/${targetCourseId}`, { replace: true });
          return;
        }
        const errMsg = err.response?.data?.message || 'Failed to start assessment';
        setErrorMsg(errMsg);
        addToast(errMsg, 'error');
      } finally {
        setLoading(false);
      }
    };

    initAssessment();
  }, [targetCourseId, skillParam, difficultyMode, addToast]);

  // 2. Countdown Timer Effect
  useEffect(() => {
    if (loading || !attemptId) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, attemptId]);

  const handleAutoSubmit = async () => {
    addToast('Time has expired! Automatically submitting your assessment...', 'warning');
    await executeSubmission();
  };

  const handleOptionSelect = (qId, optionIdx, type) => {
    setAnswers((prev) => {
      if (type === 'multiple') {
        const currentArr = prev[qId] || [];
        if (currentArr.includes(optionIdx)) {
          return { ...prev, [qId]: currentArr.filter((i) => i !== optionIdx) };
        } else {
          return { ...prev, [qId]: [...currentArr, optionIdx] };
        }
      } else {
        return { ...prev, [qId]: optionIdx };
      }
    });
  };

  const toggleFlagForReview = (qId) => {
    setFlagged((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(qId)) newSet.delete(qId);
      else newSet.add(qId);
      return newSet;
    });
  };

  const executeSubmission = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const formattedAnswers = Object.keys(answers).map((qId) => ({
        questionId: qId,
        selectedAnswer: answers[qId],
      }));

      const elapsedSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);

      const res = await API.post('/assessments/submit', {
        attemptId,
        userAnswers: formattedAnswers,
        timeTaken: elapsedSeconds,
      });

      if (res.data.success) {
        addToast('Assessment submitted successfully!', 'success');
        navigate(`/assessment/${attemptId}/result`);
      }
    } catch (err) {
      console.error('[Submit Assessment Error]', err);
      addToast(err.response?.data?.message || 'Error submitting assessment', 'error');
    } finally {
      setSubmitting(false);
      setShowSubmitModal(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyBadge = (diff) => {
    const d = (diff || '').toLowerCase();
    if (d === 'easy') return { label: 'Easy', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    if (d === 'medium') return { label: 'Medium', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
    if (d === 'hard') return { label: 'Hard', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    if (d === 'very-hard') return { label: 'Very Hard', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
    return { label: 'Medium', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
  };

  if (errorMsg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-8 text-center">
        <AlertTriangle className="w-16 h-16 text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold">Certification Exam Error</h2>
        <p className="text-slate-400 mt-2 max-w-md">{errorMsg}</p>
        <button
          onClick={() => navigate('/courses')}
          className="mt-6 px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 transition-colors"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  if (loading || !courseInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-brand-500 mx-auto"></div>
          <p className="text-sm font-semibold text-slate-400">Initializing secure 25-question exam environment...</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const isTimeCritical = timeLeft < 300; // Under 5 mins
  const progressPct = questions.length > 0 ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;
  const currentDiffBadge = getDifficultyBadge(currentQ?.difficulty);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans select-none">
      {/* Top Fixed Exam Header */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 flex items-center justify-center font-bold text-white shrink-0">
            SC
          </div>
          <div>
            <h1 className="text-base font-bold text-white line-clamp-1">{courseInfo.title}</h1>
            <p className="text-xs text-brand-400 font-semibold">
              Question {currentIndex + 1} of {questions.length} (Max 25)
            </p>
          </div>
        </div>

        {/* Timer Bar */}
        <div
          className={`flex items-center space-x-2 px-4 py-2 rounded-2xl font-mono text-sm font-extrabold border ${
            isTimeCritical
              ? 'bg-rose-950/80 text-rose-400 border-rose-800 animate-pulse'
              : 'bg-slate-800 text-slate-200 border-slate-700'
          }`}
        >
          <Clock className="w-4 h-4 text-brand-400" />
          <span>{formatTime(timeLeft)}</span>
        </div>

        {/* Submit Action */}
        <button
          onClick={() => setShowSubmitModal(true)}
          className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transition-all"
        >
          Submit Exam
        </button>
      </header>

      {/* Top Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        ></div>
      </div>

      {/* Main Exam Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Question Area */}
        <main className="lg:col-span-8 flex flex-col justify-between space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            
            {/* Question Header & Tags */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-950 text-brand-300 border border-brand-800">
                  {currentQ?.module || 'General'}
                </span>

                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase border ${currentDiffBadge.color}`}>
                  {currentDiffBadge.label}
                </span>
              </div>

              <button
                onClick={() => toggleFlagForReview(currentQ.questionId)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  flagged.has(currentQ.questionId)
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-800'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>{flagged.has(currentQ.questionId) ? 'Flagged' : 'Mark for Review'}</span>
              </button>
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  Mode: {difficultyMode.toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
                {currentQ.question}
              </h2>
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, optIdx) => {
                const qId = currentQ.questionId;
                const isSelected =
                  currentQ.type === 'multiple'
                    ? Array.isArray(answers[qId]) && answers[qId].includes(optIdx)
                    : answers[qId] === optIdx;

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleOptionSelect(qId, optIdx, currentQ.type)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                      isSelected
                        ? 'bg-brand-950/60 border-brand-500 text-white shadow-md shadow-brand-500/10'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span
                        className={`w-7 h-7 rounded-xl font-mono text-xs font-bold flex items-center justify-center ${
                          isSelected ? 'bg-brand-600 text-white' : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="text-sm font-medium">{opt}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-brand-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="flex items-center space-x-2 px-6 py-3 rounded-2xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white transition-colors shadow-md"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-6 py-3 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
              >
                Finish & Submit Exam
              </button>
            )}
          </div>
        </main>

        {/* Right Column: Question Palette */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Exam Navigation Palette
              </h3>
              <span className="text-xs font-extrabold text-brand-400">
                Max 25 Qs
              </span>
            </div>

            {/* Status Counters */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-800 p-2.5 rounded-xl">
                <span className="block font-bold text-white text-base">{answeredCount}</span>
                <span className="text-slate-400">Answered</span>
              </div>
              <div className="bg-slate-800 p-2.5 rounded-xl">
                <span className="block font-bold text-amber-400 text-base">{flagged.size}</span>
                <span className="text-slate-400">Flagged</span>
              </div>
              <div className="bg-slate-800 p-2.5 rounded-xl">
                <span className="block font-bold text-slate-400 text-base">{questions.length - answeredCount}</span>
                <span className="text-slate-400">Unanswered</span>
              </div>
            </div>

            {/* Questions Grid Selector */}
            <div className="grid grid-cols-5 gap-2.5 pt-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = answers[q.questionId] !== undefined;
                const isFlagged = flagged.has(q.questionId);

                let btnClass = 'bg-slate-800 text-slate-400 hover:bg-slate-700';
                if (isAnswered) btnClass = 'bg-brand-600 text-white font-bold';
                if (isFlagged) btnClass = 'bg-amber-500 text-slate-950 font-bold';
                if (isCurrent) btnClass += ' ring-2 ring-white ring-offset-2 ring-offset-slate-900';

                return (
                  <button
                    key={q.questionId}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-11 rounded-xl font-mono text-xs transition-all flex items-center justify-center relative ${btnClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      {/* Final Submit Confirmation Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Assessment?"
      >
        <div className="space-y-4 text-slate-900 dark:text-white">
          <div className="flex items-center space-x-3 p-4 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 rounded-2xl text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-6 h-6 shrink-0 text-amber-600" />
            <p className="text-xs font-semibold">
              Are you sure you want to finish the exam? You cannot modify your answers after submitting.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Total Questions:</span>
              <span className="font-bold">{questions.length} of 25</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Answered Questions:</span>
              <span className="font-bold text-brand-600">{answeredCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Unanswered Questions:</span>
              <span className="font-bold text-rose-500">{questions.length - answeredCount}</span>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="w-1/2 py-3 rounded-xl font-bold text-xs bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
            >
              Continue Exam
            </button>
            <button
              onClick={executeSubmission}
              disabled={submitting}
              className="w-1/2 py-3 rounded-xl font-bold text-xs bg-emerald-600 text-white shadow-lg disabled:opacity-50"
            >
              {submitting ? 'Evaluating...' : 'Confirm Submission'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
