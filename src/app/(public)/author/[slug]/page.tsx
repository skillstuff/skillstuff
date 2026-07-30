import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import ArticleCard from '@/components/public/ArticleCard';
import { constructMetadata } from '@/lib/seo';
import { User, Twitter, Github, Linkedin, Globe, BookOpen } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = await prisma.author.findUnique({ where: { slug } });
  if (!author) return constructMetadata({ title: 'Author Not Found', noIndex: true });

  return constructMetadata({
    title: `${author.displayName} — Engineering Author & Contributor`,
    description: author.bio || `Read articles authored by ${author.displayName} on SkillStuff.com.`,
    canonicalUrl: `https://skillstuff.com/author/${author.slug}`,
  });
}

export default async function AuthorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = await prisma.author.findUnique({
    where: { slug },
    include: {
      articles: {
        where: { status: 'PUBLISHED' },
        include: { category: true, author: true },
        orderBy: { publishedAt: 'desc' },
      },
    },
  });

  if (!author) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Author Hero Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className="w-20 h-20 rounded-full bg-brand-600/30 text-brand-400 font-bold text-2xl flex items-center justify-center overflow-hidden border-2 border-brand-500/40 flex-shrink-0">
            {author.avatar ? (
              <Image src={author.avatar} alt={author.displayName} width={80} height={80} className="object-cover" />
            ) : (
              <User className="w-10 h-10" />
            )}
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Author Profile</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold">{author.displayName}</h1>
            <p className="text-xs text-slate-400 font-medium">{author.title || 'Senior Software Architect'}</p>
            <p className="text-xs text-slate-300 max-w-xl pt-1 leading-relaxed">{author.bio}</p>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex items-center space-x-3 pt-2 md:pt-0">
          {author.twitter && (
            <a href={author.twitter} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
          )}
          {author.github && (
            <a href={author.github} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white transition-colors">
              <Github className="w-4 h-4" />
            </a>
          )}
          {author.linkedin && (
            <a href={author.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Author's Articles Grid */}
      <div className="space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-brand-600" /> Articles Authored by {author.displayName} ({author.articles.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {author.articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}
