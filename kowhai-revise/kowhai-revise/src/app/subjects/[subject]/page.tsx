import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import { countNotes, getCatalog } from '@/lib/content';
import { levelLabel } from '@/lib/types';

export function generateStaticParams() {
  return getCatalog().subjects.map((s) => ({ subject: s.slug }));
}

export function generateMetadata({ params }: { params: { subject: string } }): Metadata {
  const s = getCatalog().subjects.find((x) => x.slug === params.subject);
  return s ? { title: s.title, description: `${s.title} revision notes for NCEA.` } : {};
}

export default function SubjectPage({ params }: { params: { subject: string } }) {
  const subject = getCatalog().subjects.find((x) => x.slug === params.subject);
  if (!subject) notFound();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Subjects', href: '/subjects' }, { name: subject.title, href: `/subjects/${subject.slug}` }]} />
      <h1 className="mt-4 font-display text-4xl font-bold">{subject.title}</h1>
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {subject.levels.map((l) => (
          <li key={l}>
            <Link href={`/subjects/${subject.slug}/${l}`} className="block rounded-xl border-2 border-ink bg-white p-5 hover:bg-mist">
              <span className="block font-display text-2xl font-bold">{levelLabel(l)}</span>
              <span className="mt-2 block font-bold">{countNotes(subject, l)} notes</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
