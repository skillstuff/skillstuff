import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { constructMetadata } from '@/lib/seo';
import { Network } from 'lucide-react';

export const metadata = constructMetadata({
  title: 'HTML Sitemap & Site Directory',
  description: 'Complete directory of all pages, categories, tags, authors, and published articles on SkillStuff.com.',
  canonicalUrl: 'https://skillstuff.com/sitemap',
});

export default async function HtmlSitemapPage() {
  let articles: any[] = [];
  let categories: any[] = [];
  let tags: any[] = [];
  let authors: any[] = [];

  try {
    if (process.env.DATABASE_URL) {
      [articles, categories, tags, authors] = await Promise.all([
        prisma.article.findMany({
          where: { status: 'PUBLISHED' },
          select: { title: true, slug: true },
          orderBy: { title: 'asc' },
        }),
        prisma.category.findMany({ select: { name: true, slug: true }, orderBy: { name: 'asc' } }),
        prisma.tag.findMany({ select: { name: true, slug: true }, orderBy: { name: 'asc' } }),
        prisma.author.findMany({ select: { displayName: true, slug: true }, orderBy: { displayName: 'asc' } }),
      ]);
    }
  } catch (error) {
    console.error('HTML Sitemap DB fetch error:', error);
  }


  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-600">
          <Network className="w-4 h-4" />
          <span>Site Directory</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">HTML Sitemap</h1>
        <p className="text-xs text-slate-500">Comprehensive directory of all indexable pages on SkillStuff.com.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
        {/* Main Pages */}
        <div className="space-y-3">
          <h2 className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b pb-1">Main Pages</h2>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-brand-600">Home Page</Link></li>
            <li><Link href="/blog" className="hover:text-brand-600">Blog Archive</Link></li>
            <li><Link href="/category" className="hover:text-brand-600">Categories Directory</Link></li>
            <li><Link href="/tag" className="hover:text-brand-600">Tags Directory</Link></li>
            <li><Link href="/authors" className="hover:text-brand-600">Authors &amp; Contributors</Link></li>
            <li><Link href="/about" className="hover:text-brand-600">About SkillStuff</Link></li>
            <li><Link href="/contact" className="hover:text-brand-600">Contact Form</Link></li>
            <li><Link href="/search" className="hover:text-brand-600">Search Page</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h2 className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b pb-1">Categories</h2>
          <ul className="space-y-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="hover:text-brand-600">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Published Articles */}
        <div className="space-y-3 sm:col-span-2">
          <h2 className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b pb-1">Published Articles ({articles.length})</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {articles.map((a) => (
              <li key={a.slug}>
                <Link href={`/blog/${a.slug}`} className="hover:text-brand-600 line-clamp-1">&bull; {a.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
