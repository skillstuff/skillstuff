import React from 'react';
import { getAuthenticatedUser } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthenticatedUser();

  // If user is accessing /admin/login, don't wrap with sidebar shell
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-slate-100 antialiased">
      <AdminSidebar userRole={user.role} userName={user.name} />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full">{children}</main>
    </div>
  );
}
