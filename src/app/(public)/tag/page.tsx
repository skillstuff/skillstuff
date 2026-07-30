import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { constructMetadata } from '@/lib/seo';
import { Tag } from 'lucide-react';

export const metadata = constructMetadata({
  title: 'Technology Tags Index',
  description: 'Filter articles by specific technology tags: Next.js, React, Docker, PostgreSQL, TypeScript, Python, and AI.',
  canonicalUrl: 'https://skillstuff.com/tag',
});

export default async function TagsIndexPage() {
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { articles: true } } },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-400">
          <Tag className="w-4 h-4" />
          <span>Technology Index</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Browse by Tag</h1>
        <p className="text-sm text-slate-300 max-w-xl">
          Find tutorials tailored to specific frameworks, tools, and engineering topics.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <Link
            key={tag.id}
            href={`/tag/${tag.slug}`}
            className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-bold hover:border-brand-500 hover:text-brand-600 transition-all flex items-center space-x-2 shadow-sm"
          >
            <span>#{tag.name}</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
              {tag._count.articles}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
