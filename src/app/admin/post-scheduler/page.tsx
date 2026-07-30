import React from 'react';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import PostSchedulerPage from '@/components/admin/scheduler/PostSchedulerPage';

export default async function Page() {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/admin/login');

  const [articles, categories, authors] = await Promise.all([
    prisma.article.findMany({
      include: {
        category: { select: { id: true, name: true } },
        author: { select: { id: true, displayName: true, avatar: true } },
      },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.category.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.author.findMany({ select: { id: true, displayName: true }, orderBy: { displayName: 'asc' } }),
  ]);

  return (
    <PostSchedulerPage
      initialArticles={articles as any}
      categories={categories}
      authors={authors}
    />
  );
}
