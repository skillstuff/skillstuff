import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Plus, Edit, Eye, Search, Filter, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ArticlesPageProps {
  searchParams: Promise<{
    status?: string;
    category?: string;
    q?: string;
  }>;
}

export default async function AdminArticlesPage({ searchParams }: ArticlesPageProps) {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/admin/login');

  const params = await searchParams;
  const { status, category, q } = params;

  const where: any = {};
  if (status && status !== 'ALL') where.status = status;
  if (category) where.categoryId = category;
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { excerpt: { contains: q } },
      { content: { contains: q } },
    ];
  }

  // If author role, limit to their own articles
  if (user.role === 'AUTHOR' && user.author) {
    where.authorId = user.author.id;
  }

  const [articles, categories] = await Promise.all([
    prisma.article.findMany({
      where,
      include: { category: true, author: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Article Management</h1>
          <p className="text-xs text-slate-400">Total {articles.length} articles found</p>
        </div>

        <Link
          href="/admin/articles/new"
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition-all shadow-md shadow-brand-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Create Article</span>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <form action="/admin/articles" method="GET" className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            name="q"
            defaultValue={q || ''}
            placeholder="Search titles or content..."
            className="bg-transparent text-white text-xs focus:outline-none placeholder-slate-500 w-52"
          />
        </form>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 font-semibold">Status:</span>
          <div className="flex items-center space-x-1">
            {['ALL', 'PUBLISHED', 'DRAFT', 'SCHEDULED', 'ARCHIVED'].map((st) => (
              <Link
                key={st}
                href={`/admin/articles?status=${st}${category ? `&category=${category}` : ''}`}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                  (status === st || (!status && st === 'ALL'))
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-4">Title &amp; Excerpt</th>
                <th className="p-4">Category</th>
                <th className="p-4">Author</th>
                <th className="p-4">Status</th>
                <th className="p-4">Views</th>
                <th className="p-4">Created Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No articles found matching filters.
                  </td>
                </tr>
              ) : (
                articles.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-850 transition-colors">
                    <td className="p-4 max-w-sm">
                      <Link href={`/admin/articles/${art.id}/edit`} className="font-bold text-white hover:text-brand-400 block truncate">
                        {art.title}
                      </Link>
                      <span className="text-[11px] text-slate-400 line-clamp-1">{art.excerpt}</span>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">{art.category.name}</td>
                    <td className="p-4 font-semibold text-slate-300">{art.author.displayName}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                          art.status === 'PUBLISHED'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : art.status === 'SCHEDULED'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {art.status}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-brand-400">{art.viewCount}</td>
                    <td className="p-4 text-slate-400">{formatDate(art.createdAt)}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {art.status === 'PUBLISHED' && (
                          <Link href={`/blog/${art.slug}`} target="_blank" className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300" title="View Public">
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        )}
                        <Link href={`/admin/articles/${art.id}/edit`} className="p-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white" title="Edit Article">
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
