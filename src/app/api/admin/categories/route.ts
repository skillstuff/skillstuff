import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { slugify } from '@/lib/utils';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { articles: true } } },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch categories.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth('EDITOR');
    const { name, slug, description, metaTitle, metaDescription } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Category name is required.' }, { status: 400 });
    }

    const cleanSlug = slugify(slug || name);
    const existing = await prisma.category.findUnique({ where: { slug: cleanSlug } });
    if (existing) {
      return NextResponse.json({ error: 'Category slug already exists.' }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: cleanSlug,
        description: description?.trim(),
        metaTitle: metaTitle || `${name} Tutorials & Engineering Guides | SkillStuff`,
        metaDescription: metaDescription || description,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        action: 'CATEGORY_CREATE',
        entity: 'Category',
        entityId: category.id,
        details: `Created category "${category.name}"`,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create category.' }, { status: 500 });
  }
}
