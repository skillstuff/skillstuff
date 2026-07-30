'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

import { useRouter } from 'next/navigation';

const EditorJSComponent = dynamic(
  () => import('@/components/admin/editor/EditorJSComponent'),
  {
    ssr: false,
    loading: () => (
      <div className="p-8 text-center text-xs text-slate-500 bg-slate-950 border border-slate-800 rounded-input animate-pulse">
        Loading Editor.js...
      </div>
    ),
  }
);

import {
  Save,
  Eye,
  Heading1,
  Heading2,
  Bold,
  Italic,
  Code,
  Quote,
  Minus,
  CheckCircle2,
  AlertCircle,
  Loader2,
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {isEditing ? 'Edit Article' : 'Create New Article'}
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Estimated reading time: <span className="text-brand-accent font-bold">{calculateReadingTime(form.content)} min</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => router.push('/admin/articles')}
            className="px-4 py-2.5 rounded-btn text-xs font-semibold border border-slate-800 text-slate-300 bg-slate-900 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
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
          className={`p-4 rounded-btn text-xs font-semibold flex items-center space-x-2.5 ${
            feedback.type === 'success'
              ? 'bg-[#10B981]/15 border border-[#10B981]/30 text-[#4DD6C2]'
              : 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 className="w-4.5 h-4.5" /> : <AlertCircle className="w-4.5 h-4.5" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Editor & Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor 2-Cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Slug */}
          <div className="bg-slate-900 rounded-card border border-slate-800 p-6 space-y-4 shadow-brand-soft">
            <div>
              <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2">
                Article Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mastering Next.js 15 App Router Architecture"
                value={form.title}
                onChange={handleTitleChange}
                className="w-full px-4 py-3 rounded-input border border-slate-800 bg-slate-950 text-white font-bold text-base placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2">
                SEO Canonical Slug *
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 font-mono font-bold">/blog/</span>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                  className="flex-1 px-3.5 py-2 rounded-input border border-slate-800 bg-slate-950 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2">
                Article Excerpt / Summary *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Short engaging summary of what readers will learn..."
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="w-full px-4 py-3 rounded-input border border-slate-800 bg-slate-950 text-white text-xs leading-relaxed placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
          </div>

          {/* Content Editor Panel */}
          <div className="bg-slate-900 rounded-card border border-slate-800 p-6 shadow-brand-soft space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`px-3.5 py-1.5 rounded-btn text-xs font-bold transition-all ${
                    activeTab === 'write' ? 'bg-brand-gradient text-white shadow-brand-soft' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Editor.js Writer
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3.5 py-1.5 rounded-btn text-xs font-bold flex items-center space-x-1.5 transition-all ${
                    activeTab === 'preview' ? 'bg-brand-gradient text-white shadow-brand-soft' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Preview</span>
                </button>
              </div>

              <span className="text-[11px] font-semibold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                Powered by Editor.js
              </span>
            </div>

            {activeTab === 'write' ? (
              <EditorJSComponent
                initialContent={form.content}
                onChange={(html) => setForm((prev) => ({ ...prev, content: html }))}
              />
            ) : (
              <div
                className="p-6 rounded-input border border-slate-800 bg-slate-950 prose dark:prose-invert max-w-none text-xs leading-relaxed"
                dangerouslySetInnerHTML={{ __html: form.content }}
              />
            )}
          </div>

        </div>

        {/* Right Settings Sidebar */}
        <div className="space-y-6">
          {/* Status & Publishing */}
          <div className="bg-slate-900 rounded-card border border-slate-800 p-6 space-y-4 shadow-brand-soft">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-3">
              Publishing Options
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-input border border-slate-800 bg-slate-950 text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            {form.status === 'SCHEDULED' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Schedule Date &amp; Time</label>
                <input
                  type="datetime-local"
                  value={form.scheduledAt || ''}
                  onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-input border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Category</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-input border border-slate-800 bg-slate-950 text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Author</label>
              <select
                value={form.authorId}
                onChange={(e) => setForm({ ...form, authorId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-input border border-slate-800 bg-slate-950 text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.displayName}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 space-y-2.5">
              <label className="flex items-center space-x-2.5 text-xs font-bold text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="rounded text-brand-primary focus:ring-brand-primary accent-brand-primary"
                />
                <Star className="w-4 h-4 text-[#F59E0B]" />
                <span>Featured Article</span>
              </label>

              <label className="flex items-center space-x-2.5 text-xs font-bold text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPopular}
                  onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
                  className="rounded text-brand-primary focus:ring-brand-primary accent-brand-primary"
                />
                <Flame className="w-4 h-4 text-rose-500" />
                <span>Popular Article</span>
              </label>
            </div>
          </div>

          {/* Tags Picker */}
          <div className="bg-slate-900 rounded-card border border-slate-800 p-6 space-y-3 shadow-brand-soft">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-3">
              Tags Selection
            </h3>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
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
                    className={`px-3 py-1.5 rounded-btn text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-brand-gradient text-white shadow-brand-soft'
                        : 'bg-slate-800 text-slate-300 border border-slate-700/80 hover:border-brand-primary hover:text-white'
                    }`}
                  >
                    #{t.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-slate-900 rounded-card border border-slate-800 p-6 space-y-3 shadow-brand-soft">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-3">
              Featured Image URL
            </h3>
            <input
              type="text"
              value={form.featuredImage}
              onChange={(e) => setForm({ ...form, featuredImage: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-input border border-slate-800 bg-slate-950 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
