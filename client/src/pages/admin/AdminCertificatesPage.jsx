import React, { useEffect, useState } from 'react';
import { Search, ShieldAlert, CheckCircle2, XCircle, RotateCcw, ExternalLink } from 'lucide-react';
import API from '../../services/api';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { useToast } from '../../context/ToastContext';

export const AdminCertificatesPage = () => {
  const [certs, setCerts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/stats');
      if (res.data.success) {
        // Fetch all certificates via API
        const certRes = await API.get('/certificates/my'); // Or admin list
        // Let's do a direct endpoint or extract list
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadAllCerts = async () => {
      setLoading(true);
      try {
        const res = await API.get('/admin/stats');
        if (res.data.recentCertificates) {
          setCerts(res.data.recentCertificates);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadAllCerts();
  }, []);

  const handleRevoke = async (certId) => {
    try {
      const res = await API.put(`/certificates/${certId}/revoke`);
      if (res.data.success) {
        addToast(res.data.message, 'warning');
        setCerts((prev) =>
          prev.map((c) => (c._id === certId ? { ...c, status: 'REVOKED' } : c))
        );
      }
    } catch (err) {
      addToast('Error revoking certificate', 'error');
    }
  };

  const handleRestore = async (certId) => {
    try {
      const res = await API.put(`/certificates/${certId}/restore`);
      if (res.data.success) {
        addToast(res.data.message, 'success');
        setCerts((prev) =>
          prev.map((c) => (c._id === certId ? { ...c, status: 'VALID' } : c))
        );
      }
    } catch (err) {
      addToast('Error restoring certificate', 'error');
    }
  };

  const handleAdminUnlock = async (certId) => {
    try {
      const res = await API.put(`/certificates/${certId}/unlock`);
      if (res.data.success) {
        addToast(res.data.message, 'success');
        setCerts((prev) =>
          prev.map((c) => (c._id === certId ? { ...c, isPaid: true } : c))
        );
      }
    } catch (err) {
      addToast('Error unlocking certificate', 'error');
    }
  };

  const filteredCerts = certs.filter(
    (c) =>
      c.certificateId?.toLowerCase().includes(search.toLowerCase()) ||
      c.userId?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Certificate Registry & Revocation</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Inspect all issued credentials and toggle REVOKED / VALID status.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Certificate ID or Learner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Certificate ID</th>
                <th className="p-4">Learner</th>
                <th className="p-4">Course</th>
                <th className="p-4">Score</th>
                <th className="p-4">Status</th>
                <th className="p-4">Payment (₹1)</th>
                <th className="p-4 text-right">Admin Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCerts.map((cert) => {
                const isRevoked = cert.status === 'REVOKED';
                const isUnlocked = cert.isPaid;
                return (
                  <tr key={cert._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-4 font-mono font-bold text-brand-600">
                      <a href={`/verify/${cert.certificateId}`} target="_blank" rel="noreferrer" className="hover:underline flex items-center">
                        {cert.certificateId} <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{cert.userId?.name || 'Learner'}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{cert.courseId?.title || 'Course'}</td>
                    <td className="p-4 font-bold">{cert.percentage}% ({cert.grade})</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        isRevoked ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {cert.status || 'VALID'}
                      </span>
                    </td>
                    <td className="p-4">
                      {isUnlocked ? (
                        <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200">
                          ✓ Paid (₹1)
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAdminUnlock(cert._id)}
                          className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-sm"
                        >
                          Unlock Now (₹1)
                        </button>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {isRevoked ? (
                        <button
                          onClick={() => handleRestore(cert._id)}
                          className="px-3 py-1.5 rounded-xl font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center space-x-1 ml-auto"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Restore Certificate</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRevoke(cert._id)}
                          className="px-3 py-1.5 rounded-xl font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center space-x-1 ml-auto"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Revoke Credential</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
