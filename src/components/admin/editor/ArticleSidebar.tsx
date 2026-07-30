/* eslint-disable @next/next/no-img-element */
'use client';


import React, { useState, useMemo, useRef } from 'react';
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  Trash2,
  Calendar,
  User,
  Tag as TagIcon,
  FolderPlus,
  Plus,
  X,
  Check,
  Globe,
  Lock,
  Users,
  Eye,
  Save,
  Send,
  HelpCircle,
  BarChart2,
  Search,
  AlertTriangle,
  CheckCircle,
  FileText,
  Clock,
  Layers,
  Bookmark,
  MessageSquare,
  Pin,
  Flame,
  Star,
  RefreshCw,
} from 'lucide-react';
import type { CategoryOption, TagOption, AuthorOption, ArticleFormValues } from '../ArticleEditor';

interface ArticleSidebarProps {
  form: ArticleFormValues;
  setForm: React.Dispatch<React.SetStateAction<ArticleFormValues>>;
  categories: CategoryOption[];
  tags: TagOption[];
  authors: (AuthorOption & { avatar?: string | null })[];
  isSubmitting: boolean;
  onPublish: (e: React.FormEvent) => void;
  onSaveDraft: () => void;
  onPreview: () => void;
  isEditing?: boolean;
}

export default function ArticleSidebar({
  form,
  setForm,
  categories,
  tags,
  authors,
  isSubmitting,
  onPublish,
  onSaveDraft,
  onPreview,
  isEditing = false,
}: ArticleSidebarProps) {
  // State for new inline additions
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [showAddTagInput, setShowAddTagInput] = useState(false);
  const [tagSearchQuery, setTagSearchQuery] = useState('');
  const [showMediaLibraryModal, setShowMediaLibraryModal] = useState(false);
  const [lastSavedText, setLastSavedText] = useState('Draft Saved');
  const [isUnsaved, setIsUnsaved] = useState(false);
  const [aiLoadingAction, setAiLoadingAction] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Author search state
  const [authorSearch, setAuthorSearch] = useState('');
  const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);

  // Computed Article Statistics from HTML / Content
  const stats = useMemo(() => {
    const rawText = form.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = rawText ? rawText.split(/\s+/).length : 0;
    const characters = rawText.length;
    const paragraphs = (form.content.match(/<p>/gi) || []).length || (rawText ? rawText.split('\n\n').length : 0);
    const headings = (form.content.match(/<h[1-6]/gi) || []).length;
    const images = (form.content.match(/<img/gi) || []).length;
    const links = (form.content.match(/<a /gi) || []).length;
    const codeBlocks = (form.content.match(/<pre/gi) || []).length;
    const readingTime = Math.max(1, Math.ceil(words / 200));

    return {
      words,
      characters,
      paragraphs,
      headings,
      images,
      links,
      codeBlocks,
      readingTime,
    };
  }, [form.content]);

  // Dynamic SEO Score Calculation
  const seoScore = useMemo(() => {
    let score = 0;
    if (form.title.length >= 20 && form.title.length <= 65) score += 25;
    else if (form.title.length > 0) score += 10;

    if (form.seoDescription.length >= 70 && form.seoDescription.length <= 160) score += 25;
    else if (form.seoDescription.length > 0) score += 10;

    if (form.slug && form.slug.length > 3) score += 20;
    if (form.featuredImage) score += 15;
    if (stats.words >= 300) score += 15;
    else if (stats.words > 0) score += 5;

    return Math.min(100, score);
  }, [form.title, form.seoDescription, form.slug, form.featuredImage, stats.words]);

  // SEO Warnings & Checklist
  const seoWarnings = useMemo(() => {
    const warnings = [];
    if (!form.seoDescription) {
      warnings.push({ type: 'warning', text: 'Meta Description Missing' });
    } else if (form.seoDescription.length < 70) {
      warnings.push({ type: 'info', text: 'Meta Description too short (<70 chars)' });
    } else {
      warnings.push({ type: 'success', text: 'Meta Description optimal' });
    }

    if (!form.title) {
      warnings.push({ type: 'warning', text: 'Article Title Missing' });
    } else if (form.title.length > 65) {
      warnings.push({ type: 'warning', text: 'Title Too Long (>65 chars)' });
    } else {
      warnings.push({ type: 'success', text: 'Title length optimal' });
    }

    if (!form.featuredImage) {
      warnings.push({ type: 'warning', text: 'Featured Image Missing' });
    } else {
      warnings.push({ type: 'success', text: 'Featured Image set' });
    }

    return warnings;
  }, [form.title, form.seoDescription, form.featuredImage]);

  // Selected Author Object
  const selectedAuthor = useMemo(() => {
    return authors.find((a) => a.id === form.authorId) || authors[0];
  }, [authors, form.authorId]);

  // Tags Multi-Select Filtering
  const availableTags = useMemo(() => {
    return tags.filter(
      (t) =>
        !form.tagIds.includes(t.id) &&
        t.name.toLowerCase().includes(tagSearchQuery.toLowerCase())
    );
  }, [tags, form.tagIds, tagSearchQuery]);

  // File Drop Handler
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setForm((prev) => ({
            ...prev,
            featuredImage: event.target?.result as string,
            thumbnail: event.target?.result as string,
          }));
          setIsUnsaved(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setForm((prev) => ({
            ...prev,
            featuredImage: event.target?.result as string,
            thumbnail: event.target?.result as string,
          }));
          setIsUnsaved(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // AI Assistant Handlers
  const handleAiAction = (actionKey: string) => {
    setAiLoadingAction(actionKey);
    setTimeout(() => {
      if (actionKey === 'summary') {
        const text = form.content.replace(/<[^>]*>/g, ' ').slice(0, 160).trim();
        setForm((prev) => ({ ...prev, excerpt: text + '...' }));
      } else if (actionKey === 'seo') {
        setForm((prev) => ({
          ...prev,
          seoTitle: `${prev.title || 'Mastering Modern Architecture'} | SkillStuff`,
          seoDescription: prev.excerpt || prev.content.replace(/<[^>]*>/g, ' ').slice(0, 150),
        }));
      } else if (actionKey === 'title') {
        if (form.title) {
          setForm((prev) => ({ ...prev, title: `The Ultimate Guide to ${prev.title}` }));
        }
      } else if (actionKey === 'tags') {
        if (tags.length > 0) {
          const firstThree = tags.slice(0, 3).map((t) => t.id);
          setForm((prev) => ({ ...prev, tagIds: Array.from(new Set([...prev.tagIds, ...firstThree])) }));
        }
      } else if (actionKey === 'faq') {
        const faqSnippet = `\n<h2>Frequently Asked Questions</h2>\n<h3>What are the key takeaways?</h3>\n<p>This article covers best practice implementation techniques.</p>`;
        setForm((prev) => ({ ...prev, content: prev.content + faqSnippet }));
      }
      setAiLoadingAction(null);
      setIsUnsaved(true);
    }, 600);
  };

  return (
    <aside className="w-full lg:w-[360px] flex-shrink-0 space-y-4 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto pr-1 select-none font-sans text-xs">
      {/* SECTION 1 — PUBLISHING */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-4 space-y-3.5 shadow-lg relative">
        <div className="flex items-center justify-between border-b border-[#334155] pb-2.5">
          <div className="flex items-center space-x-2">
            <Send className="w-3.5 h-3.5 text-[#3B82F6]" />
            <h3 className="font-extrabold uppercase tracking-wider text-slate-200 text-xs">
              Publishing
            </h3>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center space-x-1 ${
              isUnsaved
                ? 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30'
                : 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isUnsaved ? 'bg-[#F59E0B]' : 'bg-[#22C55E]'}`} />
            <span>{isUnsaved ? 'Unsaved Changes' : lastSavedText}</span>
          </span>
        </div>

        {/* Status Pills */}
        <div>
          <label className="block font-bold text-slate-300 text-[11px] mb-1.5 uppercase tracking-wider">
            Status
          </label>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#111827] rounded-xl border border-[#334155]">
            {(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED'] as const).map((st) => (
              <button
                type="button"
                key={st}
                onClick={() => {
                  setForm((prev) => ({ ...prev, status: st }));
                  setIsUnsaved(true);
                }}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all ${
                  form.status === st
                    ? 'bg-[#3B82F6] text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {st.charAt(0) + st.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Visibility */}
        <div>
          <label className="block font-bold text-slate-300 text-[11px] mb-1.5 uppercase tracking-wider">
            Visibility
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#111827] rounded-xl border border-[#334155]">
            {[
              { id: 'PUBLIC', label: 'Public', icon: Globe },
              { id: 'MEMBERS', label: 'Members', icon: Users },
              { id: 'PRIVATE', label: 'Private', icon: Lock },
            ].map((v) => {
              const IconComp = v.icon;
              const isSelected = (form as any).visibility === v.id || v.id === 'PUBLIC';
              return (
                <button
                  type="button"
                  key={v.id}
                  onClick={() => {
                    setForm((prev) => ({ ...prev, visibility: v.id } as any));
                    setIsUnsaved(true);
                  }}
                  className={`py-1.5 px-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center space-x-1 transition-all ${
                    isSelected
                      ? 'bg-slate-800 text-white border border-[#3B82F6]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <IconComp className="w-3 h-3 text-[#3B82F6]" />
                  <span>{v.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Publish Date (Calendar + Time Picker) */}
        {form.status === 'SCHEDULED' && (
          <div>
            <label className="block font-bold text-slate-300 text-[11px] mb-1.5 uppercase tracking-wider flex items-center">
              <Calendar className="w-3 h-3 mr-1 text-[#3B82F6]" /> Publish Date &amp; Time
            </label>
            <input
              type="datetime-local"
              value={form.scheduledAt || ''}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, scheduledAt: e.target.value }));
                setIsUnsaved(true);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#111827] border border-[#334155] text-white text-xs font-semibold focus:ring-2 focus:ring-[#3B82F6] focus:outline-none"
            />
          </div>
        )}

        {/* Searchable Author Dropdown with Avatar */}
        <div className="relative">
          <label className="block font-bold text-slate-300 text-[11px] mb-1.5 uppercase tracking-wider flex items-center">
            <User className="w-3 h-3 mr-1 text-[#3B82F6]" /> Assigned Author
          </label>

          <button
            type="button"
            onClick={() => setShowAuthorDropdown(!showAuthorDropdown)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#111827] border border-[#334155] text-white text-xs font-semibold flex items-center justify-between hover:border-[#3B82F6] transition-all"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded-full bg-[#3B82F6] text-white flex items-center justify-center font-bold text-[10px] overflow-hidden">
                {selectedAuthor?.avatar ? (
                  <img src={selectedAuthor.avatar} alt={selectedAuthor.displayName} className="w-full h-full object-cover" />
                ) : (
                  selectedAuthor?.displayName?.slice(0, 2).toUpperCase() || 'AU'
                )}
              </div>
              <span className="font-bold text-slate-200">{selectedAuthor?.displayName || 'Select Author'}</span>
            </div>
            <span className="text-slate-400 text-[10px]">▼</span>
          </button>

          {showAuthorDropdown && (
            <div className="absolute z-20 left-0 right-0 mt-1 bg-[#111827] border border-[#334155] rounded-xl shadow-2xl overflow-hidden p-2 space-y-1">
              <input
                type="text"
                placeholder="Search author..."
                value={authorSearch}
                onChange={(e) => setAuthorSearch(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-[#1E293B] border border-[#334155] text-xs text-white placeholder-slate-500 focus:outline-none mb-1"
              />
              <div className="max-h-36 overflow-y-auto space-y-1">
                {authors
                  .filter((a) => a.displayName.toLowerCase().includes(authorSearch.toLowerCase()))
                  .map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({ ...prev, authorId: a.id }));
                        setShowAuthorDropdown(false);
                        setIsUnsaved(true);
                      }}
                      className={`w-full p-2 rounded-lg flex items-center space-x-2.5 text-xs text-left transition-all ${
                        a.id === form.authorId ? 'bg-[#3B82F6]/20 text-[#3B82F6] font-bold' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[9px] overflow-hidden">
                        {a.avatar ? <img src={a.avatar} alt={a.displayName} className="w-full h-full object-cover" /> : a.displayName.slice(0, 2).toUpperCase()}
                      </div>
                      <span>{a.displayName}</span>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2 — ORGANIZATION */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-4 space-y-3.5 shadow-lg">
        <div className="flex items-center space-x-2 border-b border-[#334155] pb-2.5">
          <FolderPlus className="w-3.5 h-3.5 text-[#3B82F6]" />
          <h3 className="font-extrabold uppercase tracking-wider text-slate-200 text-xs">
            Organization
          </h3>
        </div>

        {/* Category Select + Create New */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-bold text-slate-300 text-[11px] uppercase tracking-wider">Category</label>
            <button
              type="button"
              onClick={() => setShowAddCategoryModal(!showAddCategoryModal)}
              className="text-[10px] font-bold text-[#3B82F6] hover:underline flex items-center"
            >
              <Plus className="w-3 h-3 mr-0.5" /> New Category
            </button>
          </div>

          {showAddCategoryModal ? (
            <div className="flex items-center space-x-1.5 mb-2">
              <input
                type="text"
                placeholder="Category Name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl bg-[#111827] border border-[#334155] text-xs text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (newCategoryName.trim()) {
                    categories.push({ id: `cat-${Date.now()}`, name: newCategoryName });
                    setNewCategoryName('');
                    setShowAddCategoryModal(false);
                  }
                }}
                className="px-3 py-1.5 bg-[#3B82F6] text-white rounded-xl font-bold text-xs"
              >
                Add
              </button>
            </div>
          ) : null}

          <select
            value={form.categoryId}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, categoryId: e.target.value }));
              setIsUnsaved(true);
            }}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#111827] border border-[#334155] text-white text-xs font-bold focus:ring-2 focus:ring-[#3B82F6] focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tags Autocomplete & Removable Chips (Max 10) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-bold text-slate-300 text-[11px] uppercase tracking-wider">
              Tags ({form.tagIds.length}/10)
            </label>
            <button
              type="button"
              onClick={() => setShowAddTagInput(!showAddTagInput)}
              className="text-[10px] font-bold text-[#3B82F6] hover:underline flex items-center"
            >
              <Plus className="w-3 h-3 mr-0.5" /> Create Tag
            </button>
          </div>

          {showAddTagInput && (
            <div className="flex items-center space-x-1.5 mb-2">
              <input
                type="text"
                placeholder="New Tag Name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl bg-[#111827] border border-[#334155] text-xs text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (newTagName.trim() && form.tagIds.length < 10) {
                    const newId = `tag-${Date.now()}`;
                    tags.push({ id: newId, name: newTagName });
                    setForm((prev) => ({ ...prev, tagIds: [...prev.tagIds, newId] }));
                    setNewTagName('');
                    setShowAddTagInput(false);
                    setIsUnsaved(true);
                  }
                }}
                className="px-3 py-1.5 bg-[#3B82F6] text-white rounded-xl font-bold text-xs"
              >
                Add
              </button>
            </div>
          )}

          {/* Selected Tag Removable Chips */}
          <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px] p-2 bg-[#111827] rounded-xl border border-[#334155]">
            {form.tagIds.map((tId) => {
              const tagObj = tags.find((t) => t.id === tId);
              return (
                <span
                  key={tId}
                  className="px-2.5 py-1 rounded-lg bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#3B82F6] text-[11px] font-bold flex items-center space-x-1"
                >
                  <span>#{tagObj?.name || tId}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, tagIds: prev.tagIds.filter((id) => id !== tId) }));
                      setIsUnsaved(true);
                    }}
                    className="hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
            {form.tagIds.length === 0 && (
              <span className="text-slate-500 text-[11px] italic">No tags selected</span>
            )}
          </div>

          {/* Available Tags Autocomplete Search */}
          {form.tagIds.length < 10 && (
            <div className="space-y-1.5">
              <input
                type="text"
                placeholder="Search to add tags..."
                value={tagSearchQuery}
                onChange={(e) => setTagSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#111827] border border-[#334155] text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              {tagSearchQuery && availableTags.length > 0 && (
                <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto p-1.5 bg-[#111827] rounded-xl border border-[#334155]">
                  {availableTags.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        if (form.tagIds.length < 10) {
                          setForm((prev) => ({ ...prev, tagIds: [...prev.tagIds, t.id] }));
                          setTagSearchQuery('');
                          setIsUnsaved(true);
                        }
                      }}
                      className="px-2 py-1 rounded-md bg-slate-800 hover:bg-[#3B82F6] text-slate-300 hover:text-white text-[10px] font-semibold transition-all"
                    >
                      + #{t.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3 — FEATURED OPTIONS (ARTICLE OPTIONS) */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-4 space-y-3.5 shadow-lg">
        <div className="flex items-center space-x-2 border-b border-[#334155] pb-2.5">
          <Star className="w-3.5 h-3.5 text-[#F59E0B]" />
          <h3 className="font-extrabold uppercase tracking-wider text-slate-200 text-xs">
            Article Options
          </h3>
        </div>

        <div className="space-y-3">
          {[
            {
              id: 'isFeatured',
              label: 'Featured Article',
              desc: 'Promote on hero banner & main featured feed',
              icon: Star,
              color: 'text-[#F59E0B]',
              value: form.isFeatured,
            },
            {
              id: 'isPopular',
              label: 'Popular Article',
              desc: 'Mark as trending in sidebar & popular lists',
              icon: Flame,
              color: 'text-rose-500',
              value: form.isPopular,
            },
            {
              id: 'allowComments',
              label: 'Allow Comments',
              desc: 'Enable reader discussion & comment thread',
              icon: MessageSquare,
              color: 'text-[#3B82F6]',
              value: (form as any).allowComments ?? true,
            },
            {
              id: 'pinToHomepage',
              label: 'Pin on Homepage',
              desc: 'Keep fixed at top of homepage grid',
              icon: Pin,
              color: 'text-[#22C55E]',
              value: (form as any).pinToHomepage ?? false,
            },
          ].map((opt) => {
            const IconComp = opt.icon;
            return (
              <div key={opt.id} className="flex items-start justify-between space-x-3 p-2 rounded-xl hover:bg-slate-800/40 transition-all">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-1.5">
                    <IconComp className={`w-3.5 h-3.5 ${opt.color}`} />
                    <span className="font-bold text-slate-200 text-xs">{opt.label}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">{opt.desc}</p>
                </div>

                {/* iOS-Style Toggle Switch */}
                <button
                  type="button"
                  onClick={() => {
                    setForm((prev) => ({ ...prev, [opt.id]: !opt.value }));
                    setIsUnsaved(true);
                  }}
                  className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer flex-shrink-0 ${
                    opt.value ? 'bg-[#3B82F6]' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      opt.value ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4 — FEATURED IMAGE UPLOAD CARD */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-4 space-y-3.5 shadow-lg">
        <div className="flex items-center justify-between border-b border-[#334155] pb-2.5">
          <div className="flex items-center space-x-2">
            <ImageIcon className="w-3.5 h-3.5 text-[#3B82F6]" />
            <h3 className="font-extrabold uppercase tracking-wider text-slate-200 text-xs">
              Featured Image
            </h3>
          </div>
          <span className="text-[9px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
            1600 × 900
          </span>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
        />

        {form.featuredImage ? (
          <div className="space-y-2.5">
            <div className="aspect-video relative rounded-xl overflow-hidden border border-[#334155] group bg-black">
              <img src={form.featuredImage} alt="Featured" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => {
                  setForm((prev) => ({ ...prev, featuredImage: '', thumbnail: '' }));
                  setIsUnsaved(true);
                }}
                className="absolute top-2 right-2 p-1.5 bg-red-600/90 text-white rounded-lg opacity-90 group-hover:opacity-100 transition-all hover:bg-red-700"
                title="Remove image"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono px-1">
              <span>Featured Banner</span>
              <span>PNG / JPG / WEBP</span>
            </div>
          </div>
        ) : (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="border-2 border-dashed border-[#334155] hover:border-[#3B82F6] rounded-xl p-5 text-center bg-[#111827]/60 transition-all group cursor-pointer space-y-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-10 h-10 rounded-full bg-slate-800 text-[#3B82F6] mx-auto flex items-center justify-center group-hover:scale-110 transition-all">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-200 text-xs">
                Drag &amp; Drop image here
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                or click to browse files
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center space-x-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-3 py-1.5 rounded-lg bg-[#3B82F6] text-white font-bold text-[10px] shadow-sm hover:bg-blue-600"
              >
                Upload Image
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMediaLibraryModal(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-bold text-[10px] hover:bg-slate-700 border border-slate-700"
              >
                Media Library
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 5 — SEO CARD WITH SCORE METER */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-4 space-y-3.5 shadow-lg">
        <div className="flex items-center justify-between border-b border-[#334155] pb-2.5">
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-[#3B82F6]" />
            <h3 className="font-extrabold uppercase tracking-wider text-slate-200 text-xs">
              SEO Optimization
            </h3>
          </div>

          {/* SEO Score Badge */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold text-slate-400">SEO Score</span>
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#111827] border border-[#334155] font-extrabold text-[11px] text-[#22C55E]">
              {seoScore}
            </div>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-[11px] font-bold text-slate-300 mb-1">
              <span>Meta Title</span>
              <span className={form.seoTitle.length > 65 ? 'text-red-400' : 'text-slate-400'}>
                {form.seoTitle.length}/65
              </span>
            </div>
            <input
              type="text"
              placeholder={form.title || 'Search engine title...'}
              value={form.seoTitle}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, seoTitle: e.target.value }));
                setIsUnsaved(true);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#111827] border border-[#334155] text-white text-xs focus:ring-2 focus:ring-[#3B82F6] focus:outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] font-bold text-slate-300 mb-1">
              <span>Meta Description</span>
              <span className={form.seoDescription.length > 160 ? 'text-red-400' : 'text-slate-400'}>
                {form.seoDescription.length}/160
              </span>
            </div>
            <textarea
              rows={2}
              placeholder="Search engine summary..."
              value={form.seoDescription}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, seoDescription: e.target.value }));
                setIsUnsaved(true);
              }}
              className="w-full px-3.5 py-2 rounded-xl bg-[#111827] border border-[#334155] text-white text-xs leading-relaxed focus:ring-2 focus:ring-[#3B82F6] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">Focus Keyword</label>
            <input
              type="text"
              placeholder="e.g. Next.js 15, React"
              value={(form as any).focusKeyword || ''}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, focusKeyword: e.target.value } as any));
                setIsUnsaved(true);
              }}
              className="w-full px-3.5 py-2 rounded-xl bg-[#111827] border border-[#334155] text-white text-xs focus:ring-2 focus:ring-[#3B82F6] focus:outline-none"
            />
          </div>
        </div>

        {/* Google Snippet Live Preview */}
        <div className="p-3 bg-[#111827] rounded-xl border border-[#334155] space-y-1">
          <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 font-mono truncate">
            <Globe className="w-3 h-3 text-[#22C55E]" />
            <span>https://skillstuff.com/blog/{form.slug || 'article-slug'}</span>
          </div>
          <h4 className="text-xs font-bold text-[#3B82F6] hover:underline truncate cursor-pointer">
            {form.seoTitle || form.title || 'Article Title Preview'}
          </h4>
          <p className="text-[11px] text-slate-300 line-clamp-2 leading-tight">
            {form.seoDescription || form.excerpt || 'Article summary preview for search engine results...'}
          </p>
        </div>

        {/* Warnings / Checklist */}
        <div className="space-y-1.5 pt-1">
          {seoWarnings.map((w, idx) => (
            <div key={idx} className="flex items-center space-x-2 text-[10px] font-semibold text-slate-300">
              {w.type === 'success' ? (
                <CheckCircle className="w-3.5 h-3.5 text-[#22C55E]" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
              )}
              <span>{w.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 6 — ARTICLE STATISTICS */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-4 space-y-3.5 shadow-lg">
        <div className="flex items-center space-x-2 border-b border-[#334155] pb-2.5">
          <BarChart2 className="w-3.5 h-3.5 text-[#3B82F6]" />
          <h3 className="font-extrabold uppercase tracking-wider text-slate-200 text-xs">
            Article Stats
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-[#111827] rounded-xl border border-[#334155]">
            <span className="text-[10px] text-slate-400 font-bold block">Words</span>
            <span className="text-sm font-extrabold text-white">{stats.words}</span>
          </div>

          <div className="p-2.5 bg-[#111827] rounded-xl border border-[#334155]">
            <span className="text-[10px] text-slate-400 font-bold block">Characters</span>
            <span className="text-sm font-extrabold text-white">{stats.characters}</span>
          </div>

          <div className="p-2.5 bg-[#111827] rounded-xl border border-[#334155]">
            <span className="text-[10px] text-slate-400 font-bold block">Paragraphs</span>
            <span className="text-sm font-extrabold text-white">{stats.paragraphs}</span>
          </div>

          <div className="p-2.5 bg-[#111827] rounded-xl border border-[#334155]">
            <span className="text-[10px] text-slate-400 font-bold block">Reading Time</span>
            <span className="text-sm font-extrabold text-[#3B82F6]">{stats.readingTime} min</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-[#334155]/60">
          <span>Code Blocks: <strong className="text-slate-200">{stats.codeBlocks}</strong></span>
          <span>Images: <strong className="text-slate-200">{stats.images}</strong></span>
          <span>Headings: <strong className="text-slate-200">{stats.headings}</strong></span>
        </div>
      </div>

      {/* SECTION 7 — AI ASSISTANT */}
      <div className="bg-gradient-to-br from-[#1E293B] via-[#1E293B] to-[#1e1e38] border border-[#334155] rounded-2xl p-4 space-y-3 shadow-lg relative overflow-hidden">
        <div className="flex items-center space-x-2 border-b border-[#334155] pb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-[#3B82F6] animate-pulse" />
          <h3 className="font-extrabold uppercase tracking-wider text-slate-200 text-xs">
            AI Assistant
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-1.5">
          {[
            { id: 'summary', label: '✨ Generate Summary' },
            { id: 'seo', label: '✨ Generate SEO Meta' },
            { id: 'title', label: '✨ Refine Catchy Title' },
            { id: 'tags', label: '✨ Auto Suggest Tags' },
            { id: 'faq', label: '✨ Generate FAQ Section' },
          ].map((act) => (
            <button
              key={act.id}
              type="button"
              disabled={!!aiLoadingAction}
              onClick={() => handleAiAction(act.id)}
              className="w-full text-left px-3 py-2 rounded-xl bg-[#111827]/80 hover:bg-[#3B82F6] text-slate-200 hover:text-white font-semibold text-xs border border-[#334155] hover:border-transparent transition-all flex items-center justify-between group"
            >
              <span>{act.label}</span>
              {aiLoadingAction === act.id ? (
                <RefreshCw className="w-3 h-3 animate-spin text-[#3B82F6] group-hover:text-white" />
              ) : (
                <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-all">&rarr;</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* BOTTOM ACTION BAR (STICKY FOOTER IN SIDEBAR) */}
      <div className="sticky bottom-0 z-10 p-4 bg-[#1E293B]/95 backdrop-blur-md border border-[#334155] rounded-2xl shadow-2xl space-y-2.5">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onPublish}
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#1E88E5] hover:from-blue-600 hover:to-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Update Article' : 'Publish Article'}</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onSaveDraft}
            className="py-2.5 px-3 rounded-xl bg-[#111827] hover:bg-slate-800 border border-[#334155] text-slate-200 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all"
          >
            <Save className="w-3.5 h-3.5 text-slate-400" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={onPreview}
            className="py-2.5 px-3 rounded-xl bg-[#111827] hover:bg-slate-800 border border-[#334155] text-slate-200 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Preview</span>
          </button>
        </div>

        <p className="text-[10px] text-center text-slate-400 font-medium pt-1">
          ✓ Automatically saved 10s ago
        </p>
      </div>

      {/* Media Library Simple Modal */}
      {showMediaLibraryModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#334155] pb-3">
              <h3 className="font-extrabold text-white text-sm">Media Library</h3>
              <button type="button" onClick={() => setShowMediaLibraryModal(false)}>
                <X className="w-4 h-4 text-slate-400 hover:text-white" />
              </button>
            </div>
            <p className="text-xs text-slate-300">Enter image URL or select from recent uploads:</p>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const url = (e.target as HTMLInputElement).value;
                  if (url) {
                    setForm((prev) => ({ ...prev, featuredImage: url, thumbnail: url }));
                    setShowMediaLibraryModal(false);
                    setIsUnsaved(true);
                  }
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#111827] border border-[#334155] text-white text-xs focus:ring-2 focus:ring-[#3B82F6] focus:outline-none"
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowMediaLibraryModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
