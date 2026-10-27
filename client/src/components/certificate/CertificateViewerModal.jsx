import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download, Printer, Share2, Check, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { Modal } from '../common/Modal';
import { CertificateTemplate } from './CertificateTemplate';
import { CertificatePaymentModal } from './CertificatePaymentModal';
import { useToast } from '../../context/ToastContext';

export const CertificateViewerModal = ({ isOpen, onClose, certificate: initialCertificate }) => {
  const [certificate, setCertificate] = useState(initialCertificate);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const { addToast } = useToast();

  React.useEffect(() => {
    setCertificate(initialCertificate);
  }, [initialCertificate]);

  if (!certificate) return null;

  const isUnlocked = certificate.isPaid;

  const handleDownloadPDF = async () => {
    if (!isUnlocked) {
      setShowPayModal(true);
      return;
    }

    try {
      setDownloading(true);
      const element = document.getElementById('certificate-print-area');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`SkillCert-Certificate-${certificate.certificateId || 'Official'}.pdf`);
      addToast('Certificate PDF downloaded successfully!', 'success');
    } catch (err) {
      console.error('[PDF Export Error]', err);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyVerificationLink = () => {
    const url = `${window.location.origin}/verify/${certificate.certificateId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    addToast('Verification link copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSuccessUnlock = (updatedCert) => {
    setCertificate((prev) => ({ ...prev, ...updatedCert, isPaid: true }));
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Verified Digital Certificate" maxWidth="max-w-5xl">
        <div className="space-y-6">
          {/* Lock Banner if not paid */}
          {!isUnlocked && (
            <div className="bg-gradient-to-r from-amber-600 via-brand-600 to-amber-700 text-white rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm">Certificate Locked</h4>
                  <p className="text-xs text-white/90">
                    Pay ₹1 INR via UPI QR to unlock and download your official credential PDF.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPayModal(true)}
                className="px-5 py-2.5 rounded-xl font-black text-xs bg-white text-slate-900 shadow-md hover:bg-slate-100 transition-all flex items-center space-x-1.5"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Pay ₹1 to Unlock & Download</span>
              </button>
            </div>
          )}

          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <div>
              <p className="text-xs text-slate-500 font-semibold">Certificate ID</p>
              <p className="text-sm font-mono font-bold text-slate-900 dark:text-white flex items-center">
                {certificate.certificateId}
                {isUnlocked ? (
                  <span className="ml-2 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-sans font-bold">
                    ✓ Unlocked & Verified
                  </span>
                ) : (
                  <span className="ml-2 text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded-full font-sans font-bold">
                    🔒 Locked (₹1)
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyVerificationLink}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 text-slate-700 dark:text-slate-200"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Share Link'}</span>
              </button>

              {isUnlocked ? (
                <>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 text-slate-700 dark:text-slate-200"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print</span>
                  </button>

                  <button
                    onClick={handleDownloadPDF}
                    disabled={downloading}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-md disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>{downloading ? 'Generating PDF...' : 'Download PDF'}</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowPayModal(true)}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md"
                >
                  <Lock className="w-4 h-4" />
                  <span>Unlock PDF (₹1)</span>
                </button>
              )}
            </div>
          </div>

          {/* Certificate Display Area */}
          <div className="p-2 sm:p-4 bg-slate-200 dark:bg-slate-950 rounded-2xl overflow-x-auto flex justify-center relative">
            <div className={!isUnlocked ? 'filter blur-[3px] opacity-75 pointer-events-none select-none' : ''}>
              <CertificateTemplate certificate={certificate} />
            </div>

            {!isUnlocked && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950/40 backdrop-blur-[2px] rounded-2xl">
                <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-2xl mb-3">
                  <Lock className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-white">Certificate Locked</h3>
                <p className="text-xs text-slate-200 max-w-sm mt-1 mb-4 font-semibold">
                  Complete the ₹1 payment via UPI QR code to remove blur, view credential details, and download PDF.
                </p>
                <button
                  onClick={() => setShowPayModal(true)}
                  className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-xl transition-all"
                >
                  Unlock Certificate Now (₹1)
                </button>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* QR Code Payment Modal for ₹1 */}
      <CertificatePaymentModal
        isOpen={showPayModal}
        onClose={() => setShowPayModal(false)}
        certificate={certificate}
        onSuccessUnlock={handleSuccessUnlock}
      />
    </>
  );
};
