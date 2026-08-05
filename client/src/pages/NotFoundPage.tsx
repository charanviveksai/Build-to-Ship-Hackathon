import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4 text-center selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-white font-mono">404 — Access Denied</h1>
        <p className="text-sm text-slate-400">
          The requested security vault route does not exist or has been relocated by LockMe AI policy.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-xs hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Security Control Center
        </Link>
      </div>
    </div>
  );
};
