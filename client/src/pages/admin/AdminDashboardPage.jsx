import React, { useEffect, useState } from 'react';
import { Users, BookOpen, HelpCircle, Award, CheckCircle2, ShieldAlert, TrendingUp } from 'lucide-react';
import API from '../../services/api';
import { AdminLayout } from '../../components/layout/AdminLayout';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [recentCerts, setRecentCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      setLoading(true);
      try {
        const res = await API.get('/admin/stats');
        if (res.data.success) {
          setStats(res.data.stats);
          setRecentAttempts(res.data.recentAttempts || []);
          setRecentCerts(res.data.recentCertificates || []);
        }
      } catch (err) {
        console.error('[Admin Stats Error]', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center p-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Admin Platform Dashboard</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Real-time analytics and management control center for SkillCert.
          </p>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
              <Users className="w-5 h-5 text-indigo-500" />
            </div>
            <span className="text-3xl font-black text-slate-900 dark:text-white block">{stats?.totalUsers || 0}</span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Courses</span>
              <BookOpen className="w-5 h-5 text-brand-500" />
            </div>
            <span className="text-3xl font-black text-slate-900 dark:text-white block">{stats?.totalCourses || 0}</span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Questions</span>
              <HelpCircle className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-3xl font-black text-slate-900 dark:text-white block">{stats?.totalQuestions || 0}</span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Certs Issued</span>
              <Award className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-3xl font-black text-emerald-600 block">{stats?.certificatesIssued || 0}</span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Unlock Revenue</span>
              <Award className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-3xl font-black text-emerald-500 block">₹{stats?.totalRevenue || 0}</span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Pass Rate</span>
              <TrendingUp className="w-5 h-5 text-rose-500" />
            </div>
            <span className="text-3xl font-black text-rose-500 block">{stats?.passRate || 0}%</span>
          </div>
        </div>

        {/* Activity Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Attempts */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Recent Assessment Logs
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentAttempts.map((att) => (
                <div key={att._id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{att.userId?.name || 'User'}</p>
                    <p className="text-slate-400">{att.courseId?.title || 'Course'}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      att.status === 'PASSED' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {att.percentage}% ({att.status})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Certificates Issued */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Recent Certificates Issued
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentCerts.map((cert) => (
                <div key={cert._id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{cert.userId?.name || 'Learner'}</p>
                    <p className="text-slate-400 font-mono text-[10px]">{cert.certificateId}</p>
                  </div>
                  <span className="font-bold text-brand-600">{cert.grade} ({cert.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
