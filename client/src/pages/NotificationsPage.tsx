import React, { useEffect, useState } from 'react';
import { Bell, ShieldAlert, CheckCircle, Trash2, Clock } from 'lucide-react';
import { api } from '../services/api';
import { NotificationItem } from '../types';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    api.getNotifications().then(res => {
      if (res.notifications) setNotifications(res.notifications);
    }).catch(console.error);
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Notifications Center</h2>
          <p className="text-xs text-slate-400">Security alerts, intruder warnings, and threat score updates</p>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`glass-panel p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
              !notif.is_read
                ? 'border-cyan-500/40 bg-cyan-950/20'
                : 'border-slate-800 opacity-80'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-xl border flex-shrink-0 ${
                notif.type === 'threat'
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
              }`}>
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{notif.title}</h4>
                <p className="text-xs text-slate-300 mt-0.5">{notif.message}</p>
                <span className="text-[10px] text-slate-500 font-mono block mt-1">
                  {new Date(notif.created_at).toLocaleString()}
                </span>
              </div>
            </div>

            {!notif.is_read && (
              <button
                onClick={() => handleMarkRead(notif.id)}
                className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold hover:bg-cyan-500/20"
              >
                Mark Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
