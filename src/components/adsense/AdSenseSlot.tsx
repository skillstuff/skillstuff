'use client';

import React, { useEffect } from 'react';

interface AdSenseSlotProps {
  slotId?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
  label?: string;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdSenseSlot({
  slotId = '1234567890',
  format = 'auto',
  className = '',
  label = 'Advertisement',
}: AdSenseSlotProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-1234567890123456';
  const isDevOrPlaceholder = !process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID.includes('1234567890');

  useEffect(() => {
    if (!isDevOrPlaceholder) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense script error:', err);
      }
    }
  }, [isDevOrPlaceholder]);

  return (
    <div className={`my-6 mx-auto w-full max-w-5xl px-4 ${className}`}>
      <div className="flex items-center justify-between text-[11px] font-medium tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-1.5">
        <span>{label}</span>
        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded">Ad</span>
      </div>

      {isDevOrPlaceholder ? (
        <div className="w-full min-h-[90px] md:min-h-[120px] rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 flex flex-col items-center justify-center text-center transition-colors">
          <div className="flex items-center space-x-2 text-slate-400 dark:text-slate-500 mb-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Google AdSense Slot</span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-md">
            AdSense Ready ({format} layout) &bull; Configured with publisher ID <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded text-indigo-600 dark:text-indigo-400">{clientId}</code>
          </p>
        </div>
      ) : (
        <ins
          className="adsbygoogle block"
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
