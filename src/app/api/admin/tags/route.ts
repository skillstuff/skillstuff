import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { slugify } from '@/lib/utils';

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: { _count: { select: { articles: true } } },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(tags);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch tags.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth('EDITOR');
    const { name, slug, description } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Tag name is required.' }, { status: 400 });
    }

    const cleanSlug = slugify(slug || name);
    const existing = await prisma.tag.findUnique({ where: { slug: cleanSlug } });
    if (existing) {
      return NextResponse.json({ error: 'Tag slug already exists.' }, { status: 400 });
    }

    const tag = await prisma.tag.create({
      data: {
        name: name.trim(),
        slug: cleanSlug,
        description: description?.trim(),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        action: 'TAG_CREATE',
        entity: 'Tag',
        entityId: tag.id,
        details: `Created tag "${tag.name}"`,
      },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create tag.' }, { status: 500 });
  }
}
