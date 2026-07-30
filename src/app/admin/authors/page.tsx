import React from 'react';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { User, ArrowUpRight } from 'lucide-react';

export default async function AdminAuthorsPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/admin/login');

  const authors = await prisma.author.findMany({
    include: {
      user: { select: { email: true, role: true } },
      _count: { select: { articles: true } },
    },
    orderBy: { displayName: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Author Profiles</h1>
        <p className="text-xs text-slate-400">Manage writer bios, avatars, and social links</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((auth) => (
          <div key={auth.id} className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-brand-600/20 text-brand-400 font-bold flex items-center justify-center overflow-hidden flex-shrink-0">
                {auth.avatar ? (
                  <Image src={auth.avatar} alt={auth.displayName} width={48} height={48} className="object-cover" />
                ) : (
                  <User className="w-6 h-6" />
                )}
              </div>
              <div className="truncate">
                <h3 className="font-bold text-white text-sm truncate">{auth.displayName}</h3>
                <span className="block text-[10px] text-brand-400 uppercase font-semibold">{auth.user?.role || 'AUTHOR'}</span>
                <span className="block text-[11px] text-slate-400 truncate">{auth.user?.email || ''}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{auth.bio}</p>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-400">{auth._count?.articles || 0} Articles</span>
              <a href={`/author/${auth.slug}`} target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline flex items-center">
                <span>Public Profile</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
