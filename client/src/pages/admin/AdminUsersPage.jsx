import React, { useEffect, useState } from 'react';
import { Search, ShieldAlert, CheckCircle2, UserX, UserCheck } from 'lucide-react';
import API from '../../services/api';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { useToast } from '../../context/ToastContext';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/users?search=${encodeURIComponent(search)}`);
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleToggleSuspend = async (userId) => {
    try {
      const res = await API.put(`/users/${userId}/suspend`);
      if (res.data.success) {
        addToast(res.data.message, 'info');
        fetchUsers();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">User Accounts Manager</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Search learners, inspect earned credentials, and handle suspensions.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search user name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-bold text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Certs Earned</th>
                <th className="p-4">Exams Taken</th>
                <th className="p-4 text-right">Account Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center space-x-3">
                    <img src={u.profileImage} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p>{u.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">@{u.username}</p>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{u.email}</td>
                  <td className="p-4 font-bold uppercase">{u.role}</td>
                  <td className="p-4 font-bold text-emerald-600">{u.certCount || 0}</td>
                  <td className="p-4">{u.attemptCount || 0}</td>
                  <td className="p-4 text-right">
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => handleToggleSuspend(u._id)}
                        className={`px-3 py-1.5 rounded-xl font-bold ${
                          u.isSuspended
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                        }`}
                      >
                        {u.isSuspended ? 'Reactivate User' : 'Suspend User'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
