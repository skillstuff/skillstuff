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
    <div className="w-full my-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-indigo-500/20">
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-600/30 border border-brand-500/30 flex items-center justify-center mx-auto text-brand-400">
          <Mail className="w-6 h-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Join 10,000+ Software Engineers
        </h2>
        <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          Get our top weekly technical deep-dives on Next.js, Cloud Architecture, DevOps, AI, and Security directly in your inbox. No spam ever.
        </p>

        {status === 'success' ? (
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center space-x-2 text-sm font-medium animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
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
              className="flex-1 px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium transition-all"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 font-semibold text-sm text-white transition-all shadow-md shadow-brand-600/30 disabled:opacity-50 flex items-center justify-center space-x-2"
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
          <div className="flex items-center justify-center space-x-1.5 text-xs text-rose-400 font-medium pt-1">
            <AlertCircle className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
