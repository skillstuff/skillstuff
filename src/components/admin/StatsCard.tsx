import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
}

export default function StatsCard({ title, value, subtitle, icon: Icon, trend, trendType = 'positive' }: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</span>
        <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</span>
        {trend && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              trendType === 'positive'
                ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      {subtitle && <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
    </div>
  );
}
