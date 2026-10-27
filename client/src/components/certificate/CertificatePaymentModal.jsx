import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, Clock, Copy, CheckCircle2, QrCode, Lock, RefreshCw, Sparkles, Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const CertificatePaymentModal = ({ isOpen, onClose, certificate, onSuccessUnlock }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);

  // QR Reveal & Timer state
  const [isQRRevealed, setIsQRRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes (300 seconds)
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Verification state
  const [utrInput, setUtrInput] = useState('');
  const [verifying, setVerifying] = useState(false);

  const timerRef = useRef(null);

  // Fetch / Initiate payment info when modal opens
  useEffect(() => {
    if (!isOpen || !certificate) return;

    const initPayment = async () => {
      setLoading(true);
      setIsQRRevealed(false);
      setTimeLeft(300);
      try {
        const certId = certificate._id || certificate.certificateId;
        const res = await API.post(`/certificates/${certId}/pay-initiate`);
        if (res.data.success) {
          if (res.data.alreadyPaid) {
            addToast('Certificate is already unlocked!', 'success');
            if (onSuccessUnlock) onSuccessUnlock(res.data.certificate);
            onClose();
            return;
          }
          setPaymentInfo(res.data);
        }
      } catch (err) {
        console.error('[Certificate Payment Init Error]', err);
        addToast('Error initializing certificate payment', 'error');
      } finally {
        setLoading(false);
      }
    };

    initPayment();
  }, [isOpen, certificate]);

  // Countdown timer effect
  useEffect(() => {
    if (!isQRRevealed || !isOpen) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          addToast('Payment timer of 5 minutes expired! Refreshing session...', 'warning');
          setIsQRRevealed(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isQRRevealed, isOpen, addToast]);

  const handleRevealQR = () => {
    if (!isQRRevealed) {
      setIsQRRevealed(true);
      setTimeLeft(300);
      addToast('5-minute certificate unlock session started! Scan QR code to complete payment of ₹1.', 'info');
    }
  };

  const handleCopyUPI = () => {
    const upi = paymentInfo?.upiId || 'rainarayan709@oksbi';
    navigator.clipboard.writeText(upi);
    setCopiedUpi(true);
    addToast('UPI ID copied to clipboard!', 'success');
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleConfirmPayment = async (e) => {
    e?.preventDefault();
    if (!isQRRevealed) {
      addToast('Please click the blurred QR code to reveal it before verifying payment.', 'warning');
      return;
    }

    setVerifying(true);
    try {
      const certId = certificate._id || certificate.certificateId;
      const res = await API.post(`/certificates/${certId}/pay-verify`, {
        transactionId: utrInput.trim() || `UPI_CERT_${Date.now()}`,
      });

      if (res.data.success) {
        addToast('Payment verified successfully! Redirecting directly to your certificate page...', 'success');
        const updatedCert = res.data.certificate || certificate;
        if (onSuccessUnlock) {
          onSuccessUnlock(updatedCert);
        }
        onClose();
        const targetId = updatedCert.certificateId || certId;
        setTimeout(() => {
          navigate('/certificates', { state: { openCertId: targetId } });
        }, 500);
      }
    } catch (err) {
      console.error('[Verify Certificate Payment Error]', err);
      addToast(err.response?.data?.message || 'Payment verification failed', 'error');
    } finally {
      setVerifying(false);
    }
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const upiId = paymentInfo?.upiId || 'rainarayan709@oksbi';
  const upiName = paymentInfo?.upiName || 'narayan rai';
  const upiUrl = paymentInfo?.upiUrl || `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=1&cu=INR`;
  const qrImageUrl = paymentInfo?.qrImageUrl || '/certificate-qr.jpg';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Unlock Official SkillCert Certificate" maxWidth="max-w-lg">
      <div className="space-y-6 text-slate-900 dark:text-white">
        
        {/* Order Info Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-white">
          <div>
            <span className="text-[11px] font-bold text-brand-400 uppercase tracking-wider block">Official Credential</span>
            <h4 className="font-extrabold text-sm">{certificate?.courseId?.title || certificate?.courseTitle || 'Certification Track'}</h4>
            <span className="text-xs text-slate-400 font-mono">ID: {certificate?.certificateId}</span>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Fee to Unlock</span>
            <span className="text-xl font-black text-emerald-400">₹1 INR</span>
          </div>
        </div>

        {/* Live Timer & QR Box Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <QrCode className="w-5 h-5 text-brand-500" />
            <span className="text-sm font-bold">UPI QR Code Payment</span>
          </div>

          <div
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl font-mono text-xs font-bold border transition-all ${
              !isQRRevealed
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                : timeLeft < 60
                ? 'bg-rose-950/80 text-rose-400 border-rose-800 animate-pulse'
                : 'bg-amber-950/70 text-amber-300 border-amber-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{isQRRevealed ? formatTimer(timeLeft) : '05:00'}</span>
          </div>
        </div>

        {/* QR Code Container with Blur & Click to Reveal */}
        <div className="flex flex-col items-center justify-center space-y-3 py-2">
          <div
            onClick={handleRevealQR}
            className={`relative cursor-pointer rounded-3xl p-4 border-2 transition-all duration-300 select-none group max-w-[260px] w-full flex flex-col items-center justify-center ${
              isQRRevealed
                ? 'bg-white border-brand-500 shadow-xl shadow-brand-500/20'
                : 'bg-slate-950 border-slate-800 hover:border-brand-500/60'
            }`}
          >
            <div
              className={`transition-all duration-500 flex flex-col items-center justify-center ${
                isQRRevealed ? 'filter-none scale-100' : 'filter blur-md opacity-30 scale-95'
              }`}
            >
              {qrImageUrl ? (
                <img
                  src={qrImageUrl}
                  alt="Official Payment QR Code"
                  className="w-56 h-auto rounded-xl object-contain shadow-md"
                />
              ) : (
                <QRCodeSVG
                  value={upiUrl}
                  size={200}
                  bgColor="#FFFFFF"
                  fgColor="#0F172A"
                  level="H"
                  includeMargin={true}
                />
              )}
            </div>

            {/* Overlay prompt when QR is BLURRED */}
            {!isQRRevealed && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center space-y-2 bg-slate-950/70 rounded-3xl backdrop-blur-sm group-hover:bg-slate-950/60 transition-all">
                <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <span className="px-3 py-0.5 rounded-full text-[11px] font-black bg-brand-500 text-white inline-block shadow">
                    Click to Reveal QR
                  </span>
                  <p className="text-[11px] text-slate-300 font-medium pt-1">
                    Starts 5-minute unlock timer of ₹1
                  </p>
                </div>
              </div>
            )}

            {isQRRevealed && (
              <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>ACTIVE</span>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 text-center font-medium">
            {isQRRevealed
              ? `Timer running (${formatTimer(timeLeft)}). Complete payment via Google Pay, PhonePe, Paytm, Cred or BHIM.`
              : 'Click on the blurred QR code box above to reveal payment QR & start 5-minute timer.'}
          </p>
        </div>

        {/* Copy UPI Handle */}
        <div className="bg-slate-100 dark:bg-slate-950 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">UPI Payee Details</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white capitalize">{upiName}</span>
              <span className="text-[11px] font-mono font-bold text-brand-600 dark:text-brand-300">({upiId})</span>
            </div>
          </div>
          <button
            onClick={handleCopyUPI}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 flex items-center space-x-1 text-slate-800 dark:text-white"
          >
            {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedUpi ? 'Copied' : 'Copy UPI'}</span>
          </button>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleConfirmPayment} className="space-y-3 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              UTR / Reference Number <span className="text-slate-400 font-normal">(Optional for instant test unlock)</span>
            </label>
            <input
              type="text"
              value={utrInput}
              onChange={(e) => setUtrInput(e.target.value)}
              placeholder="Enter 12-digit UTR or leave empty for auto-confirm"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-mono focus:border-brand-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={verifying}
            className="w-full py-3.5 rounded-2xl font-black text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
          >
            {verifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying ₹1 Payment...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>I Have Paid ₹1 — Unlock Certificate</span>
              </>
            )}
          </button>
        </form>
      </div>
    </Modal>
  );
};
