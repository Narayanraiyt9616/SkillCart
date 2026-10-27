import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Award, CheckCircle2, XCircle, Clock, AlertCircle, RefreshCw, Eye, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import API from '../services/api';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Badge } from '../components/common/Badge';
import { CertificateViewerModal } from '../components/certificate/CertificateViewerModal';

export const ResultPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReview, setShowReview] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/assessments/${attemptId}/result`);
        if (res.data.success) {
          setResult(res.data.result);
          if (res.data.result.status === 'PASSED') {
            // Trigger celebration confetti
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.6 },
            });
          }
        }
      } catch (err) {
        console.error('[Fetch Result Error]', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-center p-8">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
          <h2 className="text-2xl font-bold">Result Not Found</h2>
          <Link to="/courses" className="mt-4 px-6 py-2 bg-brand-600 text-white rounded-xl font-bold">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const isPassed = result.status === 'PASSED';
  const course = result.course || {};

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const chartData = (result.skillBreakdown || []).map((sb) => ({
    module: sb.module.length > 18 ? sb.module.substring(0, 18) + '...' : sb.module,
    percentage: sb.percentage,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Top Result Banner */}
        <div
          className={`rounded-3xl p-8 text-white shadow-2xl text-center relative overflow-hidden ${
            isPassed
              ? 'bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800'
              : 'bg-gradient-to-br from-rose-600 via-rose-700 to-slate-900'
          }`}
        >
          <div className="relative z-10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto text-white">
              {isPassed ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black">
              {isPassed ? 'Congratulations! You Passed 🎉' : 'Better Luck Next Time'}
            </h1>

            <p className="text-white/90 text-sm sm:text-base max-w-xl mx-auto font-medium">
              {isPassed
                ? `You have successfully validated your competency in ${course.title || 'this course'} and earned your official SkillCert digital credential!`
                : `You scored ${result.percentage}%. A minimum passing threshold of ${result.passingPercentage || 70}% is required.`}
            </p>

            {/* Big Score Badges */}
            <div className="inline-flex items-center space-x-6 bg-white/15 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/20 my-4">
              <div className="text-center">
                <span className="text-xs uppercase tracking-wider text-white/70 block">Score</span>
                <span className="text-3xl font-black">{result.score} / {result.maxScore}</span>
              </div>
              <div className="h-8 w-px bg-white/30"></div>
              <div className="text-center">
                <span className="text-xs uppercase tracking-wider text-white/70 block">Percentage</span>
                <span className="text-3xl font-black">{result.percentage}%</span>
              </div>
              <div className="h-8 w-px bg-white/30"></div>
              <div className="text-center">
                <span className="text-xs uppercase tracking-wider text-white/70 block">Grade</span>
                <span className="text-3xl font-black">{result.grade}</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              {isPassed && result.certificate && (
                <button
                  onClick={() => setShowCertModal(true)}
                  className="px-8 py-3.5 rounded-2xl font-black text-sm text-slate-900 bg-white hover:bg-slate-100 shadow-xl transition-all flex items-center space-x-2"
                >
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span>{result.certificate.isPaid ? 'View & Download Certificate' : 'Unlock & Download Certificate (₹1)'}</span>
                </button>
              )}

              <button
                onClick={() => setShowReview(!showReview)}
                className="px-6 py-3.5 rounded-2xl font-bold text-sm bg-white/20 hover:bg-white/30 text-white border border-white/30 transition-all flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>{showReview ? 'Hide Answer Review' : 'Review Answers'}</span>
              </button>

              {!isPassed && (
                <Link
                  to={`/courses/${course._id}`}
                  className="px-6 py-3.5 rounded-2xl font-bold text-sm bg-white text-rose-600 hover:bg-rose-50 transition-all flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retake Assessment</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Performance Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center">
            <span className="text-xs font-semibold text-slate-400 block">Correct Answers</span>
            <span className="text-2xl font-extrabold text-emerald-600">{result.correct}</span>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center">
            <span className="text-xs font-semibold text-slate-400 block">Wrong Answers</span>
            <span className="text-2xl font-extrabold text-rose-500">{result.incorrect}</span>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center">
            <span className="text-xs font-semibold text-slate-400 block">Skipped</span>
            <span className="text-2xl font-extrabold text-amber-500">{result.skipped}</span>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center">
            <span className="text-xs font-semibold text-slate-400 block">Time Taken</span>
            <span className="text-2xl font-extrabold text-brand-600">{formatTime(result.timeTaken)}</span>
          </div>
        </div>

        {/* Difficulty Breakdown Section */}
        {result.difficultyBreakdown && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Difficulty Breakdown</h3>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                Test Mode: {(result.difficultyMode || 'mixed').toUpperCase()} (Max 25 Qs)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-2xl p-4 space-y-1">
                <div className="flex justify-between text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <span>Easy</span>
                  <span>{result.difficultyBreakdown.easy?.percentage || 0}%</span>
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  {result.difficultyBreakdown.easy?.correct || 0} / {result.difficultyBreakdown.easy?.total || 0}
                </p>
                <div className="w-full h-2 bg-emerald-200 dark:bg-emerald-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${result.difficultyBreakdown.easy?.percentage || 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-2xl p-4 space-y-1">
                <div className="flex justify-between text-xs font-bold text-blue-700 dark:text-blue-300">
                  <span>Medium</span>
                  <span>{result.difficultyBreakdown.medium?.percentage || 0}%</span>
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  {result.difficultyBreakdown.medium?.correct || 0} / {result.difficultyBreakdown.medium?.total || 0}
                </p>
                <div className="w-full h-2 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${result.difficultyBreakdown.medium?.percentage || 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-2xl p-4 space-y-1">
                <div className="flex justify-between text-xs font-bold text-amber-700 dark:text-amber-300">
                  <span>Hard</span>
                  <span>{result.difficultyBreakdown.hard?.percentage || 0}%</span>
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  {result.difficultyBreakdown.hard?.correct || 0} / {result.difficultyBreakdown.hard?.total || 0}
                </p>
                <div className="w-full h-2 bg-amber-200 dark:bg-amber-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${result.difficultyBreakdown.hard?.percentage || 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-2xl p-4 space-y-1">
                <div className="flex justify-between text-xs font-bold text-rose-700 dark:text-rose-300">
                  <span>Very Hard</span>
                  <span>{result.difficultyBreakdown.veryHard?.percentage || 0}%</span>
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  {result.difficultyBreakdown.veryHard?.correct || 0} / {result.difficultyBreakdown.veryHard?.total || 0}
                </p>
                <div className="w-full h-2 bg-rose-200 dark:bg-rose-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{ width: `${result.difficultyBreakdown.veryHard?.percentage || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Skill Breakdown Chart & Progress Bars */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Topic Skill Breakdown</h3>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Recharts Bar Chart */}
            <div className="md:col-span-7 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis dataKey="module" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Mastery']} />
                  <Bar dataKey="percentage" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.percentage >= 70 ? '#0c8de9' : '#f43f5e'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Modules Progress Bar List */}
            <div className="md:col-span-5 space-y-4">
              {result.skillBreakdown?.map((sb, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{sb.module}</span>
                    <span className={sb.percentage >= 70 ? 'text-brand-600' : 'text-rose-500'}>{sb.percentage}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        sb.percentage >= 70 ? 'bg-brand-600' : 'bg-rose-500'
                      }`}
                      style={{ width: `${sb.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Optional Review Answers Section */}
        {showReview && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6 animate-fadeIn">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
              <FileText className="w-5 h-5 mr-2 text-brand-600" /> Question & Answer Detailed Review
            </h3>

            <div className="space-y-6">
              {result.questions?.map((q, qIdx) => {
                return (
                  <div
                    key={q._id}
                    className={`p-6 rounded-2xl border ${
                      q.isCorrect
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900'
                        : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Question {qIdx + 1} • {q.module}
                      </span>
                      <Badge variant={q.isCorrect ? 'emerald' : 'rose'}>
                        {q.isCorrect ? 'Correct (+2)' : 'Incorrect (0)'}
                      </Badge>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4">{q.question}</h4>

                    <div className="space-y-2 text-xs">
                      {q.options.map((opt, oIdx) => {
                        const isUserChoice = String(q.selectedAnswer) === String(oIdx);
                        const isCorrectAnswer = String(q.correctAnswer) === String(oIdx);

                        let optClass = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';
                        if (isCorrectAnswer) optClass = 'bg-emerald-600 text-white font-bold border-emerald-600';
                        else if (isUserChoice && !q.isCorrect) optClass = 'bg-rose-600 text-white font-bold border-rose-600';

                        return (
                          <div
                            key={oIdx}
                            className={`p-3 rounded-xl border flex items-center justify-between ${optClass}`}
                          >
                            <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                            {isCorrectAnswer && <span className="text-[10px] font-black uppercase">Correct Answer</span>}
                            {isUserChoice && !isCorrectAnswer && <span className="text-[10px] font-black uppercase">Your Choice</span>}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="mt-4 p-3 bg-white/80 dark:bg-slate-800/80 rounded-xl text-xs text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                        <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Explanation:</span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Certificate Viewer Modal */}
      {result.certificate && (
        <CertificateViewerModal
          isOpen={showCertModal}
          onClose={() => setShowCertModal(false)}
          certificate={result.certificate}
        />
      )}

      <Footer />
    </div>
  );
};
