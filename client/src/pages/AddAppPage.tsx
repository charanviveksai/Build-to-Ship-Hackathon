import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, ArrowLeft, Check, Plus, ScanFace, KeyRound } from 'lucide-react';
import { api } from '../services/api';

const presetApps = [
  { name: 'WhatsApp', package: 'com.whatsapp', category: 'Social', icon: 'MessageCircle' },
  { name: 'Instagram', package: 'com.instagram.android', category: 'Social', icon: 'Camera' },
  { name: 'Telegram', package: 'org.telegram.messenger', category: 'Social', icon: 'MessageCircle' },
  { name: 'Photos & Gallery', package: 'com.apple.mobileslideshow', category: 'Media', icon: 'Image' },
  { name: 'Banking Vault', package: 'com.chase.bank', category: 'Finance', icon: 'Building2' },
  { name: 'Gmail', package: 'com.google.android.gm', category: 'Productivity', icon: 'Mail' },
  { name: 'Messenger', package: 'com.facebook.orca', category: 'Social', icon: 'MessageCircle' },
  { name: 'Snapchat', package: 'com.snapchat.android', category: 'Social', icon: 'Camera' },
  { name: 'Files & Documents', package: 'com.android.documentsui', category: 'Storage', icon: 'FileText' }
];

export const AddAppPage: React.FC = () => {
  const [appName, setAppName] = useState('');
  const [packageName, setPackageName] = useState('');
  const [category, setCategory] = useState('General');
  const [lockType, setLockType] = useState<'PIN' | 'Password' | 'Face' | 'Biometric'>('Face');
  const [pin, setPin] = useState('1234');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSelectPreset = (preset: typeof presetApps[0]) => {
    setAppName(preset.name);
    setPackageName(preset.package);
    setCategory(preset.category);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName || !packageName) return;
    setSubmitting(true);
    try {
      await api.addApp({
        appName,
        packageName,
        category,
        lockType,
        pin,
        lockEnabled: true,
        faceEnabled: true,
        biometricEnabled: true
      });
      navigate('/protected-apps');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/protected-apps')}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-2xl font-extrabold text-white">Add Protected Application</h2>
          <p className="text-xs text-slate-400">Select a preset app or enter custom package details</p>
        </div>
      </div>

      {/* Preset Quick Select Grid */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Quick Pick Apps
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {presetApps.map((preset) => (
            <button
              key={preset.package}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`p-3 rounded-xl border text-left transition-all ${
                appName === preset.name
                  ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className="text-xs font-bold block truncate">{preset.name}</span>
              <span className="text-[10px] text-slate-500 font-mono block truncate">{preset.package}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Configuration Form */}
      <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Application Name</label>
          <input
            type="text"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            placeholder="e.g. WhatsApp, Banking App"
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-cyan-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Package Identifier</label>
          <input
            type="text"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            placeholder="e.g. com.whatsapp"
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-mono text-white focus:border-cyan-500 focus:outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Lock Type</label>
            <select
              value={lockType}
              onChange={(e) => setLockType(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="Face">AI Face Recognition</option>
              <option value="PIN">4-Digit PIN Lock</option>
              <option value="Password">Master Password</option>
              <option value="Biometric">Dual Biometrics (Face + PIN)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Default Lock PIN</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={6}
              placeholder="1234"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-mono text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Save & Enable Lock Protection
        </button>
      </form>
    </div>
  );
};
