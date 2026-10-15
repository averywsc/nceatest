/**
 * Simple harmonic motion maths for the reference circle diagram.
 *
 * One phase value drives everything. The motion starts at the right-hand end, so:
 *   x = A cos(phase)             displacement      x / A      = cos(phase)
 *   v = -A w sin(phase)          velocity          v / v_max  = -sin(phase)   (v_max = A w)
 *   a = -A w^2 cos(phase)        acceleration      a / a_max  = -cos(phase)   (a_max = A w^2)
 * Positive is to the right. The reference-circle point is at angle `phase`, anticlockwise from the +x axis.
 */

export const TWO_PI = Math.PI * 2;

export function normalisePhase(phase: number): number {
  const r = phase % TWO_PI;
  return r < 0 ? r + TWO_PI : r;
}

export function toDegrees(phase: number): number {
  return (normalisePhase(phase) * 180) / Math.PI;
}

export function shmState(phase: number): { x: number; v: number; a: number } {
  return { x: Math.cos(phase), v: -Math.sin(phase), a: -Math.cos(phase) };
}

/** Convert a pointer offset from the circle centre (screen coordinates, y down) into a phase. */
export function phaseFromPoint(dx: number, dy: number): number {
  return normalisePhase(Math.atan2(-dy, dx));
}

export function phaseFromFraction(fraction: number): number {
  return normalisePhase(Math.min(1, Math.max(0, fraction)) * TWO_PI);
}

export function formatFraction(value: number): string {
  const r = Math.abs(value) < 0.005 ? 0 : value;
  return (r < 0 ? '\u2212' : '') + Math.abs(r).toFixed(2);
}

export function describePhase(phase: number): string {
  const { x, v, a } = shmState(phase);
  const deg = Math.round(toDegrees(phase)) % 360;
  const side = (n: number) => (n > 0 ? 'right' : 'left');
  let position: string;
  if (Math.abs(x) > 0.98) position = `at the ${side(x)} end of its swing, at maximum displacement`;
  else if (Math.abs(x) < 0.02) position = 'passing through the centre (equilibrium) position';
  else position = `${Math.abs(x).toFixed(2)} of the amplitude to the ${side(x)} of centre`;

  let velocity: string;
  if (Math.abs(v) < 0.02) velocity = 'momentarily at rest';
  else if (Math.abs(v) > 0.98) velocity = `moving ${side(v)} at its maximum speed`;
  else velocity = `moving ${side(v)} at ${Math.abs(v).toFixed(2)} of its maximum speed`;

  let acceleration: string;
  if (Math.abs(a) < 0.02) acceleration = 'The acceleration is zero.';
  else {
    const size = Math.abs(a) > 0.98 ? 'maximum' : `${Math.abs(a).toFixed(2)} of maximum`;
    acceleration = `The acceleration is ${size}, directed ${side(a)}, back toward the centre.`;
  }
  return `Phase ${deg} degrees. The mass is ${position}, ${velocity}. ${acceleration}`;
}
