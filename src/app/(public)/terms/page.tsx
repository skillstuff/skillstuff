import React from 'react';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Terms & Conditions',
  description: 'SkillStuff.com Terms & Conditions of use.',
  canonicalUrl: 'https://skillstuff.com/terms',
});

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Terms &amp; Conditions</h1>
      <p className="text-xs text-slate-400">Effective Date: July 30, 2026</p>

      <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-4 text-sm leading-relaxed">
        <p>Welcome to SkillStuff.com. By accessing or using this website, you agree to comply with and be bound by these Terms and Conditions.</p>
        <h2>1. Intellectual Property</h2>
        <p>All articles, code tutorials, graphics, and architectural diagrams are owned by SkillStuff.com unless explicitly stated otherwise.</p>
        <h2>2. Permitted Use</h2>
        <p>You may read, bookmark, and reference code snippets from our articles for educational and software engineering projects.</p>
      </div>
    </div>
  );
}
