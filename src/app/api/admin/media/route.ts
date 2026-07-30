import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { saveMediaFile } from '@/lib/upload';

export async function GET() {
  try {
    await requireAuth('AUTHOR');
    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(media);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch media library.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth('AUTHOR');
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const altText = (formData.get('altText') as string) || '';
    const title = (formData.get('title') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    const media = await saveMediaFile(file, altText, title);

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        action: 'MEDIA_UPLOAD',
        entity: 'Media',
        entityId: media.id,
        details: `Uploaded file "${media.filename}"`,
      },
    });

    return NextResponse.json(media, { status: 201 });
  } catch (error: any) {
    console.error('Media upload error:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload media.' }, { status: 500 });
  }
}
