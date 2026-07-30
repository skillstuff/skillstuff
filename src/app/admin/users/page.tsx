import React from 'react';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';

export default async function AdminUsersPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/admin/login');

  const users = await prisma.user.findMany({
    include: { author: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Admin Users &amp; Roles (RBAC)</h1>
        <p className="text-xs text-slate-400 font-medium">Server-side role permissions: SUPER_ADMIN, ADMIN, EDITOR, AUTHOR</p>
      </div>

      <div className="bg-slate-900 rounded-card border border-slate-800 overflow-hidden shadow-brand-soft">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
            <tr>
              <th className="p-4">User Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Assigned Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-850 transition-colors">
                <td className="p-4 font-bold text-white flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-full bg-brand-gradient text-white font-bold flex items-center justify-center text-xs shadow-brand-soft">
                    {u.name.charAt(0)}
                  </div>
                  <span>{u.name}</span>
                </td>
                <td className="p-4 font-mono text-slate-300">{u.email}</td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold ${
                      u.role === 'SUPER_ADMIN'
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : u.role === 'ADMIN'
                        ? 'bg-brand-secondary/20 text-brand-accent border border-brand-secondary/30'
                        : u.role === 'EDITOR'
                        ? 'bg-sky-500/20 text-sky-400'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${u.isActive ? 'bg-[#10B981]/15 text-[#4DD6C2] border border-[#10B981]/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'}`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 text-slate-400 font-medium">{formatDate(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
