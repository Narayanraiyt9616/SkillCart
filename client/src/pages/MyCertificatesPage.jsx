import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Award, Search, BookOpen } from 'lucide-react';
import API from '../services/api';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CertificateCard } from '../components/certificate/CertificateCard';
import { CertificateViewerModal } from '../components/certificate/CertificateViewerModal';
import { EmptyState } from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';

export const MyCertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  useEffect(() => {
    const fetchCertificates = async () => {
      setLoading(true);
      try {
        const res = await API.get('/certificates/my');
        if (res.data.success) {
          const certList = res.data.certificates || [];
          setCertificates(certList);

          const targetId = location.state?.openCertId || new URLSearchParams(location.search).get('certId');
          if (targetId) {
            const match = certList.find(
              (c) => c.certificateId === targetId || c._id === targetId
            );
            if (match) {
              setSelectedCert(match);
              setShowModal(true);
            }
          }
        }
      } catch (err) {
        console.error('[Fetch Certificates Error]', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [location]);

  const handleView = (cert) => {
    setSelectedCert(cert);
    setShowModal(true);
  };

  const handleDownload = (cert) => {
    setSelectedCert(cert);
    setShowModal(true);
  };

  const handleVerify = (certId) => {
    navigate(`/verify/${certId}`);
  };

  const handleShare = (cert) => {
    const url = `${window.location.origin}/verify/${cert.certificateId}`;
    navigator.clipboard.writeText(url);
    addToast('Certificate verification link copied to clipboard!', 'info');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">My Credentials</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            View, download, and manage your official SkillCert digital certificates.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          </div>
        ) : certificates.length === 0 ? (
          <EmptyState
            icon={Award}
            title="No Certificates Earned Yet"
            description="You have not completed any skill certification assessments yet. Take an assessment to earn your first verifiable digital credential."
            action={
              <Link
                to="/courses"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md"
              >
                <BookOpen className="w-4 h-4" />
                <span>Browse Certifications</span>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <CertificateCard
                key={cert._id}
                certificate={cert}
                onView={handleView}
                onDownload={handleDownload}
                onVerify={handleVerify}
                onShare={handleShare}
              />
            ))}
          </div>
        )}
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
