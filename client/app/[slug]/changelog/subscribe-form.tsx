'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface Props {
  slug: string;
  brandColor: string;
}

export default function SubscribeForm({ slug, brandColor }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

      const res = await fetch(`${apiUrl}/public/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), slug }),
      });

      const data = await res.json() as { message: string };

      if (!res.ok) throw new Error(data.message ?? 'Failed to subscribe');

      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={16} />
          <span className="text-sm font-medium">Check your email to confirm!</span>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          We sent a confirmation link to your inbox.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex gap-2 max-w-sm mx-auto w-full">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 px-3 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-all disabled:opacity-50 flex items-center gap-1.5 flex-shrink-0"
          style={{ backgroundColor: brandColor }}
        >
          {loading && <Loader2 size={13} className="animate-spin" />}
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-500 text-center">{error}</p>
      )}

      <p className="text-[11px] text-gray-400 dark:text-gray-600">
        No spam. Unsubscribe at any time.
      </p>
    </form>
  );
}