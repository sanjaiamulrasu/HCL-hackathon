import React, { useEffect, useState } from 'react';
import { adminApi } from '../utils/api';
import { User as UserIcon, Trash2, ShieldCheck, Mail, Shield, UserCheck, Loader2, AlertCircle } from 'lucide-react';

export default function UsersView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await adminApi.updateRole(id, newRole);
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    } catch (err) {
      alert('Failed to update role: ' + err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) return;
    try {
      await adminApi.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const getRoleIcon = (role) => {
    if (role === 'ADMIN') return <ShieldCheck size={14} className="text-brand" />;
    if (role === 'HOTEL_MANAGER') return <Shield size={14} className="text-blue-400" />;
    return <UserIcon size={14} className="text-white/40" />;
  };

  if (loading) {
     return (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
           <Loader2 className="text-brand animate-spin" size={48} />
           <p className="text-white/20 font-black uppercase tracking-[0.3em] text-xs font-mono">Querying User Database...</p>
        </div>
     );
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-end px-2">
         <div>
            <h2 className="text-3xl font-black text-primary tracking-tighter italic">Identity Management</h2>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Platform Accounts: <span className="text-accent font-extrabold">{users.length}</span></p>
         </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-100 p-8 rounded-[32px] text-center space-y-4 shadow-sm">
           <AlertCircle className="text-red-500 mx-auto" size={48} />
           <p className="text-red-600 font-bold">{error}</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-[40px] shadow-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                <th className="p-6 pl-10 border-r border-gray-50 w-16 text-center">UID</th>
                <th className="p-6">User Profile</th>
                <th className="p-6">Auth Authority</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right pr-10">Administrative Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {users.map((user) => (
                <tr key={user.id} className="group hover:bg-gray-50/30 transition-all">
                  <td className="p-6 pl-10 border-r border-gray-50 text-center font-mono font-black text-gray-300">#{user.id}</td>
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-primary font-black text-xs border border-gray-200 group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-6 shadow-sm">
                        {user.name?.[0] || user.email?.[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black tracking-tight text-primary text-base">{user.name || 'Anonymous User'}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Mail size={10} /> {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                       {getRoleIcon(user.role)}
                       <span className={`text-[10px] font-black uppercase tracking-widest ${user.role === 'ADMIN' ? 'text-accent' : user.role === 'HOTEL_MANAGER' ? 'text-blue-500' : 'text-gray-400'}`}>
                         {user.role}
                       </span>
                    </div>
                    <select 
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="bg-gray-100 border border-gray-200 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-500 outline-none focus:border-accent/40 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                    >
                      <option value="USER">User (Traveler)</option>
                      <option value="HOTEL_MANAGER">Hotel Manager</option>
                      <option value="ADMIN">System Admin</option>
                    </select>
                  </td>
                  <td className="p-6">
                    {user.verified ? (
                      <span className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                        <UserCheck size={14} /> Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-gray-300 text-[10px] font-black uppercase tracking-widest italic">
                        <Loader2 size={14} className="animate-spin" /> Unverified
                      </span>
                    )}
                  </td>
                  <td className="p-6 text-right pr-10">
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-3 rounded-2xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all transform hover:scale-110 active:scale-95 shadow-sm"
                      title="Deactivate Account"
                    >
                      <Trash2 size={18} strokeWidth={2.5} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
