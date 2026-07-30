import React from 'react';
import Link from 'next/link';
import { Home, Search, BookOpen, FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-brand-500/10 text-brand-600 font-extrabold text-2xl flex items-center justify-center mx-auto border border-brand-500/20">
        <FileQuestion className="w-8 h-8" />
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-brand-600">404 Error &bull; Page Not Found</span>
      <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
        Lost in Code? This Page Doesn&apos;t Exist.
      </h1>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
        The URL you requested could not be found or has been moved. Explore our latest technical guides below.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-md shadow-brand-600/30"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
        <Link
          href="/blog"
          className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center space-x-2 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
        >
          <BookOpen className="w-4 h-4" />
          <span>Browse Articles Archive</span>
        </Link>
      </div>
    </div>
  );
}
