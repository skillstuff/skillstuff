'use client';

import React from 'react';
import { BarChart3, TrendingUp, PieChart, Clock, Calendar, Activity } from 'lucide-react';

interface AnalyticsSectionProps {
  categoryDistribution: { name: string; count: number }[];
}

export default function AnalyticsSection({ categoryDistribution }: AnalyticsSectionProps) {
  const weeklyData = [
    { day: 'Mon', scheduled: 4, published: 5 },
    { day: 'Tue', scheduled: 6, published: 4 },
    { day: 'Wed', scheduled: 8, published: 7 },
    { day: 'Thu', scheduled: 5, published: 6 },
    { day: 'Fri', scheduled: 7, published: 8 },
    { day: 'Sat', scheduled: 2, published: 3 },
    { day: 'Sun', scheduled: 3, published: 2 },
  ];

  const bestPublishingTimes = [
    { time: '09:00 AM', engagement: '94% High', bestFor: 'Tech Guides & Next.js' },
    { time: '02:30 PM', engagement: '88% High', bestFor: 'DevOps & Architecture' },
    { time: '07:00 PM', engagement: '82% Medium', bestFor: 'AI & Industry News' },
  ];

  return (
    <div className="space-y-4 select-none">
      <div className="flex items-center space-x-2 border-b border-[#334155] pb-2">
        <BarChart3 className="w-4 h-4 text-[#3B82F6]" />
        <h3 className="font-extrabold text-white text-xs uppercase tracking-wider">
          Publishing Analytics &amp; Editorial Heatmap
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Scheduled vs Published Weekly Chart */}
        <div className="p-5 rounded-2xl bg-[#1E293B] border border-[#334155] space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-white text-xs flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-[#3B82F6]" /> Scheduled vs Published
            </h4>
            <span className="text-[10px] text-slate-400">This Week</span>
          </div>

          <div className="h-40 flex items-end justify-between gap-2 pt-4 px-2 border-b border-[#334155]/60">
            {weeklyData.map((d, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full flex items-end justify-center space-x-1 h-28">
                  <div
                    style={{ height: `${d.scheduled * 10}%` }}
                    className="w-2.5 bg-[#3B82F6] rounded-t-sm group-hover:bg-blue-400 transition-all"
                    title={`Scheduled: ${d.scheduled}`}
                  />
                  <div
                    style={{ height: `${d.published * 10}%` }}
                    className="w-2.5 bg-[#22C55E] rounded-t-sm group-hover:bg-emerald-400 transition-all"
                    title={`Published: ${d.published}`}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-bold">{d.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center space-x-4 text-[10px] font-bold text-slate-300">
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#3B82F6] mr-1" /> Scheduled</span>
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#22C55E] mr-1" /> Published</span>
          </div>
        </div>

        {/* Category Distribution Chart */}
        <div className="p-5 rounded-2xl bg-[#1E293B] border border-[#334155] space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-white text-xs flex items-center">
              <PieChart className="w-3.5 h-3.5 mr-1.5 text-purple-400" /> Category Distribution
            </h4>
            <span className="text-[10px] text-slate-400">Total Active</span>
          </div>

          <div className="space-y-2 pt-2">
            {categoryDistribution.map((cat, idx) => {
              const percentages = [40, 25, 20, 15];
              const pct = percentages[idx % percentages.length];
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-200">
                    <span>{cat.name}</span>
                    <span className="font-mono text-slate-400" suppressHydrationWarning>{cat.count} posts ({pct}%)</span>
                  </div>
                  <div className="w-full bg-[#111827] h-2 rounded-full overflow-hidden border border-[#334155]/60">
                    <div
                      className="bg-gradient-to-r from-[#3B82F6] to-purple-500 h-full rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best Publishing Time Insights */}
        <div className="p-5 rounded-2xl bg-[#1E293B] border border-[#334155] space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-white text-xs flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-[#22C55E]" /> Best Publishing Time
            </h4>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              AI Recommendation
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {bestPublishingTimes.map((t, idx) => (
              <div key={idx} className="p-2.5 bg-[#111827] rounded-xl border border-[#334155] flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-white text-xs font-mono">{t.time}</div>
                  <div className="text-[10px] text-slate-400">{t.bestFor}</div>
                </div>
                <span className="text-[10px] font-extrabold text-[#22C55E] bg-emerald-500/15 px-2 py-0.5 rounded-md">
                  {t.engagement}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
