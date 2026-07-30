import { prisma } from '@/lib/prisma';
import { getBaseUrl } from '@/lib/seo';

export async function GET() {
  const baseUrl = getBaseUrl();
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    include: { author: true, category: true },
    orderBy: { publishedAt: 'desc' },
    take: 20,
  });

  const rssItems = articles
    .map(
      (art) => `
    <item>
      <title><![CDATA[${art.title}]]></title>
      <link>${baseUrl}/blog/${art.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${art.slug}</guid>
      <pubDate>${art.publishedAt?.toUTCString() || art.createdAt.toUTCString()}</pubDate>
      <description><![CDATA[${art.excerpt}]]></description>
      <author><![CDATA[${art.author.displayName}]]></author>
      <category><![CDATA[${art.category.name}]]></category>
    </item>`
    )
    .join('');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SkillStuff.com — Tech &amp; Skills Engineering</title>
    <link>${baseUrl}</link>
    <description>Production-ready engineering guides, tutorials, Next.js deep dives, DevOps, AI, and cybersecurity.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
