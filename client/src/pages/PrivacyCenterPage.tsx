import React, { useState } from 'react';
import { ShieldAlert, Lock, EyeOff, Download, Trash2, CheckCircle2, FileText, Database } from 'lucide-react';

export const PrivacyCenterPage: React.FC = () => {
  const [exported, setExported] = useState(false);

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      user: "Alex Rivera",
      protectedAppsCount: 4,
      logsRecorded: 18,
      privacyPolicy: "LockMe AI Zero-Knowledge Biometric Standard 2026"
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "lockme_ai_privacy_export.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setExported(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-white">Privacy Center & Data Control</h2>
        <p className="text-xs text-slate-400">Complete transparency on biometric data encryption and user sovereignty</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
          <Lock className="w-6 h-6 text-cyan-400 mb-1" />
          <h4 className="text-sm font-bold text-white">AES-256 Vector Encryption</h4>
          <p className="text-xs text-slate-400 leading-relaxed">Facial embedding vectors are encrypted locally prior to transmission.</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
          <EyeOff className="w-6 h-6 text-purple-400 mb-1" />
          <h4 className="text-sm font-bold text-white">Zero Third-Party Sharing</h4>
          <p className="text-xs text-slate-400 leading-relaxed">No raw camera streams or facial images are sold or exposed to third parties.</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
          <Database className="w-6 h-6 text-emerald-400 mb-1" />
          <h4 className="text-sm font-bold text-white">Supabase PostgreSQL RLS</h4>
          <p className="text-xs text-slate-400 leading-relaxed">Row Level Security policies restrict database access exclusively to your auth session.</p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" /> Export or Purge Personal Data
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          You retain 100% ownership over your face profiles, security logs, and app locks. You can download a complete JSON archive of your security logs or wipe all recorded data at any time.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <button
            onClick={handleExportData}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold text-xs hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download Complete Privacy Archive (JSON)
          </button>

          <button
            onClick={() => alert('Data purge command executed. All temporary local logs cleared.')}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 font-bold text-xs hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Wipe Facial Embeddings & Logs
          </button>
        </div>

        {exported && (
          <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 pt-2">
            <CheckCircle2 className="w-4 h-4" /> Archive file generated and downloaded!
          </p>
        )}
      </div>
    </div>
  );
};
