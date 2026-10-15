import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import Quiz from '@/components/Quiz';
import { loadAllPages, loadPractice } from '@/lib/content';
import { levelLabel } from '@/lib/types';

type Params = { subject: string; level: string; standard: string; group: string; page: string };

const find = (p: Params) => loadAllPages().find((x) => x.key === `${p.subject}/${p.level}/${p.standard}/${p.group}/${p.page}`);

export function generateStaticParams(): Params[] {
  return loadAllPages().map((p) => ({ subject: p.subject, level: p.level, standard: p.standard, group: p.topicGroup, page: p.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const p = find(params);
  if (!p) return {};
  return {
    title: `Practice: ${p.title}, ${p.subjectTitle} ${levelLabel(p.level)}`,
    description: `Practice questions with worked solutions for ${p.title}.`,
    alternates: { canonical: p.practiceHref },
  };
}

export default function PracticePage({ params }: { params: Params }) {
  const page = find(params);
  if (!page) notFound();
  const questions = loadPractice(page);
  return (
    <div className="max-w-3xl">
      <Breadcrumbs
        items={[
          { name: 'Subjects', href: '/subjects' },
          { name: page.subjectTitle, href: `/subjects/${page.subject}` },
          { name: levelLabel(page.level), href: `/subjects/${page.subject}/${page.level}` },
          { name: page.title, href: page.href },
          { name: 'Practice', href: page.practiceHref },
        ]}
      />
      <p className="mt-4 font-bold text-fern">Practice questions</p>
      <h1 className="mb-6 font-display text-4xl font-bold">{page.title}</h1>
      <Quiz pageKey={page.key} noteHref={page.href} questions={questions} />
    </div>
  );
}
