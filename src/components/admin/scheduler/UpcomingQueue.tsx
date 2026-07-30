/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { Clock, Send, Edit3, Image as ImageIcon, Flame, CheckCircle } from "lucide-react";
import type { ScheduledArticleItem } from "./CalendarView";

interface UpcomingQueueProps {
  articles: ScheduledArticleItem[];
  onEdit: (art: ScheduledArticleItem) => void;
  onPublishNow: (artId: string) => void;
}

export default function UpcomingQueue({ articles, onEdit, onPublishNow }: UpcomingQueueProps) {
  const [now, setNow] = useState(Date.now());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const upcomingList = articles
    .filter((a) => a.status === "SCHEDULED" && new Date(a.publishDate).getTime() > Date.now())
    .sort((a, b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime())
    .slice(0, 5);

  const getCountdown = (targetDate: Date) => {
    if (!isMounted) return "--h --m --s";
    const diff = Math.max(0, new Date(targetDate).getTime() - now);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}h ${mins}m ${secs}s`;
  };

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5 shadow-xl space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-[#334155] pb-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-[#3B82F6] animate-spin" />
          <h3 className="font-extrabold text-white text-xs uppercase tracking-wider">Upcoming Queue</h3>
        </div>
        <span className="text-[10px] font-bold text-slate-400 bg-[#111827] px-2 py-0.5 rounded-full border border-[#334155]">
          {upcomingList.length} In Queue
        </span>
      </div>

      <div className="space-y-3">
        {upcomingList.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-xs italic space-y-1">
            <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto" />
            <p className="font-bold text-slate-300">All caught up!</p>
            <p>No upcoming posts in the queue.</p>
          </div>
        ) : (
          upcomingList.map((art) => {
            return (
              <div
                key={art.id}
                className="p-3 bg-[#111827] border border-[#334155] rounded-xl space-y-2.5 shadow-md hover:border-[#3B82F6]/60 transition-all group"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-14 h-14 rounded-lg bg-black overflow-hidden flex-shrink-0 border border-slate-800 relative">
                    {art.thumbnail ? (
                      <img src={art.thumbnail} alt={art.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-extrabold text-white text-xs line-clamp-2 leading-tight group-hover:text-[#3B82F6] transition-colors">
                      {art.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                      <span>{art.categoryName}</span>
                      <span>•</span>
                      <span>{art.authorName}</span>
                    </div>
                  </div>
                </div>

                {/* Countdown Meter & Badges */}
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#334155]/60">
                  <div className="flex items-center space-x-1 font-mono text-[#3B82F6] font-extrabold">
                    <Clock className="w-3 h-3 text-[#3B82F6]" />
                    <span suppressHydrationWarning>{getCountdown(art.publishDate)}</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => onEdit(art)}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px]"
                    >
                      <Edit3 className="w-3 h-3 inline mr-1" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onPublishNow(art.id)}
                      className="px-2 py-1 rounded-lg bg-[#3B82F6] hover:bg-blue-600 text-white font-bold text-[10px]"
                    >
                      <Send className="w-3 h-3 inline mr-1" /> Publish Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
