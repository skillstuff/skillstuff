import React from 'react';
import Link from 'next/link';
import { Code2, ShieldCheck, Rss, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-slate-900 text-slate-300 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold shadow-md shadow-brand-500/20">
                <Code2 className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                SkillStuff<span className="text-brand-400">.com</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400">
              High-quality production-grade tutorials, architecture patterns, and engineering guides for modern developers.
            </p>
            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3 mr-1" /> AdSense Compliant
              </span>
              <a href="/feed.xml" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 flex items-center transition-colors">
                <Rss className="w-3.5 h-3.5 mr-1" /> RSS Feed
              </a>
            </div>
          </div>

          {/* Core Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Categories</h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/category/web-development" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Web Development</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </Link>
              </li>
              <li>
                <Link href="/category/software-architecture" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Software Architecture</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </Link>
              </li>
              <li>
                <Link href="/category/devops-cloud" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>DevOps & Cloud</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </Link>
              </li>
              <li>
                <Link href="/category/ai-ml" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>AI & Machine Learning</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </Link>
              </li>
              <li>
                <Link href="/category/cybersecurity" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Cybersecurity</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Navigation</h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/" className="hover:text-white transition-colors">Home Page</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">All Articles</Link></li>
              <li><Link href="/authors" className="hover:text-white transition-colors">Authors & Contributors</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Mandatory Legal & Policies */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Legal Policies</h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              <li><Link href="/sitemap" className="hover:text-white transition-colors">HTML Sitemap</Link></li>
              <li><a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">XML Sitemap Index</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} SkillStuff.com. All rights reserved. Built for technical excellence.</p>
          <div className="flex items-center space-x-6">
            <span>Server Time: UTC</span>
            <span>Version: 1.0.0-LTS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
