import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { countNotes, getCatalog } from '@/lib/content';
import { levelLabel } from '@/lib/types';

export const metadata: Metadata = { title: 'Subjects', description: 'All subjects with NCEA revision notes.' };

export default function SubjectsHub() {
  const { subjects } = getCatalog();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Subjects', href: '/subjects' }]} />
      <h1 className="mt-4 font-display text-4xl font-bold">Subjects</h1>
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {subjects.map((s) => (
          <li key={s.slug} className="rounded-xl border-2 border-ink bg-white p-5">
            <Link href={`/subjects/${s.slug}`} className="font-display text-2xl font-bold underline decoration-kowhai decoration-4 underline-offset-4">
              {s.title}
            </Link>
            <p className="mt-2 font-bold">{countNotes(s)} notes</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {s.levels.map((l) => (
                <li key={l}>
                  <Link href={`/subjects/${s.slug}/${l}`} className="rounded-full border-2 border-ink px-3 py-1 text-sm font-bold hover:bg-kowhai">
                    {levelLabel(l)}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
