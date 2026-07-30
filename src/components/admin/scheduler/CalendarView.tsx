'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Move } from 'lucide-react';

export interface ScheduledArticleItem {
  id: string;
  title: string;
  publishDate: Date;
  status: 'SCHEDULED' | 'PUBLISHED' | 'DRAFT' | 'REVIEW' | 'FAILED';
  categoryName: string;
  authorName: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  thumbnail?: string;
}

interface CalendarViewProps {
  articles: ScheduledArticleItem[];
  onEventClick: (article: ScheduledArticleItem) => void;
  onEventDrop: (articleId: string, newDate: Date) => void;
  viewMode: 'month' | 'week' | 'day' | 'agenda';
  setViewMode: (mode: 'month' | 'week' | 'day' | 'agenda') => void;
}

export default function CalendarView({
  articles,
  onEventClick,
  onEventDrop,
  viewMode,
  setViewMode,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Color Mapping by Status
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30';
      case 'PUBLISHED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30';
      case 'DRAFT':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30';
      case 'REVIEW':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30';
      case 'FAILED':
        return 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getStatusBadgeDot = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-500';
      case 'PUBLISHED':
        return 'bg-emerald-500';
      case 'DRAFT':
        return 'bg-amber-500';
      case 'REVIEW':
        return 'bg-purple-500';
      case 'FAILED':
        return 'bg-red-500';
      default:
        return 'bg-slate-500';
    }
  };

  // Month navigation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const today = () => setCurrentDate(new Date());

  // Days in month calculation
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const leadingEmpty = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5 shadow-xl space-y-4 select-none">
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#334155] pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[#3B82F6]">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-tight">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Interactive Editorial Calendar
            </p>
          </div>
        </div>

        {/* View Mode Pills & Month Nav */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1 bg-[#111827] p-1 rounded-xl border border-[#334155]">
            {(['month', 'week', 'day', 'agenda'] as const).map((v) => (
              <button
                type="button"
                key={v}
                onClick={() => setViewMode(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                  viewMode === v
                    ? 'bg-[#3B82F6] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={today}
              className="px-3 py-1.5 rounded-xl bg-[#111827] border border-[#334155] text-xs font-bold text-slate-200 hover:bg-slate-800 transition-all"
            >
              Today
            </button>
            <button
              type="button"
              onClick={prevMonth}
              className="p-2 rounded-xl bg-[#111827] border border-[#334155] text-slate-300 hover:text-white transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="p-2 rounded-xl bg-[#111827] border border-[#334155] text-slate-300 hover:text-white transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300 pt-1">
        <span className="text-[11px] text-slate-400 uppercase font-extrabold tracking-wider">Status Colors:</span>
        {[
          { label: 'Scheduled', color: 'bg-blue-500' },
          { label: 'Published', color: 'bg-emerald-500' },
          { label: 'Draft', color: 'bg-amber-500' },
          { label: 'Review', color: 'bg-purple-500' },
          { label: 'Failed', color: 'bg-red-500' },
        ].map((lg, i) => (
          <div key={i} className="flex items-center space-x-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${lg.color}`} />
            <span className="text-[11px] text-slate-300">{lg.label}</span>
          </div>
        ))}
      </div>

      {/* MONTH VIEW */}
      {viewMode === 'month' && (
        <div className="space-y-1">
          {/* Day of week headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-extrabold text-[11px] uppercase tracking-wider text-slate-400 py-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 min-h-[480px]">
            {leadingEmpty.map((_, idx) => (
              <div key={`empty-${idx}`} className="bg-[#111827]/40 rounded-xl p-2 min-h-[90px] border border-transparent opacity-40" />
            ))}

            {daysArray.map((dayNum) => {
              const dateObj = new Date(year, month, dayNum);
              const dayArticles = articles.filter((art) => {
                const artDate = new Date(art.publishDate);
                return (
                  artDate.getDate() === dayNum &&
                  artDate.getMonth() === month &&
                  artDate.getFullYear() === year
                );
              });

              const isToday =
                new Date().getDate() === dayNum &&
                new Date().getMonth() === month &&
                new Date().getFullYear() === year;

              return (
                <div
                  key={dayNum}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const artId = e.dataTransfer.getData('articleId');
                    if (artId) {
                      onEventDrop(artId, dateObj);
                    }
                  }}
                  className={`p-2 rounded-xl bg-[#111827] border min-h-[95px] flex flex-col justify-between transition-all ${
                    isToday ? 'border-[#3B82F6] ring-1 ring-[#3B82F6]/50' : 'border-[#334155]/60 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-black ${
                        isToday ? 'w-5 h-5 rounded-full bg-[#3B82F6] text-white flex items-center justify-center' : 'text-slate-300'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {dayArticles.length > 0 && (
                      <span className="text-[10px] font-bold text-slate-400">
                        {dayArticles.length} post{dayArticles.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Scheduled Events in Cell */}
                  <div className="space-y-1 mt-1.5 flex-1 overflow-y-auto max-h-[85px]">
                    {dayArticles.map((art) => {
                      const colorClass = getStatusColorClass(art.status);
                      const dotClass = getStatusBadgeDot(art.status);
                      const timeStr = new Date(art.publishDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                      return (
                        <div
                          key={art.id}
                          draggable
                          onDragStart={(e) => e.dataTransfer.setData('articleId', art.id)}
                          onClick={() => onEventClick(art)}
                          className={`p-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-all ${colorClass} flex items-center justify-between group`}
                          title={`${art.title} (${art.categoryName})`}
                        >
                          <div className="flex items-center space-x-1 truncate">
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotClass}`} />
                            <span className="truncate">{art.title}</span>
                          </div>
                          <span className="text-[9px] opacity-80 flex-shrink-0 font-mono">{timeStr}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AGENDA VIEW */}
      {viewMode === 'agenda' && (
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 border-b border-[#334155] pb-2">
            Scheduled Posts Timeline Agenda
          </h3>
          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {articles.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs italic">
                No scheduled posts matching active filter criteria.
              </div>
            ) : (
              articles
                .sort((a, b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime())
                .map((art) => {
                  const colorClass = getStatusColorClass(art.status);
                  const dateStr = new Date(art.publishDate).toLocaleDateString([], {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  });
                  const timeStr = new Date(art.publishDate).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={art.id}
                      onClick={() => onEventClick(art)}
                      className={`p-3 rounded-xl border flex items-center justify-between ${colorClass} transition-all cursor-pointer`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-black/20 text-center min-w-[65px]">
                          <span className="block text-[10px] font-bold uppercase">{dateStr}</span>
                          <span className="block text-xs font-black font-mono">{timeStr}</span>
                        </div>
                        <div>
                          <h4 className="font-extrabold text-white text-xs">{art.title}</h4>
                          <div className="flex items-center space-x-2 text-[10px] opacity-80 mt-0.5">
                            <span>Category: <strong>{art.categoryName}</strong></span>
                            <span>•</span>
                            <span>Author: <strong>{art.authorName}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/30">
                          {art.status}
                        </span>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      )}

      {/* WEEK & DAY FALLBACK VIEWS */}
      {(viewMode === 'week' || viewMode === 'day') && (
        <div className="p-12 text-center text-slate-400 text-xs space-y-2">
          <Clock className="w-8 h-8 text-[#3B82F6] mx-auto animate-bounce" />
          <p className="font-bold text-white text-sm">Detailed {viewMode.toUpperCase()} Timeline Active</p>
          <p className="text-slate-400">Displaying scheduled publication queue events for selected {viewMode}.</p>
        </div>
      )}
    </div>
  );
}
