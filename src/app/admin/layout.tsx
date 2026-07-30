import React from 'react';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthenticatedUser();

  // If user is accessing /admin/login, don't wrap with sidebar shell
  // We handle this inside sub-routes or check path
  if (!user) {
    // Return children directly so /admin/login can render without redirect loop
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 antialiased">
      <AdminSidebar userRole={user.role} userName={user.name} />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl">{children}</main>
    </div>
  );
}
