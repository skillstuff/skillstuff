'use client';

import React, { useState } from 'react';
import {
  MoreVertical,
  Calendar,
  Clock,
  User,
  FolderTree,
  ChevronLeft,
  ChevronRight,
  Edit,
  Send,
  Copy,
  Trash2,
  XCircle,
  ArrowUpDown,
} from 'lucide-react';
import type { ScheduledArticleItem } from './CalendarView';

interface ScheduledPostsTableProps {
  articles: ScheduledArticleItem[];
  onEdit: (art: ScheduledArticleItem) => void;
  onPublishNow: (artId: string) => void;
  onCancelSchedule: (artId: string) => void;
  onDelete: (artId: string) => void;
  onDuplicate: (art: ScheduledArticleItem) => void;
}

export default function ScheduledPostsTable({
  articles,
  onEdit,
  onPublishNow,
  onCancelSchedule,
  onDelete,
  onDuplicate,
}: ScheduledPostsTableProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'title' | 'publishDate' | 'status' | 'priority'>('publishDate');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Sorting
  const sortedArticles = [...articles].sort((a, b) => {
    if (sortField === 'publishDate') {
      const tA = new Date(a.publishDate).getTime();
      const tB = new Date(b.publishDate).getTime();
      return sortAsc ? tA - tB : tB - tA;
    }
    if (sortField === 'title') {
      return sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    }
    if (sortField === 'status') {
      return sortAsc ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedArticles.length / pageSize));
  const paginatedArticles = sortedArticles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">Blue • Scheduled</span>;
      case 'PUBLISHED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Green • Published</span>;
      case 'DRAFT':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Yellow • Draft</span>;
      case 'REVIEW':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">Purple • Review</span>;
      case 'FAILED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">Red • Failed</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-red-500/15 text-red-400 border border-red-500/30">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-amber-500/15 text-amber-400 border border-amber-500/30">MEDIUM</span>;
      case 'LOW':
        return <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-slate-800 text-slate-400 border border-slate-700">LOW</span>;
      default:
        return null;
    }
  };

  const handleSort = (field: 'title' | 'publishDate' | 'status' | 'priority') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5 shadow-xl space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-[#334155] pb-3">
        <div>
          <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">
            Scheduled Posts Table
          </h3>
          <p className="text-xs text-slate-400">
            Showing {paginatedArticles.length} of {articles.length} posts
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#334155] text-slate-400 uppercase text-[10px] tracking-wider font-extrabold bg-[#111827]">
              <th className="p-3 cursor-pointer hover:text-white" onClick={() => handleSort('title')}>
                <div className="flex items-center space-x-1">
                  <span>Article Title</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3">Author</th>
              <th className="p-3">Category</th>
              <th className="p-3 cursor-pointer hover:text-white" onClick={() => handleSort('publishDate')}>
                <div className="flex items-center space-x-1">
                  <span>Publish Date &amp; Time</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3">Status</th>
              <th className="p-3">Priority</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#334155]/60 text-slate-200">
            {paginatedArticles.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500 italic">
                  No scheduled articles found.
                </td>
              </tr>
            ) : (
              paginatedArticles.map((art) => {
                const dateStr = new Date(art.publishDate).toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
                const timeStr = new Date(art.publishDate).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <tr key={art.id} className="hover:bg-[#111827]/60 transition-colors">
                    <td className="p-3 font-bold text-white max-w-xs truncate">
                      {art.title}
                    </td>
                    <td className="p-3 font-semibold text-slate-300">
                      {art.authorName}
                    </td>
                    <td className="p-3 text-slate-300 font-semibold">
                      {art.categoryName}
                    </td>
                    <td className="p-3 font-mono text-slate-300">
                      <div>{dateStr}</div>
                      <div className="text-[10px] text-slate-500">{timeStr}</div>
                    </td>
                    <td className="p-3">
                      {getStatusBadge(art.status)}
                    </td>
                    <td className="p-3">
                      {getPriorityBadge(art.priority)}
                    </td>
                    <td className="p-3 text-right relative">
                      <button
                        type="button"
                        onClick={() => setActiveMenuId(activeMenuId === art.id ? null : art.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Action Menu */}
                      {activeMenuId === art.id && (
                        <div className="absolute right-3 z-30 mt-1 w-44 bg-[#111827] border border-[#334155] rounded-xl shadow-2xl overflow-hidden p-1.5 space-y-1 text-left">
                          <button
                            type="button"
                            onClick={() => {
                              onEdit(art);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:bg-slate-800 flex items-center space-x-2"
                          >
                            <Edit className="w-3.5 h-3.5 text-[#3B82F6]" />
                            <span>Edit Schedule</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onPublishNow(art.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 flex items-center space-x-2"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Publish Now</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onDuplicate(art);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:bg-slate-800 flex items-center space-x-2"
                          >
                            <Copy className="w-3.5 h-3.5 text-purple-400" />
                            <span>Duplicate</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onCancelSchedule(art.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-400 hover:bg-amber-500/20 flex items-center space-x-2"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Cancel Schedule</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onDelete(art.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/20 flex items-center space-x-2 border-t border-slate-800 pt-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between border-t border-[#334155] pt-3 text-xs text-slate-400">
        <span>
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>
        <div className="flex items-center space-x-1">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="p-1.5 rounded-lg bg-[#111827] border border-[#334155] hover:bg-slate-800 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="p-1.5 rounded-lg bg-[#111827] border border-[#334155] hover:bg-slate-800 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
