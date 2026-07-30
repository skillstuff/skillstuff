'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function NewsletterBox() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'newsletter_widget' }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Thank you for subscribing to SkillStuff weekly insights!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="w-full my-8 bg-gradient-to-br from-indigo-50/90 via-white to-blue-50/80 rounded-3xl p-6 sm:p-10 text-slate-900 shadow-sm relative overflow-hidden border border-indigo-200/90 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 dark:text-white dark:border-indigo-900/40">
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-700/50 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 shadow-xs">
          <Mail className="w-6 h-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Join 10,000+ Software Engineers
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
          Get our top weekly technical deep-dives on Next.js, Cloud Architecture, DevOps, AI, and Security directly in your inbox.
        </p>

        {status === 'success' ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-center space-x-2 text-sm font-semibold animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
            <input
              type="email"
              required
              placeholder="Enter your work email address..."
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm font-medium transition-all shadow-xs"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-sm text-white transition-all shadow-md shadow-indigo-600/25 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Subscribing...</span>
                </>
              ) : (
                <span>Subscribe Free</span>
              )}
            </button>
          </form>
        )}

        {status === 'error' && (
          <div className="flex items-center justify-center space-x-1.5 text-xs text-rose-600 dark:text-rose-400 font-semibold pt-1">
            <AlertCircle className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
