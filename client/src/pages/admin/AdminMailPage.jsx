import React, { useState } from 'react';
import { Mail, Send, Users, UserCheck, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import API from '../../services/api';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { useToast } from '../../context/ToastContext';

export const AdminMailPage = () => {
  const { addToast } = useToast();

  const [recipientType, setRecipientType] = useState('all'); // 'all' or 'single'
  const [studentEmail, setStudentEmail] = useState('');
  const [subject, setSubject] = useState('SkillCert Notification: Important Update');
  const [body, setBody] = useState(
    `Dear Student,\n\nCongratulations on your progress in SkillCert! We encourage you to complete your technical certification assessments and claim your verifiable digital certificates.\n\nBest regards,\nSkillCert Certification Board`
  );
  const [sending, setSending] = useState(false);
  const [logs, setLogs] = useState([]);
  const [statusMsg, setStatusMsg] = useState(null);

  const handleTemplateSelect = (type) => {
    if (type === 'cert_unlock') {
      setSubject('SkillCert Reminder: Unlock & Download Your Official Certificate (₹1)');
      setBody(
        `Dear Learner,\n\nGreat job passing your recent SkillCert technical exam! Your official credential is now ready to be unlocked for ₹1 INR.\n\nUnlock your certificate today to showcase your verified skill on LinkedIn and resume.\n\nBest regards,\nSkillCert Certification Board`
      );
    } else if (type === 'announcement') {
      setSubject('New Technical Certifications & Exam Tracks Released!');
      setBody(
        `Hello Engineer,\n\nWe have added new assessment tracks across Web Development, Data Science, AI, and Cloud Architecture.\n\nTest your knowledge for free now on SkillCert!\n\nBest regards,\nSkillCert Team`
      );
    }
  };

  const handleSendMail = async (e) => {
    e.preventDefault();
    setStatusMsg(null);
    if (!subject.trim() || !body.trim()) {
      addToast('Please provide both subject and message body.', 'warning');
      return;
    }
    if (recipientType === 'single' && !studentEmail.trim()) {
      addToast('Please enter the recipient email address.', 'warning');
      return;
    }

    setSending(true);
    try {
      const res = await API.post('/admin/mail/send', {
        recipientType,
        studentEmail: recipientType === 'single' ? studentEmail.trim() : undefined,
        subject,
        body,
      });

      if (res.data.success) {
        const targetDesc = recipientType === 'single' ? studentEmail.trim() : `${res.data.recipientCount} student(s)`;
        const successText = `Email sent successfully to ${targetDesc}`;
        setStatusMsg({ type: 'success', text: successText });
        addToast(successText, 'success');

        setLogs((prev) => [
          {
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            subject,
            recipients: recipientType === 'single' ? studentEmail.trim() : `${res.data.recipientCount} learners`,
            status: 'SUCCESS',
            previewUrl: res.data.previewUrl,
          },
          ...prev,
        ]);
      }
    } catch (err) {
      console.error('[Send Mail Error]', err);
      const errorText = err.response?.data?.message || 'Failed to send email. Please check email address or SMTP configuration.';
      setStatusMsg({ type: 'error', text: errorText });
      addToast(errorText, 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Student Email & Broadcast Suite</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Compose and dispatch custom email notifications, certificate reminders, and announcements directly to registered learners.
          </p>
        </div>

        {/* Preset Templates */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleTemplateSelect('cert_unlock')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Load "Certificate Unlock (₹1)" Template</span>
          </button>

          <button
            onClick={() => handleTemplateSelect('announcement')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 hover:bg-brand-100 flex items-center space-x-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-brand-500" />
            <span>Load "New Courses Announcement" Template</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Mail Composer Form */}
          <form onSubmit={handleSendMail} className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            {statusMsg && (
              <div
                className={`p-4 rounded-2xl text-xs font-bold border flex items-center space-x-2.5 transition-all animate-fadeIn ${
                  statusMsg.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                }`}
              >
                {statusMsg.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
                <span>{statusMsg.text}</span>
              </div>
            )}
            <div className="space-y-3">
              <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                Target Recipient Group
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRecipientType('all')}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-center space-x-3 ${
                    recipientType === 'all'
                      ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-700 dark:text-rose-300 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Users className="w-5 h-5 text-rose-500" />
                  <div>
                    <span className="text-sm block font-bold">All Registered Students</span>
                    <span className="text-[11px] text-slate-400 font-normal">Broadcast to all active learners</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRecipientType('single')}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-center space-x-3 ${
                    recipientType === 'single'
                      ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-700 dark:text-rose-300 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <UserCheck className="w-5 h-5 text-indigo-500" />
                  <div>
                    <span className="text-sm block font-bold">Single Student</span>
                    <span className="text-[11px] text-slate-400 font-normal">Send to specific student email</span>
                  </div>
                </button>
              </div>
            </div>

            {recipientType === 'single' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Student Email Address
                </label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="e.g. student@gmail.com"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Email Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject line..."
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Message Body
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={8}
                placeholder="Write your email announcement or reminder message..."
                required
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-mono leading-relaxed focus:border-rose-500 focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-4 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 shadow-xl shadow-rose-500/20 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
            >
              {sending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Dispatching Email Broadcast...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Mail Broadcast Now</span>
                </>
              )}
            </button>
          </form>

          {/* Right Column: Dispatch Activity Log */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center">
              <Mail className="w-4 h-4 text-rose-500 mr-2" />
              Recent Dispatch Log
            </h3>

            {logs.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No mail broadcast sent in this session yet.
              </p>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>{log.time}</span>
                      <span className="text-emerald-500 font-bold flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> {log.status}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{log.subject}</p>
                    <p className="text-[11px] text-slate-400">Sent to {log.recipients} learner(s)</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
