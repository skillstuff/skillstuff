import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://skillstuff.com';
const SITE_NAME = 'SkillStuff';
const SITE_DESCRIPTION = 'Production-ready technology and skills blogging platform. Learn Next.js, React, Architecture, Cloud DevOps, AI engineering, and web security.';

export function getBaseUrl(): string {
  return SITE_URL;
}

export function constructMetadata({
  title = `${SITE_NAME} — Tech Guides & Software Engineering Tutorials`,
  description = SITE_DESCRIPTION,
  image = `${SITE_URL}/og-default.jpg`,
  canonicalUrl,
  noIndex = false,
  type = 'website',
  publishedTime,
  authors,
}: {
  title?: string;
  description?: string;
  image?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  type?: 'website' | 'article';
  publishedTime?: string;
  authors?: string[];
} = {}): Metadata {
  const metaTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title: metaTitle,
    description,
    keywords: [
      'SkillStuff',
      'Next.js',
      'React',
      'TypeScript',
      'Web Development',
      'DevOps',
      'Software Architecture',
      'AI Engineering',
      'Cybersecurity',
      'Coding Tutorials',
    ],
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl || SITE_URL,
    },
    openGraph: {
      title: metaTitle,
      description,
      url: canonicalUrl || SITE_URL,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      type,
      ...(publishedTime && { publishedTime }),
      ...(authors && { authors }),
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description,
      images: [image],
      creator: '@skillstuff',
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateArticleJsonLd(article: {
  title: string;
  excerpt: string;
  slug: string;
  featuredImage?: string | null;
  publishedAt?: Date | null;
  updatedAt: Date;
  author: { displayName: string; slug: string; avatar?: string | null };
  category: { name: string };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    url: `${SITE_URL}/blog/${article.slug}`,
    image: article.featuredImage || `${SITE_URL}/og-default.jpg`,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: article.author.displayName,
      url: `${SITE_URL}/author/${article.author.slug}`,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    articleSection: article.category.name,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${article.slug}`,
    },
  };
}

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function generateWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}
