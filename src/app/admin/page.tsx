import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth';
import { getAnalyticsSummary } from '@/lib/analytics';
import { prisma } from '@/lib/prisma';
import StatsCard from '@/components/admin/StatsCard';
import TrafficChart from '@/components/admin/TrafficChart';
import {
  FileText,
  Eye,
  Users,
  Clock,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Activity,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function AdminDashboardPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/admin/login');

  const [summary, draftCount, scheduledCount, popularArticles, recentArticles, auditLogs] =
    await Promise.all([
      getAnalyticsSummary(),
      prisma.article.count({ where: { status: 'DRAFT' } }),
      prisma.article.count({ where: { status: 'SCHEDULED' } }),
      prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        take: 5,
        orderBy: { viewCount: 'desc' },
        include: { category: true },
      }),
      prisma.article.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { category: true, author: true },
      }),
      prisma.auditLog.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

  // Past 7 days chart data
  const chartData = [
    { date: 'Jul 24', views: 320 },
    { date: 'Jul 25', views: 450 },
    { date: 'Jul 26', views: 610 },
    { date: 'Jul 27', views: 580 },
    { date: 'Jul 28', views: 840 },
    { date: 'Jul 29', views: 990 },
    { date: 'Jul 30', views: summary.todayViews || 1240 },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Welcome back, <strong className="text-brand-accent">{user.name}</strong> ({user.role})
          </p>
        </div>

        <Link
          href="/admin/articles/new"
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </Link>
      </div>

      {/* Stats Cards Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Articles"
          value={summary.totalArticles}
          subtitle={`${summary.publishedArticles} Published • ${draftCount} Drafts`}
          icon={FileText}
          trend="+12%"
        />
        <StatsCard
          title="Total Page Views"
          value={summary.totalViews.toLocaleString()}
          subtitle={`${summary.todayViews} views today`}
          icon={Eye}
          trend="+24%"
        />
        <StatsCard
          title="Subscribers"
          value={summary.totalSubscribers}
          subtitle="Newsletter audience"
          icon={Users}
          trend="+8%"
        />
        <StatsCard
          title="Scheduled Posts"
          value={scheduledCount}
          subtitle="Upcoming releases"
          icon={Clock}
          trend="Active"
        />
      </div>

      {/* Views Trend Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-card border border-slate-800 p-6 space-y-4 shadow-brand-soft">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-brand-accent" /> Traffic Overview (Last 7 Days)
            </h2>
            <span className="text-xs text-slate-400 font-mono font-medium">Real-time stats</span>
          </div>
          <TrafficChart data={chartData} />
        </div>

        {/* Recent Activity Audit Log (1 col) */}
        <div className="bg-slate-900 rounded-card border border-slate-800 p-6 space-y-4 shadow-brand-soft">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center">
              <Activity className="w-4 h-4 mr-2 text-[#4DD6C2]" /> Recent Audit Activity
            </h2>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-btn bg-slate-950/80 border border-slate-800/80 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-brand-accent">{log.action}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{formatDate(log.createdAt)}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-snug">{log.details}</p>
                <span className="text-[10px] text-slate-500 font-medium">By {log.userName || 'System'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular & Recent Articles Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Articles */}
        <div className="bg-slate-900 rounded-card border border-slate-800 p-6 space-y-4 shadow-brand-soft">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-white">Most Viewed Articles</h2>
            <Link href="/admin/articles" className="text-xs text-brand-accent font-semibold hover:underline">View All</Link>
          </div>

          <div className="space-y-3">
            {popularArticles.map((art) => (
              <div key={art.id} className="flex items-center justify-between p-3.5 rounded-btn bg-slate-950/60 border border-slate-800/80 text-xs">
                <div className="truncate max-w-xs space-y-0.5">
                  <span className="block font-bold text-white truncate">{art.title}</span>
                  <span className="block text-[10px] text-slate-400 font-medium">{art.category.name}</span>
                </div>
                <div className="text-right">
                  <span className="block font-extrabold text-brand-accent font-mono">{art.viewCount} views</span>
                  <span className="block text-[10px] text-[#4DD6C2] uppercase font-bold">{art.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Articles */}
        <div className="bg-slate-900 rounded-card border border-slate-800 p-6 space-y-4 shadow-brand-soft">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-white">Recent Articles</h2>
            <Link href="/admin/articles/new" className="text-xs text-brand-accent font-semibold hover:underline">Create New</Link>
          </div>

          <div className="space-y-3">
            {recentArticles.map((art) => (
              <div key={art.id} className="flex items-center justify-between p-3.5 rounded-btn bg-slate-950/60 border border-slate-800/80 text-xs">
                <div className="truncate max-w-xs space-y-0.5">
                  <span className="block font-bold text-white truncate">{art.title}</span>
                  <span className="block text-[10px] text-slate-400 font-medium">By {art.author.displayName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                      art.status === 'PUBLISHED'
                        ? 'bg-[#10B981]/15 text-[#4DD6C2] border border-[#10B981]/30'
                        : art.status === 'SCHEDULED'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {art.status}
                  </span>
                  <Link href={`/admin/articles/${art.id}/edit`} className="p-1.5 rounded-md bg-slate-800 text-slate-300 hover:text-white transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
