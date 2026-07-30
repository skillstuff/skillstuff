import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { calculateReadingTime, slugify } from '@/lib/utils';

export async function GET(req: Request) {
  try {
    await requireAuth('AUTHOR');
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const categoryId = searchParams.get('categoryId');
    const query = searchParams.get('q');

    const where: any = {};
    if (status && status !== 'ALL') where.status = status;
    if (categoryId) where.categoryId = categoryId;
    if (query) {
      where.OR = [
        { title: { contains: query } },
        { excerpt: { contains: query } },
        { content: { contains: query } },
      ];
    }

    const articles = await prisma.article.findMany({
      where,
      include: {
        category: true,
        author: true,
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(articles);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth('AUTHOR');
    const body = await req.json();

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
      status = 'DRAFT',
      scheduledAt,
      seoTitle,
      seoDescription,
      canonicalUrl,
      isFeatured = false,
      isPopular = false,
    } = body;

    if (!title || !slug || !excerpt || !content || !categoryId) {
      return NextResponse.json({ error: 'Title, slug, excerpt, content, and category are required.' }, { status: 400 });
    }

    const cleanSlug = slugify(slug);
    const existing = await prisma.article.findUnique({ where: { slug: cleanSlug } });
    if (existing) {
      return NextResponse.json({ error: 'An article with this slug already exists.' }, { status: 400 });
    }

    const targetAuthorId = authorId || user.author?.id;
    if (!targetAuthorId) {
      return NextResponse.json({ error: 'Valid Author profile required for creating articles.' }, { status: 400 });
    }

    const readingTime = calculateReadingTime(content);
    const publishedAt = status === 'PUBLISHED' ? new Date() : null;
    const scheduledDate = status === 'SCHEDULED' && scheduledAt ? new Date(scheduledAt) : null;

    const article = await prisma.article.create({
      data: {
        title: title.trim(),
        slug: cleanSlug,
        excerpt: excerpt.trim(),
        content,
        featuredImage,
        thumbnail,
        authorId: targetAuthorId,
        categoryId,
        status,
        publishedAt,
        scheduledAt: scheduledDate,
        readingTime,
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || excerpt,
        canonicalUrl: canonicalUrl || `https://skillstuff.com/blog/${cleanSlug}`,
        isFeatured,
        isPopular,
        tags: {
          create: tagIds.map((tId: string) => ({ tagId: tId })),
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        action: 'ARTICLE_CREATE',
        entity: 'Article',
        entityId: article.id,
        details: `Created article "${article.title}" with status ${status}`,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error: any) {
    console.error('Article creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create article.' }, { status: 500 });
  }
}
