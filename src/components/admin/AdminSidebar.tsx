'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Tag,
  Users,
  Image as ImageIcon,
  BarChart3,
  FileSpreadsheet,
  UserCheck,
  LogOut,
  Code2,
  ExternalLink,
} from 'lucide-react';

interface AdminSidebarProps {
  userRole: string;
  userName: string;
}

export default function AdminSidebar({ userRole, userName }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, role: 'AUTHOR' },
    { label: 'Articles', href: '/admin/articles', icon: FileText, role: 'AUTHOR' },
    { label: 'Categories', href: '/admin/categories', icon: FolderTree, role: 'EDITOR' },
    { label: 'Tags', href: '/admin/tags', icon: Tag, role: 'EDITOR' },
    { label: 'Authors', href: '/admin/authors', icon: Users, role: 'ADMIN' },
    { label: 'Media Library', href: '/admin/media', icon: ImageIcon, role: 'AUTHOR' },
    { label: 'Users & Roles', href: '/admin/users', icon: UserCheck, role: 'ADMIN' },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3, role: 'ADMIN' },
    { label: 'Reports', href: '/admin/reports', icon: FileSpreadsheet, role: 'ADMIN' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800 flex-shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <Link href="/admin" className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-xs border border-slate-700 flex-shrink-0">
            <Image
              src="/logo.jpg"
              alt="SkillStuff Logo"
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-extrabold text-lg text-white tracking-tight">SkillStuff</span>
            <span className="block text-[10px] text-brand-400 font-bold uppercase tracking-wider">Admin Console</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 pb-2">
          Management
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 pb-2">
          Quick Links
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800/80 hover:text-white transition-all"
        >
          <span>View Live Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </nav>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 truncate">
            <div className="w-8 h-8 rounded-full bg-brand-600/30 text-brand-400 border border-brand-500/40 flex items-center justify-center font-bold text-xs flex-shrink-0">
              {userName.charAt(0)}
            </div>
            <div className="truncate">
              <span className="block text-xs font-bold text-white truncate">{userName}</span>
              <span className="block text-[10px] text-brand-400 font-semibold uppercase">{userRole}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
