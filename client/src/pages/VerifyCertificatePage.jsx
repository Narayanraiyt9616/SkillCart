import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, Search, CheckCircle2, XCircle, AlertCircle, Copy, Check, Award, Calendar, User, BookOpen } from 'lucide-react';
import API from '../services/api';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { useToast } from '../context/ToastContext';

export const VerifyCertificatePage = () => {
  const { certificateId: urlCertId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [inputCertId, setInputCertId] = useState(urlCertId || '');
  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  const performVerification = async (idToVerify) => {
    if (!idToVerify || !idToVerify.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await API.get(`/certificates/verify/${idToVerify.trim().toUpperCase()}`);
      if (res.data) {
        setCertData(res.data);
      }
    } catch (err) {
      console.error('[Verification Error]', err);
      setCertData(err.response?.data || { success: false, verified: false, status: 'INVALID', message: 'Certificate verification failed' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlCertId) {
      setInputCertId(urlCertId);
      performVerification(urlCertId);
    }
  }, [urlCertId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputCertId.trim()) return;
    navigate(`/verify/${inputCertId.trim().toUpperCase()}`);
    performVerification(inputCertId);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    addToast('Verification URL copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black">Official Certificate Verification</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Verify the authenticity of any SkillCert credential by entering the unique Certificate ID.
          </p>
        </div>

        {/* Verification Search Bar */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Certificate ID (e.g. SC-FSD-2026-8A91X)..."
                value={inputCertId}
                onChange={(e) => setInputCertId(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-2xl font-bold text-sm text-white bg-brand-600 hover:bg-brand-700 shadow-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Certificate'}
            </button>
          </div>

          <p className="text-xs text-slate-400 text-center">
            Example demo IDs: <button type="button" onClick={() => { setInputCertId('SC-FSD-2026-8A91X'); performVerification('SC-FSD-2026-8A91X'); }} className="text-brand-600 underline font-mono">SC-FSD-2026-8A91X</button>
          </p>
        </form>

        {/* Verification Result Card */}
        {searched && (
          <div className="animate-fadeIn">
            {loading ? (
              <div className="flex items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-3xl border">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
              </div>
            ) : certData && certData.verified ? (
              /* VALID CERTIFICATE */
              <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                  <div className="flex items-center space-x-3 text-center sm:text-left">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                        ✓ CERTIFICATE VERIFIED
                      </span>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">Official SkillCert Credential</h2>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyLink}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied Link' : 'Copy Verification URL'}</span>
                  </button>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Certificate ID</span>
                      <span className="text-base font-mono font-bold text-slate-900 dark:text-white">{certData.certificate?.certificateId}</span>
                    </div>

                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Recipient Name</span>
                      <span className="text-lg font-bold text-slate-900 dark:text-white capitalize">{certData.certificate?.userName}</span>
                    </div>

                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Certification Exam</span>
                      <span className="text-base font-bold text-brand-600 dark:text-brand-400">{certData.certificate?.courseTitle}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl">
                      <div>
                        <span className="text-xs text-slate-400 font-semibold block">Score</span>
                        <span className="text-xl font-extrabold text-emerald-600">{certData.certificate?.score || certData.certificate?.percentage}%</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 font-semibold block">Grade</span>
                        <span className="text-xl font-extrabold text-brand-600">{certData.certificate?.grade}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-xs text-slate-400 font-semibold block">Issue Date</span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          {new Date(certData.certificate?.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    {/* QR Code Container */}
                    <div className="flex items-center space-x-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
                      <div className="p-1 bg-white rounded-lg">
                        <QRCodeSVG value={window.location.href} size={64} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">Authentic Digital Seal</p>
                        <p className="text-[10px] text-slate-500">Issued by SkillCert Certification Board</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : certData && certData.status === 'REVOKED' ? (
              /* REVOKED CERTIFICATE */
              <div className="bg-white dark:bg-slate-900 border-2 border-rose-500 rounded-3xl p-8 shadow-2xl text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                  <XCircle className="w-10 h-10" />
                </div>
                <span className="px-4 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-700 border border-rose-300">
                  ✕ CERTIFICATE REVOKED
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">This Credential Is No Longer Valid</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  Certificate ID <span className="font-mono font-bold text-rose-500">{certData.certificate?.certificateId}</span> has been revoked by SkillCert administration.
                </p>
              </div>
            ) : (
              /* INVALID / NOT FOUND */
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Certificate Not Found</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  We could not find any active credential matching the Certificate ID provided. Please double check the ID and try again.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
