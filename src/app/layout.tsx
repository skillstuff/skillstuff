import type { Metadata } from 'next';
import './globals.css';
import { constructMetadata, generateWebsiteJsonLd } from '@/lib/seo';

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteJsonLd = generateWebsiteJsonLd();

  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-brand-dark text-slate-100 font-sans antialiased selection:bg-brand-primary selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
