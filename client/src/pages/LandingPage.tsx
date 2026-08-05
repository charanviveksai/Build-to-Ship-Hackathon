import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ScanFace, Lock, Bot, ShieldCheck, Eye, Cpu, ArrowRight, Zap, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const LandingPage: React.FC = () => {
  const { openLockModal } = useAuth();

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Hero Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-2">
            LOCKME <span className="text-cyan-400 font-mono text-xs px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 text-center overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-8 animate-pulse">
          <Zap className="w-3.5 h-3.5 text-cyan-400" /> Next-Gen AI Biometric Privacy & Zero-Trust Lock
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight max-w-4xl mx-auto">
          AI-Powered App Protection <br />
          <span className="text-gradient-cyan">Biometric Face Recognition</span>
        </h1>

        <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Lock WhatsApp, Banking Vaults, Gallery & Instagram with real-time AI face matching, instant intruder snapshot capture, and Google Gemini threat intelligence.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-slate-950 font-bold text-sm hover:opacity-95 transition-all shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2"
          >
            Launch Security Dashboard <ChevronRight className="w-4 h-4" />
          </Link>
          <button
            onClick={() => openLockModal({ app_name: 'WhatsApp', lock_type: 'Face' })}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 border border-slate-700 text-slate-200 font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4 text-cyan-400" /> Try Live App Lock Demo
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-cyan-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <ScanFace className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI Face Recognition</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Detect facial descriptors in real-time. Distinguishes legitimate owners from unknown intruders with high-confidence accuracy.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-purple-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Intruder Snapshot Trap</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Instantly captures high-resolution photo snapshots of unauthorized access attempts and saves timestamped device logs.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-cyan-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Gemini Threat Intelligence</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Google Gemini SDK evaluates unlock frequencies, shoulder-surfing anomalies, and outputs automated threat scores & recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-6 text-center text-xs text-slate-500">
        <p>© 2026 LockMe AI — Production AI Security, Privacy & Trust Application. All Rights Reserved.</p>
      </footer>
    </div>
  );
};
