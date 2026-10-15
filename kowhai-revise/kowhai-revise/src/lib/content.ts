import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {
  isLevelSlug,
  LEVELS,
  type Catalog,
  type GlossaryEntry,
  type LevelSlug,
  type PageMeta,
  type PageNode,
  type PracticeQuestion,
  type StandardNode,
  type SubjectNode,
} from './types';

export const CONTENT_DIR = path.join(process.cwd(), 'content');

const STRING_FIELDS = ['title', 'description', 'subjectTitle', 'standardTitle', 'topicGroupTitle'] as const;
const NUMBER_FIELDS = ['standardOrder', 'groupOrder', 'order'] as const;

/**
 * Parse one MDX file. relPath is relative to the content folder:
 * <subject>/<level>/<standard>/<topic-group>/<page>.mdx
 */
export function parsePage(relPath: string, raw: string, filePath: string = relPath): PageMeta {
  const parts = relPath.replace(/\\/g, '/').replace(/\.mdx$/, '').split('/');
  if (parts.length !== 5) {
    throw new Error(`${relPath}: expected content/<subject>/<level>/<standard>/<topic-group>/<page>.mdx`);
  }
  const [subject, level, standard, topicGroup, slug] = parts;
  if (!isLevelSlug(level)) {
    throw new Error(`${relPath}: level folder must be one of ${LEVELS.map((l) => l.slug).join(', ')}`);
  }
  const { data, content } = matter(raw);
  for (const f of STRING_FIELDS) {
    if (typeof data[f] !== 'string' || !data[f].trim()) throw new Error(`${relPath}: frontmatter "${f}" must be a non-empty string`);
  }
  for (const f of NUMBER_FIELDS) {
    if (typeof data[f] !== 'number') throw new Error(`${relPath}: frontmatter "${f}" must be a number`);
  }
  if (!['string', 'number'].includes(typeof data.asNumber) || !String(data.asNumber).trim()) {
    throw new Error(`${relPath}: frontmatter "asNumber" is required`);
  }
  const base = `/subjects/${subject}/${level}`;
  const tail = `${standard}/${topicGroup}/${slug}`;
  return {
    title: data.title,
    description: data.description,
    subjectTitle: data.subjectTitle,
    asNumber: String(data.asNumber),
    standardTitle: data.standardTitle,
    standardOrder: data.standardOrder,
    topicGroupTitle: data.topicGroupTitle,
    groupOrder: data.groupOrder,
    order: data.order,
    subject,
    level,
    standard,
    topicGroup,
    slug,
    key: `${subject}/${level}/${standard}/${topicGroup}/${slug}`,
    href: `${base}/${tail}`,
    practiceHref: `${base}/practice/${tail}`,
    body: content,
    filePath,
  };
}

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return walk(full);
    return e.name.endsWith('.mdx') ? [full] : [];
  });
}

let pageCache: PageMeta[] | null = null;

export function loadAllPages(dir: string = CONTENT_DIR): PageMeta[] {
  const useCache = dir === CONTENT_DIR && process.env.NODE_ENV === 'production';
  if (useCache && pageCache) return pageCache;
  const pages = walk(dir).map((file) => parsePage(path.relative(dir, file), fs.readFileSync(file, 'utf8'), file));
  if (useCache) pageCache = pages;
  return pages;
}

function conflict(p: PageMeta, field: string): Error {
  return new Error(`${p.key}: "${field}" disagrees with another page in the same ${field.startsWith('topic') ? 'topic group' : field.startsWith('subject') ? 'subject' : 'standard'}`);
}

/** Build the subject > standard > topic group > page tree from loaded pages. */
export function buildCatalog(pages: PageMeta[]): Catalog {
  const subjects = new Map<string, SubjectNode>();
  for (const p of pages) {
    let subject = subjects.get(p.subject);
    if (!subject) {
      subject = { slug: p.subject, title: p.subjectTitle, levels: [], standardsByLevel: {} };
      subjects.set(p.subject, subject);
    } else if (subject.title !== p.subjectTitle) {
      throw conflict(p, 'subjectTitle');
    }
    const standards = (subject.standardsByLevel[p.level] ??= []);
    let std = standards.find((s) => s.slug === p.standard);
    if (!std) {
      std = {
        slug: p.standard,
        subject: p.subject,
        level: p.level,
        asNumber: p.asNumber,
        title: p.standardTitle,
        order: p.standardOrder,
        groups: [],
        pageCount: 0,
      };
      standards.push(std);
    } else if (std.asNumber !== p.asNumber) throw conflict(p, 'asNumber');
    else if (std.title !== p.standardTitle) throw conflict(p, 'standardTitle');
    let group = std.groups.find((g) => g.slug === p.topicGroup);
    if (!group) {
      group = { slug: p.topicGroup, title: p.topicGroupTitle, order: p.groupOrder, pages: [] };
      std.groups.push(group);
    } else if (group.title !== p.topicGroupTitle) throw conflict(p, 'topicGroupTitle');
    if (group.pages.some((x) => x.slug === p.slug)) throw new Error(`${p.key}: duplicate page`);
    group.pages.push({
      key: p.key,
      slug: p.slug,
      title: p.title,
      description: p.description,
      order: p.order,
      href: p.href,
      practiceHref: p.practiceHref,
    });
    std.pageCount += 1;
  }
  const levelOrder = LEVELS.map((l) => l.slug);
  const list = [...subjects.values()];
  for (const s of list) {
    for (const standards of Object.values(s.standardsByLevel)) {
      standards.sort((a, b) => a.order - b.order || a.asNumber.localeCompare(b.asNumber));
      for (const std of standards) {
        std.groups.sort((a, b) => a.order - b.order);
        for (const g of std.groups) g.pages.sort((a, b) => a.order - b.order);
      }
    }
    s.levels = (Object.keys(s.standardsByLevel) as LevelSlug[]).sort((a, b) => levelOrder.indexOf(a) - levelOrder.indexOf(b));
  }
  list.sort((a, b) => a.title.localeCompare(b.title));
  return { subjects: list };
}

export function getCatalog(): Catalog {
  return buildCatalog(loadAllPages());
}

export function standardsFor(subject: SubjectNode, level: LevelSlug): StandardNode[] {
  return subject.standardsByLevel[level] ?? [];
}

/** Every page of a subject at a level in reading order. */
export function orderedPages(subject: SubjectNode, level: LevelSlug): PageNode[] {
  return standardsFor(subject, level).flatMap((s) => s.groups.flatMap((g) => g.pages));
}

export function adjacentPages(subject: SubjectNode, level: LevelSlug, key: string): { prev?: PageNode; next?: PageNode } {
  const pages = orderedPages(subject, level);
  const i = pages.findIndex((p) => p.key === key);
  if (i === -1) return {};
  return { prev: pages[i - 1], next: pages[i + 1] };
}

export function countNotes(subject: SubjectNode, level?: LevelSlug): number {
  const levels = level ? [level] : subject.levels;
  return levels.reduce((n, l) => n + standardsFor(subject, l).reduce((m, s) => m + s.pageCount, 0), 0);
}

export function getGlossary(): Record<string, GlossaryEntry> {
  const file = path.join(CONTENT_DIR, 'glossary.json');
  return JSON.parse(fs.readFileSync(file, 'utf8')) as Record<string, GlossaryEntry>;
}

export function loadPractice(page: PageMeta): PracticeQuestion[] {
  const file = page.filePath.replace(/\.mdx$/, '.practice.json');
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf8')) as PracticeQuestion[];
}
