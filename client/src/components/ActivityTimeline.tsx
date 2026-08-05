import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Eye, Clock, MapPin, Smartphone } from 'lucide-react';
import { UnlockLog } from '../types';

interface ActivityTimelineProps {
  logs: UnlockLog[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return (
      <div className="glass-panel p-8 rounded-3xl text-center text-slate-400">
        <ShieldCheck className="w-10 h-10 text-cyan-400 mx-auto mb-2 opacity-50" />
        <p className="text-sm font-semibold">No recent security events logged</p>
        <p className="text-xs text-slate-500 mt-1">All unlock attempts will appear here in real-time.</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return { label: 'Unlocked', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', icon: ShieldCheck };
      case 'INTRUDER_DETECTED':
        return { label: 'Intruder Captured', color: 'text-red-400 bg-red-500/10 border-red-500/30', icon: ShieldAlert };
      default:
        return { label: 'Failed Attempt', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30', icon: AlertTriangle };
    }
  };

  return (
    <div className="space-y-3">
      {logs.slice(0, 6).map((log) => {
        const badge = getStatusBadge(log.status);
        const Icon = badge.icon;
        const formattedTime = new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return (
          <div
            key={log.id}
            className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-cyan-500/30 transition-all flex items-center justify-between gap-4"
          >
            {/* Left Snapshot / Icon */}
            <div className="flex items-center gap-3.5">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-slate-700 flex-shrink-0 bg-slate-900">
                {log.image_url ? (
                  <img src={log.image_url} alt="Snap" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <Eye className="w-5 h-5" />
                  </div>
                )}
                <div className={`absolute bottom-0 right-0 p-0.5 rounded-tl ${badge.color}`}>
                  <Icon className="w-3 h-3" />
                </div>
              </div>

              <div>
                <h5 className="text-xs font-bold text-white flex items-center gap-2">
                  {log.app_name}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.color}`}>
                    {badge.label}
                  </span>
                </h5>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-cyan-400" /> {formattedTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Smartphone className="w-3 h-3 text-purple-400" /> {log.device_name || 'Mobile'}
                  </span>
                  <span className="font-mono text-cyan-300 font-semibold">
                    Match: {log.confidence}%
                  </span>
                </div>
              </div>
            </div>

            {/* Right Threat Level */}
            <div className="text-right hidden sm:block">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${
                log.threat_level === 'High' || log.threat_level === 'Critical'
                  ? 'bg-red-500/10 text-red-400 border-red-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}>
                {log.threat_level} Threat
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
