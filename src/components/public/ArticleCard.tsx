import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, Calendar, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export interface ArticleCardData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string | null;
  publishedAt?: Date | string | null;
  readingTime: number;
  viewCount: number;
  isFeatured?: boolean;
  isPopular?: boolean;
  category: { name: string; slug: string };
  author: { displayName: string; slug: string; avatar?: string | null };
}

export default function ArticleCard({ article }: { article: ArticleCardData }) {
  return (
    <article className="group flex flex-col rounded-card border border-brand-border dark:border-slate-800 bg-white dark:bg-slate-800 overflow-hidden shadow-brand-soft hover:shadow-brand-glow hover:border-brand-secondary/40 hover:-translate-y-1 transition-all duration-300">
      {/* Image Container */}
      <div className="aspect-[16/9] relative overflow-hidden bg-slate-100 dark:bg-slate-950">
        <Image
          src={article.featuredImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />
        <div className="absolute top-3.5 left-3.5 flex items-center space-x-2">
          <Link
            href={`/category/${article.category.slug}`}
            className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-brand-gradient text-white rounded-btn shadow-brand-soft hover:scale-105 transition-all"
          >
            {article.category.name}
          </Link>
          {article.isFeatured && (
            <span className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-brand-success text-slate-950 rounded-btn shadow-sm">
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Content Container (24px padding) */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center space-x-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center text-slate-500 dark:text-slate-400"><Calendar className="w-3 h-3 mr-1 text-brand-secondary" />{formatDate(article.publishedAt)}</span>
            <span>&bull;</span>
            <span className="flex items-center text-slate-500 dark:text-slate-400"><Clock className="w-3 h-3 mr-1 text-brand-secondary" />{article.readingTime} min read</span>
          </div>

          <h3 className="text-base font-extrabold text-brand-text dark:text-white group-hover:text-brand-primary dark:group-hover:text-brand-accent transition-colors line-clamp-2 leading-snug tracking-tight">
            <Link href={`/blog/${article.slug}`}>{article.title}</Link>
          </h3>

          <p className="text-xs text-brand-muted dark:text-slate-400 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        {/* Footer Author & Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-brand-border dark:border-slate-800 text-xs">
          <Link href={`/author/${article.author.slug}`} className="flex items-center space-x-2.5 text-slate-700 dark:text-slate-300 hover:text-brand-primary transition-colors">
            <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center overflow-hidden text-[10px] flex-shrink-0 border border-slate-200 dark:border-slate-700">
              {article.author.avatar ? (
                <Image src={article.author.avatar} alt={article.author.displayName} width={28} height={28} className="object-cover" />
              ) : (
                <User className="w-3.5 h-3.5" />
              )}
            </div>
            <span className="font-semibold text-xs truncate max-w-[130px] text-brand-text dark:text-slate-200">{article.author.displayName}</span>
          </Link>

          <span className="flex items-center text-slate-400 text-[11px] font-mono font-medium">
            <Eye className="w-3.5 h-3.5 mr-1 text-slate-400" />{article.viewCount}
          </span>
        </div>
      </div>
    </article>
  );
}
