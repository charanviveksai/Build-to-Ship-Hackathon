import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, Lock, AlertTriangle, ScanFace, Smartphone, Bell, ChevronRight, Activity, Cpu } from 'lucide-react';
import { ThreatScoreWidget } from '../components/ThreatScoreWidget';
import { SecurityChart } from '../components/SecurityChart';
import { ActivityTimeline } from '../components/ActivityTimeline';
import { api } from '../services/api';
import { DashboardStats, UnlockLog } from '../types';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [logs, setLogs] = useState<UnlockLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboardData = async () => {
    try {
      const [dashRes, logsRes] = await Promise.all([
        api.getDashboardStats(),
        api.getLogs()
      ]);
      if (dashRes.stats) setStats(dashRes.stats);
      if (logsRes.logs) setLogs(logsRes.logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              SYSTEM ONLINE
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: SEC-88902</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Security Control Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time biometric monitoring, intruder traps, and Gemini threat intelligence active.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/add-app"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
          >
            + Protect New App
          </Link>
          <Link
            to="/ai-advisor"
            className="px-4 py-2.5 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-semibold hover:bg-purple-500/20 transition-all flex items-center gap-1.5"
          >
            <Cpu className="w-3.5 h-3.5 text-purple-400" /> AI Advisor
          </Link>
        </div>
      </div>

      {/* Top Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Protected Apps</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-3xl font-extrabold text-white mt-3">
            {stats?.totalProtectedApps || 4}
          </p>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> 100% Locked
          </span>
        </div>

        {/* Card 2 */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Today's Attempts</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-3xl font-extrabold text-white mt-3">
            {stats?.todayAttempts || 12}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {stats?.unauthorizedAttempts || 1} Intruder Triggered
          </span>
        </div>

        {/* Card 3 */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-red-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Unauthorized Attempts</span>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-3xl font-extrabold text-red-400 mt-3">
            {stats?.unauthorizedAttempts || 1}
          </p>
          <span className="text-[11px] text-red-400 font-semibold mt-1 block">
            Intruder Photo Snapshot Recorded
          </span>
        </div>

        {/* Card 4 */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Biometric Face Status</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <ScanFace className="w-4 h-4" />
            </div>
          </div>
          <p className="text-base font-bold text-white mt-3 truncate">
            {stats?.faceRecognitionStatus || 'Active & Registered'}
          </p>
          <span className="text-[11px] text-cyan-300 font-semibold mt-1 block">
            Confidence Threshold: 85%
          </span>
        </div>
      </div>

      {/* Main Grid: Threat Score Widget & Security Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ThreatScoreWidget
            score={stats?.aiThreatScore || 18}
            threatLevel={stats?.threatLevel || 'Low'}
            onRefresh={fetchDashboardData}
          />
        </div>
        <div className="lg:col-span-2">
          <SecurityChart />
        </div>
      </div>

      {/* Activity Log Feed */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-bold text-white">Recent Security Logs & Attempts</h4>
            <p className="text-xs text-slate-400">Timestamped attempt audit feed</p>
          </div>
          <Link
            to="/security-logs"
            className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
          >
            View Full Logs <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ActivityTimeline logs={logs} />
      </div>
    </div>
  );
};
