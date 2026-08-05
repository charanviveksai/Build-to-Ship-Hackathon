import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Plus, Search, Filter, Lock } from 'lucide-react';
import { ProtectedAppCard } from '../components/ProtectedAppCard';
import { api } from '../services/api';
import { ProtectedApp } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedAppsPage: React.FC = () => {
  const [apps, setApps] = useState<ProtectedApp[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { openLockModal } = useAuth();

  const fetchApps = async () => {
    try {
      const res = await api.getApps();
      if (res.apps) setApps(res.apps);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleToggleLock = async (id: string, currentStatus: boolean) => {
    try {
      await api.updateApp(id, { lock_enabled: !currentStatus });
      setApps(prev => prev.map(a => a.id === id ? { ...a, lock_enabled: !currentStatus } : a));
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangeLockType = async (id: string, newType: any) => {
    try {
      await api.updateApp(id, { lock_type: newType });
      setApps(prev => prev.map(a => a.id === id ? { ...a, lock_type: newType } : a));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteApp(id);
      setApps(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredApps = apps.filter(a =>
    a.app_name.toLowerCase().includes(search.toLowerCase()) ||
    a.package_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            Protected Applications
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono">
              {apps.length} Managed
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure PIN, Password, or Biometric Face Recognition lock rules for each app.
          </p>
        </div>

        <Link
          to="/add-app"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Protected App
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="glass-panel p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search protected apps (WhatsApp, Banking, Gallery)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredApps.map((app) => (
          <ProtectedAppCard
            key={app.id}
            app={app}
            onToggleLock={handleToggleLock}
            onChangeLockType={handleChangeLockType}
            onTestLock={(a) => openLockModal(a)}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredApps.length === 0 && !loading && (
        <div className="glass-panel p-12 rounded-3xl text-center">
          <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-white">No protected apps found</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Click "+ Add Protected App" to start securing WhatsApp, Instagram, or Banking apps.
          </p>
        </div>
      )}
    </div>
  );
};
