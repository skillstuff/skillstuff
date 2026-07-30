'use client';

import React from 'react';
import { Calendar, Clock, CheckCircle2, AlertTriangle, FileText, Eye } from 'lucide-react';

interface SchedulerStats {
  scheduled: number;
  publishingToday: number;
  publishedThisWeek: number;
  missedSchedule: number;
  drafts: number;
  pendingReview: number;
}

interface StatisticsCardsProps {
  stats: SchedulerStats;
}

export default function StatisticsCards({ stats }: StatisticsCardsProps) {
  const cards = [
    {
      title: 'Scheduled Posts',
      value: stats.scheduled,
      label: 'Upcoming queued',
      icon: Calendar,
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-[#3B82F6]',
    },
    {
      title: 'Publishing Today',
      value: stats.publishingToday,
      label: 'Due next 24h',
      icon: Clock,
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      iconColor: 'text-[#22C55E]',
    },
    {
      title: 'Published This Week',
      value: stats.publishedThisWeek,
      label: 'Live articles',
      icon: CheckCircle2,
      bgColor: 'bg-teal-500/10',
      borderColor: 'border-teal-500/30',
      iconColor: 'text-teal-400',
    },
    {
      title: 'Missed Schedule',
      value: stats.missedSchedule,
      label: 'Needs attention',
      icon: AlertTriangle,
      bgColor: 'bg-[#EF4444]/10',
      borderColor: 'border-[#EF4444]/30',
      iconColor: 'text-[#EF4444]',
    },
    {
      title: 'Draft Articles',
      value: stats.drafts,
      label: 'Ready to schedule',
      icon: FileText,
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      iconColor: 'text-[#F59E0B]',
    },
    {
      title: 'Pending Review',
      value: stats.pendingReview,
      label: 'Awaiting editor sign-off',
      icon: Eye,
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      iconColor: 'text-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((c, idx) => {
        const IconComp = c.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl bg-[#1E293B] border ${c.borderColor} space-y-2 shadow-lg transition-all hover:translate-y-[-2px]`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                {c.title}
              </span>
              <div className={`p-2 rounded-xl ${c.bgColor}`}>
                <IconComp className={`w-4 h-4 ${c.iconColor}`} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">{c.value}</div>
              <div className="text-[10px] text-slate-400 font-medium">{c.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
