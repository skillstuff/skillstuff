import { prisma } from './prisma';

export interface ViewMetadata {
  ipAddress?: string | null;
  referrer?: string | null;
  userAgent?: string | null;
}

export function detectDeviceType(userAgent?: string | null): string {
  if (!userAgent) return 'Desktop';
  const ua = userAgent.toLowerCase();
  if (/mobile|android|iphone|ipad|phone/.test(ua)) return 'Mobile';
  if (/tablet|ipad/.test(ua)) return 'Tablet';
  return 'Desktop';
}

export function detectBrowser(userAgent?: string | null): string {
  if (!userAgent) return 'Unknown';
  const ua = userAgent.toLowerCase();
  if (ua.includes('chrome')) return 'Chrome';
  if (ua.includes('firefox')) return 'Firefox';
  if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari';
  if (ua.includes('edge')) return 'Edge';
  return 'Other';
}

export async function trackArticleView(articleId: string, metadata: ViewMetadata) {
  try {
    const deviceType = detectDeviceType(metadata.userAgent);
    const browser = detectBrowser(metadata.userAgent);

    await prisma.$transaction([
      prisma.articleView.create({
        data: {
          articleId,
          ipAddress: metadata.ipAddress || null,
          referrer: metadata.referrer || null,
          userAgent: metadata.userAgent || null,
          deviceType,
          browser,
          country: 'United States', // Mock IP geo fallback
        },
      }),
      prisma.article.update({
        where: { id: articleId },
        data: { viewCount: { increment: 1 } },
      }),
    ]);
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
}

export async function getAnalyticsSummary() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [totalViews, todayViews, weekViews, monthViews, totalSubscribers, totalArticles, publishedArticles] =
    await Promise.all([
      prisma.articleView.count(),
      prisma.articleView.count({ where: { timestamp: { gte: startOfDay } } }),
      prisma.articleView.count({ where: { timestamp: { gte: startOfWeek } } }),
      prisma.articleView.count({ where: { timestamp: { gte: startOfMonth } } }),
      prisma.subscriber.count({ where: { status: 'SUBSCRIBED' } }),
      prisma.article.count(),
      prisma.article.count({ where: { status: 'PUBLISHED' } }),
    ]);

  return {
    totalViews,
    todayViews,
    weekViews,
    monthViews,
    totalSubscribers,
    totalArticles,
    publishedArticles,
  };
}
