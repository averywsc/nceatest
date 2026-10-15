export type LevelSlug = 'level-2' | 'level-3' | 'scholarship';

export const LEVELS: ReadonlyArray<{ slug: LevelSlug; label: string; blurb: string }> = [
  { slug: 'level-2', label: 'Level 2', blurb: 'Year 12 standards. Lock in the core ideas.' },
  { slug: 'level-3', label: 'Level 3', blurb: 'Year 13 standards. Go deeper and aim for Excellence.' },
  { slug: 'scholarship', label: 'Scholarship', blurb: 'Stretch problems for top-of-the-class thinking.' },
];

export function isLevelSlug(value: string): value is LevelSlug {
  return LEVELS.some((l) => l.slug === value);
}

export function levelLabel(slug: LevelSlug): string {
  return LEVELS.find((l) => l.slug === slug)?.label ?? slug;
}

/** Fields every MDX file must have in its frontmatter. */
export interface PageFrontmatter {
  title: string;
  description: string;
  subjectTitle: string;
  asNumber: string;
  standardTitle: string;
  standardOrder: number;
  topicGroupTitle: string;
  groupOrder: number;
  order: number;
}

/** A page as loaded from disk. subject/level/standard/topicGroup/slug come from the file path. */
export interface PageMeta extends PageFrontmatter {
  subject: string;
  level: LevelSlug;
  standard: string;
  topicGroup: string;
  slug: string;
  key: string;
  href: string;
  practiceHref: string;
  body: string;
  filePath: string;
}

export interface PageNode {
  key: string;
  slug: string;
  title: string;
  description: string;
  order: number;
  href: string;
  practiceHref: string;
}

export interface TopicGroupNode {
  slug: string;
  title: string;
  order: number;
  pages: PageNode[];
}

export interface StandardNode {
  slug: string;
  subject: string;
  level: LevelSlug;
  asNumber: string;
  title: string;
  order: number;
  groups: TopicGroupNode[];
  pageCount: number;
}

export interface SubjectNode {
  slug: string;
  title: string;
  levels: LevelSlug[];
  standardsByLevel: Partial<Record<LevelSlug, StandardNode[]>>;
}

export interface Catalog {
  subjects: SubjectNode[];
}

export interface GlossaryEntry {
  term: string;
  definition: string;
}

export type PracticeQuestion =
  | { id: string; type: 'mcq'; prompt: string; options: string[]; answer: number; solution: string; noteSection?: string }
  | { id: string; type: 'short'; prompt: string; answer: string; solution: string; noteSection?: string };
