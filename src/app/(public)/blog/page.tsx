import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ArticleCard from '@/components/public/ArticleCard';
import { constructMetadata } from '@/lib/seo';
import { Filter, Search, BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = constructMetadata({
  title: 'Blog & Software Engineering Articles',
  description: 'Explore our complete library of technology guides, Next.js tutorials, Cloud DevOps, AI, and backend software architecture.',
  canonicalUrl: 'https://skillstuff.com/blog',
});

interface BlogPageProps {
  searchParams: Promise<{
    category?: string;
    tag?: string;
    q?: string;
    sort?: string;
  }>;
}

export default async function BlogArchivePage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const { category, tag, q, sort = 'latest' } = params;

  const where: any = { status: 'PUBLISHED' };

  if (category) {
    where.category = { slug: category };
  }

  if (tag) {
    where.tags = { some: { tag: { slug: tag } } };
  }

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { excerpt: { contains: q } },
      { content: { contains: q } },
    ];
  }

  let orderBy: any = { publishedAt: 'desc' };
  if (sort === 'popular') orderBy = { viewCount: 'desc' };
  if (sort === 'readingTime') orderBy = { readingTime: 'desc' };

  const [articles, categories, tags] = await Promise.all([
    prisma.article.findMany({
      where,
      include: { category: true, author: true },
      orderBy,
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.tag.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-400">
          <BookOpen className="w-4 h-4" />
          <span>Knowledge Archive</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          All Technical Guides & Tutorials
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Browse {articles.length} in-depth engineering articles. Filter by technology stack, category, or search keywords.
        </p>

        {/* Filter Controls Bar */}
        <div className="pt-4 flex flex-wrap items-center gap-3">
          <form action="/blog" method="GET" className="flex items-center space-x-2 bg-slate-800 rounded-xl px-3 py-1.5 border border-slate-700">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="q"
              defaultValue={q || ''}
              placeholder="Search by keyword..."
              className="bg-transparent text-white text-xs font-medium focus:outline-none placeholder-slate-400 w-44"
            />
          </form>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-semibold">Category:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <Link
                href="/blog"
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  !category ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog?category=${cat.slug}${sort ? `&sort=${sort}` : ''}`}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    category === cat.slug ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sorting bar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 text-xs">
        <span className="font-semibold text-slate-500">
          Showing <strong className="text-slate-900 dark:text-white">{articles.length}</strong> published articles
        </span>

        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-medium">Sort By:</span>
          <Link
            href={`/blog?${category ? `category=${category}&` : ''}sort=latest`}
            className={`px-2.5 py-1 rounded-md font-bold ${sort === 'latest' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Latest
          </Link>
          <Link
            href={`/blog?${category ? `category=${category}&` : ''}sort=popular`}
            className={`px-2.5 py-1 rounded-md font-bold ${sort === 'popular' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Most Viewed
          </Link>
        </div>
      </div>

      {/* Articles Grid */}
      {articles.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No articles matched your criteria</h3>
          <p className="text-xs text-slate-500">Try clearing your search query or selecting a different category filter.</p>
          <Link href="/blog" className="inline-block mt-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold">
            Reset Filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

    </div>
  );
}
