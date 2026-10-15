import { describe, expect, it } from 'vitest';
import {
  addScore, countDone, isDone, mergeProgress, parseProgress, parseScores, percent, serialiseProgress, setDone, toggle,
} from '@/lib/progress';

describe('progress', () => {
  it('toggles a page on and off', () => {
    const a = toggle({}, 'p1', 1);
    expect(isDone(a, 'p1')).toBe(true);
    const b = toggle(a, 'p1', 2);
    expect(isDone(b, 'p1')).toBe(false);
  });

  it('does not mutate the original map', () => {
    const a = {};
    setDone(a, 'p1', true, 1);
    expect(a).toEqual({});
  });

  it('merges with last write wins', () => {
    const local = { p1: { done: true, at: 10 }, p2: { done: true, at: 5 } };
    const remote = { p1: { done: false, at: 20 }, p3: { done: true, at: 1 } };
    const merged = mergeProgress(local, remote);
    expect(merged.p1).toEqual({ done: false, at: 20 });
    expect(merged.p2.done).toBe(true);
    expect(merged.p3.done).toBe(true);
  });

  it('counts and rounds percentages', () => {
    const map = { a: { done: true, at: 1 }, b: { done: false, at: 1 } };
    expect(countDone(map, ['a', 'b', 'c'])).toBe(1);
    expect(percent(1, 3)).toBe(33);
    expect(percent(0, 0)).toBe(0);
  });

  it('round-trips and survives bad stored data', () => {
    const map = toggle({}, 'a', 3);
    expect(parseProgress(serialiseProgress(map))).toEqual(map);
    expect(parseProgress('not json')).toEqual({});
    expect(parseProgress('[1,2]')).toEqual({});
    expect(parseProgress(JSON.stringify({ a: { done: 'yes', at: 1 }, b: { done: true, at: 2 } }))).toEqual({
      b: { done: true, at: 2 },
    });
  });

  it('keeps only the latest ten score attempts', () => {
    let scores = {};
    for (let i = 0; i < 12; i++) scores = addScore(scores, 'p', i, 12, i);
    const attempts = (scores as Record<string, { score: number }[]>).p;
    expect(attempts).toHaveLength(10);
    expect(attempts[0].score).toBe(2);
    expect(parseScores('oops')).toEqual({});
  });
});
