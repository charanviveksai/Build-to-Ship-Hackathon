import React from 'react';
import { User, Shield, KeyRound, Mail, Smartphone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const AccountPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-white">Account & Vault Management</h2>
        <p className="text-xs text-slate-400">Manage user credentials and master encryption key status</p>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
          <img src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} alt="Avatar" className="w-16 h-16 rounded-2xl border border-cyan-500/40 object-cover" />
          <div>
            <h4 className="text-base font-bold text-white">{user?.name}</h4>
            <p className="text-xs text-slate-400 font-mono">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Session Key Token</span>
            <p className="text-xs font-mono font-bold text-cyan-300 mt-1 truncate">
              JWT Bearer Active (LockMe-AI)
            </p>
          </div>

          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Account Creation Date</span>
            <p className="text-xs font-mono font-bold text-slate-200 mt-1">
              August 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
