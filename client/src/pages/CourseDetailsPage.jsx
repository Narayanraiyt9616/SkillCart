import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Award, Clock, HelpCircle, ShieldCheck, CheckCircle2, ChevronRight, BookOpen, AlertCircle, ArrowLeft } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Badge } from '../components/common/Badge';

export const CourseDetailsPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/courses/${id}`);
        if (res.data.success) {
          setCourse(res.data.course);

          // Check payment status if authenticated
          if (isAuthenticated) {
            try {
              const payRes = await API.get(`/payments/status/${res.data.course._id || id}`);
              if (payRes.data.success && payRes.data.hasPaid) {
                setHasPaid(true);
              }
            } catch (pErr) {
              console.warn('[Payment status check error]', pErr);
            }
          }
        }
      } catch (err) {
        console.error('[Course Details Error]', err);
        setError('Course not found or unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, isAuthenticated]);

  const [selectedDifficulty, setSelectedDifficulty] = useState('mixed');
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);

  const handleStartAssessment = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }
    setShowDifficultyModal(true);
  };

  const handleConfirmLaunch = () => {
    setShowDifficultyModal(false);
    navigate(`/assessment/${course._id}?difficultyMode=${selectedDifficulty}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
          <h2 className="text-2xl font-bold">Course Not Found</h2>
          <p className="text-slate-500 mt-2">The certification track you requested does not exist.</p>
          <Link to="/courses" className="mt-6 px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-brand-950 via-slate-900 to-slate-950 text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/courses" className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Certifications</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="blue">{course.category}</Badge>
                <Badge variant="slate">{course.difficulty}</Badge>
                <span className="text-xs text-emerald-400 font-semibold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verifiable Credential
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black leading-tight">{course.title}</h1>
              <p className="text-slate-300 text-base leading-relaxed max-w-3xl">{course.description}</p>

              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold text-slate-300">
                <div>
                  <span className="text-slate-500 block">Issuer</span>
                  <span className="text-white font-bold">SkillCert Certification Board</span>
                </div>
                <div className="h-6 w-px bg-slate-800"></div>
                <div>
                  <span className="text-slate-500 block">Enrolled Learners</span>
                  <span className="text-white font-bold">{course.enrolledCount} Engineers</span>
                </div>
              </div>
            </div>

            {/* Quick Summary Box */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
              <img src={course.thumbnail} alt={course.title} className="w-full h-44 object-cover rounded-2xl" />

              <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 flex items-center"><Award className="w-4 h-4 mr-2 text-emerald-500" /> Assessment Exam</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">FREE (₹0)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 flex items-center"><ShieldCheck className="w-4 h-4 mr-2 text-amber-500" /> Cert Unlock Fee</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">₹1 INR</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 flex items-center"><HelpCircle className="w-4 h-4 mr-2 text-brand-500" /> Max Questions</span>
                  <span className="font-bold">25 Questions</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 flex items-center"><Clock className="w-4 h-4 mr-2 text-amber-500" /> Exam Duration</span>
                  <span className="font-bold">{course.duration} Minutes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 flex items-center"><ShieldCheck className="w-4 h-4 mr-2 text-indigo-500" /> Passing Threshold</span>
                  <span className="font-bold">{course.passingPercentage}%</span>
                </div>
              </div>

              <button
                onClick={handleStartAssessment}
                className="w-full py-4 rounded-2xl font-extrabold text-base text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center space-x-2"
              >
                <span>Start Free Assessment</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Test Difficulty Selection Modal */}
        {showDifficultyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Select Assessment Difficulty</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Choose your test mode. Maximum 25 questions per attempt.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'mixed', label: 'Mixed (Recommended)', desc: 'Balanced: 5 Easy + 8 Medium + 7 Hard + 5 Very Hard (25 Qs)' },
                  { id: 'easy', label: 'Easy Level', desc: 'Core fundamental questions to test basic understanding.' },
                  { id: 'medium', label: 'Medium Level', desc: 'Intermediate application and scenario-based questions.' },
                  { id: 'hard', label: 'Hard Level', desc: 'Advanced problem solving and architectural concepts.' },
                  { id: 'very-hard', label: 'Very Hard Level', desc: 'Complex deep diagnostics and advanced evaluation.' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedDifficulty(mode.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      selectedDifficulty === mode.id
                        ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-700 dark:text-brand-300 font-bold shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-sm font-extrabold">{mode.label}</div>
                    <div className="text-xs font-normal text-slate-500 dark:text-slate-400 mt-0.5">{mode.desc}</div>
                  </button>
                ))}
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => setShowDifficultyModal(false)}
                  className="w-1/2 py-3 rounded-xl font-bold text-xs bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmLaunch}
                  className="w-1/2 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-lg"
                >
                  Launch Exam Now →
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Main Content Details */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Syllabus Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-2">Certification Syllabus & Modules</h2>
          <p className="text-sm text-slate-500 mb-6">
            Review the breakdown of core topics covered in this assessment exam.
          </p>

          <div className="space-y-4">
            {course.syllabus && course.syllabus.length > 0 ? (
              course.syllabus.map((mod, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 font-extrabold text-xs flex items-center justify-center">
                      M{idx + 1}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">{mod.moduleTitle}</h3>
                  </div>

                  {mod.topics && mod.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2 ml-11">
                      {mod.topics.map((t, ti) => (
                        <span key={ti} className="px-3 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          • {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">Standard topics for {course.title} apply.</p>
            )}
          </div>
        </div>

        {/* Assessment Guidelines */}
        <div className="bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/60 rounded-3xl p-8">
          <h3 className="text-lg font-bold text-brand-900 dark:text-brand-300 mb-3 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-brand-600" />
            Assessment Rules & Guidelines
          </h3>
          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
            <li>The assessment contains {course.questionCount} randomized technical questions.</li>
            <li>You will have {course.duration} minutes to complete all questions.</li>
            <li>Answers are securely evaluated on submission. Answers are not exposed in advance.</li>
            <li>Achieve a minimum score of {course.passingPercentage}% to earn your verifiable SkillCert PDF credential.</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
};
