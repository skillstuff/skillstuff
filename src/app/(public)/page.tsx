import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import ArticleCard from '@/components/public/ArticleCard';
import NewsletterBox from '@/components/public/NewsletterBox';
import AdSenseSlot from '@/components/adsense/AdSenseSlot';
import { Sparkles, TrendingUp, Compass, ArrowRight, Code2, Users } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  const [featuredArticles, latestArticles, popularArticles, categories, authors] = await Promise.all([
    prisma.article.findMany({
      where: { status: 'PUBLISHED', isFeatured: true },
      include: { category: true, author: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    }),
    prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      include: { category: true, author: true },
      orderBy: { publishedAt: 'desc' },
      take: 6,
    }),
    prisma.article.findMany({
      where: { status: 'PUBLISHED', isPopular: true },
      include: { category: true, author: true },
      orderBy: { viewCount: 'desc' },
      take: 5,
    }),
    prisma.category.findMany({
      include: { _count: { select: { articles: true } } },
      orderBy: { name: 'asc' },
    }),
    prisma.author.findMany({
      take: 3,
    }),
  ]);

  const mainHero = featuredArticles[0] || latestArticles[0];

  return (
    <div className="space-y-12 pb-16">
      {/* Editorial Hero Section */}
      <section className="bg-slate-900 text-white pt-10 pb-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Tagline */}
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Production Software Engineering</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Practical guides on Next.js, Cloud Infrastructure &amp; AI.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Curated software architecture deep-dives and tutorials written by experienced lead engineers and architects.
            </p>
          </div>

          {/* Main Hero Article */}
          {mainHero && (
            <div className="group rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl transition-all hover:border-slate-700">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                <div className="lg:col-span-7 relative min-h-[280px] lg:min-h-[380px] bg-slate-900">
                  <Image
                    src={mainHero.featuredImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80'}
                    alt={mainHero.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover group-hover:scale-[1.01] transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider bg-brand-600 text-white rounded-md shadow-md">
                      Featured Masterclass
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-slate-950">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <span className="font-bold text-brand-400 uppercase tracking-wider">{mainHero.category.name}</span>
                      <span>&bull;</span>
                      <span>{formatDate(mainHero.publishedAt)}</span>
                      <span>&bull;</span>
                      <span>{mainHero.readingTime} min read</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-brand-400 transition-colors leading-snug">
                      <Link href={`/blog/${mainHero.slug}`}>{mainHero.title}</Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                      {mainHero.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-800 text-brand-400 font-bold flex items-center justify-center text-xs">
                        {mainHero.author.displayName.charAt(0)}
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-white">{mainHero.author.displayName}</span>
                        <span className="block text-[10px] text-slate-400">Author</span>
                      </div>
                    </div>

                    <Link
                      href={`/blog/${mainHero.slug}`}
                      className="flex items-center space-x-1.5 text-xs font-bold text-brand-400 hover:text-white transition-colors"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Top Banner AdSense Slot */}
      <AdSenseSlot slotId="header-top-banner" label="Sponsor Advertisement" />

      {/* Category Pills Navigation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center">
            <Compass className="w-4 h-4 mr-1.5 text-brand-600" /> Explore Topics
          </h2>
          <Link href="/category" className="text-xs font-bold text-brand-600 hover:underline">
            View All Categories &rarr;
          </Link>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:border-brand-500 hover:text-brand-600 transition-all flex items-center space-x-2"
            >
              <span>{cat.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                {cat._count.articles}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Main Grid: Latest Articles (Left 2 cols) & Trending Sidebar (Right 1 col) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Latest Articles */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                <Code2 className="w-4.5 h-4.5 mr-2 text-brand-600" /> Latest Tutorials &amp; Articles
              </h2>
              <Link href="/blog" className="text-xs font-bold text-brand-600 hover:underline">
                View Archive &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {latestArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Trending Articles Widget */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 space-y-4 shadow-sm">
              <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
                <TrendingUp className="w-4 h-4 text-rose-500" />
                <span>Most Popular Guides</span>
              </div>

              <div className="space-y-3.5">
                {popularArticles.map((art, idx) => (
                  <div key={art.id} className="flex items-start space-x-3 group">
                    <span className="font-black text-base text-slate-300 dark:text-slate-700 group-hover:text-brand-600 transition-colors w-5">
                      0{idx + 1}
                    </span>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">{art.category.name}</span>
                      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
                        <Link href={`/blog/${art.slug}`}>{art.title}</Link>
                      </h3>
                      <span className="text-[10px] text-slate-400 font-medium">{art.viewCount} views</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar AdSense Slot */}
            <AdSenseSlot slotId="sidebar-widget-ad" format="rectangle" label="Sponsored Sidebar" />

            {/* Authors Spotlight */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center">
                  <Users className="w-4 h-4 mr-1.5 text-brand-600" /> Lead Contributors
                </span>
                <Link href="/authors" className="text-[11px] text-brand-600 font-semibold hover:underline">All Authors</Link>
              </div>

              <div className="space-y-2.5">
                {authors.map((auth) => (
                  <Link
                    key={auth.id}
                    href={`/author/${auth.slug}`}
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center text-xs flex-shrink-0">
                      {auth.displayName.charAt(0)}
                    </div>
                    <div className="truncate">
                      <span className="block text-xs font-bold text-slate-900 dark:text-white truncate">{auth.displayName}</span>
                      <span className="block text-[10px] text-slate-500 truncate">{auth.title || 'Contributor'}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NewsletterBox />
      </section>
    </div>
  );
}
