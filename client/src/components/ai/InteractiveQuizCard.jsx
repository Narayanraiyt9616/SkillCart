import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, RefreshCw, Trophy } from 'lucide-react';

export const InteractiveQuizCard = ({ quizData, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [index]: selectedOptionIndex }
  const [showResults, setShowResults] = useState(false);

  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    return null;
  }

  const questions = quizData.questions;
  const currentQ = questions[currentIndex];
  const total = questions.length;
  const isAnswered = selectedAnswers[currentIndex] !== undefined;
  const selectedOption = selectedAnswers[currentIndex];
  const isCorrect = selectedOption === currentQ.correctAnswer;

  const handleSelectOption = (optIndex) => {
    if (isAnswered) return; // Prevent re-answering
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optIndex,
    }));
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowResults(false);
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= 70;

    return (
      <div className="my-3 p-5 rounded-2xl bg-gradient-to-br from-white to-brand-50/40 dark:from-slate-900 dark:to-slate-950 border border-brand-200 dark:border-brand-900/60 shadow-lg text-center animate-fadeIn">
        <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/25">
          <Trophy className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Quiz Completed!
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          Topic: {quizData.skillName || 'Skill Assessment'}
        </p>

        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-extrabold mb-4">
          <span className="text-slate-600 dark:text-slate-300">Score:</span>
          <span className={passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
            {score} / {total} ({percentage}%)
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
            passed ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
          }`}>
            {passed ? 'Passed (>=70%)' : 'Needs Practice'}
          </span>
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={handleRestart}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white flex items-center gap-1.5 shadow-sm transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry Quiz
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Done
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="my-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded-md">
            Practice Quiz
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Question {currentIndex + 1} of {total}
          </span>
        </div>
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 capitalize">
          {quizData.skillName} • {currentQ.difficulty || 'medium'}
        </span>
      </div>

      {/* Question Text */}
      <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 leading-snug">
        {currentQ.question}
      </h4>

      {/* Options */}
      <div className="space-y-2 mb-3">
        {currentQ.options.map((opt, optIdx) => {
          let btnStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-200 hover:border-brand-400 hover:bg-brand-50/30';
          let icon = null;

          if (isAnswered) {
            if (optIdx === currentQ.correctAnswer) {
              btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-medium ring-1 ring-emerald-500';
              icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
            } else if (optIdx === selectedOption) {
              btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 ring-1 ring-rose-500';
              icon = <XCircle className="w-4 h-4 text-rose-600 shrink-0" />;
            } else {
              btnStyle = 'opacity-40 border-slate-200 dark:border-slate-800 text-slate-500';
            }
          }

          return (
            <button
              key={optIdx}
              type="button"
              disabled={isAnswered}
              onClick={() => handleSelectOption(optIdx)}
              className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${btnStyle}`}
            >
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-bold flex items-center justify-center shrink-0">
                  {String.fromCharCode(65 + optIdx)}
                </span>
                <span>{opt}</span>
              </div>
              {icon}
            </button>
          );
        })}
      </div>

      {/* Explanation Banner (when answered) */}
      {isAnswered && (
        <div className={`p-3 rounded-xl text-xs mb-3 transition-all ${
          isCorrect
            ? 'bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800/60'
            : 'bg-amber-50/80 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/60'
        }`}>
          <div className="flex items-center space-x-1.5 font-bold mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{isCorrect ? 'Correct Answer!' : 'Explanation:'}</span>
          </div>
          <p className="text-[11.5px] leading-relaxed">
            {currentQ.explanation}
          </p>
        </div>
      )}

      {/* Footer Controls */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-[11px] text-slate-400">
          {isAnswered ? (isCorrect ? '✨ Great job!' : '💡 Review the solution above') : 'Select an option'}
        </span>
        {isAnswered && (
          <button
            type="button"
            onClick={handleNext}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-sm flex items-center gap-1 transition-all"
          >
            <span>{currentIndex < total - 1 ? 'Next Question' : 'View Results'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
