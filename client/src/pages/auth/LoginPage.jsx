import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Award, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      addToast('Welcome back! Logged in successfully.', 'success');

      // Strict Role-Based Redirection
      if (data?.user?.role === 'admin') {
        const target = from.startsWith('/admin') ? from : '/admin';
        navigate(target, { replace: true });
      } else {
        const target = !from.startsWith('/admin') ? from : '/dashboard';
        navigate(target, { replace: true });
      }
    } catch (err) {
      console.error('[Login Error]', err);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-flex items-center space-x-2.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-brand-500/20">
            <Award className="w-7 h-7" />
          </div>
          <span className="text-2xl font-black text-white">SkillCert</span>
        </Link>
        <h2 className="text-2xl font-extrabold text-white">Sign in to your account</h2>
        <p className="text-xs text-slate-400">
          Or{' '}
          <Link to="/register" className="font-bold text-brand-400 hover:underline">
            create a new learner account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl py-8 px-6 shadow-2xl space-y-6">
          {error && (
            <div className="flex items-center space-x-2 p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Fill Buttons */}
          <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-2">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Quick Fill Demo Accounts:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setEmail('learner@skillcert.com'); setPassword('User@123'); }}
                className="py-1.5 px-2 rounded-lg bg-slate-700 hover:bg-brand-600 text-white text-[11px] font-semibold transition-colors truncate"
              >
                Learner User
              </button>
              <button
                type="button"
                onClick={() => { setEmail('admin@skillcert.com'); setPassword('Admin@123'); }}
                className="py-1.5 px-2 rounded-lg bg-slate-700 hover:bg-rose-600 text-white text-[11px] font-semibold transition-colors truncate"
              >
                Admin User
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-xs text-brand-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center space-x-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-brand-600 focus:ring-brand-500"
                />
                <span>Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-xl transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
