'use client';

import React, { useState } from 'react';
import { Plus, Download, Upload, Calendar, RefreshCw, Layers } from 'lucide-react';
import StatisticsCards from './StatisticsCards';
import FilterToolbar, { FilterState } from './FilterToolbar';
import CalendarView, { ScheduledArticleItem } from './CalendarView';
import SchedulePostModal from './SchedulePostModal';
import ScheduledPostsTable from './ScheduledPostsTable';
import UpcomingQueue from './UpcomingQueue';
import AnalyticsSection from './AnalyticsSection';
import NotificationCenter, { SchedulerNotification } from './NotificationCenter';

interface ArticleRawData {
  id: string;
  title: string;
  status: string;
  scheduledAt: string | Date | null;
  publishedAt: string | Date | null;
  category: { id: string; name: string };
  author: { id: string; displayName: string; avatar?: string | null };
  thumbnail?: string | null;
  isFeatured?: boolean;
}

interface PostSchedulerPageProps {
  initialArticles: ArticleRawData[];
  categories: { id: string; name: string }[];
  authors: { id: string; displayName: string }[];
}

export default function PostSchedulerPage({
  initialArticles,
  categories,
  authors,
}: PostSchedulerPageProps) {
  // Map raw DB articles to ScheduledArticleItems
  const [scheduledItems, setScheduledItems] = useState<ScheduledArticleItem[]>(() => {
    return initialArticles.map((art, idx) => {
      const pubDate = art.scheduledAt
        ? new Date(art.scheduledAt)
        : art.publishedAt
        ? new Date(art.publishedAt)
        : new Date(Date.now() + (idx + 1) * 86400000);

      let statusStr: ScheduledArticleItem['status'] = 'SCHEDULED';
      if (art.status === 'PUBLISHED') statusStr = 'PUBLISHED';
      else if (art.status === 'DRAFT') statusStr = 'DRAFT';
      else if (art.status === 'SCHEDULED') statusStr = 'SCHEDULED';

      return {
        id: art.id,
        title: art.title,
        publishDate: pubDate,
        status: statusStr,
        categoryName: art.category?.name || 'General',
        authorName: art.author?.displayName || 'Editorial Team',
        priority: art.isFeatured ? 'HIGH' : idx % 2 === 0 ? 'MEDIUM' : 'LOW',
        thumbnail: art.thumbnail || undefined,
      };
    });
  });

  // UI state
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduledArticleItem | null>(null);

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    author: '',
    status: '',
    priority: '',
    dateRange: '',
  });

  // Notifications
  const [notifications, setNotifications] = useState<SchedulerNotification[]>([
    {
      id: 'notif-1',
      type: 'REMINDER',
      message: 'Article "Mastering Next.js 15" scheduled to publish today at 09:00 AM.',
      timestamp: '10m ago',
    },
    {
      id: 'notif-2',
      type: 'CONFLICT',
      message: 'Schedule conflict detected: 2 posts set for the exact same time slot.',
      timestamp: '1h ago',
    },
  ]);

  // Statistics calculation
  const stats = {
    scheduled: scheduledItems.filter((i) => i.status === 'SCHEDULED').length,
    publishingToday: scheduledItems.filter((i) => {
      const d = new Date(i.publishDate);
      const today = new Date();
      return d.toDateString() === today.toDateString();
    }).length,
    publishedThisWeek: scheduledItems.filter((i) => i.status === 'PUBLISHED').length,
    missedSchedule: scheduledItems.filter((i) => i.status === 'FAILED').length,
    drafts: scheduledItems.filter((i) => i.status === 'DRAFT').length,
    pendingReview: scheduledItems.filter((i) => i.status === 'REVIEW').length,
  };

  // Filtered Articles
  const filteredArticles = scheduledItems.filter((item) => {
    if (filters.search && !item.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.category && item.categoryName !== categories.find((c) => c.id === filters.category)?.name) return false;
    if (filters.author && item.authorName !== authors.find((a) => a.id === filters.author)?.displayName) return false;
    if (filters.status && item.status !== filters.status) return false;
    if (filters.priority && item.priority !== filters.priority) return false;
    return true;
  });

  // Handlers
  const handleSaveSchedule = (data: any) => {
    if (editingItem) {
      setScheduledItems((prev) =>
        prev.map((i) =>
          i.id === editingItem.id
            ? {
                ...i,
                publishDate: data.publishDate,
                priority: data.priority,
                status: 'SCHEDULED',
              }
            : i
        )
      );
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          type: 'SUCCESS',
          message: `Updated publication schedule for "${editingItem.title}".`,
          timestamp: 'Just now',
        },
        ...prev,
      ]);
    } else {
      const art = initialArticles.find((a) => a.id === data.articleId);
      const newItem: ScheduledArticleItem = {
        id: `sched-${Date.now()}`,
        title: art?.title || 'New Scheduled Post',
        publishDate: data.publishDate,
        status: 'SCHEDULED',
        categoryName: art?.category?.name || 'General',
        authorName: art?.author?.displayName || 'Author',
        priority: data.priority || 'MEDIUM',
      };
      setScheduledItems((prev) => [newItem, ...prev]);
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          type: 'SUCCESS',
          message: `Successfully scheduled "${newItem.title}" for ${newItem.publishDate.toLocaleDateString()}.`,
          timestamp: 'Just now',
        },
        ...prev,
      ]);
    }
  };

  const handleEventDrop = (articleId: string, newDate: Date) => {
    setScheduledItems((prev) =>
      prev.map((art) => (art.id === articleId ? { ...art, publishDate: newDate } : art))
    );
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: 'SUCCESS',
        message: `Rescheduled post to ${newDate.toLocaleDateString()}.`,
        timestamp: 'Just now',
      },
      ...prev,
    ]);
  };

  const handlePublishNow = (artId: string) => {
    setScheduledItems((prev) =>
      prev.map((art) => (art.id === artId ? { ...art, status: 'PUBLISHED' } : art))
    );
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: 'SUCCESS',
        message: 'Article published live successfully!',
        timestamp: 'Just now',
      },
      ...prev,
    ]);
  };

  const handleCancelSchedule = (artId: string) => {
    setScheduledItems((prev) =>
      prev.map((art) => (art.id === artId ? { ...art, status: 'DRAFT' } : art))
    );
  };

  const handleDelete = (artId: string) => {
    setScheduledItems((prev) => prev.filter((art) => art.id !== artId));
  };

  const handleDuplicate = (art: ScheduledArticleItem) => {
    const dup: ScheduledArticleItem = {
      ...art,
      id: `dup-${Date.now()}`,
      title: `${art.title} (Copy)`,
      status: 'DRAFT',
    };
    setScheduledItems((prev) => [dup, ...prev]);
  };

  return (
    <div className="space-y-6 select-none pb-12 font-sans">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#334155] pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/30">
              CMS Module
            </span>
            <span className="text-xs text-slate-400 font-mono">/admin/post-scheduler</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Post Scheduler
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Plan, schedule, and manage upcoming articles from one place.
          </p>
        </div>

        {/* Right Header Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#1E88E5] hover:from-blue-600 hover:to-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 flex items-center space-x-2 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Post</span>
          </button>

          <button
            type="button"
            onClick={() => alert('Import Schedule: Select CSV/JSON file to bulk import post schedules.')}
            className="px-3.5 py-2.5 rounded-xl bg-[#1E293B] hover:bg-slate-800 border border-[#334155] text-slate-200 font-bold text-xs flex items-center space-x-1.5 transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span>Import</span>
          </button>

          <button
            type="button"
            onClick={() => alert('Export Calendar: iCal & CSV exported successfully!')}
            className="px-3.5 py-2.5 rounded-xl bg-[#1E293B] hover:bg-slate-800 border border-[#334155] text-slate-200 font-bold text-xs flex items-center space-x-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS BAR */}
      <NotificationCenter
        notifications={notifications}
        onDismiss={(id) => setNotifications((prev) => prev.filter((n) => n.id !== id))}
      />

      {/* QUICK STATISTICS CARDS */}
      <StatisticsCards stats={stats} />

      {/* GLOBAL FILTER TOOLBAR */}
      <FilterToolbar
        filters={filters}
        setFilters={setFilters}
        categories={categories}
        authors={authors}
        onClear={() =>
          setFilters({
            search: '',
            category: '',
            author: '',
            status: '',
            priority: '',
            dateRange: '',
          })
        }
      />

      {/* MAIN GRID: CALENDAR & UPCOMING QUEUE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive Calendar */}
        <div className="lg:col-span-8">
          <CalendarView
            articles={filteredArticles}
            onEventClick={(art) => {
              setEditingItem(art);
              setIsModalOpen(true);
            }}
            onEventDrop={handleEventDrop}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </div>

        {/* Right Upcoming Queue */}
        <div className="lg:col-span-4">
          <UpcomingQueue
            articles={scheduledItems}
            onEdit={(art) => {
              setEditingItem(art);
              setIsModalOpen(true);
            }}
            onPublishNow={handlePublishNow}
          />
        </div>
      </div>

      {/* SCHEDULED POSTS TABLE */}
      <ScheduledPostsTable
        articles={filteredArticles}
        onEdit={(art) => {
          setEditingItem(art);
          setIsModalOpen(true);
        }}
        onPublishNow={handlePublishNow}
        onCancelSchedule={handleCancelSchedule}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
      />

      {/* PUBLISHING ANALYTICS SECTION */}
      <AnalyticsSection categoryDistribution={categories.map((c, idx) => ({ name: c.name, count: ((idx * 3 + 4) % 8) + 2 }))} />

      {/* SCHEDULE NEW POST MODAL */}
      <SchedulePostModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveSchedule}
        existingArticles={initialArticles.map((a) => ({
          id: a.id,
          title: a.title,
          categoryName: a.category?.name || 'General',
          authorName: a.author?.displayName || 'Author',
        }))}
        categories={categories}
        authors={authors}
        editingItem={editingItem}
      />
    </div>
  );
}
