import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { constructMetadata } from '@/lib/seo';
import { FolderTree, ArrowRight } from 'lucide-react';

export const metadata = constructMetadata({
  title: 'Engineering Categories & Tech Stacks',
  description: 'Browse articles by core technology category: Web Development, DevOps & Cloud, AI & Machine Learning, Software Architecture, and Security.',
  canonicalUrl: 'https://skillstuff.com/category',
});

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { articles: true } } },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-400">
          <FolderTree className="w-4 h-4" />
          <span>Topic Taxonomies</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Explore Categories</h1>
        <p className="text-sm text-slate-300 max-w-xl">
          Deep-dive into curated engineering topics designed for production software engineers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 flex flex-col justify-between space-y-4 hover:shadow-xl hover:border-brand-500/30 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                  <Link href={`/category/${cat.slug}`}>{cat.name}</Link>
                </h2>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
                  {cat._count.articles} articles
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {cat.description}
              </p>
            </div>

            <Link
              href={`/category/${cat.slug}`}
              className="flex items-center space-x-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform"
            >
              <span>Explore {cat.name} Guides</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
