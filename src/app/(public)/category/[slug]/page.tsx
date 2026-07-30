import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ArticleCard from '@/components/public/ArticleCard';
import AdSenseSlot from '@/components/adsense/AdSenseSlot';
import { constructMetadata } from '@/lib/seo';
import { FolderTree } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return constructMetadata({ title: 'Category Not Found', noIndex: true });

  return constructMetadata({
    title: category.metaTitle || `${category.name} Articles & Guides`,
    description: category.metaDescription || category.description || `Browse articles in ${category.name}`,
    canonicalUrl: `https://skillstuff.com/category/${category.slug}`,
  });
}

export default async function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      articles: {
        where: { status: 'PUBLISHED' },
        include: { category: true, author: true },
        orderBy: { publishedAt: 'desc' },
      },
    },
  });

  if (!category) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-400">
          <FolderTree className="w-4 h-4" />
          <span>Category Topic</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{category.name}</h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">{category.description}</p>
        <span className="inline-block text-xs font-bold text-slate-400">
          {category.articles.length} Published Articles in this category
        </span>
      </div>

      <AdSenseSlot slotId="category-top-banner" label="Category Sponsor" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
