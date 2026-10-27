import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { 
  ShieldCheck, 
  Clock, 
  Copy, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  QrCode, 
  Lock, 
  RefreshCw, 
  Sparkles, 
  Zap, 
  Check 
} from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const PaymentPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);

  // QR Reveal & Timer states
  const [isQRRevealed, setIsQRRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes = 300 seconds
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Payment Verification states
  const [utrInput, setUtrInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const timerRef = useRef(null);

  // Fetch course & payment details on mount
  useEffect(() => {
    const fetchCourseAndPaymentStatus = async () => {
      setLoading(true);
      try {
        // Check if already paid
        const statusRes = await API.get(`/payments/status/${courseId}`);
        if (statusRes.data.success) {
          setCourse(statusRes.data.course);

          if (statusRes.data.hasPaid) {
            setIsSuccess(true);
            addToast('Payment already completed for this course!', 'success');
            setTimeout(() => {
              navigate(`/courses/${statusRes.data.course._id || courseId}`);
            }, 1500);
            return;
          }
        }

        // Initiate payment session
        const initRes = await API.post('/payments/initiate', { courseId });
        if (initRes.data.success) {
          if (initRes.data.alreadyPaid) {
            setIsSuccess(true);
            addToast('Payment already completed for this course!', 'success');
            setTimeout(() => {
              navigate(`/courses/${courseId}`);
            }, 1500);
            return;
          }
          setPaymentData(initRes.data);
        }
      } catch (err) {
        console.error('[Payment Page Error]', err);
        addToast(err.response?.data?.message || 'Error initializing payment', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndPaymentStatus();
  }, [courseId, navigate, addToast]);

  // Countdown Timer Effect (Starts when QR is revealed)
  useEffect(() => {
    if (!isQRRevealed) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          addToast('Payment timer of 5 minutes expired! Refreshing payment page...', 'warning');
          setTimeout(() => {
            window.location.reload();
          }, 1200);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isQRRevealed, addToast]);

  const handleRevealQR = () => {
    if (!isQRRevealed) {
      setIsQRRevealed(true);
      setTimeLeft(300); // 5 minutes
      addToast('5-minute payment session started! Please scan QR code to complete payment.', 'info');
    }
  };

  const handleCopyUPI = () => {
    const upi = paymentData?.upiId || 'rainarayan709@oksbi';
    navigator.clipboard.writeText(upi);
    setCopiedUpi(true);
    addToast('UPI ID copied to clipboard!', 'success');
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleConfirmPayment = async (e) => {
    e?.preventDefault();
    if (!isQRRevealed) {
      addToast('Please click the blurred QR code to reveal it before completing payment.', 'warning');
      return;
    }

    setVerifying(true);
    try {
      const res = await API.post('/payments/verify', {
        courseId: course?._id || courseId,
        transactionId: utrInput.trim() || `UPI_TXN_${Date.now()}`,
        paymentId: paymentData?.paymentId,
      });

      if (res.data.success) {
        setIsSuccess(true);
        addToast('Payment verified successfully! Access granted.', 'success');
        setTimeout(() => {
          navigate(`/assessment/${course?._id || courseId}`);
        }, 1800);
      }
    } catch (err) {
      console.error('[Verify Payment Error]', err);
      addToast(err.response?.data?.message || 'Payment verification failed', 'error');
    } finally {
      setVerifying(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-white">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
          <p className="text-sm font-semibold text-slate-400">Loading secure QR payment gateway...</p>
        </div>
      </div>
    );
  }

  const courseTitle = course?.title || paymentData?.course?.title || 'Certification Assessment';
  const price = course?.price || paymentData?.amount || 499;
  const upiUrl = paymentData?.upiUrl || `upi://pay?pa=skillcert@upi&pn=SkillCert&am=${price}&cu=INR`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Back Link */}
        <Link
          to={`/courses/${course?._id || courseId}`}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Course Details</span>
        </Link>

        {/* Page Title Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-950/80 border border-brand-800 text-brand-400 text-xs font-extrabold">
            <Zap className="w-3.5 h-3.5 text-brand-400" />
            <span>Instant UPI QR Payment</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Complete Course Access Payment</h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Scan the QR code using any UPI app (Google Pay, PhonePe, Paytm, BHIM) to unlock your certification assessment.
          </p>
        </div>

        {/* Success Modal / Screen if verified */}
        {isSuccess ? (
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Payment Successfully Verified!</h2>
              <p className="text-slate-300 text-sm max-w-md mx-auto">
                You have unlocked full access to <span className="text-white font-bold">{courseTitle}</span>. Redirecting to your exam launch room...
              </p>
            </div>
            <div className="pt-4">
              <button
                onClick={() => navigate(`/assessment/${course?._id || courseId}`)}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-sm shadow-xl hover:from-emerald-600 hover:to-teal-700 transition-all"
              >
                Launch Assessment Now →
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Course Checkout Summary */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center">
                <ShieldCheck className="w-5 h-5 text-brand-400 mr-2" />
                Order Summary
              </h2>

              {course?.thumbnail && (
                <img
                  src={course.thumbnail}
                  alt={courseTitle}
                  className="w-full h-36 object-cover rounded-2xl border border-slate-800"
                />
              )}

              <div className="space-y-1">
                <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Certification</span>
                <h3 className="text-xl font-black text-white">{courseTitle}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{course?.description || 'Official technical skill certification track.'}</p>
              </div>

              <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Course Fee:</span>
                  <span className="font-bold text-white">₹{price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tax / Platform Fee:</span>
                  <span className="font-bold text-emerald-400">FREE (₹0)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assessment Retries:</span>
                  <span className="font-bold text-white">Unlimited Attempts</span>
                </div>
                <div className="h-px bg-slate-800 my-2"></div>
                <div className="flex justify-between text-sm font-black">
                  <span className="text-white">Total Amount Due:</span>
                  <span className="text-brand-400 text-base">₹{price} INR</span>
                </div>
              </div>

              {/* Supported UPI Apps */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Accepted Payment Method
                </span>
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 flex items-center space-x-3 text-xs text-slate-300">
                  <QrCode className="w-6 h-6 text-brand-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">UPI QR Code Only</span>
                    <span className="text-[11px] text-slate-400">Google Pay, PhonePe, Paytm, BHIM, Cred & Any UPI App</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: QR Code & 5-Min Timer Interactive Box */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              
              {/* Header with Timer Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Scan UPI QR Code</h2>
                  <p className="text-xs text-slate-400">Click QR code below to reveal and start timer</p>
                </div>

                {/* Live 5-Minute Timer Display */}
                <div
                  className={`flex items-center space-x-2 px-4 py-2 rounded-2xl font-mono text-sm font-black border transition-all ${
                    !isQRRevealed
                      ? 'bg-slate-800 text-slate-400 border-slate-700'
                      : timeLeft < 60
                      ? 'bg-rose-950/80 text-rose-400 border-rose-800 animate-pulse'
                      : 'bg-amber-950/70 text-amber-300 border-amber-800'
                  }`}
                >
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{isQRRevealed ? formatTimer(timeLeft) : '05:00'}</span>
                </div>
              </div>

              {/* QR Code Container with Blur & Click to Reveal */}
              <div className="flex flex-col items-center justify-center space-y-4 py-4">
                <div
                  onClick={handleRevealQR}
                  className={`relative cursor-pointer rounded-3xl p-6 border-2 transition-all duration-300 select-none group ${
                    isQRRevealed
                      ? 'bg-white border-brand-500 shadow-2xl shadow-brand-500/20'
                      : 'bg-slate-950/90 border-slate-800 hover:border-brand-500/60 shadow-lg'
                  }`}
                >
                  {/* The Actual QR Code Component */}
                  <div
                    className={`transition-all duration-500 flex flex-col items-center justify-center ${
                      isQRRevealed ? 'filter-none scale-100' : 'filter blur-md opacity-30 scale-95'
                    }`}
                  >
                    <img
                      src={paymentData?.qrImageUrl || "/certificate-qr.jpg"}
                      alt="Official Payment QR Code"
                      className="w-56 h-auto rounded-xl object-contain shadow-md"
                    />
                  </div>

                  {/* Overlay prompt when QR is BLURRED */}
                  {!isQRRevealed && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-slate-950/60 rounded-3xl backdrop-blur-sm group-hover:bg-slate-950/50 transition-all">
                      <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Lock className="w-7 h-7" />
                      </div>
                      <div className="space-y-1">
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-brand-500 text-white shadow-md inline-block">
                          Click to Reveal QR
                        </span>
                        <p className="text-xs text-slate-300 font-semibold pt-1">
                          Clicking will start the 5-minute payment countdown timer
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Verified Badge when revealed */}
                  {isQRRevealed && (
                    <div className="absolute -top-3 -right-3 bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>LIVE QR CODE</span>
                    </div>
                  )}
                </div>

                {/* Instruction subtext */}
                {isQRRevealed ? (
                  <p className="text-xs text-amber-400 font-bold flex items-center text-center">
                    <Clock className="w-3.5 h-3.5 mr-1 shrink-0" />
                    Timer running ({formatTimer(timeLeft)} remaining). Complete payment before page refreshes.
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 text-center font-medium">
                    Tap/click on the QR box above to unveil payment details & start 5-min timer.
                  </p>
                )}
              </div>

              {/* Copyable UPI Handle */}
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-slate-500 block uppercase">UPI Payee Details</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-white capitalize">{paymentData?.upiName || 'narayan rai'}</span>
                    <span className="text-xs font-mono font-bold text-brand-300">({paymentData?.upiId || 'rainarayan709@oksbi'})</span>
                  </div>
                </div>
                <button
                  onClick={handleCopyUPI}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white flex items-center space-x-1.5 transition-colors"
                >
                  {copiedUpi ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedUpi ? 'Copied!' : 'Copy UPI ID'}</span>
                </button>
              </div>

              {/* UTR / Payment Submission Form */}
              <form onSubmit={handleConfirmPayment} className="space-y-4 pt-2 border-t border-slate-800">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">
                    Transaction Reference / UTR Number <span className="text-slate-500">(Optional for instant test verification)</span>
                  </label>
                  <input
                    type="text"
                    value={utrInput}
                    onChange={(e) => setUtrInput(e.target.value)}
                    placeholder="e.g. 425619082341 or leave empty for auto-verify"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-brand-500 focus:outline-none placeholder-slate-600 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={verifying}
                  className="w-full py-4 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-xl shadow-brand-500/20 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
                >
                  {verifying ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Verifying QR Payment...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>I Have Paid — Verify & Unlock Exam</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
