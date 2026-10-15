import { getGlossary } from '@/lib/content';
import GlossaryTerm from './GlossaryTerm';
import LazyShm from './LazyShm';
import WorkedExample from './WorkedExample';

function Term({ id, children }: { id: string; children: React.ReactNode }) {
  const entry = getGlossary()[id];
  if (!entry) return <>{children}</>;
  return <GlossaryTerm definition={entry.definition}>{children}</GlossaryTerm>;
}

function Figure({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="my-6">
      {/* Plain img: these are small static SVGs, and next/image adds nothing for SVG. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" className="mx-auto w-full max-w-xl rounded-lg border-2 border-ink bg-white" />
      {caption && <figcaption className="mt-2 text-center text-sm">{caption}</figcaption>}
    </figure>
  );
}

function Mistake({ children }: { children: React.ReactNode }) {
  return <span className="mt-4 block rounded-lg border-l-8 border-pohutukawa bg-red-50 p-3 font-bold">{children}</span>;
}

function Tips({ children }: { children: React.ReactNode }) {
  return (
    <aside className="my-8 rounded-xl border-2 border-fern bg-mist p-4" aria-label="Tips and tricks">
      <p className="!mt-0 font-display text-xl font-bold">Tips and tricks</p>
      {children}
    </aside>
  );
}

function Parts({ children }: { children: React.ReactNode }) {
  return <div className="parts">{children}</div>;
}

export const mdxComponents = { Term, Figure, Mistake, Tips, Parts, WorkedExample, ShmDiagram: LazyShm };
