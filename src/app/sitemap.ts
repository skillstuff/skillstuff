import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { getBaseUrl } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/category`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/tag`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/authors`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/cookie-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/sitemap`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.4 },
  ];

  try {
    if (!process.env.DATABASE_URL) {
      return staticRoutes;
    }

    // Fetch Published Articles
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
    });

    const articleRoutes: MetadataRoute.Sitemap = articles.map((art) => ({
      url: `${baseUrl}/blog/${art.slug}`,
      lastModified: art.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // Fetch Categories
    const categories = await prisma.category.findMany({ select: { slug: true, updatedAt: true } });
    const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: cat.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    // Fetch Tags
    const tags = await prisma.tag.findMany({ select: { slug: true, updatedAt: true } });
    const tagRoutes: MetadataRoute.Sitemap = tags.map((t) => ({
      url: `${baseUrl}/tag/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    // Fetch Authors
    const authors = await prisma.author.findMany({ select: { slug: true, updatedAt: true } });
    const authorRoutes: MetadataRoute.Sitemap = authors.map((a) => ({
      url: `${baseUrl}/author/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    return [...staticRoutes, ...articleRoutes, ...categoryRoutes, ...tagRoutes, ...authorRoutes];
  } catch (error) {
    console.error('Sitemap DB generation error:', error);
    return staticRoutes;
  }
}

