import { describe, expect, it } from 'vitest';
import { describePhase, formatFraction, normalisePhase, phaseFromFraction, phaseFromPoint, shmState, toDegrees, TWO_PI } from '@/lib/shm';

describe('shm maths', () => {
  it('normalises phase into 0..2pi', () => {
    expect(normalisePhase(-Math.PI / 2)).toBeCloseTo(1.5 * Math.PI);
    expect(normalisePhase(TWO_PI + 1)).toBeCloseTo(1);
  });

  it('has the right values at the key points', () => {
    expect(shmState(0)).toEqual({ x: 1, v: -0, a: -1 });
    const quarter = shmState(Math.PI / 2);
    expect(quarter.x).toBeCloseTo(0);
    expect(quarter.v).toBeCloseTo(-1);
    expect(quarter.a).toBeCloseTo(0);
    const half = shmState(Math.PI);
    expect(half.x).toBeCloseTo(-1);
    expect(half.a).toBeCloseTo(1);
  });

  it('keeps acceleration opposite to displacement', () => {
    for (let p = 0; p < TWO_PI; p += 0.1) {
      const s = shmState(p);
      expect(s.a).toBeCloseTo(-s.x);
    }
  });

  it('turns a pointer position into a phase', () => {
    expect(phaseFromPoint(10, 0)).toBeCloseTo(0);
    expect(toDegrees(phaseFromPoint(0, -10))).toBeCloseTo(90); // up on screen
    expect(toDegrees(phaseFromPoint(-10, 0))).toBeCloseTo(180);
    expect(toDegrees(phaseFromPoint(0, 10))).toBeCloseTo(270);
    expect(phaseFromFraction(2)).toBeCloseTo(0); // clamped to 1 then wrapped
  });

  it('formats and describes', () => {
    expect(formatFraction(-0.5)).toBe('\u22120.50');
    expect(formatFraction(-0.001)).toBe('0.00');
    expect(describePhase(0)).toContain('right end');
    expect(describePhase(Math.PI / 2)).toContain('centre');
    expect(describePhase(Math.PI / 2)).toContain('acceleration is zero');
  });
});
