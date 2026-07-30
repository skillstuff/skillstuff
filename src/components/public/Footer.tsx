import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Rss, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#E5E7EB] dark:border-slate-800 bg-[#0F172A] text-slate-300 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-[12px] p-0.5 bg-brand-gradient shadow-brand-soft group-hover:scale-105 transition-transform flex-shrink-0">
                <div className="w-full h-full rounded-[10px] overflow-hidden bg-white">
                  <Image
                    src="/logo.jpg"
                    alt="SkillStuff Logo"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                SkillStuff<span className="text-brand-gradient">.com</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400">
              Production-grade tutorials, software architecture patterns, and engineering guides for modern developers.
            </p>
            <div className="flex items-center space-x-3 text-xs text-slate-400 pt-1">
              <span className="inline-flex items-center px-3 py-1 rounded-[12px] text-[11px] font-semibold bg-[#10B981]/15 text-[#4DD6C2] border border-[#10B981]/30">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Privacy Compliant
              </span>
              <a href="/feed.xml" target="_blank" rel="noopener noreferrer" className="hover:text-[#35B8F1] flex items-center transition-colors font-medium">
                <Rss className="w-3.5 h-3.5 mr-1" /> RSS Feed
              </a>
            </div>
          </div>

          {/* Core Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Core Topics</h3>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/category/nextjs" className="text-slate-400 hover:text-white transition-colors">Next.js &amp; React</Link></li>
              <li><Link href="/category/architecture" className="text-slate-400 hover:text-white transition-colors">Software Architecture</Link></li>
              <li><Link href="/category/devops" className="text-slate-400 hover:text-white transition-colors">Cloud &amp; DevOps</Link></li>
              <li><Link href="/category/ai-engineering" className="text-slate-400 hover:text-white transition-colors">AI &amp; Machine Learning</Link></li>
              <li><Link href="/category/security" className="text-slate-400 hover:text-white transition-colors">Web Security</Link></li>
            </ul>
          </div>

          {/* Platform & Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Platform</h3>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/blog" className="text-slate-400 hover:text-white transition-colors">Article Archive</Link></li>
              <li><Link href="/authors" className="text-slate-400 hover:text-white transition-colors">Engineering Authors</Link></li>
              <li><Link href="/about" className="text-slate-400 hover:text-white transition-colors">About SkillStuff</Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact Editorial</Link></li>
              <li><Link href="/admin/login" className="text-[#35B8F1] font-semibold hover:underline flex items-center">Admin Portal <ArrowUpRight className="w-3 h-3 ml-0.5" /></Link></li>
            </ul>
          </div>

          {/* Legal Policies */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Legal &amp; Policy</h3>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/privacy-policy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookie-policy" className="text-slate-400 hover:text-white transition-colors">Cookie Policy</Link></li>
              <li><Link href="/disclaimer" className="text-slate-400 hover:text-white transition-colors">Editorial Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>&copy; {new Date().getFullYear()} SkillStuff.com. All rights reserved. Enterprise-grade engineering publication.</p>
          <div className="flex items-center space-x-6">
            <Link href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</Link>
            <Link href="/robots.txt" className="hover:text-white transition-colors">Robots</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
