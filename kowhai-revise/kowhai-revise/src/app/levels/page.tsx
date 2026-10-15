import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { countNotes, getCatalog } from '@/lib/content';
import { LEVELS } from '@/lib/types';

export const metadata: Metadata = { title: 'Levels', description: 'Choose NCEA Level 2, Level 3 or Scholarship.' };

export default function LevelsHub() {
  const { subjects } = getCatalog();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Levels', href: '/levels' }]} />
      <h1 className="mt-4 font-display text-4xl font-bold">Levels</h1>
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {LEVELS.map((l) => {
          const n = subjects.reduce((sum, s) => sum + countNotes(s, l.slug), 0);
          return (
            <li key={l.slug}>
              <Link href={`/levels/${l.slug}`} className="block h-full rounded-xl border-2 border-ink bg-white p-5 hover:bg-mist">
                <span className="block font-display text-2xl font-bold">{l.label}</span>
                <span className="mt-1 block">{l.blurb}</span>
                <span className="mt-3 block font-bold">{n} {n === 1 ? 'note' : 'notes'}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
