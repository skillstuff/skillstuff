import React from 'react';
import { constructMetadata } from '@/lib/seo';
import { Code2, Target, Zap, ShieldCheck } from 'lucide-react';

export const metadata = constructMetadata({
  title: 'About SkillStuff.com',
  description: 'SkillStuff.com is a production-focused technology platform providing deep technical guides on Next.js, Cloud DevOps, AI, and Software Architecture.',
  canonicalUrl: 'https://skillstuff.com/about',
});

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-bold flex items-center justify-center mx-auto shadow-lg shadow-brand-600/30">
          <Code2 className="w-6 h-6" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About SkillStuff<span className="text-brand-600">.com</span>
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
          Empowering software engineers, architects, and technical leaders with actionable, production-ready engineering tutorials.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-center">
          <Zap className="w-6 h-6 text-brand-600 mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Fast & Actionable</h3>
          <p className="text-xs text-slate-500">Concise, production-tested code walkthroughs without fluff.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-center">
          <Target className="w-6 h-6 text-indigo-500 mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Deep Technical Accuracy</h3>
          <p className="text-xs text-slate-500">Written by experienced architects and cloud engineers.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-center">
          <ShieldCheck className="w-6 h-6 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Security Focused</h3>
          <p className="text-xs text-slate-500">Best practices for zero-trust, RBAC, and web defense.</p>
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-4">
        <h2>Our Mission</h2>
        <p>
          SkillStuff.com was created to bridge the gap between basic coding tutorials and complex real-world production engineering. We focus on modern full-stack development, serverless architecture, containerization, AI system design, and performance engineering.
        </p>
      </div>
    </div>
  );
}
