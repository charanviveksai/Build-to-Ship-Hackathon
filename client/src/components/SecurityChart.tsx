import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const mockChartData = [
  { time: '00:00', authorized: 2, unauthorized: 0 },
  { time: '04:00', authorized: 0, unauthorized: 1 },
  { time: '08:00', authorized: 8, unauthorized: 0 },
  { time: '12:00', authorized: 14, unauthorized: 2 },
  { time: '16:00', authorized: 10, unauthorized: 0 },
  { time: '20:00', authorized: 18, unauthorized: 1 },
  { time: '23:59', authorized: 5, unauthorized: 0 },
];

export const SecurityChart: React.FC = () => {
  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-white">Unlock Attempts & Security Trends</h4>
          <p className="text-[11px] text-slate-400">Authorized vs Unauthorized Attempts (24h)</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Authorized
          </span>
          <span className="flex items-center gap-1.5 text-red-400">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Unauthorized
          </span>
        </div>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAuth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#00F0FF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorUnauth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
            <YAxis stroke="#64748B" fontSize={11} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#1E293B', borderRadius: '12px', fontSize: '12px' }}
            />
            <Area type="monotone" dataKey="authorized" stroke="#00F0FF" strokeWidth={2} fillOpacity={1} fill="url(#colorAuth)" />
            <Area type="monotone" dataKey="unauthorized" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorUnauth)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
