import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ArticleCard from '@/components/public/ArticleCard';
import { constructMetadata } from '@/lib/seo';
import { Search, Sparkles } from 'lucide-react';

export const metadata = constructMetadata({
  title: 'Search Articles',
  description: 'Search SkillStuff engineering tutorials, code snippets, and tech guides.',
  canonicalUrl: 'https://skillstuff.com/search',
});

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = '' } = await searchParams;
  const query = q.trim();

  let results: any[] = [];

  if (query) {
    results = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: query } },
          { excerpt: { contains: query } },
          { content: { contains: query } },
          { category: { name: { contains: query } } },
          { tags: { some: { tag: { name: { contains: query } } } } },
        ],
      },
      include: { category: true, author: true },
      orderBy: { publishedAt: 'desc' },
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Bar Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 space-y-5">
        <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-400">
          <Sparkles className="w-4 h-4" />
          <span>Site-wide Search</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Search Knowledge Base</h1>

        <form action="/search" method="GET" className="flex items-center max-w-2xl bg-slate-800 rounded-2xl px-4 py-3 border border-slate-700 space-x-3">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Type technology, topic, or keyword (e.g. Next.js, Docker, RBAC)..."
            className="w-full bg-transparent text-white placeholder-slate-400 focus:outline-none text-sm font-medium"
          />
          <button type="submit" className="px-4 py-1.5 bg-brand-600 hover:bg-brand-500 font-bold text-xs text-white rounded-xl transition-all">
            Search
          </button>
        </form>
      </div>

      {/* Results Header */}
      {query ? (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Search results for &ldquo;<span className="text-brand-600">{query}</span>&rdquo; ({results.length} found)
          </h2>

          {results.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No articles matched &ldquo;{query}&rdquo;</h3>
              <p className="text-xs text-slate-500">Try searching for broader terms like &ldquo;Next.js&rdquo;, &ldquo;Docker&rdquo;, or &ldquo;PostgreSQL&rdquo;.</p>
              <Link href="/blog" className="inline-block mt-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold">
                View All Articles
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500 text-sm">
          Enter a keyword above to search through our articles.
        </div>
      )}
    </div>
  );
}
