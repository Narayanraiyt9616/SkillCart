import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Github, Twitter, Linkedin, Mail, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white shadow-md">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold text-white">SkillCert</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              SkillCert is the premier online certification platform empowering software engineers, data analysts, and tech professionals to validate their skills through industry-grade assessments.
            </p>
            <div className="flex items-center space-x-3 text-slate-400 pt-2">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:text-white hover:bg-brand-600 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:text-white hover:bg-brand-600 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:text-white hover:bg-brand-600 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/courses" className="hover:text-brand-400 transition-colors">Browse Certifications</Link></li>
              <li><Link to="/certificates" className="hover:text-brand-400 transition-colors">My Certificates</Link></li>
              <li><Link to="/verify" className="hover:text-brand-400 transition-colors">Verify Certificate</Link></li>
              <li><a href="#how-it-works" className="hover:text-brand-400 transition-colors">How It Works</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/courses?category=Web+Development" className="hover:text-brand-400 transition-colors">Web Development</Link></li>
              <li><Link to="/courses?category=Software+Engineering" className="hover:text-brand-400 transition-colors">Software Engineering</Link></li>
              <li><Link to="/courses?category=Data+%26+Analytics" className="hover:text-brand-400 transition-colors">Data & Analytics</Link></li>
              <li><Link to="/courses?category=AI+%26+Machine+Learning" className="hover:text-brand-400 transition-colors">AI & Machine Learning</Link></li>
            </ul>
          </div>

          {/* Verification Trust */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Verification</h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Every SkillCert credential comes with an immutable Certificate ID and embedded QR Code for instant employer verification.
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Cryptographically Verifiable</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SkillCert Inc. All rights reserved. Prove Your Skills. Earn Your Certificate.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
