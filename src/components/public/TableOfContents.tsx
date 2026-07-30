'use client';

import React, { useEffect, useState } from 'react';
import { List, ChevronDown, ChevronUp } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ htmlContent }: { htmlContent: string }) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const headingNodes = Array.from(doc.querySelectorAll('h2, h3, h4'));

    const items: TocItem[] = headingNodes.map((node, index) => {
      const text = node.textContent || '';
      const id = node.id || `heading-${index}`;
      const level = parseInt(node.tagName.replace('H', ''), 10);
      return { id, text, level };
    });

    setHeadings(items);
  }, [htmlContent]);

  if (headings.length === 0) return null;

  return (
    <div className="my-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 p-5 transition-all">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 dark:text-white">
          <List className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>Table of Contents</span>
          <span className="text-xs font-normal text-slate-400">({headings.length} sections)</span>
        </div>
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <nav className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2 text-xs">
          {headings.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`block hover:text-brand-600 dark:hover:text-brand-400 transition-colors font-medium text-slate-600 dark:text-slate-400 ${
                item.level === 3 ? 'pl-4' : item.level === 4 ? 'pl-8' : 'pl-0'
              }`}
            >
              {item.text}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
