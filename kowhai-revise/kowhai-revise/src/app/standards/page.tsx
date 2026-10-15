import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getCatalog } from '@/lib/content';
import { levelLabel } from '@/lib/types';

export const metadata: Metadata = { title: 'Achievement standards', description: 'Every achievement standard with revision notes, listed by AS number.' };

export default function StandardsHub() {
  const rows = getCatalog()
    .subjects.flatMap((s) => Object.values(s.standardsByLevel).flatMap((list) => list.map((std) => ({ subject: s, std }))))
    .sort((a, b) => a.std.asNumber.localeCompare(b.std.asNumber));
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Standards', href: '/standards' }]} />
      <h1 className="mt-4 font-display text-4xl font-bold">Achievement standards</h1>
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {rows.map(({ subject, std }) => (
          <li key={`${subject.slug}/${std.level}/${std.slug}`}>
            <Link
              href={std.groups[0]?.pages[0]?.href ?? `/subjects/${subject.slug}/${std.level}`}
              className="block h-full rounded-xl border-2 border-ink bg-white p-5 hover:bg-mist"
            >
              <span className="block font-bold text-fern">AS {std.asNumber}</span>
              <span className="block font-display text-xl font-bold">{std.title}</span>
              <span className="mt-2 block text-sm">
                {subject.title} {levelLabel(std.level)} · <strong>{std.pageCount} {std.pageCount === 1 ? 'note' : 'notes'}</strong>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
