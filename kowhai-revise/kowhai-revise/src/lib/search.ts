import GithubSlugger from 'github-slugger';
import { getCatalog, getGlossary, loadAllPages } from './content';
import { levelLabel, type LevelSlug } from './types';

export interface SearchEntry {
  id: string;
  kind: 'page' | 'heading' | 'glossary';
  title: string;
  snippet: string;
  href: string;
  subjectTitle: string;
  asNumber: string;
  level: LevelSlug;
  levelLabel: string;
}

/** Build the search index at build time: page titles, H2 headings and glossary terms. */
export function buildSearchIndex(): SearchEntry[] {
  const pages = loadAllPages();
  getCatalog(); // validates the content tree
  const glossary = getGlossary();
  const entries: SearchEntry[] = [];
  const termHome = new Map<string, (typeof pages)[number]>();

  for (const p of pages) {
    const base = { subjectTitle: p.subjectTitle, asNumber: p.asNumber, level: p.level, levelLabel: levelLabel(p.level) };
    entries.push({ ...base, id: p.key, kind: 'page', title: p.title, snippet: p.description, href: p.href });
    const slugger = new GithubSlugger();
    for (const m of p.body.matchAll(/^##\s+(.+)$/gm)) {
      const heading = m[1].trim();
      entries.push({
        ...base,
        id: `${p.key}#${heading}`,
        kind: 'heading',
        title: heading,
        snippet: `In: ${p.title}`,
        href: `${p.href}#${slugger.slug(heading)}`,
      });
    }
    for (const m of p.body.matchAll(/<Term id="([^"]+)"/g)) if (!termHome.has(m[1])) termHome.set(m[1], p);
  }

  for (const [id, entry] of Object.entries(glossary)) {
    const home = termHome.get(id);
    if (!home) continue;
    entries.push({
      id: `glossary:${id}`,
      kind: 'glossary',
      title: entry.term,
      snippet: entry.definition,
      href: home.href,
      subjectTitle: home.subjectTitle,
      asNumber: home.asNumber,
      level: home.level,
      levelLabel: levelLabel(home.level),
    });
  }
  return entries;
}
