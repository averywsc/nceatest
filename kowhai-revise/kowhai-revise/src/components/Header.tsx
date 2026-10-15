import Link from 'next/link';
import { SITE_NAME } from '@/lib/site';
import { LogoMark } from './Mascot';
import SearchBox from './SearchBox';

const groups: { heading: string; links: { label: string; href: string }[] }[] = [
  { heading: 'Exams', links: [{ label: 'Past exams', href: '/past-papers' }, { label: 'Mock exams', href: '/mock-exams' }] },
  { heading: 'Content', links: [{ label: 'Levels', href: '/levels' }, { label: 'Subjects', href: '/subjects' }, { label: 'Standards', href: '/standards' }] },
  {
    heading: 'Info',
    links: [
      { label: 'How NCEA works', href: '/how-ncea-works' },
      { label: 'How Scholarship works', href: '/how-scholarship-works' },
      { label: 'Reviews', href: '/reviews' },
    ],
  },
];

export default function Header() {
  return (
    <header className="border-b-4 border-ink bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-display text-2xl font-bold">
          <LogoMark className="h-9 w-9" />
          {SITE_NAME}
        </Link>
        <SearchBox />
        <nav aria-label="Main" className="flex flex-wrap items-center gap-2">
          {groups.map((g) => (
            <details key={g.heading} className="relative">
              <summary className="cursor-pointer list-none rounded-full border-2 border-ink px-4 py-1 font-bold hover:bg-kowhai">{g.heading}</summary>
              <ul className="absolute left-0 z-30 mt-1 w-52 rounded-lg border-2 border-ink bg-white p-2 shadow-lg">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="block rounded px-2 py-1 hover:bg-mist">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
          <Link href="/dashboard" className="rounded-full border-2 border-ink bg-kowhai px-4 py-1 font-bold">
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
