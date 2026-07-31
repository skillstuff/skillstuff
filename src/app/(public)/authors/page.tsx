import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { constructMetadata } from '@/lib/seo';
import { Users, User, ArrowRight, Twitter, Github, Linkedin, Globe } from 'lucide-react';

export const metadata = constructMetadata({
  title: 'Authors & Engineering Contributors',
  description: 'Meet the senior software architects, DevOps specialists, and AI engineers writing for SkillStuff.com.',
  canonicalUrl: 'https://skillstuff.com/authors',
});

export default async function AuthorsListPage() {
  let authors: any[] = [];
  try {
    if (process.env.DATABASE_URL) {
      authors = await prisma.author.findMany({
        include: {
          _count: { select: { articles: true } },
        },
        orderBy: { displayName: 'asc' },
      });
    }
  } catch (error) {
    console.error('Failed to load authors:', error);
  }


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-400">
          <Users className="w-4 h-4" />
          <span>Editorial Team</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Meet Our Authors</h1>
        <p className="text-sm text-slate-300 max-w-xl">
          Experienced practitioners bringing real-world production engineering insight to every article.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((author) => (
          <div
            key={author.id}
            className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 flex flex-col justify-between space-y-4 hover:shadow-xl hover:border-brand-500/30 transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-full bg-brand-600/20 text-brand-600 font-bold flex items-center justify-center overflow-hidden flex-shrink-0">
                  {author.avatar ? (
                    <Image src={author.avatar} alt={author.displayName} width={56} height={56} className="object-cover" />
                  ) : (
                    <User className="w-7 h-7" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                    <Link href={`/author/${author.slug}`}>{author.displayName}</Link>
                  </h2>
                  <p className="text-xs text-brand-600 dark:text-brand-400 font-medium">{author.title || 'Contributor'}</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                {author.bio}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">
                {author._count.articles} Articles Published
              </span>

              <Link
                href={`/author/${author.slug}`}
                className="flex items-center space-x-1 text-xs font-bold text-brand-600 hover:underline"
              >
                <span>View Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
