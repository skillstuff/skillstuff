import React from 'react';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserCheck, Shield } from 'lucide-react';
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
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Admin Users &amp; Roles (RBAC)</h1>
        <p className="text-xs text-slate-400">Server-side role permissions: SUPER_ADMIN, ADMIN, EDITOR, AUTHOR</p>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
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
              <tr key={u.id} className="hover:bg-slate-850">
                <td className="p-4 font-bold text-white flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-brand-600/30 text-brand-400 font-bold flex items-center justify-center text-xs">
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
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        : u.role === 'EDITOR'
                        ? 'bg-sky-500/20 text-sky-400'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 text-slate-400">{formatDate(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
