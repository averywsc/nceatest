/** Pure progress logic. No browser or Node APIs, so it is easy to test and reuse for server sync. */

export interface ProgressEntry {
  done: boolean;
  at: number;
}
export type ProgressMap = Record<string, ProgressEntry>;

export function isDone(map: ProgressMap, key: string): boolean {
  return map[key]?.done === true;
}

export function setDone(map: ProgressMap, key: string, done: boolean, now: number = Date.now()): ProgressMap {
  return { ...map, [key]: { done, at: now } };
}

export function toggle(map: ProgressMap, key: string, now: number = Date.now()): ProgressMap {
  return setDone(map, key, !isDone(map, key), now);
}

/** Last write wins per page. Used when a signed-out browser syncs with the server on sign-in. */
export function mergeProgress(a: ProgressMap, b: ProgressMap): ProgressMap {
  const out: ProgressMap = { ...a };
  for (const [key, entry] of Object.entries(b)) {
    const existing = out[key];
    if (!existing || entry.at > existing.at) out[key] = entry;
  }
  return out;
}

export function countDone(map: ProgressMap, keys: string[]): number {
  return keys.reduce((n, k) => n + (isDone(map, k) ? 1 : 0), 0);
}

export function percent(done: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((done / total) * 100);
}

export function parseProgress(raw: string | null): ProgressMap {
  if (!raw) return {};
  try {
    const data: unknown = JSON.parse(raw);
    if (typeof data !== 'object' || data === null || Array.isArray(data)) return {};
    const out: ProgressMap = {};
    for (const [key, value] of Object.entries(data)) {
      const v = value as Partial<ProgressEntry> | null;
      if (v && typeof v.done === 'boolean' && typeof v.at === 'number') out[key] = { done: v.done, at: v.at };
    }
    return out;
  } catch {
    return {};
  }
}

export function serialiseProgress(map: ProgressMap): string {
  return JSON.stringify(map);
}

export interface ScoreAttempt {
  score: number;
  total: number;
  at: number;
}
export type ScoreMap = Record<string, ScoreAttempt[]>;

const MAX_ATTEMPTS = 10;

export function addScore(map: ScoreMap, key: string, score: number, total: number, now: number = Date.now()): ScoreMap {
  const attempts = [...(map[key] ?? []), { score, total, at: now }].slice(-MAX_ATTEMPTS);
  return { ...map, [key]: attempts };
}

export function parseScores(raw: string | null): ScoreMap {
  if (!raw) return {};
  try {
    const data: unknown = JSON.parse(raw);
    if (typeof data !== 'object' || data === null || Array.isArray(data)) return {};
    const out: ScoreMap = {};
    for (const [key, list] of Object.entries(data)) {
      if (!Array.isArray(list)) continue;
      out[key] = list.filter(
        (a): a is ScoreAttempt => !!a && typeof a.score === 'number' && typeof a.total === 'number' && typeof a.at === 'number',
      );
    }
    return out;
  } catch {
    return {};
  }
}
