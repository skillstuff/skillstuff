'use client';

import React, { useState } from 'react';
import { Share2, Check, Copy, Twitter, Linkedin, Facebook } from 'lucide-react';

export default function SocialShare({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  return (
    <div className="flex items-center space-x-2 py-4 border-y border-slate-200 dark:border-slate-800 my-6">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center mr-2">
        <Share2 className="w-3.5 h-3.5 mr-1 text-brand-600" /> Share:
      </span>

      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-sky-500 hover:text-white text-slate-600 dark:text-slate-300 transition-colors"
        aria-label="Share on X / Twitter"
      >
        <Twitter className="w-4 h-4" />
      </a>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-600 dark:text-slate-300 transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </a>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-700 hover:text-white text-slate-600 dark:text-slate-300 transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook className="w-4 h-4" />
      </a>

      <button
        onClick={handleCopy}
        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-600 hover:text-white text-slate-600 dark:text-slate-300 text-xs font-semibold transition-colors"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        <span>{copied ? 'Copied!' : 'Copy Link'}</span>
      </button>
    </div>
  );
}
