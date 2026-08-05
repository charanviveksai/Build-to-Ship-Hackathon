import React, { useState } from 'react';
import { Settings, Shield, Bell, Eye, Lock, Camera, Sliders, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export const SettingsPage: React.FC = () => {
  const [captureIntruderPhoto, setCaptureIntruderPhoto] = useState(true);
  const [instantNotifs, setInstantNotifs] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [stealthMode, setStealthMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    try {
      await api.updateSettings({
        captureIntruderPhoto,
        instantNotifications: instantNotifs,
        faceConfidenceThreshold: confidenceThreshold,
        stealthMode
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-white">System & Lock Settings</h2>
          <p className="text-xs text-slate-400">Configure biometric sensitivity, intruder triggers, and notifications</p>
        </div>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Security settings updated successfully!</span>
        </div>
      )}

      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
        {/* Setting 1 */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-cyan-400" /> Intruder Photo Capture
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">Capture high-res front camera snapshot on unauthorized attempt</p>
          </div>
          <button
            onClick={() => setCaptureIntruderPhoto(!captureIntruderPhoto)}
            className={`w-12 h-6 rounded-full p-1 transition-colors flex items-center ${
              captureIntruderPhoto ? 'bg-cyan-500 justify-end' : 'bg-slate-800 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-slate-950 shadow-md" />
          </button>
        </div>

        <div className="h-px bg-slate-800" />

        {/* Setting 2 */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-400" /> Instant Push Notifications
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">Send immediate FCM alert when unrecognized face is detected</p>
          </div>
          <button
            onClick={() => setInstantNotifs(!instantNotifs)}
            className={`w-12 h-6 rounded-full p-1 transition-colors flex items-center ${
              instantNotifs ? 'bg-cyan-500 justify-end' : 'bg-slate-800 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-slate-950 shadow-md" />
          </button>
        </div>

        <div className="h-px bg-slate-800" />

        {/* Setting 3 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" /> Face ID Match Threshold ({confidenceThreshold}%)
            </h4>
            <span className="font-mono text-xs font-bold text-cyan-400">{confidenceThreshold}% Score</span>
          </div>
          <input
            type="range"
            min={60}
            max={98}
            value={confidenceThreshold}
            onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Higher threshold requires stricter facial landmark matches before unlocking.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20"
        >
          Save Configuration Changes
        </button>
      </div>
    </div>
  );
};
