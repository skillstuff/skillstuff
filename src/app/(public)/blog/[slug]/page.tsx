import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { constructMetadata, generateArticleJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';
import TableOfContents from '@/components/public/TableOfContents';
import SocialShare from '@/components/public/SocialShare';
import ArticleCard from '@/components/public/ArticleCard';
import { trackArticleView } from '@/lib/analytics';
import { formatDate } from '@/lib/utils';
import { Clock, Eye, Calendar, User, ChevronRight, BookOpen } from 'lucide-react';
import { headers } from 'next/headers';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { author: true, category: true },
  });

  if (!article || article.status !== 'PUBLISHED') {
    return constructMetadata({ title: 'Article Not Found', noIndex: true });
  }

  return constructMetadata({
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    image: article.featuredImage || undefined,
    canonicalUrl: article.canonicalUrl || `https://skillstuff.com/blog/${article.slug}`,
    type: 'article',
    publishedTime: article.publishedAt?.toISOString(),
    authors: [article.author.displayName],
  });
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      category: true,
      author: true,
      tags: { include: { tag: true } },
    },
  });

  if (!article || article.status !== 'PUBLISHED') {
    notFound();
  }

  // Increment view count in background
  const headerList = await headers();
  const userAgent = headerList.get('user-agent');
  const ipAddress = headerList.get('x-forwarded-for') || '127.0.0.1';
  const referrer = headerList.get('referer') || 'Direct';

  await trackArticleView(article.id, { userAgent, ipAddress, referrer });

  // Fetch Related Articles
  const relatedArticles = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      categoryId: article.categoryId,
      NOT: { id: article.id },
    },
    include: { category: true, author: true },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  });

  const articleJsonLd = generateArticleJsonLd(article);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: article.category.name, url: `/category/${article.category.slug}` },
    { name: article.title, url: `/blog/${article.slug}` },
  ]);

  const fullUrl = `https://skillstuff.com/blog/${article.slug}`;

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Schema Injection */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Breadcrumb Header */}
      <nav className="max-w-3xl mx-auto flex items-center space-x-2 text-xs font-semibold text-slate-500 overflow-x-auto">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/blog" className="hover:text-brand-600">Blog</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/category/${article.category.slug}`} className="hover:text-brand-600">{article.category.name}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white truncate max-w-xs">{article.title}</span>
      </nav>

      {/* Article Header */}
      <header className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center space-x-3">
          <Link
            href={`/category/${article.category.slug}`}
            className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-slate-900 text-white dark:bg-brand-600 rounded-md hover:bg-brand-600 transition-colors"
          >
            {article.category.name}
          </Link>
          <span className="text-xs text-slate-400 font-medium flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1" /> {article.readingTime} min read
          </span>
          <span className="text-xs text-slate-400 font-medium flex items-center">
            <Eye className="w-3.5 h-3.5 mr-1" /> {article.viewCount} views
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {article.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {article.excerpt}
        </p>

        {/* Author Metadata Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 gap-4">
          <Link href={`/author/${article.author.slug}`} className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center overflow-hidden flex-shrink-0">
              {article.author.avatar ? (
                <Image src={article.author.avatar} alt={article.author.displayName} width={40} height={40} className="object-cover" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <div>
              <span className="block text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                {article.author.displayName}
              </span>
              <span className="block text-xs text-slate-500">{article.author.title || 'Contributor'}</span>
            </div>
          </Link>

          <div className="flex items-center space-x-3 text-xs text-slate-500 font-medium">
            <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" /> Published {formatDate(article.publishedAt)}</span>
          </div>
        </div>
      </header>

      {/* Featured Banner Image */}
      {article.featuredImage && (
        <div className="max-w-4xl mx-auto aspect-[16/9] relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg bg-slate-950">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1000px"
            className="object-cover"
          />
        </div>
      )}

      {/* Main Article Content & Sidebar Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">
          {/* Table of Contents */}
          <TableOfContents htmlContent={article.content} />

          {/* Rendered Article Body */}
          <div
            className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Article Tags */}
          {article.tags.length > 0 && (
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Tagged Technologies:</span>
              <div className="flex flex-wrap gap-2">
                {article.tags.map(({ tag }) => (
                  <Link
                    key={tag.id}
                    href={`/tag/${tag.slug}`}
                    className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-brand-600 hover:text-white transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Social Share Bar */}
          <SocialShare title={article.title} url={fullUrl} />

          {/* Author Box Footer */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-white to-blue-50/60 text-slate-900 space-y-3 border border-indigo-200/90 shadow-xs dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:text-white dark:border-indigo-900/40">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-slate-800 font-bold text-base flex items-center justify-center overflow-hidden flex-shrink-0 border border-indigo-200 dark:border-slate-700">
                {article.author.avatar ? (
                  <Image src={article.author.avatar} alt={article.author.displayName} width={48} height={48} className="object-cover" />
                ) : (
                  <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Written by {article.author.displayName}</h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{article.author.title || 'Contributor'}</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {article.author.bio || 'Technical writer and software engineer delivering deep tutorials.'}
            </p>
            <Link
              href={`/author/${article.author.slug}`}
              className="inline-block text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline transition-colors"
            >
              View all articles by {article.author.displayName} &rarr;
            </Link>
          </div>
        </div>
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Category Info Widget */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 space-y-3 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
              <BookOpen className="w-4 h-4 mr-1.5 text-brand-600" /> Topic Spotlight
            </h3>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{article.category.name}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {article.category.description}
            </p>
            <Link href={`/category/${article.category.slug}`} className="inline-block text-xs font-bold text-brand-600 hover:underline">
              Explore category &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Related Articles Section */}
      {relatedArticles.length > 0 && (
        <section className="max-w-5xl mx-auto pt-10 border-t border-slate-200 dark:border-slate-800 space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Related Engineering Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <ArticleCard key={rel.id} article={rel} />
            ))}
          </div>
        </section>
      )}

    </article>
  );
}
