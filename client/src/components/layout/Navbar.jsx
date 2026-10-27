import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Award, Sun, Moon, User, LogOut, LayoutDashboard, ShieldCheck, Menu, X, CheckCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'Certifications', path: '/certificates' },
    { name: 'Resume Builder', path: '/resume', badge: 'ATS' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'Verify Certificate', path: '/verify' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleHowItWorksClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const elem = document.getElementById('how-it-works');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const elem = document.getElementById('how-it-works');
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-500 bg-clip-text text-transparent">
                SkillCert
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400 -mt-1">
                Verified Skills
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              if (link.name === 'How It Works') {
                return (
                  <a
                    key={link.name}
                    href="#how-it-works"
                    onClick={handleHowItWorksClick}
                    className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer"
                  >
                    {link.name}
                  </a>
                );
              }
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-1.5 ${
                    isActive(link.path)
                      ? 'text-brand-600 dark:text-brand-400 bg-brand-50/80 dark:bg-brand-950/60'
                      : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* AI Assistant Quick Trigger */}
            <button
              type="button"
              onClick={() => {
                const btn = document.getElementById('skillcert-ai-assistant-btn');
                if (btn) btn.click();
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-brand-50/80 hover:bg-brand-100/80 dark:bg-brand-950/60 dark:hover:bg-brand-900/60 border border-brand-200/80 dark:border-brand-800/80 hover:border-brand-400 dark:hover:border-brand-600 transition-all shadow-sm group cursor-pointer"
              title="Open Gemini AI Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform" />
              <span>Ask AI</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-mono uppercase tracking-wider">
                Gemini
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors border border-slate-200/60 dark:border-slate-800"
                >
                  <img
                    src={user.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover border border-brand-500/30"
                  />
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 max-w-[120px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    {isAdmin ? (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      >
                        <ShieldCheck className="w-4 h-4 mr-2.5 text-rose-500" />
                        Admin Control Suite
                      </Link>
                    ) : (
                      <>
                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <LayoutDashboard className="w-4 h-4 mr-2.5 text-brand-600" />
                          Dashboard
                        </Link>

                        <Link
                          to="/certificates"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <Award className="w-4 h-4 mr-2.5 text-indigo-600" />
                          My Certificates
                        </Link>

                        <Link
                          to={`/profile/${user.username}`}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <User className="w-4 h-4 mr-2.5 text-emerald-600" />
                          Public Profile
                        </Link>
                      </>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      >
                        <LogOut className="w-4 h-4 mr-2.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            if (link.name === 'How It Works') {
              return (
                <a
                  key={link.name}
                  href="#how-it-works"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleHowItWorksClick(e);
                  }}
                  className="block px-4 py-3 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-300"
                >
                  {link.name}
                </a>
              );
            }
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold ${
                  isActive(link.path)
                    ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Ask AI Assistant Mobile Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                const btn = document.getElementById('skillcert-ai-assistant-btn');
                if (btn) btn.click();
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-slate-800 dark:text-slate-100 bg-gradient-to-r from-brand-50 to-indigo-50 dark:from-brand-950 dark:to-indigo-950 border border-brand-200 dark:border-brand-800"
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>Ask SkillCert AI</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-600 text-white uppercase font-mono">
                Gemini Direct
              </span>
            </button>
          </div>

          {isAuthenticated ? (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl font-medium text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/40"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2.5 rounded-xl font-bold text-white bg-brand-600"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
