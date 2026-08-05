import React from 'react';
import { Award, ShieldCheck, CheckCircle2, Cpu, Lock, Database } from 'lucide-react';

export const TrustCenterPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
          Trust & Architecture Center
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
            VERIFIED SECURE
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">Independent compliance audit and zero-trust engineering standards</p>
      </div>

      {/* Compliance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">PostgreSQL Row Level Security</h4>
              <p className="text-[11px] text-slate-400">Strict Auth Isolation</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every table (`users`, `protected_apps`, `face_profiles`, `unlock_logs`, `ai_reports`) enforces RLS policies verifying `auth.uid() = user_id`.
          </p>
          <div className="p-3 rounded-xl bg-slate-900 font-mono text-[11px] text-cyan-300 border border-slate-800">
            CREATE POLICY "Users access own apps" ON protected_apps USING (auth.uid() = user_id);
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Google Gemini Security Relay</h4>
              <p className="text-[11px] text-slate-400">Backend Server API Security</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Gemini API keys are strictly confined to Node.js backend environment variables (`@google/genai`). Zero client-side API key exposure.
          </p>
          <div className="p-3 rounded-xl bg-slate-900 font-mono text-[11px] text-purple-300 border border-slate-800">
            import &#123; GoogleGenAI &#125; from '@google/genai'; // Express Server Only
          </div>
        </div>
      </div>
    </div>
  );
};
