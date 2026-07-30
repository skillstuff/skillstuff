import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Download, Search } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ReportsPageProps {
  searchParams: Promise<{
    type?: string;
    q?: string;
  }>;
}

export default async function AdminReportsPage({ searchParams }: ReportsPageProps) {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/admin/login');

  const params = await searchParams;
  const { type = 'articles', q = '' } = params;

  let reportData: any[] = [];

  if (type === 'articles') {
    reportData = await prisma.article.findMany({
      where: q ? { title: { contains: q } } : {},
      include: { author: true, category: true },
      orderBy: { viewCount: 'desc' },
    });
  } else if (type === 'subscribers') {
    reportData = await prisma.subscriber.findMany({
      where: q ? { email: { contains: q } } : {},
      orderBy: { createdAt: 'desc' },
    });
  } else if (type === 'categories') {
    reportData = await prisma.category.findMany({
      include: { _count: { select: { articles: true } } },
      orderBy: { name: 'asc' },
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Reports &amp; Export Center</h1>
          <p className="text-xs text-slate-400 font-medium">Generate, filter, and export performance reports to CSV</p>
        </div>

        <a
          href={`/api/admin/reports/export?type=${type}`}
          download
          className="btn-success"
        >
          <Download className="w-4 h-4" />
          <span>Export {type.toUpperCase()} Report (CSV)</span>
        </a>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-4 rounded-card border border-slate-800 shadow-brand-soft">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-semibold">Report Type:</span>
          {['articles', 'subscribers', 'categories'].map((t) => (
            <Link
              key={t}
              href={`/admin/reports?type=${t}`}
              className={`px-3 py-1.5 rounded-btn text-xs font-bold capitalize transition-all ${
                type === t ? 'bg-brand-gradient text-white shadow-brand-soft' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </Link>
          ))}
        </div>

        <form action="/admin/reports" method="GET" className="flex items-center space-x-2 bg-slate-950 px-3.5 py-1.5 rounded-btn border border-slate-800">
          <input type="hidden" name="type" value={type} />
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder={`Filter ${type}...`}
            className="bg-transparent text-white text-xs focus:outline-none placeholder-slate-500 w-48"
          />
        </form>
      </div>

      {/* Report Data Table */}
      <div className="bg-slate-900 rounded-card border border-slate-800 overflow-hidden shadow-brand-soft">
        {type === 'articles' && (
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-4">Article Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Author</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">View Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {reportData.map((a) => (
                <tr key={a.id} className="hover:bg-slate-850 transition-colors">
                  <td className="p-4 font-bold text-white max-w-sm truncate">{a.title}</td>
                  <td className="p-4">{a.category.name}</td>
                  <td className="p-4">{a.author.displayName}</td>
                  <td className="p-4 font-bold text-[#4DD6C2]">{a.status}</td>
                  <td className="p-4 text-right font-extrabold text-brand-accent font-mono">{a.viewCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {type === 'subscribers' && (
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-4">Email Address</th>
                <th className="p-4">Status</th>
                <th className="p-4">Source</th>
                <th className="p-4">Subscribed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {reportData.map((s) => (
                <tr key={s.id} className="hover:bg-slate-850 transition-colors">
                  <td className="p-4 font-mono font-bold text-white">{s.email}</td>
                  <td className="p-4 font-bold text-[#4DD6C2]">{s.status}</td>
                  <td className="p-4 text-slate-400">{s.source || 'homepage'}</td>
                  <td className="p-4 text-slate-400 font-medium">{formatDate(s.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {type === 'categories' && (
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-4">Category Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4 text-right">Total Articles Published</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {reportData.map((c) => (
                <tr key={c.id} className="hover:bg-slate-850 transition-colors">
                  <td className="p-4 font-bold text-white">{c.name}</td>
                  <td className="p-4 font-mono text-slate-400">/category/{c.slug}</td>
                  <td className="p-4 text-right font-extrabold text-brand-accent font-mono">{c._count.articles}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
