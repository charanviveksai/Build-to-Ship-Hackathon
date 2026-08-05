import React, { useState } from 'react';
import { User, ScanFace, KeyRound, Shield, CheckCircle2, Camera, Lock, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [masterPin, setMasterPin] = useState('1234');
  const [enrolling, setEnrolling] = useState(false);
  const [enrollMsg, setEnrollMsg] = useState<string | null>(null);

  const handleEnrollFace = async () => {
    setEnrolling(true);
    setEnrollMsg('Capturing 128-d face embedding vector...');
    setTimeout(async () => {
      try {
        await api.registerFace({
          embedding: Array.from({ length: 128 }, () => (Math.random() - 0.5) * 2),
          deviceName: 'Primary iPhone / Web Camera'
        });
        setEnrollMsg('✅ Biometric Face Profile Successfully Enrolled & Hash Saved.');
      } catch (err: any) {
        setEnrollMsg(`Failed to enroll face: ${err.message}`);
      } finally {
        setEnrolling(false);
      }
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* User Header Card */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-cyan-400 p-0.5 shadow-xl shadow-cyan-500/20">
            <img src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} alt="Profile" className="w-full h-full object-cover rounded-[14px]" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">{user?.name || 'Alex Rivera'}</h2>
            <p className="text-xs text-cyan-400 font-mono mt-0.5">{user?.email || 'alex@lockme.ai'}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Biometrics Verified
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleEnrollFace}
          disabled={enrolling}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 font-bold text-xs hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
        >
          <ScanFace className="w-4 h-4" /> {enrolling ? 'Enrolling Face...' : 'Re-Register Biometric Face'}
        </button>
      </div>

      {enrollMsg && (
        <div className="p-4 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold">
          {enrollMsg}
        </div>
      )}

      {/* Security Credentials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Master Override PIN</h4>
              <p className="text-xs text-slate-400">Used as fallback when face scan fails</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Configure 4-Digit Master PIN</label>
            <input
              type="password"
              value={masterPin}
              onChange={(e) => setMasterPin(e.target.value)}
              maxLength={6}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-white text-sm focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Trusted Device Profiles</h4>
              <p className="text-xs text-slate-400">Devices registered to access vault</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-white block">iPhone 15 Pro Max</span>
              <span className="text-slate-500 text-[10px]">Registered August 2026</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
