import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const CertificateTemplate = ({ certificate }) => {
  if (!certificate) return null;

  const userName = certificate.userId?.name || certificate.userName || 'Learner';
  const courseTitle = certificate.courseId?.title || certificate.courseTitle || 'Certification';
  const certificateId = certificate.certificateId || 'SC-DEMO-2026-00000';
  const score = certificate.percentage || certificate.score || 87;
  const grade = certificate.grade || 'A';
  const issueDate = certificate.issueDate
    ? new Date(certificate.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const verificationUrl = certificate.verificationUrl || `http://localhost:5173/verify/${certificateId}`;
  const isRevoked = certificate.status === 'REVOKED';

  return (
    <div
      id="certificate-print-area"
      className="relative w-full max-w-4xl mx-auto aspect-[1.414/1] bg-white text-slate-900 p-8 sm:p-12 rounded-3xl shadow-2xl border-[12px] border-slate-900 overflow-hidden flex flex-col justify-between select-none"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Decorative Outer Border Lines */}
      <div className="absolute inset-3 border-2 border-brand-500/40 rounded-2xl pointer-events-none"></div>
      <div className="absolute inset-5 border border-indigo-500/20 rounded-xl pointer-events-none"></div>

      {/* Watermark Background Logo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <Award className="w-96 h-96 text-brand-900" />
      </div>

      {/* Revoked Banner Overlay */}
      {isRevoked && (
        <div className="absolute inset-0 bg-rose-950/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-white">
          <div className="bg-rose-600 px-6 py-2 rounded-full font-black text-xl tracking-widest uppercase mb-2">
            REVOKED CERTIFICATE
          </div>
          <p className="text-sm font-medium text-rose-200">This certificate is no longer valid.</p>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b-2 border-slate-100 pb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">SkillCert</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-600">
              Verified Skill Certification Board
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-brand-50 text-brand-700 border border-brand-200">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-brand-600" />
            Official Credential
          </span>
          <p className="text-xs font-mono font-bold text-slate-500 mt-1">ID: {certificateId}</p>
        </div>
      </div>

      {/* Body Content */}
      <div className="relative z-10 my-auto text-center space-y-4 py-4">
        <h1 className="text-xs sm:text-sm font-extrabold tracking-[0.3em] uppercase text-brand-600">
          Certificate of Achievement
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">This certificate is proudly presented to</p>

        <div className="inline-block relative">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 border-b-2 border-brand-500 pb-1 px-8 capitalize">
            {userName}
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          for successfully demonstrating mastery and passing the comprehensive skill assessment for
        </p>

        <h3 className="text-xl sm:text-2xl font-extrabold text-indigo-900 bg-indigo-50/60 inline-block px-6 py-2 rounded-2xl border border-indigo-100">
          {courseTitle}
        </h3>

        {/* Grade & Score Pills */}
        <div className="flex items-center justify-center space-x-6 pt-2">
          <div className="text-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">Score Achieved</span>
            <span className="text-base font-extrabold text-slate-900">{score}%</span>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div className="text-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">Grade</span>
            <span className="text-base font-extrabold text-brand-600">{grade}</span>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div className="text-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">Status</span>
            <span className="text-base font-extrabold text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 mr-1" /> VERIFIED
            </span>
          </div>
        </div>
      </div>

      {/* Footer / Signature / QR Area */}
      <div className="relative z-10 flex items-end justify-between border-t-2 border-slate-100 pt-6">
        {/* Issue Date */}
        <div className="text-left space-y-1">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Date of Issuance</p>
          <p className="text-sm font-bold text-slate-800">{issueDate}</p>
        </div>

        {/* Official Seal / Signature */}
        <div className="text-center space-y-1">
          <div className="h-10 flex items-center justify-center">
            <span className="font-serif italic text-xl font-bold text-slate-800 tracking-wider">
              SkillCert Board
            </span>
          </div>
          <div className="w-36 h-0.5 bg-slate-300 mx-auto"></div>
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Authorized Signature</p>
        </div>

        {/* Dynamic QR Code for Online Verification */}
        <div className="flex items-center space-x-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <div className="p-1 bg-white rounded-lg shadow-sm">
            <QRCodeSVG value={verificationUrl} size={54} level="H" />
          </div>
          <div className="text-left">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Scan to Verify</p>
            <p className="text-[8px] font-mono text-brand-600 font-semibold truncate max-w-[100px]">
              verify/{certificateId.slice(-6)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
