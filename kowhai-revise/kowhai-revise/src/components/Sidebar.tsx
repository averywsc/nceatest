'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { percent } from '@/lib/progress';
import { useProgress } from './ProgressProvider';

export interface SidebarData {
  subjectTitle: string;
  subjectHref: string;
  levelLabel: string;
  standards: {
    slug: string;
    asNumber: string;
    title: string;
    groups: { slug: string; title: string; pages: { key: string; title: string; href: string }[] }[];
  }[];
}

const HIDDEN_KEY = 'kr:sidebar-hidden:v1';
const SCROLL_KEY = 'kr:sidebar-scroll:v1';

function Tree({ data, pathname }: { data: SidebarData; pathname: string }) {
  const { countDone, isDone } = useProgress();
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const navRef = useRef<HTMLElement>(null);
  const uid = useId();
  // Practice URLs mirror note URLs with an extra "practice" segment, so compare without it.
  const current = pathname.replace(/\/practice(?=\/)/, '');

  const allKeys = data.standards.flatMap((s) => s.groups.flatMap((g) => g.pages.map((p) => p.key)));
  const done = countDone(allKeys);
  const pct = percent(done, allKeys.length);

  // Expand the standard that contains the current page.
  useEffect(() => {
    const std = data.standards.find((s) => s.groups.some((g) => g.pages.some((p) => p.href === current)));
    if (std) setOpen((o) => (o[std.slug] ? o : { ...o, [std.slug]: true }));
  }, [current, data.standards]);

  // Remember scroll position across full reloads (client navigations keep it because the layout persists).
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    try {
      el.scrollTop = Number(sessionStorage.getItem(SCROLL_KEY) ?? 0);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <nav
      ref={navRef}
      aria-label={`${data.subjectTitle} ${data.levelLabel} topics`}
      className="max-h-[calc(100vh-8rem)] overflow-y-auto pr-1"
      onScroll={(e) => {
        try {
          sessionStorage.setItem(SCROLL_KEY, String(e.currentTarget.scrollTop));
        } catch {
          /* ignore */
        }
      }}
    >
      <h2 className="font-display text-lg font-bold">
        <Link href={data.subjectHref} className="underline decoration-kowhai decoration-4 underline-offset-4">
          {data.subjectTitle} {data.levelLabel}
        </Link>
      </h2>
      <div className="mt-3">
        <div
          role="progressbar"
          aria-label="Notes completed"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          className="h-3 overflow-hidden rounded-full border-2 border-ink bg-white"
        >
          <div className="h-full bg-fern" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-1 text-sm font-bold">
          {pct}% · {done} of {allKeys.length} notes complete
        </p>
      </div>
      <ul className="mt-4 space-y-2">
        {data.standards.map((s) => {
          const keys = s.groups.flatMap((g) => g.pages.map((p) => p.key));
          const isOpen = !!open[s.slug];
          return (
            <li key={s.slug} className="rounded-lg border-2 border-ink bg-white">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${uid}-std-${s.slug}`}
                onClick={() => setOpen((o) => ({ ...o, [s.slug]: !isOpen }))}
                className="flex w-full items-start justify-between gap-2 p-3 text-left"
              >
                <span>
                  <span className="block text-sm font-bold text-fern">AS {s.asNumber}</span>
                  <span className="block font-bold leading-snug">{s.title}</span>
                </span>
                <span className="whitespace-nowrap text-sm font-bold">
                  {countDone(keys)}/{keys.length}
                </span>
              </button>
              <div id={`${uid}-std-${s.slug}`} hidden={!isOpen} className="border-t-2 border-ink px-3 pb-3">
                {s.groups.map((g) => (
                  <div key={g.slug} className="mt-3">
                    <h3 className="text-sm font-bold">{g.title}</h3>
                    <ul className="mt-1 space-y-1">
                      {g.pages.map((p) => (
                        <li key={p.key}>
                          <Link
                            href={p.href}
                            aria-current={p.href === current ? 'page' : undefined}
                            className={`block rounded px-2 py-1 ${p.href === current ? 'bg-kowhai font-bold' : 'hover:bg-mist'}`}
                          >
                            {p.title}
                            {isDone(p.key) && <span className="sr-only"> (complete)</span>}
                            {isDone(p.key) && <span aria-hidden="true"> ✓</span>}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function Sidebar({ data }: { data: SidebarData }) {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const openerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      setHidden(localStorage.getItem(HIDDEN_KEY) === '1');
    } catch {
      /* ignore */
    }
  }, []);

  const setHiddenPersist = (value: boolean) => {
    setHidden(value);
    try {
      localStorage.setItem(HIDDEN_KEY, value ? '1' : '0');
    } catch {
      /* ignore */
    }
  };

  const closeDrawer = useCallback(() => {
    setDrawer(false);
    openerRef.current?.focus();
  }, []);

  // Close the drawer after navigating.
  useEffect(() => setDrawer(false), [pathname]);

  useEffect(() => {
    if (drawer) closeRef.current?.focus();
  }, [drawer]);

  const onDrawerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') return closeDrawer();
    if (e.key !== 'Tab' || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      {/* Small screens: topics drawer */}
      <div className="lg:hidden">
        <button
          ref={openerRef}
          type="button"
          aria-haspopup="dialog"
          onClick={() => setDrawer(true)}
          className="rounded-full border-2 border-ink bg-white px-4 py-2 font-bold"
        >
          Topics and progress
        </button>
        {drawer && (
          <div role="dialog" aria-modal="true" aria-label="Topics and progress" className="fixed inset-0 z-40 bg-ink/60" onKeyDown={onDrawerKeyDown}>
            <div ref={panelRef} className="absolute inset-y-0 left-0 w-80 max-w-[88vw] overflow-y-auto bg-paper p-4">
              <button ref={closeRef} type="button" onClick={closeDrawer} className="mb-3 rounded-full border-2 border-ink bg-white px-4 py-1 font-bold">
                Close topics
              </button>
              <Tree data={data} pathname={pathname} />
            </div>
          </div>
        )}
      </div>

      {/* Large screens: collapsible sidebar */}
      <aside className="hidden lg:block lg:w-80 lg:shrink-0" aria-label="Topic sidebar">
        {hidden ? (
          <button type="button" onClick={() => setHiddenPersist(false)} className="rounded-full border-2 border-ink bg-white px-4 py-2 font-bold">
            Show topics
          </button>
        ) : (
          <div className="sticky top-4">
            <button type="button" onClick={() => setHiddenPersist(true)} className="mb-3 rounded-full border-2 border-ink bg-white px-4 py-1 font-bold">
              Hide topics
            </button>
            <Tree data={data} pathname={pathname} />
          </div>
        )}
      </aside>
    </>
  );
}
