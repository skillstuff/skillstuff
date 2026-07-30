'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Upload, Copy, Check, Search, Loader2 } from 'lucide-react';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  altText?: string | null;
  createdAt: string;
}

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [query, setQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/admin/media');
      const data = await res.json();
      if (Array.isArray(data)) setMediaList(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        fetchMedia();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = mediaList.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase()) || m.filename.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Media Library</h1>
          <p className="text-xs text-slate-400 font-medium">Upload and manage article graphics and assets</p>
        </div>

        <label className="btn-primary cursor-pointer">
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Upload className="w-4 h-4" />}
          <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      <div className="flex items-center space-x-2 bg-slate-950 px-3.5 py-2 rounded-btn border border-slate-800 max-w-md">
        <Search className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Filter media files by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-transparent text-white text-xs focus:outline-none placeholder-slate-500 w-full"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map((item) => (
          <div key={item.id} className="group bg-slate-900 rounded-card border border-slate-800 overflow-hidden space-y-3 p-4 shadow-brand-soft hover:border-brand-secondary/50 transition-all">
            <div className="aspect-video relative rounded-btn overflow-hidden bg-slate-950">
              <Image src={item.url} alt={item.altText || item.name} fill className="object-cover" />
            </div>

            <div className="space-y-1">
              <span className="block text-xs font-bold text-white truncate">{item.name}</span>
              <span className="block text-[10px] text-slate-400 font-mono">{(item.size / 1024).toFixed(1)} KB</span>
            </div>

            <button
              onClick={() => handleCopy(item.url, item.id)}
              className="w-full py-2 rounded-btn bg-slate-800 hover:bg-brand-gradient text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all shadow-2xs"
            >
              {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-[#4DD6C2]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === item.id ? 'URL Copied!' : 'Copy URL'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
