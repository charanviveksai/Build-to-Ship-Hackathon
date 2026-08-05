import React from 'react';
import { Shield, Lock, Unlock, ScanFace, KeyRound, Eye, Trash2, Camera, MessageCircle, Building2, Image as ImageIcon, Mail, FileText, Globe } from 'lucide-react';
import { ProtectedApp } from '../types';

interface ProtectedAppCardProps {
  app: ProtectedApp;
  onToggleLock: (id: string, currentStatus: boolean) => void;
  onChangeLockType: (id: string, newType: 'PIN' | 'Password' | 'Face' | 'Biometric') => void;
  onTestLock: (app: ProtectedApp) => void;
  onDelete: (id: string) => void;
}

export const ProtectedAppCard: React.FC<ProtectedAppCardProps> = ({
  app,
  onToggleLock,
  onChangeLockType,
  onTestLock,
  onDelete
}) => {
  const getAppIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('whatsapp') || lower.includes('message') || lower.includes('chat')) return MessageCircle;
    if (lower.includes('bank') || lower.includes('vault') || lower.includes('money')) return Building2;
    if (lower.includes('photo') || lower.includes('gallery') || lower.includes('image')) return ImageIcon;
    if (lower.includes('insta') || lower.includes('camera')) return Camera;
    if (lower.includes('mail') || lower.includes('gmail')) return Mail;
    return Shield;
  };

  const IconComponent = getAppIcon(app.app_name);

  return (
    <div className={`glass-panel p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between group ${
      app.lock_enabled
        ? 'border-slate-800 hover:border-cyan-500/40 shadow-lg shadow-cyan-500/5'
        : 'border-slate-800/40 opacity-70 hover:opacity-100'
    }`}>
      {/* Header Info */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
              app.lock_enabled
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                {app.app_name}
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">{app.package_name}</span>
            </div>
          </div>

          {/* Toggle Lock Switch */}
          <button
            onClick={() => onToggleLock(app.id, app.lock_enabled)}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 flex items-center ${
              app.lock_enabled ? 'bg-cyan-500 justify-end' : 'bg-slate-800 justify-start'
            }`}
            title={app.lock_enabled ? 'Lock Enabled' : 'Lock Disabled'}
          >
            <div className={`w-4 h-4 rounded-full bg-slate-950 shadow-md transform transition-transform ${
              app.lock_enabled ? 'scale-110' : ''
            }`} />
          </button>
        </div>

        {/* Lock Configuration Pills */}
        <div className="grid grid-cols-2 gap-2 my-3">
          <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800 flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium">Auth Mode</span>
            <select
              value={app.lock_type}
              onChange={(e) => onChangeLockType(app.id, e.target.value as any)}
              className="bg-transparent text-xs font-bold text-cyan-300 focus:outline-none cursor-pointer mt-0.5"
            >
              <option value="Face" className="bg-slate-900 text-white">Face ID</option>
              <option value="PIN" className="bg-slate-900 text-white">PIN Lock</option>
              <option value="Password" className="bg-slate-900 text-white">Password</option>
              <option value="Biometric" className="bg-slate-900 text-white">Dual Biometrics</option>
            </select>
          </div>

          <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800 flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium">Attempts Logged</span>
            <span className="text-xs font-bold font-mono text-slate-200 mt-0.5">
              {app.attempts_count} Attempts
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <button
          onClick={() => onTestLock(app)}
          className="flex-1 py-2 px-3 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-1.5"
        >
          <Lock className="w-3.5 h-3.5" /> Test Lock
        </button>

        <button
          onClick={() => onDelete(app.id)}
          className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-red-400 hover:border-red-500/30 border border-slate-800 transition-colors"
          title="Remove Protection"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
