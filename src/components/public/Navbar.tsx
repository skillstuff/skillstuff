'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Menu, X, Code2, UserCheck, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Keyboard shortcut ⌘K or Ctrl+K to open search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchModalOpen(false);
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'Categories', href: '/category' },
    { label: 'Tags', href: '/tag' },
    { label: 'Authors', href: '/authors' },
    { label: 'About', href: '/about' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded-xl overflow-hidden shadow-xs border border-slate-200/80 group-hover:scale-105 transition-transform flex-shrink-0">
                <Image
                  src="/logo.jpg"
                  alt="SkillStuff Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                  SkillStuff<span className="text-brand-600 dark:text-brand-400">.com</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest text-brand-600 dark:text-brand-400 -mt-1">
                  Engineering &amp; Software Publication
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`transition-colors py-1.5 border-b-2 ${
                      isActive
                        ? 'text-brand-600 dark:text-brand-400 border-brand-600 dark:border-brand-400 font-bold'
                        : 'border-transparent hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Controls */}
            <div className="flex items-center space-x-3">
              {/* Search Trigger */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors text-xs font-medium"
                aria-label="Search guides"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Search...</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-400">
                  ⌘K
                </kbd>
              </button>

              {/* Admin Portal Link */}
              <Link
                href="/admin"
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 dark:bg-slate-800 text-white hover:bg-brand-600 dark:hover:bg-brand-600 transition-colors shadow-sm"
              >
                <UserCheck className="w-3.5 h-3.5 text-brand-400" />
                <span>Admin</span>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-2">
            <nav className="flex flex-col space-y-1 text-sm font-medium text-slate-800 dark:text-slate-200">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/contact" className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                Contact
              </Link>
              <Link href="/admin" className="px-3 py-2.5 rounded-lg bg-brand-600 text-white font-bold flex items-center justify-between mt-2">
                <span>Admin Dashboard</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center border-b border-slate-200 dark:border-slate-800 px-4 py-3.5">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input
                type="text"
                autoFocus
                placeholder="Search articles by topic, framework, or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-sm font-medium"
              />
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </form>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between text-xs text-slate-500">
              <span>Popular: <strong className="text-brand-600">Next.js</strong>, <strong className="text-brand-600">Docker</strong>, <strong className="text-brand-600">PostgreSQL</strong></span>
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="px-3 py-1 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-500 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
