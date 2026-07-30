import React from 'react';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Disclaimer',
  description: 'SkillStuff.com Content & Technical Disclaimer.',
  canonicalUrl: 'https://skillstuff.com/disclaimer',
});

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Disclaimer</h1>
      <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-4 text-sm leading-relaxed">
        <p>The information provided on SkillStuff.com is for educational and technical guidance purposes only.</p>
        <p>While we strive to provide accurate, production-tested code and architecture patterns, software environments vary. Test all code in staging environments before deploying to production systems.</p>
      </div>
    </div>
  );
}
