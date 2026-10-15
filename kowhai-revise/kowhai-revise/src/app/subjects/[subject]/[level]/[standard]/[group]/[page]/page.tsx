import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import remarkMath from 'remark-math';
import Breadcrumbs from '@/components/Breadcrumbs';
import MarkComplete from '@/components/MarkComplete';
import { mdxComponents } from '@/components/mdx';
import { adjacentPages, getCatalog, loadAllPages } from '@/lib/content';
import { SITE_NAME } from '@/lib/site';
import { levelLabel } from '@/lib/types';

type Params = { subject: string; level: string; standard: string; group: string; page: string };

const find = (p: Params) => loadAllPages().find((x) => x.key === `${p.subject}/${p.level}/${p.standard}/${p.group}/${p.page}`);

export function generateStaticParams(): Params[] {
  return loadAllPages().map((p) => ({ subject: p.subject, level: p.level, standard: p.standard, group: p.topicGroup, page: p.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const p = find(params);
  if (!p) return {};
  const title = `${p.title}, ${p.subjectTitle} ${levelLabel(p.level)}`;
  return {
    title,
    description: p.description,
    alternates: { canonical: p.href },
    openGraph: { type: 'article', title, description: p.description, url: p.href, locale: 'en_NZ', siteName: SITE_NAME },
    twitter: { card: 'summary_large_image', title, description: p.description },
  };
}

export default async function NotePage({ params }: { params: Params }) {
  const page = find(params);
  if (!page) notFound();
  const subject = getCatalog().subjects.find((s) => s.slug === page.subject);
  if (!subject) notFound();
  const { prev, next } = adjacentPages(subject, page.level, page.key);
  const { content } = await compileMDX({
    source: page.body,
    components: mdxComponents,
    options: { mdxOptions: { remarkPlugins: [remarkMath], rehypePlugins: [rehypeSlug, rehypeKatex] } },
  });

  return (
    <article className="max-w-3xl">
      <Breadcrumbs
        items={[
          { name: 'Subjects', href: '/subjects' },
          { name: subject.title, href: `/subjects/${subject.slug}` },
          { name: levelLabel(page.level), href: `/subjects/${subject.slug}/${page.level}` },
          { name: page.title, href: page.href },
        ]}
      />
      <p className="mt-4 font-bold text-fern">Revision notes</p>
      <h1 className="font-display text-4xl font-bold">{page.title}</h1>
      <div className="note">{content}</div>

      <div className="mt-10 flex flex-wrap items-center gap-4 border-t-4 border-ink pt-6">
        <MarkComplete pageKey={page.key} />
      </div>
      <nav aria-label="Page navigation" className="mt-6 flex flex-wrap gap-4">
        <Link href={page.practiceHref} className="rounded-full border-2 border-ink bg-kowhai px-5 py-2 font-bold">
          Practice questions, test yourself
        </Link>
        {next && (
          <Link href={next.href} className="rounded-full border-2 border-ink bg-white px-5 py-2 font-bold">
            Next page: {next.title}
          </Link>
        )}
        {prev && (
          <Link href={prev.href} className="rounded-full border-2 border-ink bg-white px-5 py-2 font-bold">
            Previous page: {prev.title}
          </Link>
        )}
      </nav>
      <p className="mt-6 text-sm">
        <Link href={`/feedback?page=${encodeURIComponent(page.href)}`} className="underline">
          Something wrong on this page? Tell us
        </Link>
      </p>
    </article>
  );
}
