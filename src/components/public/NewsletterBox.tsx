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
    <div className="w-full my-10 bg-brand-gradient rounded-dialog p-8 sm:p-12 text-white shadow-brand-glow relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-5">
        <div className="w-14 h-14 rounded-card bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto text-white shadow-brand-soft">
          <Mail className="w-7 h-7" />
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          Join 10,000+ Software Engineers
        </h2>
        <p className="text-sm sm:text-base text-white/90 max-w-lg mx-auto leading-relaxed font-normal">
          Get our top weekly technical deep-dives on Next.js, Cloud Architecture, DevOps, AI, and Security directly in your inbox.
        </p>

        {status === 'success' ? (
          <div className="p-4 rounded-btn bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center space-x-2 text-sm font-semibold animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-brand-success" />
            <span>{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-3">
            <input
              type="email"
              required
              placeholder="Enter your work email address..."
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              className="flex-1 px-4 py-3 rounded-btn bg-white/95 text-brand-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white text-sm font-medium transition-all shadow-brand-soft"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 rounded-btn bg-white text-brand-primary font-bold text-sm hover:bg-slate-50 transition-all shadow-brand-soft disabled:opacity-50 flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-100"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-brand-primary" />
                  <span>Subscribing...</span>
                </>
              ) : (
                <span>Subscribe Free</span>
              )}
            </button>
          </form>
        )}

        {status === 'error' && (
          <div className="flex items-center justify-center space-x-1.5 text-xs text-rose-200 font-semibold pt-1">
            <AlertCircle className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
