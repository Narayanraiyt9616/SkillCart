import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, Share2, Download, CheckCircle2, User, ShieldCheck, FileText, Check } from 'lucide-react';
import API from '../services/api';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CertificateCard } from '../components/certificate/CertificateCard';
import { CertificateViewerModal } from '../components/certificate/CertificateViewerModal';
import { useToast } from '../context/ToastContext';

export const PublicProfilePage = () => {
  const { username } = useParams();
  const { addToast } = useToast();

  const [profile, setProfile] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/users/public/${username}`);
        if (res.data.success) {
          setProfile(res.data.profile);
          setCertificates(res.data.certificates);
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('[Fetch Profile Error]', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [username]);

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    addToast('Public profile link copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadResume = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-center p-8">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <User className="w-16 h-16 text-slate-400" />
          <h2 className="text-2xl font-bold">User Profile Not Found</h2>
          <Link to="/" className="px-6 py-2 bg-brand-600 text-white rounded-xl font-bold">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <img
                src={profile.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                alt={profile.name}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-brand-500 shadow-md"
              />
              <div>
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">{profile.name}</h1>
                  <ShieldCheck className="w-5 h-5 text-brand-500" />
                </div>
                <p className="text-xs font-mono font-semibold text-slate-400">@{profile.username}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 max-w-lg leading-relaxed">{profile.bio}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={handleShareProfile}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Share Profile'}</span>
              </button>

              <button
                onClick={handleDownloadResume}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Resume</span>
              </button>
            </div>
          </div>

          {/* Verified Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Verified Technical Skills</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.skills.map((skill, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl space-y-2 border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-800 dark:text-slate-200">{skill.name}</span>
                      <span className="text-brand-600">{skill.score}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-600 rounded-full" style={{ width: `${skill.score}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Earned Credentials */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
            <Award className="w-6 h-6 mr-2 text-brand-600" /> Verified Credentials ({certificates.length})
          </h2>

          {certificates.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl text-center text-slate-500 border">
              No verified credentials available yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map((cert) => (
                <CertificateCard
                  key={cert._id}
                  certificate={cert}
                  onView={(c) => { setSelectedCert(c); setShowModal(true); }}
                  onDownload={(c) => { setSelectedCert(c); setShowModal(true); }}
                  onVerify={(id) => window.location.href = `/verify/${id}`}
                  onShare={(c) => {
                    navigator.clipboard.writeText(`${window.location.origin}/verify/${c.certificateId}`);
                    addToast('Verification link copied!', 'info');
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <CertificateViewerModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        certificate={selectedCert}
      />

      <Footer />
    </div>
  );
};
