import { promises as fs } from 'fs';
import path from 'path';
import { prisma } from './prisma';

export async function saveMediaFile(file: File, altText?: string, title?: string) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });

  const ext = path.extname(file.name) || '.jpg';
  const cleanBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  const filename = `${cleanBase}-${Date.now()}${ext}`;
  const filepath = path.join(uploadDir, filename);

  await fs.writeFile(filepath, buffer);

  const publicUrl = `/uploads/${filename}`;

  const media = await prisma.media.create({
    data: {
      name: file.name,
      url: publicUrl,
      filename,
      mimeType: file.type || 'image/jpeg',
      size: file.size,
      altText: altText || file.name,
      title: title || file.name,
      width: 1200,
      height: 800,
    },
  });

  return media;
}
