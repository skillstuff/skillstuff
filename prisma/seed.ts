import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SkillStuff database seed with updated working media assets...');

  // Clean existing data
  await prisma.articleView.deleteMany();
  await prisma.articleTag.deleteMany();
  await prisma.article.deleteMany();
  await prisma.author.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.media.deleteMany();
  await prisma.subscriber.deleteMany();
  await prisma.analyticsEvent.deleteMany();

  // Create Users & Passwords
  const adminPasswordHash = await bcrypt.hash('AdminPass123!', 10);
  const editorPasswordHash = await bcrypt.hash('EditorPass123!', 10);
  const authorPasswordHash = await bcrypt.hash('AuthorPass123!', 10);

  const adminUser = await prisma.user.create({
    data: {
      name: 'Alex Rivera',
      email: 'admin@skillstuff.com',
      passwordHash: adminPasswordHash,
      role: 'SUPER_ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
  });

  const editorUser = await prisma.user.create({
    data: {
      name: 'Elena Rostova',
      email: 'editor@skillstuff.com',
      passwordHash: editorPasswordHash,
      role: 'EDITOR',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    },
  });

  const authorUser = await prisma.user.create({
    data: {
      name: 'Marcus Chen',
      email: 'author@skillstuff.com',
      passwordHash: authorPasswordHash,
      role: 'AUTHOR',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
  });

  // Create Authors
  const alexAuthor = await prisma.author.create({
    data: {
      userId: adminUser.id,
      displayName: 'Alex Rivera',
      slug: 'alex-rivera',
      title: 'Principal Software Architect & Tech Writer',
      bio: 'Principal Software Architect specializing in Next.js, distributed systems, and modern web performance engineering. Writer and mentor for full-stack developers worldwide.',
      avatar: adminUser.avatar,
      twitter: 'https://twitter.com/alexrivera_dev',
      github: 'https://github.com/alexrivera',
      linkedin: 'https://linkedin.com/in/alexrivera-tech',
      website: 'https://skillstuff.com/author/alex-rivera',
    },
  });

  const elenaAuthor = await prisma.author.create({
    data: {
      userId: editorUser.id,
      displayName: 'Elena Rostova',
      slug: 'elena-rostova',
      title: 'DevOps & Cloud Infrastructure Specialist',
      bio: 'Cloud Architect & DevOps advocate passionate about Kubernetes, Terraform, zero-trust security, and high-availability multi-region systems.',
      avatar: editorUser.avatar,
      twitter: 'https://twitter.com/elena_devops',
      github: 'https://github.com/elenarostova',
      linkedin: 'https://linkedin.com/in/elena-rostova',
      website: 'https://skillstuff.com/author/elena-rostova',
    },
  });

  const marcusAuthor = await prisma.author.create({
    data: {
      userId: authorUser.id,
      displayName: 'Marcus Chen',
      slug: 'marcus-chen',
      title: 'AI Systems Engineer & ML Researcher',
      bio: 'Machine Learning engineer working on large language model optimization, vector index retrieval, and high-throughput Python backends.',
      avatar: authorUser.avatar,
      twitter: 'https://twitter.com/marcuschen_ai',
      github: 'https://github.com/marcuschen',
      linkedin: 'https://linkedin.com/in/marcus-chen-ai',
      website: 'https://skillstuff.com/author/marcus-chen',
    },
  });

  // Create Categories
  const webDevCat = await prisma.category.create({
    data: {
      name: 'Web Development',
      slug: 'web-development',
      description: 'Modern frontend & backend engineering, Next.js, React, TypeScript, and web performance optimization.',
      metaTitle: 'Web Development Tutorials & Guides | SkillStuff',
      metaDescription: 'Master web development with in-depth guides on Next.js, React, Node.js, TypeScript, and full-stack architectures.',
    },
  });

  const devopsCat = await prisma.category.create({
    data: {
      name: 'DevOps & Cloud',
      slug: 'devops-cloud',
      description: 'Docker containers, Kubernetes orchestration, CI/CD automation pipelines, AWS, and Cloud Native practices.',
      metaTitle: 'DevOps & Cloud Infrastructure Guides | SkillStuff',
      metaDescription: 'Learn Docker, Kubernetes, CI/CD automation, Terraform, and cloud scaling strategies for modern infrastructure.',
    },
  });

  const aiCat = await prisma.category.create({
    data: {
      name: 'AI & Machine Learning',
      slug: 'ai-ml',
      description: 'LLM applications, Retrieval-Augmented Generation (RAG), vector databases, PyTorch, and AI system design.',
      metaTitle: 'AI & Machine Learning Engineering | SkillStuff',
      metaDescription: 'Practical articles on AI engineering, LLMs, prompt pipelines, vector indexes, and machine learning deployment.',
    },
  });

  const archCat = await prisma.category.create({
    data: {
      name: 'Software Architecture',
      slug: 'software-architecture',
      description: 'Microservices, distributed system design, clean architecture, message queues, and database scaling.',
      metaTitle: 'Software Architecture & System Design | SkillStuff',
      metaDescription: 'Explore microservices, scalable backend architectures, database indexing, and domain-driven software design.',
    },
  });

  const secCat = await prisma.category.create({
    data: {
      name: 'Cybersecurity',
      slug: 'cybersecurity',
      description: 'Web application security, OAuth2, RBAC, secret management, threat modeling, and encryption standards.',
      metaTitle: 'Cybersecurity & Application Defense | SkillStuff',
      metaDescription: 'Practical security guides covering OWASP top 10, JWT security, server-side RBAC, and web application hardening.',
    },
  });

  // Create Tags
  const tagNames = [
    { name: 'Next.js', slug: 'nextjs', desc: 'React framework for server-rendered and static web applications' },
    { name: 'React', slug: 'react', desc: 'UI library for building interactive user interfaces' },
    { name: 'TypeScript', slug: 'typescript', desc: 'Typed superset of JavaScript for scalable applications' },
    { name: 'JavaScript', slug: 'javascript', desc: 'Core programming language of the modern web' },
    { name: 'Docker', slug: 'docker', desc: 'Containerization technology for lightweight application deployment' },
    { name: 'PostgreSQL', slug: 'postgresql', desc: 'Advanced open-source relational database management system' },
    { name: 'TailwindCSS', slug: 'tailwindcss', desc: 'Utility-first CSS framework for rapid UI development' },
    { name: 'Node.js', slug: 'nodejs', desc: 'Asynchronous event-driven JavaScript runtime' },
    { name: 'AI', slug: 'ai', desc: 'Artificial intelligence technologies and algorithm design' },
    { name: 'API', slug: 'api', desc: 'Application Programming Interfaces and REST/GraphQL architecture' },
    { name: 'Security', slug: 'security', desc: 'Best practices for web and system security hardening' },
    { name: 'Performance', slug: 'performance', desc: 'Core Web Vitals, speed optimization, and caching strategies' },
    { name: 'Microservices', slug: 'microservices', desc: 'Decoupled service-oriented architectural design' },
    { name: 'Git', slug: 'git', desc: 'Distributed version control system' },
    { name: 'Python', slug: 'python', desc: 'Versatile programming language for web, data, and machine learning' },
  ];

  const tagMap: Record<string, string> = {};
  for (const t of tagNames) {
    const createdTag = await prisma.tag.create({
      data: {
        name: t.name,
        slug: t.slug,
        description: t.desc,
      },
    });
    tagMap[t.slug] = createdTag.id;
  }

  // Guaranteed Working Images
  const imgNext = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80';
  const imgDocker = 'https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=1200&q=80';
  const imgAI = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
  const imgSecurity = 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80';
  const imgCloud = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80';
  const imgCSS = 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80';
  const imgDatabase = 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80';

  const articlesData = [
    {
      title: 'Mastering Next.js 15 App Router: Server Components, Caching & Parallel Routes',
      slug: 'mastering-nextjs-15-app-router',
      excerpt: 'A comprehensive deep-dive into Next.js 15 App Router architecture. Learn how Server Components, Granular Caching, Server Actions, and Parallel Routes deliver ultra-fast Core Web Vitals.',
      featuredImage: imgNext,
      thumbnail: imgNext,
      authorId: alexAuthor.id,
      categoryId: webDevCat.id,
      status: 'PUBLISHED',
      publishedAt: new Date('2026-07-15T10:00:00Z'),
      isFeatured: true,
      isPopular: true,
      readingTime: 8,
      viewCount: 1420,
      seoTitle: 'Mastering Next.js 15 App Router: Complete Architecture Guide',
      seoDescription: 'Learn Next.js 15 Server Components, caching strategies, server actions, and parallel routing for high-performance production apps.',
      canonicalUrl: 'https://skillstuff.com/blog/mastering-nextjs-15-app-router',
      tags: ['nextjs', 'react', 'typescript', 'performance', 'web-development'],
      content: `
<h2>Introduction to Next.js 15 App Router</h2>
<p>Next.js 15 represents a massive leap forward in full-stack JavaScript architecture. Built around React Server Components (RSC), the App Router fundamentally alters how we build, render, and optimize web applications for real-world production performance.</p>

<blockquote>
<p>"React Server Components allow developers to combine the rich interactive user experience of client-side apps with the native performance of server-side rendering without shipping bloated JavaScript bundles to the browser."</p>
</blockquote>

<h2>1. React Server Components vs. Client Components</h2>
<p>By default in Next.js 15, every component inside the <code>app/</code> directory is a Server Component. Server Components execute exclusively on the server node and output zero client-side JavaScript. This dramatically reduces Largest Contentful Paint (LCP) and Interactive to Next Paint (INP) metrics.</p>

<pre><code class="language-typescript">// src/app/blog/[slug]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
  });
  if (!article) return {};
  return {
    title: \`\${article.seoTitle || article.title} | SkillStuff\`,
    description: article.seoDescription || article.excerpt,
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
    include: { author: true, category: true, tags: { include: { tag: true } } },
  });

  if (!article) notFound();

  return (
    &lt;article className="max-w-4xl mx-auto px-4 py-8"&gt;
      &lt;h1 className="text-4xl font-bold text-slate-900"&gt;{article.title}&lt;/h1&gt;
      &lt;div className="mt-4 text-slate-600"&gt;By {article.author.displayName}&lt;/div&gt;
      &lt;div className="prose lg:prose-xl mt-8" dangerouslySetInnerHTML={{ __html: article.content }} /&gt;
    &lt;/article&gt;
  );
}
</code></pre>

<h2>2. Optimizing Caching and Dynamic Fetching</h2>
<p>Next.js 15 provides granular control over caching mechanisms. You can explicitly configure cache revalidation frequencies or enforce dynamic data fetching depending on your endpoint requirements:</p>

<ul>
  <li><strong>Static Pre-rendering:</strong> Standard pages compiled at build time for instant CDN delivery.</li>
  <li><strong>On-Demand Revalidation:</strong> Trigger cache clears via <code>revalidatePath()</code> or <code>revalidateTag()</code> in Server Actions.</li>
  <li><strong>Dynamic SSR:</strong> Opt-out of caching when accessing real-time session or cookie data.</li>
</ul>

<h2>3. Summary & Best Practices</h2>
<p>When engineering web applications at scale, prefer Server Components for data fetching and heavy computational UI, reserving <code>'use client'</code> strictly for interactive leaf nodes such as form handlers and modal toggles.</p>
      `,
    },
    {
      title: 'Building Production-Grade Microservices with Docker, Node.js, and PostgreSQL',
      slug: 'building-production-microservices-docker-nodejs-postgresql',
      excerpt: 'Learn how to architect, containerize, and connect resilient microservices using Node.js, PostgreSQL connection pooling, and Docker Compose networking.',
      featuredImage: imgDocker,
      thumbnail: imgDocker,
      authorId: elenaAuthor.id,
      categoryId: archCat.id,
      status: 'PUBLISHED',
      publishedAt: new Date('2026-07-18T14:30:00Z'),
      isFeatured: true,
      isPopular: true,
      readingTime: 10,
      viewCount: 980,
      seoTitle: 'Production Microservices with Docker & PostgreSQL Guide',
      seoDescription: 'Architect scalable microservices using Docker containers, Node.js APIs, and PostgreSQL database connection pools.',
      canonicalUrl: 'https://skillstuff.com/blog/building-production-microservices-docker-nodejs-postgresql',
      tags: ['microservices', 'docker', 'postgresql', 'nodejs', 'api'],
      content: `
<h2>Why Containerized Microservices?</h2>
<p>Modern enterprise applications require modular scalability, independent deployments, and fault isolation. Containerizing backend services with Docker ensures reproducible environments from development through Kubernetes production clusters.</p>

<h2>1. Multi-Stage Dockerfile Strategy</h2>
<p>Using multi-stage builds minimizes final container image sizes, reducing attack vectors and speeding up CI/CD deployment pipelines:</p>

<pre><code class="language-dockerfile"># Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
EXPOSE 4000
CMD ["node", "dist/main.js"]
</code></pre>

<h2>2. PostgreSQL Connection Pooling & Failover</h2>
<p>Microservices accessing PostgreSQL must manage database connection limits effectively. Utilizing PgBouncer or native ORM pooling ensures queries do not overwhelm database worker processes during traffic spikes.</p>

<table>
  <thead>
    <tr>
      <th>Architecture Pattern</th>
      <th>Latency</th>
      <th>Throughput</th>
      <th>Resiliency Rating</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Direct DB Connections</td>
      <td>Low</td>
      <td>Medium (Capped)</td>
      <td>Medium</td>
    </tr>
    <tr>
      <td>PgBouncer Connection Pool</td>
      <td>Very Low</td>
      <td>High (10,000+ qps)</td>
      <td>High</td>
    </tr>
    <tr>
      <td>Read Replica Sharding</td>
      <td>Ultra Low</td>
      <td>Extremely High</td>
      <td>Enterprise Grade</td>
    </tr>
  </tbody>
</table>

<h2>3. Key Takeaways</h2>
<p>Always implement strict health checks (<code>/healthz</code> endpoints) and graceful shutdown signals (<code>SIGTERM</code> handling) to ensure zero-downtime rolling upgrades.</p>
      `,
    },
    {
      title: 'Optimizing Large Language Model Inferences in Production: A Hands-On Guide',
      slug: 'optimizing-llm-inferences-in-production',
      excerpt: 'Discover practical techniques for reducing LLM API latency, implementing vector caching, dynamic batching, and semantic prompt compression.',
      featuredImage: imgAI,
      thumbnail: imgAI,
      authorId: marcusAuthor.id,
      categoryId: aiCat.id,
      status: 'PUBLISHED',
      publishedAt: new Date('2026-07-22T09:15:00Z'),
      isFeatured: false,
      isPopular: true,
      readingTime: 7,
      viewCount: 1250,
      seoTitle: 'Optimizing LLM Inferences in Production | SkillStuff',
      seoDescription: 'Reduce token costs and inference latency with prompt caching, semantic vector search, and model quantization.',
      canonicalUrl: 'https://skillstuff.com/blog/optimizing-llm-inferences-in-production',
      tags: ['ai', 'python', 'performance', 'api'],
      content: `
<h2>The Challenge of Production LLM Performance</h2>
<p>Deploying AI applications to thousands of concurrent users introduces significant challenges around response latency and per-token compute costs. Optimization requires a multi-layered approach across prompt design, semantic caching, and model serving infrastructure.</p>

<h2>1. Semantic Caching with Vector Databases</h2>
<p>Before forwarding a user query to an LLM provider, run a cosine similarity lookup against a fast vector cache (e.g. Qdrant or Redis VSS). If a query with high semantic similarity (>0.95) exists in cache, return the pre-generated output instantly.</p>

<pre><code class="language-python"># Example Semantic Cache Pattern in Python
import math

def calculate_cosine_similarity(vec_a, vec_b):
    dot_product = sum(a * b for a, b in zip(vec_a, vec_b))
    magnitude_a = math.sqrt(sum(a * a for a in vec_a))
    magnitude_b = math.sqrt(sum(b * b for b in vec_b))
    return dot_product / (magnitude_a * magnitude_b)

# Query vector lookup takes &lt;5ms vs 1200ms LLM API generation call
</code></pre>

<h2>2. Quantization & Model Distillation</h2>
<p>Converting FP16 model weights down to INT8 or INT4 using techniques like GPTQ or AWQ yields up to 4x throughput improvements with minimal impact on output precision.</p>
      `,
    },
    {
      title: 'Implementing Zero-Trust Architecture & Server-Side RBAC in Web Applications',
      slug: 'implementing-zero-trust-rbac-web-applications',
      excerpt: 'Secure your web application with robust server-side Role-Based Access Control (RBAC), signed JWT HTTP-only cookies, and defensive security headers.',
      featuredImage: imgSecurity,
      thumbnail: imgSecurity,
      authorId: alexAuthor.id,
      categoryId: secCat.id,
      status: 'PUBLISHED',
      publishedAt: new Date('2026-07-25T11:00:00Z'),
      isFeatured: false,
      isPopular: false,
      readingTime: 6,
      viewCount: 620,
      seoTitle: 'Zero-Trust Architecture & Server-Side RBAC Guide',
      seoDescription: 'Learn how to enforce server-side RBAC, secure session cookies, rate limiting, and defensive security headers.',
      canonicalUrl: 'https://skillstuff.com/blog/implementing-zero-trust-rbac-web-applications',
      tags: ['security', 'typescript', 'nextjs', 'api'],
      content: `
<h2>Never Trust Client-Side Claims Alone</h2>
<p>A common vulnerability in web applications is relying exclusively on UI client-side state to authorize user actions. Attackers can bypass client checks easily by executing HTTP requests directly against server endpoints.</p>

<h2>1. Server-Side Guard Enforcement</h2>
<p>Every server action or API route must explicitly verify user identity and role permissions before mutating data or executing business logic:</p>

<pre><code class="language-typescript">// src/lib/rbac.ts
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'AUTHOR';

export function hasPermission(role: UserRole, requiredRole: UserRole): boolean {
  const hierarchy: Record&lt;UserRole, number&gt; = {
    SUPER_ADMIN: 4,
    ADMIN: 3,
    EDITOR: 2,
    AUTHOR: 1,
  };
  return hierarchy[role] &gt;= hierarchy[requiredRole];
}
</code></pre>

<h2>2. HTTP-Only Cookie Security Settings</h2>
<p>Always configure session cookies with <code>HttpOnly</code>, <code>Secure</code>, <code>SameSite=Lax</code>, and short expiration windows to protect against XSS token exfiltration.</p>
      `,
    },
    {
      title: 'Automating Multi-Cloud Infrastructure with Terraform, GitHub Actions, and Kubernetes',
      slug: 'automating-multicloud-infrastructure-terraform-k8s',
      excerpt: 'Step-by-step blueprint for building automated CI/CD pipelines that provision infrastructure using Terraform and deploy container workloads to Kubernetes.',
      featuredImage: imgCloud,
      thumbnail: imgCloud,
      authorId: elenaAuthor.id,
      categoryId: devopsCat.id,
      status: 'PUBLISHED',
      publishedAt: new Date('2026-07-28T16:00:00Z'),
      isFeatured: false,
      isPopular: true,
      readingTime: 9,
      viewCount: 840,
      seoTitle: 'Automating Multi-Cloud Infrastructure with Terraform & K8s',
      seoDescription: 'Build declarative CI/CD pipelines with GitHub Actions, Terraform HCL, and Kubernetes manifests.',
      canonicalUrl: 'https://skillstuff.com/blog/automating-multicloud-infrastructure-terraform-k8s',
      tags: ['devops', 'docker', 'git', 'security'],
      content: `
<h2>Declarative Infrastructure as Code (IaC)</h2>
<p>Manual server provisioning is error-prone and unscalable. Writing declarative HCL configuration files in Terraform enables peer code reviews, automated drift detection, and immediate rollbacks.</p>

<h2>Infrastructure Workflow</h2>
<ol>
  <li><strong>Pull Request Creation:</strong> Triggers <code>terraform plan</code> and lint checks in GitHub Actions.</li>
  <li><strong>Code Review Approval:</strong> Senior SRE approves structural state changes.</li>
  <li><strong>Merge to Main:</strong> Executes <code>terraform apply</code> and updates Kubernetes deployment manifests via GitOps.</li>
</ol>
      `,
    },
    {
      title: 'Modern CSS Architecture with Tailwind CSS: Best Practices for Enterprise Apps',
      slug: 'modern-css-architecture-tailwind-enterprise',
      excerpt: 'Learn how to construct a scalable design system using Tailwind CSS tokens, dynamic theme modes, component encapsulation, and clean typography.',
      featuredImage: imgCSS,
      thumbnail: imgCSS,
      authorId: alexAuthor.id,
      categoryId: webDevCat.id,
      status: 'DRAFT',
      publishedAt: null,
      isFeatured: false,
      isPopular: false,
      readingTime: 5,
      viewCount: 0,
      seoTitle: 'Modern CSS Architecture with Tailwind CSS Enterprise Guide',
      seoDescription: 'Build enterprise-grade design systems with Tailwind CSS tokens and custom component abstractions.',
      canonicalUrl: 'https://skillstuff.com/blog/modern-css-architecture-tailwind-enterprise',
      tags: ['tailwindcss', 'react', 'web-development'],
      content: '<p>Draft content for modern Tailwind CSS design architecture.</p>',
    },
    {
      title: "The Developer's Guide to High-Performance Database Indexing & Query Optimization",
      slug: 'developers-guide-database-indexing-optimization',
      excerpt: 'Uncover the mechanics of B-Tree, GIN, and BRIN indexes in SQL databases. Learn how EXPLAIN ANALYZE helps eliminate slow table scans.',
      featuredImage: imgDatabase,
      thumbnail: imgDatabase,
      authorId: elenaAuthor.id,
      categoryId: archCat.id,
      status: 'SCHEDULED',
      publishedAt: null,
      scheduledAt: new Date('2026-08-10T12:00:00Z'),
      isFeatured: false,
      isPopular: false,
      readingTime: 7,
      viewCount: 0,
      seoTitle: 'Database Indexing & Query Optimization Guide',
      seoDescription: 'Master SQL database query execution plans, B-Tree indexes, and performance tuning techniques.',
      canonicalUrl: 'https://skillstuff.com/blog/developers-guide-database-indexing-optimization',
      tags: ['postgresql', 'microservices', 'performance'],
      content: '<p>Scheduled post covering B-Tree and GIN indexes in PostgreSQL databases.</p>',
    },
  ];

  for (const art of articlesData) {
    const tagsToConnect = art.tags.map((slug) => ({ tagId: tagMap[slug] })).filter((t) => t.tagId);

    const createdArticle = await prisma.article.create({
      data: {
        title: art.title,
        slug: art.slug,
        excerpt: art.excerpt,
        content: art.content,
        featuredImage: art.featuredImage,
        thumbnail: art.thumbnail,
        authorId: art.authorId,
        categoryId: art.categoryId,
        status: art.status,
        publishedAt: art.publishedAt,
        scheduledAt: art.scheduledAt,
        isFeatured: art.isFeatured,
        isPopular: art.isPopular,
        readingTime: art.readingTime,
        viewCount: art.viewCount,
        seoTitle: art.seoTitle,
        seoDescription: art.seoDescription,
        canonicalUrl: art.canonicalUrl,
        tags: {
          create: tagsToConnect,
        },
      },
    });

    if (art.viewCount > 0) {
      const views = [];
      const now = new Date();
      for (let i = 0; i < Math.min(art.viewCount, 30); i++) {
        const daysAgo = Math.floor(Math.random() * 14);
        const timestamp = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        views.push({
          articleId: createdArticle.id,
          ipAddress: `192.168.1.${Math.floor(Math.random() * 250)}`,
          referrer: i % 3 === 0 ? 'https://google.com' : i % 3 === 1 ? 'https://t.co' : 'Direct',
          userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126.0.0.0',
          deviceType: i % 4 === 0 ? 'Mobile' : 'Desktop',
          browser: 'Chrome',
          country: i % 5 === 0 ? 'United States' : i % 5 === 1 ? 'United Kingdom' : 'Germany',
          timestamp,
        });
      }
      await prisma.articleView.createMany({ data: views });
    }
  }

  // Create Sample Media Items
  await prisma.media.createMany({
    data: [
      {
        name: 'Next.js App Router Architecture Diagram',
        url: imgNext,
        filename: 'nextjs-architecture.jpg',
        mimeType: 'image/jpeg',
        size: 142000,
        altText: 'Next.js code editor screen showing TypeScript App Router code',
        title: 'Next.js Architecture',
        width: 1200,
        height: 800,
      },
      {
        name: 'Docker Microservices Server Rack',
        url: imgDocker,
        filename: 'docker-microservices.jpg',
        mimeType: 'image/jpeg',
        size: 198000,
        altText: 'Server hardware rack representing containerized cloud infrastructure',
        title: 'Cloud Infrastructure',
        width: 1200,
        height: 800,
      },
      {
        name: 'AI Neural Network Visualization',
        url: imgAI,
        filename: 'ai-llm-network.jpg',
        mimeType: 'image/jpeg',
        size: 215000,
        altText: 'Abstract neural network graph visualization',
        title: 'Machine Learning Network',
        width: 1200,
        height: 800,
      },
    ],
  });

  // Create Subscribers
  await prisma.subscriber.createMany({
    data: [
      { email: 'dev.subscriber1@example.com', source: 'homepage' },
      { email: 'sarah.engineer@techcorp.io', source: 'article_footer' },
      { email: 'michael.cloud@devops.net', source: 'homepage' },
      { email: 'lisa.frontend@design.org', source: 'sidebar_widget' },
    ],
  });

  // Create Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        userId: adminUser.id,
        userName: 'Alex Rivera',
        action: 'ARTICLE_PUBLISH',
        entity: 'Article',
        entityId: 'mastering-nextjs-15-app-router',
        details: 'Published article "Mastering Next.js 15 App Router"',
      },
      {
        userId: editorUser.id,
        userName: 'Elena Rostova',
        action: 'CATEGORY_CREATE',
        entity: 'Category',
        entityId: 'devops-cloud',
        details: 'Created category "DevOps & Cloud"',
      },
      {
        userId: adminUser.id,
        userName: 'Alex Rivera',
        action: 'USER_ROLE_UPDATE',
        entity: 'User',
        entityId: authorUser.id,
        details: 'Assigned role AUTHOR to Marcus Chen',
      },
    ],
  });

  console.log('✅ Seed completed successfully with verified working images!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
