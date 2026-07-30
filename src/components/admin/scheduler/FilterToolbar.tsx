'use client';

import React from 'react';
import { Search, X, Filter, RotateCcw } from 'lucide-react';

export interface FilterState {
  search: string;
  category: string;
  author: string;
  status: string;
  priority: string;
  dateRange: string;
}

interface FilterToolbarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  categories: { id: string; name: string }[];
  authors: { id: string; displayName: string }[];
  onClear: () => void;
}

export default function FilterToolbar({
  filters,
  setFilters,
  categories,
  authors,
  onClear,
}: FilterToolbarProps) {
  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.category) ||
    Boolean(filters.author) ||
    Boolean(filters.status) ||
    Boolean(filters.priority) ||
    Boolean(filters.dateRange);

  return (
    <div className="p-4 rounded-2xl bg-[#1E293B] border border-[#334155] shadow-lg space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-[#3B82F6]" />
          <h3 className="font-extrabold text-white text-xs uppercase tracking-wider">
            Filter &amp; Search Scheduler
          </h3>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="px-2.5 py-1 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold flex items-center space-x-1 border border-red-500/20 transition-all"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search article title..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#111827] border border-[#334155] text-white text-xs placeholder-slate-500 focus:ring-2 focus:ring-[#3B82F6] focus:outline-none"
          />
        </div>

        {/* Category */}
        <select
          value={filters.category}
          onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
          className="w-full px-3 py-2 rounded-xl bg-[#111827] border border-[#334155] text-white text-xs font-semibold focus:ring-2 focus:ring-[#3B82F6] focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Author */}
        <select
          value={filters.author}
          onChange={(e) => setFilters((prev) => ({ ...prev, author: e.target.value }))}
          className="w-full px-3 py-2 rounded-xl bg-[#111827] border border-[#334155] text-white text-xs font-semibold focus:ring-2 focus:ring-[#3B82F6] focus:outline-none"
        >
          <option value="">All Authors</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.displayName}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
          className="w-full px-3 py-2 rounded-xl bg-[#111827] border border-[#334155] text-white text-xs font-semibold focus:ring-2 focus:ring-[#3B82F6] focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="SCHEDULED">Blue - Scheduled</option>
          <option value="PUBLISHED">Green - Published</option>
          <option value="DRAFT">Yellow - Draft</option>
          <option value="REVIEW">Purple - Review</option>
          <option value="FAILED">Red - Failed</option>
        </select>

        {/* Priority */}
        <select
          value={filters.priority}
          onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value }))}
          className="w-full px-3 py-2 rounded-xl bg-[#111827] border border-[#334155] text-white text-xs font-semibold focus:ring-2 focus:ring-[#3B82F6] focus:outline-none"
        >
          <option value="">All Priorities</option>
          <option value="HIGH">High Priority</option>
          <option value="MEDIUM">Medium Priority</option>
          <option value="LOW">Low Priority</option>
        </select>

        {/* Date Range */}
        <select
          value={filters.dateRange}
          onChange={(e) => setFilters((prev) => ({ ...prev, dateRange: e.target.value }))}
          className="w-full px-3 py-2 rounded-xl bg-[#111827] border border-[#334155] text-white text-xs font-semibold focus:ring-2 focus:ring-[#3B82F6] focus:outline-none"
        >
          <option value="">Any Date</option>
          <option value="today">Publishing Today</option>
          <option value="this_week">This Week</option>
          <option value="this_month">This Month</option>
          <option value="overdue">Overdue / Missed</option>
        </select>
      </div>
    </div>
  );
}
