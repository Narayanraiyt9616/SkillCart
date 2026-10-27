import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, HelpCircle, Users, Award, ShieldAlert, ArrowLeft, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout = ({ children }) => {
  const { user, isAuthenticated, isAdmin, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Admin Suite...</div>;
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const adminNav = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Courses Manager', path: '/admin/courses', icon: BookOpen },
    { name: 'Question Bank', path: '/admin/questions', icon: HelpCircle },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Certificates Registry', path: '/admin/certificates', icon: Award },
    { name: 'Student Mailer', path: '/admin/mail', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 md:p-6 shrink-0">
        <div className="flex items-center justify-between md:flex-col md:items-start space-y-4 mb-6">
          <Link to="/" className="flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-rose-500" />
            <span className="font-extrabold text-slate-900 dark:text-white text-lg">SkillCert Admin</span>
          </Link>

          <Link
            to="/dashboard"
            className="flex items-center text-xs font-semibold text-slate-500 hover:text-brand-600 dark:hover:text-brand-400"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to User Portal
          </Link>
        </div>

        <nav className="space-y-1.5 flex-1">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Logged in Admin</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">{user?.name}</span>
            <span className="text-[11px] text-slate-400 block truncate">{user?.email}</span>
          </div>

          <button
            onClick={() => {
              logout();
            }}
            className="w-full flex items-center px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <ShieldAlert className="w-4 h-4 mr-2" />
            <span>Admin Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};
