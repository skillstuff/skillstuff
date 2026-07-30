'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, UserCheck, Menu, X, BookOpen, Layers, Tag, PhoneCall, Sparkles } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Articles', href: '/blog' },
    { label: 'Categories', href: '/category' },
    { label: 'Topics', href: '/tag' },
    { label: 'Authors', href: '/authors' },
    { label: 'About', href: '/about' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-brand-border dark:border-slate-800 bg-white/80 dark:bg-brand-dark/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-btn p-0.5 bg-brand-gradient shadow-brand-soft group-hover:shadow-brand-glow group-hover:scale-105 transition-all flex-shrink-0">
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
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tight text-brand-text dark:text-white group-hover:text-brand-primary transition-colors">
                  SkillStuff<span className="text-brand-gradient">.com</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400 -mt-1">
                  Engineering &amp; Software Publication
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-7 text-xs font-semibold text-slate-600 dark:text-slate-300">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative py-1.5 transition-colors ${
                      isActive
                        ? 'text-brand-primary dark:text-brand-accent font-bold'
                        : 'hover:text-brand-text dark:hover:text-white'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 rounded-full bg-brand-gradient" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Controls */}
            <div className="flex items-center space-x-3">
              {/* Search Trigger */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="flex items-center space-x-2.5 px-3.5 py-2 rounded-btn border border-brand-border dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500 hover:text-brand-text dark:hover:text-white hover:border-brand-secondary/40 transition-all text-xs font-medium shadow-2xs"
                aria-label="Search guides"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Search guides...</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-400">
                  ⌘K
                </kbd>
              </button>

              {/* Admin Portal Link */}
              <Link
                href="/admin"
                className="hidden sm:flex items-center space-x-1.5 px-4 py-2 rounded-btn bg-brand-gradient text-white text-xs font-semibold shadow-brand-soft hover:shadow-brand-glow hover:-translate-y-0.5 transition-all"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-btn text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-brand-border dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-btn text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-gradient text-white shadow-brand-soft'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2">
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-btn bg-brand-gradient text-white text-xs font-bold shadow-brand-soft"
              >
                <UserCheck className="w-4 h-4" />
                <span>Admin Console</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal overlay */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-dialog border border-brand-border dark:border-slate-800 p-6 shadow-brand-elevated space-y-4">
            <div className="flex items-center justify-between border-b border-brand-border dark:border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
                <Search className="w-4 h-4 mr-2 text-brand-primary" /> Search Engineering Knowledgebase
              </span>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form action="/search" method="GET" onSubmit={() => setSearchModalOpen(false)}>
              <div className="relative">
                <input
                  type="text"
                  name="q"
                  autoFocus
                  placeholder="Type to search tutorials, architecture patterns, Next.js guides..."
                  className="input-master pl-4 pr-10 py-3.5 text-sm"
                />
                <button type="submit" className="absolute right-3 top-3 p-1 text-brand-primary hover:scale-110 transition-transform">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>Press <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono">ESC</kbd> to exit</span>
              <Link href="/blog" onClick={() => setSearchModalOpen(false)} className="text-brand-primary hover:underline">
                Browse Full Catalog &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
