import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';

export async function GET(req: Request) {
  try {
    await requireAuth('ADMIN');
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'articles';

    let csvContent = '';
    let filename = `skillstuff-report-${type}-${Date.now()}.csv`;

    if (type === 'articles') {
      const articles = await prisma.article.findMany({
        include: { author: true, category: true },
        orderBy: { viewCount: 'desc' },
      });

      csvContent = 'ID,Title,Slug,Author,Category,Status,Views,ReadingTime,PublishedAt\n';
      for (const a of articles) {
        csvContent += `"${a.id}","${a.title.replace(/"/g, '""')}","${a.slug}","${a.author.displayName}","${a.category.name}","${a.status}",${a.viewCount},${a.readingTime},"${a.publishedAt || ''}"\n`;
      }
    } else if (type === 'subscribers') {
      const subs = await prisma.subscriber.findMany({ orderBy: { createdAt: 'desc' } });
      csvContent = 'ID,Email,Status,Source,CreatedAt\n';
      for (const s of subs) {
        csvContent += `"${s.id}","${s.email}","${s.status}","${s.source || ''}","${s.createdAt.toISOString()}"\n`;
      }
    } else {
      const views = await prisma.articleView.findMany({
        take: 500,
        include: { article: true },
        orderBy: { timestamp: 'desc' },
      });
      csvContent = 'ViewID,ArticleTitle,IPAddress,Referrer,DeviceType,Browser,Timestamp\n';
      for (const v of views) {
        csvContent += `"${v.id}","${v.article.title.replace(/"/g, '""')}","${v.ipAddress || ''}","${v.referrer || ''}","${v.deviceType || ''}","${v.browser || ''}","${v.timestamp.toISOString()}"\n`;
      }
    }

    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to generate CSV export report.' }, { status: 500 });
  }
}
