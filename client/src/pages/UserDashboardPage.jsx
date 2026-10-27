import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, BookOpen, Clock, CheckCircle2, Search, ArrowRight, TrendingUp, ShieldCheck, User } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const UserDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ certCount: 0, attemptCount: 0, avgScore: 0 });
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [recentCerts, setRecentCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [certRes, attemptRes] = await Promise.all([
          API.get('/certificates/my'),
          API.get('/assessments/my-attempts'),
        ]);

        if (certRes.data.success) {
          setRecentCerts(certRes.data.certificates);
        }
        if (attemptRes.data.success) {
          const attempts = attemptRes.data.attempts;
          setRecentAttempts(attempts);

          const totalScore = attempts.reduce((acc, a) => acc + (a.percentage || 0), 0);
          const avg = attempts.length > 0 ? Math.round(totalScore / attempts.length) : 0;

          setStats({
            certCount: certRes.data.certificates.length,
            attemptCount: attempts.length,
            avgScore: avg,
          });
        }
      } catch (err) {
        console.error('[Dashboard Data Error]', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-brand-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white">
              Learner Dashboard
            </span>
            <h1 className="text-3xl font-black">Welcome back, {user?.name || 'Learner'}! 👋</h1>
            <p className="text-sm text-brand-100 max-w-xl">
              Track your assessment performance, manage earned credentials, and explore new certification paths.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/resume"
              className="px-5 py-3 rounded-2xl font-bold text-xs bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 shadow-lg transition-all flex items-center gap-2"
            >
              <span>Build ATS Resume</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-white text-brand-700 rounded-full font-extrabold uppercase">
                AI
              </span>
            </Link>
            <Link
              to="/courses"
              className="px-5 py-3 rounded-2xl font-bold text-xs bg-white text-brand-700 hover:bg-brand-50 shadow-lg transition-all shrink-0"
            >
              Browse Certifications
            </Link>
          </div>
        </div>

        {/* Quick Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Certifications Earned</span>
              <Award className="w-5 h-5 text-brand-600" />
            </div>
            <span className="text-3xl font-black text-slate-900 dark:text-white block">{stats.certCount}</span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Assessments Taken</span>
              <BookOpen className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-3xl font-black text-slate-900 dark:text-white block">{stats.attemptCount}</span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Average Score</span>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-3xl font-black text-emerald-600 block">{stats.avgScore}%</span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Verification Status</span>
              <ShieldCheck className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-sm font-extrabold text-emerald-600 block mt-2">✓ 100% Validated</span>
          </div>
        </div>

        {/* Dashboard Grid: Recent Activity & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Assessment Attempts */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Assessment Activity</h2>
              <Link to="/courses" className="text-xs font-bold text-brand-600 hover:text-brand-700">Take Assessment</Link>
            </div>

            {recentAttempts.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No assessments completed yet.</p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentAttempts.slice(0, 5).map((att) => (
                  <div key={att._id} className="py-3.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{att.courseId?.title || 'Certification'}</p>
                      <p className="text-slate-400 text-[10px]">
                        {new Date(att.completedAt || att.startedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="font-bold">{att.percentage}% ({att.grade})</span>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        att.status === 'PASSED' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {att.status}
                      </span>
                      <Link to={`/assessment/${att._id}/result`} className="text-brand-600 font-bold hover:underline">
                        Result
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Quick Actions</h3>

              <Link
                to="/courses"
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 text-xs font-bold transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-brand-600" />
                  <span>Browse Certifications</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/certificates"
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 text-xs font-bold transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>View My Certificates</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/verify"
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 text-xs font-bold transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-emerald-600" />
                  <span>Verify Certificate ID</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
