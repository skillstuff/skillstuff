'use client';

import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Edit, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  _count?: { articles: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    setMsg(null);

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), description: description.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create category.');

      setMsg({ type: 'success', text: `Category "${name}" created!` });
      setName('');
      setDescription('');
      fetchCategories();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred';
      setMsg({ type: 'error', text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Category Manager</h1>
        <p className="text-xs text-slate-400">Create, edit, and organize article categories</p>
      </div>

      {msg && (
        <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
          msg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
        }`}>
          {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{msg.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Form */}
        <form onSubmit={handleCreate} className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-sm h-fit">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
            Create Category
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Category Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Web Development"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Description</label>
            <textarea
              rows={3}
              placeholder="Short category summary..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition-all shadow-md shadow-brand-600/30 flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Category</span>
          </button>
        </form>

        {/* Categories Data List (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Articles Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-850">
                  <td className="p-4 font-bold text-white">
                    {cat.name}
                    {cat.description && <span className="block text-[11px] font-normal text-slate-400 line-clamp-1">{cat.description}</span>}
                  </td>
                  <td className="p-4 font-mono text-slate-400">/category/{cat.slug}</td>
                  <td className="p-4 font-bold text-brand-400">{cat._count?.articles || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
