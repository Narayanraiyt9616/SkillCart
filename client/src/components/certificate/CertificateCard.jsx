import React from 'react';
import { Award, Download, ExternalLink, Share2, CheckCircle2 } from 'lucide-react';
import { Badge } from '../common/Badge';

export const CertificateCard = ({ certificate, onView, onDownload, onVerify, onShare }) => {
  const course = certificate.courseId || {};
  const issueDate = certificate.issueDate
    ? new Date(certificate.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'Recently';

  const isRevoked = certificate.status === 'REVOKED';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Card Top */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Award className="w-6 h-6" />
          </div>

          <div className="flex items-center space-x-2">
            {certificate.isPaid ? (
              <Badge variant={isRevoked ? 'rose' : 'emerald'}>
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                {isRevoked ? 'REVOKED' : 'UNLOCKED'}
              </Badge>
            ) : (
              <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-amber-500/20 text-amber-500 border border-amber-500/40">
                🔒 LOCKED (₹1)
              </span>
            )}
          </div>
        </div>

        {/* Title & Category */}
        <p className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1">
          {course.category || 'Certification'}
        </p>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
          {course.title || certificate.courseTitle}
        </h3>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 py-3 my-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl px-4 border border-slate-100 dark:border-slate-800/80 text-xs">
          <div>
            <span className="text-slate-400 font-semibold block">Certificate ID</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{certificate.certificateId}</span>
          </div>
          <div>
            <span className="text-slate-400 font-semibold block">Issue Date</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{issueDate}</span>
          </div>
          <div>
            <span className="text-slate-400 font-semibold block">Score</span>
            <span className="font-bold text-emerald-600">{certificate.percentage}%</span>
          </div>
          <div>
            <span className="text-slate-400 font-semibold block">Grade</span>
            <span className="font-bold text-brand-600">{certificate.grade}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 mt-4">
        <button
          onClick={() => onView(certificate)}
          className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/60 dark:hover:text-brand-300 transition-colors"
        >
          <Award className="w-4 h-4" />
          <span>View</span>
        </button>

        <button
          onClick={() => onDownload(certificate)}
          className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF</span>
        </button>

        <button
          onClick={() => onVerify(certificate.certificateId)}
          className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Verify Online</span>
        </button>

        <button
          onClick={() => onShare(certificate)}
          className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};
