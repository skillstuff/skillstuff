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
    <div className="bg-slate-900 rounded-card border border-slate-800 p-6 shadow-brand-soft hover:shadow-brand-glow hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className="w-10 h-10 rounded-btn bg-brand-gradient text-white flex items-center justify-center shadow-brand-soft">
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">{value}</span>
        {trend && (
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
              trendType === 'positive'
                ? 'bg-[#10B981]/15 text-[#4DD6C2] border border-[#10B981]/30'
                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      {subtitle && <p className="mt-1.5 text-xs text-slate-400 font-medium">{subtitle}</p>}
    </div>
  );
}
