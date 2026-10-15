import { notFound } from 'next/navigation';
import Sidebar, { type SidebarData } from '@/components/Sidebar';
import { getCatalog, standardsFor } from '@/lib/content';
import { isLevelSlug, levelLabel } from '@/lib/types';

/** One layout for every page of a subject at a level, so the sidebar keeps its open state and scroll position while navigating. */
export default function SubjectLevelLayout({ children, params }: { children: React.ReactNode; params: { subject: string; level: string } }) {
  if (!isLevelSlug(params.level)) notFound();
  const subject = getCatalog().subjects.find((s) => s.slug === params.subject);
  if (!subject || !subject.levels.includes(params.level)) notFound();
  const data: SidebarData = {
    subjectTitle: subject.title,
    subjectHref: `/subjects/${subject.slug}/${params.level}`,
    levelLabel: levelLabel(params.level),
    standards: standardsFor(subject, params.level).map((s) => ({
      slug: s.slug,
      asNumber: s.asNumber,
      title: s.title,
      groups: s.groups.map((g) => ({ slug: g.slug, title: g.title, pages: g.pages.map((p) => ({ key: p.key, title: p.title, href: p.href })) })),
    })),
  };
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 lg:flex-row">
      <Sidebar data={data} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
