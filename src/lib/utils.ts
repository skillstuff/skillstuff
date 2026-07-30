import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W_]+(-[\s\W_]+)*/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function calculateReadingTime(content: string): number {
  const cleanText = content.replace(/<[^>]*>/g, '');
  const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export function formatDate(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function truncateText(text: string, maxLength: number = 150): string {
  if (!text) return '';
  const clean = text.replace(/<[^>]*>/g, '');
  if (clean.length <= maxLength) return clean;
  return clean.substring(0, maxLength).trim() + '...';
}
