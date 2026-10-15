import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { adjacentPages, buildCatalog, countNotes, getGlossary, loadAllPages, orderedPages, parsePage, standardsFor } from '@/lib/content';

const fm = (over: Record<string, string | number> = {}) => {
  const base: Record<string, string | number> = {
    title: 'T', description: 'D', subjectTitle: 'Physics', asNumber: '91524', standardTitle: 'Mechanics',
    standardOrder: 1, topicGroupTitle: 'Group', groupOrder: 1, order: 1, ...over,
  };
  return `---\n${Object.entries(base).map(([k, v]) => `${k}: ${typeof v === 'string' ? JSON.stringify(v) : v}`).join('\n')}\n---\nBody`;
};
const page = (rel: string, over?: Record<string, string | number>) => parsePage(rel, fm(over));

describe('parsePage', () => {
  it('reads path and frontmatter', () => {
    const p = page('physics/level-3/mechanics/shm/basics.mdx');
    expect(p.subject).toBe('physics');
    expect(p.href).toBe('/subjects/physics/level-3/mechanics/shm/basics');
    expect(p.practiceHref).toBe('/subjects/physics/level-3/practice/mechanics/shm/basics');
    expect(p.body.trim()).toBe('Body');
  });
  it('rejects bad paths and missing fields', () => {
    expect(() => page('physics/level-3/basics.mdx')).toThrow(/expected content/);
    expect(() => page('physics/level-9/a/b/c.mdx')).toThrow(/level folder/);
    expect(() => parsePage('physics/level-3/a/b/c.mdx', '---\ntitle: x\n---\n')).toThrow(/description/);
  });
});

describe('buildCatalog', () => {
  const pages = [
    page('physics/level-3/waves/w/two.mdx', { asNumber: '91523', standardTitle: 'Waves', standardOrder: 2, topicGroupTitle: 'W', order: 2, title: 'Two' }),
    page('physics/level-3/mechanics/shm/b.mdx', { order: 2, title: 'B' }),
    page('physics/level-3/mechanics/shm/a.mdx', { order: 1, title: 'A' }),
    page('physics/level-3/mechanics/circ/c.mdx', { groupOrder: 0, topicGroupTitle: 'Circ', title: 'C' }),
  ];
  const catalog = buildCatalog(pages);
  const physics = catalog.subjects[0];

  it('sorts standards, groups and pages', () => {
    const std = standardsFor(physics, 'level-3');
    expect(std.map((s) => s.slug)).toEqual(['mechanics', 'waves']);
    expect(std[0].groups.map((g) => g.slug)).toEqual(['circ', 'shm']);
    expect(orderedPages(physics, 'level-3').map((p) => p.title)).toEqual(['C', 'A', 'B', 'Two']);
  });
  it('counts notes and finds neighbours', () => {
    expect(countNotes(physics)).toBe(4);
    expect(countNotes(physics, 'level-2')).toBe(0);
    const { prev, next } = adjacentPages(physics, 'level-3', 'physics/level-3/mechanics/shm/b');
    expect(prev?.title).toBe('A');
    expect(next?.title).toBe('Two');
    expect(adjacentPages(physics, 'level-3', 'nope')).toEqual({});
  });
  it('flags inconsistent frontmatter', () => {
    const bad = [page('physics/level-3/m/g/a.mdx'), page('physics/level-3/m/g/b.mdx', { standardTitle: 'Different' })];
    expect(() => buildCatalog(bad)).toThrow(/standardTitle/);
  });
});

describe('real content', () => {
  const pages = loadAllPages();
  it('loads and builds without errors', () => {
    expect(pages.length).toBeGreaterThanOrEqual(6);
    expect(() => buildCatalog(pages)).not.toThrow();
    expect(new Set(pages.map((p) => p.key)).size).toBe(pages.length);
  });
  it('only uses glossary terms that exist', () => {
    const glossary = getGlossary();
    for (const p of pages) {
      for (const m of p.body.matchAll(/<Term id="([^"]+)"/g)) {
        expect(glossary[m[1]], `${p.key} uses unknown glossary term "${m[1]}"`).toBeDefined();
      }
    }
  });
  it('has valid practice sets', () => {
    for (const p of pages) {
      const file = p.filePath.replace(/\.mdx$/, '.practice.json');
      if (!fs.existsSync(file)) continue;
      const qs = JSON.parse(fs.readFileSync(file, 'utf8')) as { type: string; options?: string[]; answer: unknown }[];
      for (const q of qs) {
        if (q.type === 'mcq') expect(q.options && (q.answer as number) < q.options.length).toBeTruthy();
      }
    }
  });
});
