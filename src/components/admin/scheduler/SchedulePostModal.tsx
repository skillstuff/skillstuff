'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, Globe, User, FolderPlus, Bell, CheckCircle2, Save, Send } from 'lucide-react';
import type { ScheduledArticleItem } from './CalendarView';

interface ArticleOption {
  id: string;
  title: string;
  categoryName: string;
  authorName: string;
}

interface SchedulePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scheduleData: any) => void;
  existingArticles: ArticleOption[];
  categories: { id: string; name: string }[];
  authors: { id: string; displayName: string }[];
  editingItem?: ScheduledArticleItem | null;
}

export default function SchedulePostModal({
  isOpen,
  onClose,
  onSave,
  existingArticles,
  categories,
  authors,
  editingItem,
}: SchedulePostModalProps) {
  const [selectedArticleId, setSelectedArticleId] = useState(editingItem?.id || existingArticles[0]?.id || '');
  const [publishDate, setPublishDate] = useState(
    editingItem ? new Date(editingItem.publishDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
  );
  const [publishTime, setPublishTime] = useState(
    editingItem ? new Date(editingItem.publishDate).toTimeString().slice(0, 5) : '09:00'
  );
  const [timezone, setTimezone] = useState('UTC+05:00 (PKT / Asia/Karachi)');
  const [authorId, setAuthorId] = useState(authors[0]?.id || '');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>(editingItem?.priority || 'MEDIUM');
  const [repeatRule, setRepeatRule] = useState<'NEVER' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'>('NEVER');
  const [publishingNotes, setPublishingNotes] = useState('');

  // Toggles
  const [seoChecklistPassed, setSeoChecklistPassed] = useState(true);
  const [notifyAuthor, setNotifyAuthor] = useState(true);
  const [sendReminder, setSendReminder] = useState(true);
  const [slackNotification, setSlackNotification] = useState(false);
  const [emailNotification, setEmailNotification] = useState(true);

  if (!isOpen) return null;


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const combinedDateTime = new Date(`${publishDate}T${publishTime}:00`);

    onSave({
      articleId: selectedArticleId,
      publishDate: combinedDateTime,
      timezone,
      authorId,
      categoryId,
      priority,
      repeatRule,
      publishingNotes,
      seoChecklistPassed,
      notifyAuthor,
      sendReminder,
      slackNotification,
      emailNotification,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#334155] pb-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-[#3B82F6]" />
            <h3 className="font-extrabold text-white text-base">
              {editingItem ? 'Edit Article Schedule' : 'Schedule New Article Post'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          {/* Article Selector */}
          <div>
            <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[10px]">
              Target Article *
            </label>
            <select
              value={selectedArticleId}
              onChange={(e) => setSelectedArticleId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#111827] border border-[#334155] text-white text-xs font-bold focus:ring-2 focus:ring-[#3B82F6] focus:outline-none"
            >
              {existingArticles.map((art) => (
                <option key={art.id} value={art.id}>
                  {art.title} ({art.categoryName})
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[10px]">
                Publish Date *
              </label>
              <input
                type="date"
                required
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#111827] border border-[#334155] text-white font-semibold text-xs focus:ring-2 focus:ring-[#3B82F6] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[10px]">
                Publish Time *
              </label>
              <input
                type="time"
                required
                value={publishTime}
                onChange={(e) => setPublishTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#111827] border border-[#334155] text-white font-semibold text-xs focus:ring-2 focus:ring-[#3B82F6] focus:outline-none"
              />
            </div>
          </div>

          {/* Timezone Selector */}
          <div>
            <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[10px]">
              Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#111827] border border-[#334155] text-white font-semibold text-xs focus:ring-2 focus:ring-[#3B82F6] focus:outline-none"
            >
              <option value="UTC+05:00 (PKT / Asia/Karachi)">UTC+05:00 (PKT / Asia/Karachi)</option>
              <option value="UTC+00:00 (GMT / London)">UTC+00:00 (GMT / London)</option>
              <option value="UTC-05:00 (EST / New York)">UTC-05:00 (EST / New York)</option>
              <option value="UTC-08:00 (PST / San Francisco)">UTC-08:00 (PST / San Francisco)</option>
            </select>
          </div>

          {/* Author & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[10px]">
                Assigned Author
              </label>
              <select
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#111827] border border-[#334155] text-white font-semibold text-xs focus:ring-2 focus:ring-[#3B82F6] focus:outline-none"
              >
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.displayName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[10px]">
                Schedule Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#111827] border border-[#334155] text-white font-bold text-xs focus:ring-2 focus:ring-[#3B82F6] focus:outline-none"
              >
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>
            </div>
          </div>

          {/* Repeat Rule */}
          <div>
            <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[10px]">
              Recurring Schedule
            </label>
            <select
              value={repeatRule}
              onChange={(e) => setRepeatRule(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#111827] border border-[#334155] text-white font-bold text-xs focus:ring-2 focus:ring-[#3B82F6] focus:outline-none"
            >
              <option value="NEVER">Never (One-time Schedule)</option>
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>

          {/* Publishing Notes */}
          <div>
            <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[10px]">
              Publishing &amp; Editorial Notes
            </label>
            <textarea
              rows={2}
              placeholder="Instructions or notes for social media team..."
              value={publishingNotes}
              onChange={(e) => setPublishingNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#111827] border border-[#334155] text-white text-xs leading-relaxed focus:ring-2 focus:ring-[#3B82F6] focus:outline-none"
            />
          </div>

          {/* Notifications & Toggles Section */}
          <div className="p-3 bg-[#111827] rounded-xl border border-[#334155] space-y-2.5">
            <h4 className="font-extrabold text-[#3B82F6] text-[10px] uppercase tracking-wider flex items-center">
              <Bell className="w-3 h-3 mr-1" /> Automation &amp; Notification Toggles
            </h4>

            <div className="grid grid-cols-2 gap-2 text-slate-200 text-xs">
              {[
                { label: 'Notify Author', value: notifyAuthor, setter: setNotifyAuthor },
                { label: 'Send Reminder', value: sendReminder, setter: setSendReminder },
                { label: 'Slack Alert', value: slackNotification, setter: setSlackNotification },
                { label: 'Email Notification', value: emailNotification, setter: setEmailNotification },
              ].map((t, idx) => (
                <label key={idx} className="flex items-center space-x-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={t.value}
                    onChange={(e) => t.setter(e.target.checked)}
                    className="rounded text-[#3B82F6] focus:ring-[#3B82F6] accent-[#3B82F6]"
                  />
                  <span>{t.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#334155]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-blue-600 text-white font-extrabold text-xs shadow-lg flex items-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Schedule</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
