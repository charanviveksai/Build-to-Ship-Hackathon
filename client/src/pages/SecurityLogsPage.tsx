import React, { useEffect, useState } from 'react';
import { History, Search, Filter, ShieldAlert, ShieldCheck, Eye, Smartphone, MapPin, Clock, Camera } from 'lucide-react';
import { api } from '../services/api';
import { UnlockLog } from '../types';

export const SecurityLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<UnlockLog[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [selectedSnapshot, setSelectedSnapshot] = useState<UnlockLog | null>(null);

  useEffect(() => {
    api.getLogs().then(res => {
      if (res.logs) setLogs(res.logs);
    }).catch(console.error);
  }, []);

  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.app_name.toLowerCase().includes(search.toLowerCase()) || l.device_name.toLowerCase().includes(search.toLowerCase());
    if (filterStatus === 'ALL') return matchesSearch;
    if (filterStatus === 'INTRUDER') return matchesSearch && l.status !== 'SUCCESS';
    if (filterStatus === 'SUCCESS') return matchesSearch && l.status === 'SUCCESS';
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            Security Logs & Intruder Traps
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono">
              {logs.length} Recorded
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete audit trail of all biometric face scans, PIN unlocks, and captured intruder photo snapshots.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-3 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by app or device..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['ALL', 'INTRUDER', 'SUCCESS'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterStatus === status
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {status === 'ALL' ? 'All Events' : status === 'INTRUDER' ? '🚨 Intruder Snapshot' : '✅ Successful'}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table Card */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Snapshot</th>
                <th className="px-6 py-4">App & Event</th>
                <th className="px-6 py-4">Face Match %</th>
                <th className="px-6 py-4">Device & Location</th>
                <th className="px-6 py-4">Threat Level</th>
                <th className="px-6 py-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                  {/* Photo Thumbnail */}
                  <td className="px-6 py-3">
                    <button
                      onClick={() => setSelectedSnapshot(log)}
                      className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-700 hover:border-cyan-400 transition-colors group"
                    >
                      <img src={log.image_url} alt="Intruder" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Eye className="w-4 h-4 text-cyan-300" />
                      </div>
                    </button>
                  </td>

                  {/* App & Event */}
                  <td className="px-6 py-3">
                    <span className="font-bold text-white block">{log.app_name}</span>
                    <span className={`inline-block text-[10px] font-semibold mt-0.5 ${
                      log.status === 'SUCCESS' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {log.status}
                    </span>
                  </td>

                  {/* Face Confidence */}
                  <td className="px-6 py-3 font-mono font-bold">
                    <span className={log.confidence >= 70 ? 'text-emerald-400' : 'text-red-400'}>
                      {log.confidence}%
                    </span>
                  </td>

                  {/* Device */}
                  <td className="px-6 py-3">
                    <span className="text-slate-300 flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-purple-400" /> {log.device_name}
                    </span>
                    <span className="text-slate-500 text-[10px] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" /> {log.location}
                    </span>
                  </td>

                  {/* Threat level */}
                  <td className="px-6 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      log.threat_level === 'High' || log.threat_level === 'Critical'
                        ? 'bg-red-500/10 text-red-400 border-red-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {log.threat_level}
                    </span>
                  </td>

                  {/* Timestamp */}
                  <td className="px-6 py-3 font-mono text-slate-400">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Snapshot Preview Modal */}
      {selectedSnapshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F19]/90 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#131B2E] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedSnapshot(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-cyan-400" /> Intruder Photo Capture
            </h3>
            <div className="w-full h-64 rounded-2xl overflow-hidden border border-slate-700 bg-slate-950">
              <img src={selectedSnapshot.image_url} alt="Intruder Snapshot" className="w-full h-full object-cover" />
            </div>
            <div className="glass-panel p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
              <p className="text-slate-300"><strong>App Target:</strong> {selectedSnapshot.app_name}</p>
              <p className="text-slate-300"><strong>Confidence Score:</strong> <span className="font-mono font-bold text-cyan-400">{selectedSnapshot.confidence}%</span></p>
              <p className="text-slate-300"><strong>Timestamp:</strong> {new Date(selectedSnapshot.created_at).toLocaleString()}</p>
              <p className="text-slate-300"><strong>Device Location:</strong> {selectedSnapshot.location}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
