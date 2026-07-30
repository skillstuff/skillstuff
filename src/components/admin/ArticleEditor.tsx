'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Save,
  Eye,
  Sparkles,
  Heading1,
  Heading2,
  Bold,
  Italic,
  List,
  Code,
  Quote,
  Table,
  Video,
  Image as ImageIcon,
  Link as LinkIcon,
  Minus,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Star,
  Flame,
} from 'lucide-react';
import { calculateReadingTime, slugify } from '@/lib/utils';

export interface CategoryOption {
  id: string;
  name: string;
}

export interface TagOption {
  id: string;
  name: string;
}

export interface AuthorOption {
  id: string;
  displayName: string;
}

export interface ArticleFormValues {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  thumbnail: string;
  authorId: string;
  categoryId: string;
  tagIds: string[];
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
  scheduledAt?: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  isFeatured: boolean;
  isPopular: boolean;
}

interface ArticleEditorProps {
  initialData?: Partial<ArticleFormValues>;
  categories: CategoryOption[];
  tags: TagOption[];
  authors: AuthorOption[];
  isEditing?: boolean;
}

export default function ArticleEditor({
  initialData,
  categories,
  tags,
  authors,
  isEditing = false,
}: ArticleEditorProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'write' | 'preview' | 'seo'>('write');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [form, setForm] = useState<ArticleFormValues>({
    id: initialData?.id || '',
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '<h2>Introduction</h2>\n<p>Start writing your guide here...</p>',
    featuredImage: initialData?.featuredImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    thumbnail: initialData?.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80',
    authorId: initialData?.authorId || (authors[0]?.id ?? ''),
    categoryId: initialData?.categoryId || (categories[0]?.id ?? ''),
    tagIds: initialData?.tagIds || [],
    status: initialData?.status || 'DRAFT',
    scheduledAt: initialData?.scheduledAt || '',
    seoTitle: initialData?.seoTitle || '',
    seoDescription: initialData?.seoDescription || '',
    canonicalUrl: initialData?.canonicalUrl || '',
    isFeatured: initialData?.isFeatured || false,
    isPopular: initialData?.isPopular || false,
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setForm((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug || slugify(val),
      seoTitle: prev.seoTitle || `${val} | SkillStuff`,
    }));
  };

  const insertSnippet = (snippet: string) => {
    setForm((prev) => ({
      ...prev,
      content: prev.content + '\n' + snippet,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) {
      setFeedback({ type: 'error', message: 'Article title and slug are required.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const endpoint = isEditing ? `/api/admin/articles/${form.id}` : '/api/admin/articles';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          readingTime: calculateReadingTime(form.content),
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to save article.');
      }

      setFeedback({ type: 'success', message: 'Article saved successfully!' });
      setTimeout(() => {
        router.push('/admin/articles');
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isEditing ? 'Edit Article' : 'Create New Article'}
          </h1>
          <p className="text-xs text-slate-500">Estimated reading time: {calculateReadingTime(form.content)} min</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => router.push('/admin/articles')}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all shadow-md shadow-brand-600/30 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Update Article' : 'Save Article'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-center space-x-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Editor & Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor 2-Cols */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title & Slug */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 space-y-4 shadow-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Article Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mastering Next.js 15 App Router Architecture"
                value={form.title}
                onChange={handleTitleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                SEO Canonical Slug *
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 font-mono">/blog/</span>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Article Excerpt / Summary *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Short engaging summary of what readers will learn..."
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Content Editor Panel */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'write' ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Write Content
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all ${
                    activeTab === 'preview' ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 mr-1" /> Live Preview
                </button>
              </div>

              {/* Formatting Toolbar */}
              <div className="hidden sm:flex items-center space-x-1">
                <button type="button" onClick={() => insertSnippet('<h2>Section Heading</h2>')} title="H2 Heading" className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <Heading1 className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => insertSnippet('<h3>Subheading</h3>')} title="H3 Subheading" className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <Heading2 className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => insertSnippet('<strong>Bold Text</strong>')} title="Bold" className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <Bold className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => insertSnippet('<em>Italic Text</em>')} title="Italic" className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <Italic className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => insertSnippet('<pre><code class="language-typescript">\n// Code snippet here\n</code></pre>')} title="Code Block" className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <Code className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => insertSnippet('<blockquote><p>"Insightful quote here..."</p></blockquote>')} title="Quote" className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <Quote className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => insertSnippet('<hr />')} title="Separator" className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {activeTab === 'write' ? (
              <textarea
                rows={16}
                required
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            ) : (
              <div
                className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 prose dark:prose-invert max-w-none text-xs leading-relaxed"
                dangerouslySetInnerHTML={{ __html: form.content }}
              />
            )}
          </div>
        </div>

        {/* Right Settings Sidebar */}
        <div className="space-y-5">
          {/* Status & Publishing */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 pb-2">
              Publishing Options
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            {form.status === 'SCHEDULED' && (
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Schedule Date & Time</label>
                <input
                  type="datetime-local"
                  value={form.scheduledAt || ''}
                  onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Category</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Author</label>
              <select
                value={form.authorId}
                onChange={(e) => setForm({ ...form, authorId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.displayName}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 space-y-2">
              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <Star className="w-3.5 h-3.5 text-amber-500" />
                <span>Featured Article</span>
              </label>

              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPopular}
                  onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span>Popular Article</span>
              </label>
            </div>
          </div>

          {/* Tags Picker */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 space-y-3 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 pb-2">
              Tags Selection
            </h3>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
              {tags.map((t) => {
                const isSelected = form.tagIds.includes(t.id);
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => {
                      setForm((prev) => ({
                        ...prev,
                        tagIds: isSelected ? prev.tagIds.filter((id) => id !== t.id) : [...prev.tagIds, t.id],
                      }));
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      isSelected
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    #{t.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 space-y-3 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 pb-2">
              Featured Image URL
            </h3>
            <input
              type="text"
              value={form.featuredImage}
              onChange={(e) => setForm({ ...form, featuredImage: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
