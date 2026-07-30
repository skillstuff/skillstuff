'use client';

import React from 'react';
import { Bell, AlertTriangle, CheckCircle2, XCircle, Info, X } from 'lucide-react';

export interface SchedulerNotification {
  id: string;
  type: 'REMINDER' | 'SUCCESS' | 'FAILED' | 'CONFLICT' | 'WARNING';
  message: string;
  timestamp: string;
}

interface NotificationCenterProps {
  notifications: SchedulerNotification[];
  onDismiss: (id: string) => void;
}

export default function NotificationCenter({ notifications, onDismiss }: NotificationCenterProps) {
  if (notifications.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />;
      case 'FAILED':
        return <XCircle className="w-4 h-4 text-[#EF4444]" />;
      case 'CONFLICT':
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />;
      default:
        return <Bell className="w-4 h-4 text-[#3B82F6]" />;
    }
  };

  const getBgClass = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200';
      case 'FAILED':
        return 'bg-red-500/10 border-red-500/30 text-red-200';
      case 'CONFLICT':
      case 'WARNING':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-200';
      default:
        return 'bg-blue-500/10 border-blue-500/30 text-blue-200';
    }
  };

  return (
    <div className="space-y-2 select-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`p-3 rounded-2xl border flex items-center justify-between shadow-lg text-xs transition-all ${getBgClass(
            n.type
          )}`}
        >
          <div className="flex items-center space-x-2.5">
            {getIcon(n.type)}
            <span className="font-bold">{n.message}</span>
            <span className="text-[10px] opacity-70 font-mono">({n.timestamp})</span>
          </div>

          <button
            type="button"
            onClick={() => onDismiss(n.id)}
            className="p-1 rounded-lg hover:bg-black/20 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
