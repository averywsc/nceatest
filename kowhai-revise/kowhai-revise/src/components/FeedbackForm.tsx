'use client';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function FeedbackForm({ page }: { page?: string }) {
  const pathname = usePathname();
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, page: page ?? pathname }),
      });
      if (!res.ok) throw new Error('bad response');
      setMessage('');
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={submit} id="talk-to-us" className="max-w-xl">
      <h2 className="font-display text-2xl font-bold">Talk to us</h2>
      <p className="mt-1">Spotted a mistake, or want a topic added? Tell us.</p>
      {page && <p className="mt-1 text-sm">About page: {page}</p>}
      <label htmlFor="feedback-message" className="mt-3 block font-bold">
        Your message
      </label>
      <textarea
        id="feedback-message"
        required
        maxLength={2000}
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="mt-1 w-full rounded-lg border-2 border-ink bg-white p-2 text-ink"
      />
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button type="submit" disabled={status === 'sending'} className="rounded-full border-2 border-ink bg-kowhai px-5 py-2 font-bold text-ink">
          {status === 'sending' ? 'Sending' : 'Send message'}
        </button>
        <span className="text-sm">We read every message</span>
      </div>
      <p role="status" className="mt-2 font-bold">
        {status === 'sent' && 'Thanks. Your message has been sent.'}
        {status === 'error' && 'Your message did not send. Check your connection and try again.'}
      </p>
    </form>
  );
}
