import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ArticleCard from '@/components/public/ArticleCard';
import { constructMetadata } from '@/lib/seo';
import { Tag } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tag = await prisma.tag.findUnique({ where: { slug } });
  if (!tag) return constructMetadata({ title: 'Tag Not Found', noIndex: true });

  return constructMetadata({
    title: `${tag.name} Articles & Tutorials`,
    description: tag.description || `Read engineering guides tagged with ${tag.name}`,
    canonicalUrl: `https://skillstuff.com/tag/${tag.slug}`,
  });
}

export default async function TagDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tag = await prisma.tag.findUnique({
    where: { slug },
    include: {
      articles: {
        include: {
          article: {
            include: { category: true, author: true },
          },
        },
      },
    },
  });

  if (!tag) notFound();

  const publishedArticles = tag.articles
    .map((ta) => ta.article)
    .filter((art) => art.status === 'PUBLISHED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-gradient-to-br from-brand-50/90 via-white to-sky-50/60 rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm space-y-3 relative overflow-hidden dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:border-slate-800">
        <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400 bg-brand-100/80 dark:bg-brand-950/60 px-3 py-1 rounded-full border border-brand-200/80 dark:border-brand-800">
          <Tag className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>Technology Topic</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">#{tag.name}</h1>
        {tag.description && <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">{tag.description}</p>}
        <span className="inline-block text-xs font-semibold text-slate-500 font-mono">
          {publishedArticles.length} Published Articles
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publishedArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
