import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  History,
  Bell,
  Bot,
  User,
  Settings,
  ShieldAlert,
  Award,
  PlusCircle,
  Lock,
  Globe
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/protected-apps', label: 'Protected Apps', icon: ShieldCheck },
    { to: '/add-app', label: 'Add App', icon: PlusCircle },
    { to: '/security-logs', label: 'Security Logs', icon: History },
    { to: '/notifications', label: 'Notifications', icon: Bell },
    { to: '/ai-advisor', label: 'AI Security Advisor', icon: Bot, highlight: true },
    { to: '/privacy-center', label: 'Privacy Center', icon: ShieldAlert },
    { to: '/trust-center', label: 'Trust Center', icon: Award },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0B0F19]/90 border-r border-slate-800/80 p-4 flex flex-col justify-between hidden lg:flex min-h-[calc(100vh-61px)]">
      <div className="space-y-6">
        {/* Navigation Group */}
        <div>
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
            Core Modules
          </p>
          <nav className="space-y-1">
            {navItems.slice(0, 6).map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? item.highlight
                          ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-purple-300 border border-purple-500/40 shadow-lg shadow-purple-500/10'
                          : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`
                  }
                >
                  <Icon className={`w-4 h-4 ${item.highlight ? 'text-purple-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Security & System */}
        <div>
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
            Trust & Governance
          </p>
          <nav className="space-y-1">
            {navItems.slice(6).map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Cyber System Status Banner */}
      <div className="glass-panel p-3.5 rounded-2xl border border-cyan-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
          <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">Zero-Trust Engine</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-snug">
          PostgreSQL RLS & Gemini Threat Analysis active.
        </p>
      </div>
    </aside>
  );
};
