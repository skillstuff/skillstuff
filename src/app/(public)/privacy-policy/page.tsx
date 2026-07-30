import React from 'react';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Privacy Policy',
  description: 'SkillStuff.com Privacy Policy outlining data collection, cookie usage, analytics transparency, and Google AdSense compliance.',
  canonicalUrl: 'https://skillstuff.com/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Privacy Policy</h1>
      <p className="text-xs text-slate-400">Last updated: July 30, 2026</p>

      <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-4 text-sm leading-relaxed">
        <p>
          At SkillStuff.com, available from https://skillstuff.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by SkillStuff.com and how we use it.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          When you subscribe to our newsletter or fill out a contact form, we collect your email address and optional contact metadata. We also automatically collect anonymized log files including IP addresses, browser types, Internet Service Providers (ISP), referring/exit pages, and clickstream analytics to optimize performance.
        </p>

        <h2>2. Cookies and Advertising (Google AdSense)</h2>
        <p>
          SkillStuff.com uses cookies to store information about visitors preferences, to record user-specific information on which pages the user accesses or visits, and to personalize web page content.
        </p>
        <p>
          Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to your website or other websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet. Users may opt out of personalized advertising by visiting Google Ads Settings.
        </p>

        <h2>3. Contact Us</h2>
        <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at support@skillstuff.com.</p>
      </div>
    </div>
  );
}
