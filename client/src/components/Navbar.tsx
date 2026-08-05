import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Bell, Lock, User, LogOut, Bot, ChevronDown, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Navbar: React.FC<{ unreadCount?: number }> = ({ unreadCount = 2 }) => {
  const { user, logout, openLockModal } = useAuth();
  const navigate = useNavigate();

  const handleTestLock = () => {
    openLockModal({
      id: 'app-demo-test',
      app_name: 'WhatsApp',
      category: 'Messaging',
      lock_type: 'Face',
      lock_enabled: true
    });
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3 flex items-center justify-between">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
              LOCKME <span className="text-cyan-400 font-mono text-xs px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">AI</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Privacy & Zero Trust</span>
          </div>
        </Link>
      </div>

      {/* Center Security Status Badge */}
      <div className="hidden md:flex items-center gap-4 bg-slate-900/90 px-4 py-1.5 rounded-full border border-slate-800">
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300 font-medium">AI Shield: <strong className="text-cyan-400">ACTIVE</strong></span>
        </div>
        <div className="h-3 w-px bg-slate-800"></div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Activity className="w-3.5 h-3.5 text-purple-400" />
          <span>Threat Score: <strong className="text-emerald-400 font-mono">18 / Low</strong></span>
        </div>
      </div>

      {/* Right Controls & Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Lock Simulator Button */}
        <button
          onClick={handleTestLock}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all shadow-sm shadow-cyan-500/10"
        >
          <Lock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Test Lock Screen</span>
        </button>

        {/* AI Advisor Shortcut */}
        <Link
          to="/ai-advisor"
          className="p-2 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/30 hover:bg-purple-500/20 transition-all"
          title="AI Security Advisor"
        >
          <Bot className="w-4 h-4 text-purple-400" />
        </Link>

        {/* Notifications */}
        <Link
          to="/notifications"
          className="relative p-2 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 transition-all"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center border-2 border-[#0B0F19]">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* User Profile Dropdown */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <Link to="/profile" className="flex items-center gap-2 group">
            <img
              src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt="Avatar"
              className="w-8 h-8 rounded-full border border-cyan-500/40 object-cover group-hover:border-cyan-400 transition-colors"
            />
            <span className="hidden md:inline text-xs font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
              {user?.name || 'Alex Rivera'}
            </span>
          </Link>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};
