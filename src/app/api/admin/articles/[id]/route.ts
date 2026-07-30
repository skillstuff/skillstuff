import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, canModifyArticle } from '@/lib/rbac';
import { calculateReadingTime, slugify } from '@/lib/utils';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth('AUTHOR');
    const { id } = await params;

    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        category: true,
        author: true,
        tags: { include: { tag: true } },
      },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found.' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 401 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth('AUTHOR');
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Article not found.' }, { status: 404 });
    }

    const canModify = await canModifyArticle(existing.authorId);
    if (!canModify) {
      return NextResponse.json({ error: 'Forbidden: You can only edit your own articles.' }, { status: 403 });
    }

    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      thumbnail,
      authorId,
      categoryId,
      tagIds = [],
      status,
      scheduledAt,
      seoTitle,
      seoDescription,
      canonicalUrl,
      isFeatured,
      isPopular,
    } = body;

    const cleanSlug = slugify(slug || title);
    const readingTime = calculateReadingTime(content);
    const publishedAt = status === 'PUBLISHED' && !existing.publishedAt ? new Date() : existing.publishedAt;
    const scheduledDate = status === 'SCHEDULED' && scheduledAt ? new Date(scheduledAt) : null;

    // Delete previous tags and recreate
    await prisma.articleTag.deleteMany({ where: { articleId: id } });

    const updated = await prisma.article.update({
      where: { id },
      data: {
        title: title.trim(),
        slug: cleanSlug,
        excerpt: excerpt.trim(),
        content,
        featuredImage,
        thumbnail,
        authorId: authorId || existing.authorId,
        categoryId: categoryId || existing.categoryId,
        status: status || existing.status,
        publishedAt,
        scheduledAt: scheduledDate,
        readingTime,
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || excerpt,
        canonicalUrl: canonicalUrl || `https://skillstuff.com/blog/${cleanSlug}`,
        isFeatured: isFeatured !== undefined ? isFeatured : existing.isFeatured,
        isPopular: isPopular !== undefined ? isPopular : existing.isPopular,
        tags: {
          create: tagIds.map((tId: string) => ({ tagId: tId })),
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        action: 'ARTICLE_UPDATE',
        entity: 'Article',
        entityId: id,
        details: `Updated article "${updated.title}"`,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Article update error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update article.' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth('AUTHOR');
    const { id } = await params;

    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Article not found.' }, { status: 404 });
    }

    const canModify = await canModifyArticle(existing.authorId);
    if (!canModify) {
      return NextResponse.json({ error: 'Forbidden: You can only delete your own articles.' }, { status: 403 });
    }

    await prisma.article.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        action: 'ARTICLE_DELETE',
        entity: 'Article',
        entityId: id,
        details: `Deleted article "${existing.title}"`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete article.' }, { status: 500 });
  }
}
