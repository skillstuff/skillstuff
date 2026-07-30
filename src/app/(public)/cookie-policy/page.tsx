import React from 'react';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Cookie Policy',
  description: 'SkillStuff.com Cookie Policy.',
  canonicalUrl: 'https://skillstuff.com/cookie-policy',
});

export default function CookiePolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Cookie Policy</h1>
      <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-4 text-sm leading-relaxed">
        <p>SkillStuff.com uses essential cookies to manage authentication sessions, remember UI preferences, and process anonymized analytics metrics.</p>
        <p>Third-party analytics or performance tools may place cookies for site optimization. You can disable non-essential cookies through your web browser preferences at any time.</p>
      </div>
    </div>
  );
}
