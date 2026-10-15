import type { Metadata } from 'next';
import FeedbackForm from '@/components/FeedbackForm';

export const metadata: Metadata = { title: 'Tell us what is wrong', robots: { index: false } };

export default function FeedbackPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = typeof searchParams.page === 'string' ? searchParams.page.slice(0, 300) : undefined;
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <FeedbackForm page={page} />
    </div>
  );
}
