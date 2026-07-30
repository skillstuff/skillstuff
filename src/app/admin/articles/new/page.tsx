import React from 'react';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ArticleEditor from '@/components/admin/ArticleEditor';

export default async function NewArticlePage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/admin/login');

  const [categories, tags, authors] = await Promise.all([
    prisma.category.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.tag.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.author.findMany({ select: { id: true, displayName: true, avatar: true }, orderBy: { displayName: 'asc' } }),
  ]);

  return (
    <div className="space-y-6">
      <ArticleEditor
        categories={categories}
        tags={tags}
        authors={authors}
        isEditing={false}
      />
    </div>
  );
}
