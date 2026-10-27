import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Search,
  Plus,
  Loader2,
  Check,
  ShieldCheck,
  Lightbulb,
  Cpu,
} from 'lucide-react';
import { analyzeResumeATS } from '../../services/aiService';

export const ATSScoreModal = ({
  isOpen,
  onClose,
  resumeData,
  onApplySummary,
  onAddSkill,
}) => {
  const [targetRole, setTargetRole] = useState(resumeData?.personalInfo?.title || 'Full Stack Software Engineer');
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [appliedSummary, setAppliedSummary] = useState(false);
  const [addedSkills, setAddedSkills] = useState({});

  if (!isOpen) return null;

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    setAppliedSummary(false);
    try {
      const res = await analyzeResumeATS({
        resumeData,
        targetRole,
        jobDescription,
      });
      if (res.analysis) {
        setAnalysisResult(res.analysis);
      }
    } catch (err) {
      console.error('ATS scan error:', err);
      alert(err.message || 'ATS analysis failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  const currentScore = analysisResult?.atsScore || 75;
  const breakdown = analysisResult?.scoreBreakdown || {
    keywordsMatch: 72,
    formatting: 95,
    experienceImpact: 78,
    skillsRelevance: 80,
  };

  const getScoreColor = (val) => {
    if (val >= 85) return 'text-emerald-600 dark:text-emerald-400 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40';
    if (val >= 70) return 'text-brand-600 dark:text-brand-400 border-brand-500 bg-brand-50 dark:bg-brand-950/40';
    return 'text-amber-600 dark:text-amber-400 border-amber-500 bg-amber-50 dark:bg-amber-950/40';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-gradient-to-r from-brand-50/70 via-indigo-50/50 to-transparent dark:from-brand-950/60 dark:via-indigo-950/40 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  ATS Scanner & Optimization Engine
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/60 dark:text-brand-300">
                  Powered by Gemini
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Analyze parseability, keyword match, and recruiter ranking
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Target Role & Job Description Inputs */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Target Job Role
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Full Stack Developer, Data Scientist, Frontend Lead..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div className="sm:w-auto flex items-end">
                <button
                  type="button"
                  onClick={handleRunAnalysis}
                  disabled={analyzing}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center justify-center space-x-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Scanning with Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Run ATS Evaluation</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Paste Target Job Description (Optional - For keyword match against specific job post)
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste requirements, required skills, and job description text here..."
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          {/* Overall ATS Score & Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Main Score Circle */}
            <div className={`p-5 rounded-2xl border flex flex-col items-center justify-center text-center ${getScoreColor(currentScore)}`}>
              <span className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80">
                Overall ATS Score
              </span>
              <div className="text-4xl sm:text-5xl font-black my-1">
                {currentScore}
                <span className="text-xl font-normal opacity-60">/100</span>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/70 dark:bg-slate-900/60 shadow-xs mt-1">
                {currentScore >= 85 ? '🟢 ATS Compliant (High Pass)' : currentScore >= 70 ? '🟡 Good (Optimizations Recommended)' : '🔴 Needs ATS Optimization'}
              </span>
            </div>

            {/* Sub-Scores Breakdown */}
            <div className="md:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                ATS Criteria Breakdown
              </h4>

              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-600 dark:text-slate-300">Target Role & Keywords Match</span>
                    <span className="text-brand-600 dark:text-brand-400 font-bold">{breakdown.keywordsMatch}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full transition-all duration-500" style={{ width: `${breakdown.keywordsMatch}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-600 dark:text-slate-300">Format Parseability (ATS Clean)</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{breakdown.formatting}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${breakdown.formatting}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-600 dark:text-slate-300">Experience Impact & Action Verbs</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">{breakdown.experienceImpact}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${breakdown.experienceImpact}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-600 dark:text-slate-300">Skills & Verified Credentials</span>
                    <span className="text-purple-600 dark:text-purple-400 font-bold">{breakdown.skillsRelevance}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${breakdown.skillsRelevance}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Keywords Analysis (Matching vs Missing) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Matching Keywords */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 space-y-2">
              <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Matching Keywords Found
              </h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(analysisResult?.matchingKeywords || resumeData.skills.slice(0, 6)).map((kw, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1"
                  >
                    <Check className="w-3 h-3 text-emerald-600" />
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Keywords with 1-click Add */}
            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 space-y-2">
              <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Recommended Missing Keywords
              </h4>
              <p className="text-[11px] text-amber-700 dark:text-amber-300">
                Click any keyword below to add it directly to your resume:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(analysisResult?.missingKeywords || ['TypeScript', 'Docker', 'System Design', 'CI/CD Pipelines', 'AWS']).map((kw, i) => {
                  const isAdded = addedSkills[kw];
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={isAdded}
                      onClick={() => {
                        if (onAddSkill) onAddSkill(kw);
                        setAddedSkills((prev) => ({ ...prev, [kw]: true }));
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                        isAdded
                          ? 'bg-emerald-100 text-emerald-700 cursor-default'
                          : 'bg-amber-100/70 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-900 cursor-pointer'
                      }`}
                    >
                      {isAdded ? <Check className="w-3 h-3 text-emerald-600" /> : <Plus className="w-3 h-3 text-amber-600" />}
                      <span>{kw}</span>
                      {isAdded && <span className="text-[10px] text-emerald-600">(Added)</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* AI Optimized Professional Summary */}
          {analysisResult?.suggestedSummary && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/60 to-brand-50/60 dark:from-indigo-950/40 dark:to-brand-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Gemini Suggested ATS-Optimized Summary
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    if (onApplySummary) onApplySummary(analysisResult.suggestedSummary);
                    setAppliedSummary(true);
                  }}
                  disabled={appliedSummary}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                    appliedSummary
                      ? 'bg-emerald-600 text-white'
                      : 'bg-brand-600 hover:bg-brand-500 text-white shadow-sm'
                  }`}
                >
                  {appliedSummary ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Applied to Resume!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Apply to Resume</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic bg-white/70 dark:bg-slate-900/60 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                "{analysisResult.suggestedSummary}"
              </p>
            </div>
          )}

          {/* Actionable Recommendations */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Recruiter & ATS Optimization Tips
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="space-y-1.5">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Key Strengths:</span>
                <ul className="list-disc list-inside space-y-1 text-[11.5px] leading-relaxed">
                  {(analysisResult?.strengths || [
                    'Clean single-column parsing hierarchy',
                    'Direct contact details present',
                    'Accredited SkillCert verification IDs included',
                  ]).map((st, i) => (
                    <li key={i}>{st}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-amber-600 dark:text-amber-400">High-Impact Fixes:</span>
                <ul className="list-disc list-inside space-y-1 text-[11.5px] leading-relaxed">
                  {(analysisResult?.criticalImprovements || [
                    'Add measurable metrics (e.g. reduced load time by 30%)',
                    'Ensure keywords match the job description accurately',
                  ]).map((imp, i) => (
                    <li key={i}>{imp}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            Certified skills from SkillCert boost recruiter trust and verification score.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
          >
            Close Scanner
          </button>
        </div>
      </div>
    </div>
  );
};
