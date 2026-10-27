import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await API.post('/auth/forgot-password', { email });
      if (res.data.success) {
        setSent(true);
        addToast('Reset link sent to your email!', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Error processing request', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-flex items-center space-x-2.5">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-xl">
            <Award className="w-7 h-7" />
          </div>
          <span className="text-2xl font-black text-white">SkillCert</span>
        </Link>
        <h2 className="text-2xl font-extrabold text-white">Forgot your password?</h2>
        <p className="text-xs text-slate-400">Enter your account email to receive a password reset link.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl py-8 px-6 shadow-2xl space-y-6">
          {sent ? (
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">Reset Link Sent</h3>
              <p className="text-xs text-slate-400">
                Check your inbox at <span className="font-bold text-white">{email}</span>.
              </p>
              <Link to="/reset-password" className="block py-3 rounded-xl bg-brand-600 text-white font-bold text-xs">
                Proceed to Reset Password
              </Link>
            </div>
          ) : (
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-brand-600 hover:bg-brand-700 shadow-xl disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <div className="text-center">
                <Link to="/login" className="text-xs text-slate-400 hover:text-white font-bold">
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
