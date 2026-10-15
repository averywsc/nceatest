import { addScore, parseScores, type ScoreMap } from './progress';

export const PROGRESS_KEY = 'kr:progress:v1';
export const SCORES_KEY = 'kr:scores:v1';
export const SAVED_SUBJECTS_KEY = 'kr:saved-subjects:v1';

export function loadScores(): ScoreMap {
  try {
    return parseScores(localStorage.getItem(SCORES_KEY));
  } catch {
    return {};
  }
}

export function recordScore(pageKey: string, score: number, total: number): void {
  try {
    localStorage.setItem(SCORES_KEY, JSON.stringify(addScore(loadScores(), pageKey, score, total)));
  } catch {
    /* storage unavailable (private mode or full): ignore */
  }
}

export function loadSavedSubjects(): string[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(SAVED_SUBJECTS_KEY) ?? '[]');
    return Array.isArray(data) ? data.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function storeSavedSubjects(list: string[]): void {
  try {
    localStorage.setItem(SAVED_SUBJECTS_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}
