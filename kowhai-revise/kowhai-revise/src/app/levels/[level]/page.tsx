import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import { countNotes, getCatalog } from '@/lib/content';
import { isLevelSlug, LEVELS, levelLabel } from '@/lib/types';

export const dynamicParams = false;
export function generateStaticParams() {
  return LEVELS.map((l) => ({ level: l.slug }));
}

export function generateMetadata({ params }: { params: { level: string } }): Metadata {
  return isLevelSlug(params.level) ? { title: `${levelLabel(params.level)} subjects`, description: `Subjects with revision notes at NCEA ${levelLabel(params.level)}.` } : {};
}

export default function LevelPage({ params }: { params: { level: string } }) {
  if (!isLevelSlug(params.level)) notFound();
  const level = params.level;
  const subjects = getCatalog().subjects.filter((s) => s.levels.includes(level));
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Levels', href: '/levels' }, { name: levelLabel(level), href: `/levels/${level}` }]} />
      <h1 className="mt-4 font-display text-4xl font-bold">{levelLabel(level)} subjects</h1>
      {subjects.length === 0 ? (
        <p className="mt-4">No subjects at this level yet. They are added as notes are written.</p>
      ) : (
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {subjects.map((s) => (
            <li key={s.slug}>
              <Link href={`/subjects/${s.slug}/${level}`} className="block h-full rounded-xl border-2 border-ink bg-white p-5 hover:bg-mist">
                <span className="block font-display text-2xl font-bold">{s.title}</span>
                <span className="mt-2 block font-bold">{countNotes(s, level)} notes</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
