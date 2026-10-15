import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import SaveSubject from '@/components/SaveSubject';
import { getCatalog, standardsFor } from '@/lib/content';
import { isLevelSlug, levelLabel } from '@/lib/types';

export function generateStaticParams() {
  return getCatalog().subjects.flatMap((s) => s.levels.map((level) => ({ subject: s.slug, level })));
}

export function generateMetadata({ params }: { params: { subject: string; level: string } }): Metadata {
  const s = getCatalog().subjects.find((x) => x.slug === params.subject);
  if (!s || !isLevelSlug(params.level)) return {};
  return { title: `${s.title} ${levelLabel(params.level)}`, description: `${s.title} ${levelLabel(params.level)} achievement standards and revision notes.` };
}

export default function SubjectLevelPage({ params }: { params: { subject: string; level: string } }) {
  if (!isLevelSlug(params.level)) notFound();
  const level = params.level;
  const subject = getCatalog().subjects.find((x) => x.slug === params.subject);
  if (!subject) notFound();
  const standards = standardsFor(subject, level);
  return (
    <div>
      <Breadcrumbs
        items={[
          { name: 'Home', href: '/' },
          { name: 'Subjects', href: '/subjects' },
          { name: subject.title, href: `/subjects/${subject.slug}` },
          { name: levelLabel(level), href: `/subjects/${subject.slug}/${level}` },
        ]}
      />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-4xl font-bold">
          {subject.title} {levelLabel(level)}
        </h1>
        <SaveSubject subject={subject.slug} title={subject.title} />
      </div>
      <ul className="mt-6 space-y-4">
        {standards.map((s) => (
          <li key={s.slug} className="rounded-xl border-2 border-ink bg-white p-5">
            <p className="font-bold text-fern">AS {s.asNumber}</p>
            <h2 className="font-display text-xl font-bold">{s.title}</h2>
            <p className="mt-1 font-bold">{s.pageCount} {s.pageCount === 1 ? 'note' : 'notes'}</p>
            {s.groups.map((g) => (
              <div key={g.slug} className="mt-3">
                <h3 className="font-bold">{g.title}</h3>
                <ul className="mt-1 list-disc pl-6">
                  {g.pages.map((p) => (
                    <li key={p.key}>
                      <Link href={p.href} className="underline">
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}
