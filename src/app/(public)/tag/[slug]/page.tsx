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
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-400">
          <Tag className="w-4 h-4" />
          <span>Technology Tag</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">#{tag.name}</h1>
        {tag.description && <p className="text-sm text-slate-300 max-w-xl leading-relaxed">{tag.description}</p>}
        <span className="inline-block text-xs font-bold text-slate-400">
          {publishedArticles.length} Published Articles tagged with #{tag.name}
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
