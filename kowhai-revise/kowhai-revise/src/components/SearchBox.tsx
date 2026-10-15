'use client';
import Fuse from 'fuse.js';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { SearchEntry } from '@/lib/search';

export default function SearchBox() {
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState('');
  const [entries, setEntries] = useState<SearchEntry[] | null>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const load = () => {
    if (entries) return;
    fetch('/api/search')
      .then((r) => r.json() as Promise<SearchEntry[]>)
      .then(setEntries)
      .catch(() => setEntries([]));
  };

  const fuse = useMemo(
    () => (entries ? new Fuse(entries, { keys: [{ name: 'title', weight: 2 }, 'snippet'], threshold: 0.35, ignoreLocation: true }) : null),
    [entries],
  );
  const results = useMemo(() => (fuse && query.trim().length >= 2 ? fuse.search(query.trim(), { limit: 8 }).map((r) => r.item) : []), [fuse, query]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const go = (entry: SearchEntry) => {
    setOpen(false);
    setQuery('');
    router.push(entry.href);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const showList = open && query.trim().length >= 2;
  let lastGroup = '';

  return (
    <div ref={boxRef} className="relative w-full max-w-sm" role="search">
      <label htmlFor={`${listId}-input`} className="sr-only">
        Search the revision notes
      </label>
      <input
        id={`${listId}-input`}
        type="search"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList && results[active] ? `${listId}-${active}` : undefined}
        placeholder="Search the revision notes"
        value={query}
        autoComplete="off"
        onFocus={() => {
          load();
          setOpen(true);
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
        className="w-full rounded-full border-2 border-ink bg-white px-4 py-2"
      />
      <ul
        id={listId}
        role="listbox"
        aria-label="Search results"
        hidden={!showList}
        className="absolute left-0 right-0 top-full z-30 mt-1 max-h-96 overflow-y-auto rounded-lg border-2 border-ink bg-white p-1 shadow-lg"
      >
        {showList && results.length === 0 && <li role="presentation" className="p-3 text-sm">{entries ? 'No matches. Try a different word.' : 'Loading search'}</li>}
        {results.map((r, i) => {
          const header = r.subjectTitle !== lastGroup ? r.subjectTitle : null;
          lastGroup = r.subjectTitle;
          return (
            <li key={r.id} role="presentation">
              {header && <div className="px-2 pt-2 text-sm font-bold text-fern">{header}</div>}
              <div
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  go(r);
                }}
                className={`cursor-pointer rounded px-2 py-2 ${i === active ? 'bg-kowhai' : ''}`}
              >
                <span className="block font-bold">{r.title}</span>
                <span className="block text-xs">
                  AS {r.asNumber} · {r.levelLabel} · {r.kind === 'page' ? 'Note' : r.kind === 'heading' ? 'Section' : 'Glossary'}
                </span>
                <span className="block truncate text-sm">{r.snippet}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
