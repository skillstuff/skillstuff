import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ArticleEditor from '@/components/admin/ArticleEditor';

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/admin/login');

  const { id } = await params;

  const [article, categories, tags, authors] = await Promise.all([
    prisma.article.findUnique({
      where: { id },
      include: { tags: true },
    }),
    prisma.category.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.tag.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.author.findMany({ select: { id: true, displayName: true }, orderBy: { displayName: 'asc' } }),
  ]);

  if (!article) notFound();

  const initialValues = {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    featuredImage: article.featuredImage || '',
    thumbnail: article.thumbnail || '',
    authorId: article.authorId,
    categoryId: article.categoryId,
    tagIds: article.tags.map((t) => t.tagId),
    status: article.status as any,
    scheduledAt: article.scheduledAt ? article.scheduledAt.toISOString().slice(0, 16) : '',
    seoTitle: article.seoTitle || '',
    seoDescription: article.seoDescription || '',
    canonicalUrl: article.canonicalUrl || '',
    isFeatured: article.isFeatured,
    isPopular: article.isPopular,
  };

  return (
    <div className="space-y-6">
      <ArticleEditor
        initialData={initialValues}
        categories={categories}
        tags={tags}
        authors={authors}
        isEditing={true}
      />
    </div>
  );
}
