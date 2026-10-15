import fs from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import LoopVideo from '@/components/LoopVideo';
import { Mascot } from '@/components/Mascot';
import { loadAllPages } from '@/lib/content';
import { LEVELS } from '@/lib/types';

const faqs: { q: string; a: string }[] = [
  {
    q: 'What is it?',
    a: 'A free set of short revision notes for NCEA Level 2, Level 3 and Scholarship. Each note covers one idea, with worked examples, tips and practice questions so you can check what stuck.',
  },
  {
    q: 'Who is it for?',
    a: 'Secondary school students in New Zealand who want a quick, clear way to revise before an assessment. Teachers can use it for homework and revision lessons too.',
  },
  {
    q: 'What does it provide?',
    a: 'Bite-sized notes, step-by-step worked examples, diagrams you can drag and play with, practice questions with worked solutions, and links to official past papers on the NZQA website.',
  },
  {
    q: 'Does it match the official NCEA courses?',
    a: 'Notes are organised by achievement standard and use each standard’s AS number. We write them to follow the published standards, but the NZQA website is always the official source, so check it for the latest requirements.',
  },
  {
    q: 'How should I use it to revise?',
    a: 'Pick a standard, read one note, try the worked example before opening the answer, then do the practice questions. Mark the note as complete so you can see what is left. Short, regular sessions work better than one long one.',
  },
  {
    q: 'Do I need an account?',
    a: 'No. Everything can be read for free, and your progress is saved in your browser. An optional account will save your subjects and progress across devices.',
  },
];

function FeatureBlock({
  title,
  text,
  href,
  linkLabel,
  video,
  flip,
}: {
  title: string;
  text: string;
  href: string;
  linkLabel: string;
  video: string;
  flip?: boolean;
}) {
  const hasVideo = fs.existsSync(path.join(process.cwd(), 'public', 'videos', video));
  return (
    <div className={`grid items-center gap-6 md:grid-cols-2 ${flip ? 'md:[&>*:first-child]:order-2' : ''}`}>
      <div>
        {hasVideo ? (
          <LoopVideo src={`/videos/${video}`} label={`Short clip: ${title}`} />
        ) : (
          <div className="flex aspect-video items-center justify-center rounded-xl border-2 border-dashed border-ink bg-mist p-4 text-center text-sm">
            Add a short looping clip at public/videos/{video}
          </div>
        )}
      </div>
      <div>
        <h3 className="font-display text-2xl font-bold">{title}</h3>
        <p className="mt-2 max-w-md">{text}</p>
        <Link href={href} className="mt-3 inline-block font-bold text-fern underline">
          {linkLabel}
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  const example = loadAllPages().find((p) => p.slug === 'basics');
  const noteHref = example?.href ?? '/subjects';
  return (
    <>
      <section className="border-b-4 border-ink bg-kowhai">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 md:grid-cols-[1.4fr_1fr]">
          <div>
            <h1 className="font-display text-5xl font-bold leading-tight md:text-6xl">Revise NCEA one small note at a time</h1>
            <p className="mt-4 max-w-xl text-xl">Short notes, worked examples and practice questions for Level 2, Level 3 and Scholarship. Free to read, no account needed.</p>
            <a href="#levels" className="mt-6 inline-block rounded-full border-2 border-ink bg-ink px-6 py-3 text-lg font-bold text-white">
              Get started
            </a>
          </div>
          <Mascot className="mx-auto w-56 md:w-72" />
        </div>
      </section>

      <section id="levels" aria-labelledby="levels-heading" className="mx-auto max-w-7xl scroll-mt-4 px-4 py-14">
        <h2 id="levels-heading" className="font-display text-3xl font-bold">
          Choose your level
        </h2>
        <p className="mt-1">Pick the level you are studying this year.</p>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {LEVELS.map((l) => (
            <li key={l.slug}>
              <Link href={`/levels/${l.slug}`} className="flex h-full flex-col justify-between rounded-xl border-2 border-ink bg-white p-5 hover:bg-mist">
                <span>
                  <span className="block font-display text-2xl font-bold">{l.label}</span>
                  <span className="mt-1 block">{l.blurb}</span>
                </span>
                <span className="mt-4 flex items-center gap-2 font-bold">
                  See subjects
                  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12h16M14 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-5">
          Prefer to start with a subject?{' '}
          <Link href="/subjects" className="font-bold text-fern underline">
            Browse by subject across levels
          </Link>
        </p>
      </section>

      <section aria-labelledby="action-heading" className="bg-white py-14">
        <div className="mx-auto max-w-7xl space-y-14 px-4">
          <h2 id="action-heading" className="font-display text-3xl font-bold">
            See it in action
          </h2>
          <FeatureBlock
            title="Detailed notes with worked examples and tips"
            text="Every note breaks one idea into short bullets, then shows a full worked example and the mistake most students make."
            href={noteHref}
            linkLabel="Read an example note"
            video="notes.mp4"
          />
          <FeatureBlock
            flip
            title="Interactive diagrams you can drag"
            text="Drag the point round the circle and watch the pendulum and graphs move together."
            href={`${noteHref}#the-reference-circle`}
            linkLabel="Try the diagram"
            video="diagram.mp4"
          />
          <FeatureBlock
            title="Practice questions with worked solutions"
            text="Answer, see why, then jump straight back to the part of the note you need."
            href={example?.practiceHref ?? '/subjects'}
            linkLabel="Try some questions"
            video="practice.mp4"
          />
        </div>
      </section>

      <section aria-labelledby="about-heading" className="mx-auto max-w-3xl px-4 py-14">
        <h2 id="about-heading" className="font-display text-3xl font-bold">
          About
        </h2>
        <div className="mt-6 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-xl border-2 border-ink bg-white">
              <summary className="cursor-pointer list-none p-4 font-bold">{f.q}</summary>
              <p className="px-4 pb-4">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
