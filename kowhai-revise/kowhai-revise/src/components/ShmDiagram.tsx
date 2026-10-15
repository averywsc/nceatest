'use client';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  TWO_PI,
  describePhase,
  formatFraction,
  normalisePhase,
  phaseFromFraction,
  phaseFromPoint,
  shmState,
  toDegrees,
} from '@/lib/shm';

const PERIOD_SECONDS = 4;
const SAMPLES = 120;
// Circle and pendulum panels share a 240 x 240 view box.
const VB = 240;
const CX = 120;
const CY = 120;
const R = 90;
const PIVOT_Y = 20;
const STRING = 170;
const MAX_SWING = 0.4; // radians
// Graph view box.
const GW = 320;
const GH = 84;
const MID = GH / 2;
const AMP = 32;

const ACCENT = '#B3261E'; // playhead colour
const INK = '#0B2B3A';
const FERN = '#1B6B4F';

type Fn = (phase: number) => number;

function Graph({
  label,
  symbol,
  fn,
  phase,
  onScrub,
}: {
  label: string;
  symbol: string;
  fn: Fn;
  phase: number;
  onScrub: (phase: number) => void;
}) {
  const d = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const p = (i / SAMPLES) * TWO_PI;
      pts.push(`${i === 0 ? 'M' : 'L'}${((i / SAMPLES) * GW).toFixed(1)} ${(MID - AMP * fn(p)).toFixed(1)}`);
    }
    return pts.join(' ');
  }, [fn]);
  const dragging = useRef(false);

  const scrub = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onScrub(phaseFromFraction((e.clientX - rect.left) / rect.width));
  };
  const px = (normalisePhase(phase) / TWO_PI) * GW;

  return (
    <svg
      viewBox={`0 0 ${GW} ${GH}`}
      role="img"
      aria-label={`${label} against phase. Drag across the graph to scrub.`}
      className="w-full cursor-ew-resize rounded-lg border-2 border-ink bg-white"
      style={{ touchAction: 'none' }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        dragging.current = true;
        scrub(e);
      }}
      onPointerMove={(e) => dragging.current && scrub(e)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <line x1="0" x2={GW} y1={MID} y2={MID} stroke={INK} strokeOpacity="0.35" strokeDasharray="4 4" />
      <path d={d} fill="none" stroke={FERN} strokeWidth="3" />
      <line x1={px} x2={px} y1="0" y2={GH} stroke={ACCENT} strokeWidth="2.5" />
      <circle cx={px} cy={MID - AMP * fn(phase)} r="5" fill={ACCENT} />
      <text x="6" y="14" fontSize="12" fontWeight="700" fill={INK}>
        {symbol}
      </text>
    </svg>
  );
}

const fnX: Fn = (p) => shmState(p).x;
const fnV: Fn = (p) => shmState(p).v;
const fnA: Fn = (p) => shmState(p).a;

export default function ShmDiagram() {
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(false);
  const phaseRef = useRef(0);
  const circleRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const descId = useId();

  const set = useCallback((p: number) => {
    const n = normalisePhase(p);
    phaseRef.current = n;
    setPhase(n);
  }, []);

  // Start playing only if the visitor has not asked for reduced motion.
  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(true);
  }, []);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      set(phaseRef.current + (dt * TWO_PI) / PERIOD_SECONDS);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, set]);

  const scrubTo = useCallback(
    (p: number) => {
      setPlaying(false);
      set(p);
    },
    [set],
  );

  const circleScrub = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = circleRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scale = VB / rect.width;
    scrubTo(phaseFromPoint((e.clientX - rect.left) * scale - CX, (e.clientY - rect.top) * scale - CY));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return; // let buttons and the slider handle their own keys
    const step = (e.shiftKey ? 15 : 5) * (Math.PI / 180);
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      scrubTo(phaseRef.current + step);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      scrubTo(phaseRef.current - step);
    } else if (e.key === ' ') {
      e.preventDefault();
      setPlaying((p) => !p);
    }
  };

  const { x, v, a } = shmState(phase);
  const deg = Math.round(toDegrees(phase)) % 360;
  const pointX = CX + R * Math.cos(phase);
  const pointY = CY - R * Math.sin(phase);
  const arcR = 28;
  const arcEnd = `${CX + arcR * Math.cos(phase)} ${CY - arcR * Math.sin(phase)}`;
  const theta = MAX_SWING * x;
  const bobX = CX + STRING * Math.sin(theta);
  const bobY = PIVOT_Y + STRING * Math.cos(theta);

  return (
    <div
      role="group"
      tabIndex={0}
      aria-label="Simple harmonic motion reference circle. Arrow keys scrub the phase. Space plays or pauses."
      aria-describedby={descId}
      onKeyDown={onKeyDown}
      className="my-8 rounded-xl border-2 border-ink bg-paper p-4"
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
          <svg
            ref={circleRef}
            viewBox={`0 0 ${VB} ${VB}`}
            role="img"
            aria-label="Reference circle. Drag the yellow point to change the phase."
            className="w-full cursor-grab rounded-lg border-2 border-ink bg-white"
            style={{ touchAction: 'none' }}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              dragging.current = true;
              circleScrub(e);
            }}
            onPointerMove={(e) => dragging.current && circleScrub(e)}
            onPointerUp={() => (dragging.current = false)}
            onPointerCancel={() => (dragging.current = false)}
          >
            <line x1="10" x2={VB - 10} y1={CY} y2={CY} stroke={INK} strokeOpacity="0.5" />
            <line x1={CX} x2={CX} y1="10" y2={VB - 10} stroke={INK} strokeOpacity="0.5" />
            <circle cx={CX} cy={CY} r={R} fill="#DCEBE6" fillOpacity="0.6" stroke={FERN} strokeWidth="3" />
            <path d={`M ${CX + arcR} ${CY} A ${arcR} ${arcR} 0 ${phase > Math.PI ? 1 : 0} 0 ${arcEnd}`} fill="none" stroke={INK} strokeWidth="2" />
            <line x1={CX} y1={CY} x2={pointX} y2={pointY} stroke={INK} strokeWidth="3" />
            <line x1={pointX} y1={pointY} x2={pointX} y2={CY} stroke={ACCENT} strokeWidth="2" strokeDasharray="5 4" />
            <circle cx={pointX} cy={CY} r="5" fill={ACCENT} />
            <circle cx={pointX} cy={pointY} r="12" fill="#F5B700" stroke={INK} strokeWidth="3" />
          </svg>
          <svg viewBox={`0 0 ${VB} ${VB}`} role="img" aria-label="Pendulum swinging in time with the circle" className="w-full rounded-lg border-2 border-ink bg-white">
            <line x1={CX} x2={CX} y1={PIVOT_Y} y2={PIVOT_Y + STRING} stroke={INK} strokeOpacity="0.4" strokeDasharray="4 4" />
            <line x1="40" x2="200" y1={PIVOT_Y} y2={PIVOT_Y} stroke={INK} strokeWidth="4" />
            <line x1={CX} y1={PIVOT_Y} x2={bobX} y2={bobY} stroke={INK} strokeWidth="3" />
            <circle cx={bobX} cy={bobY} r="14" fill="#F5B700" stroke={INK} strokeWidth="3" />
          </svg>
        </div>

        <div className="flex flex-col gap-3">
          <Graph label="Displacement" symbol="x / A" fn={fnX} phase={phase} onScrub={scrubTo} />
          <Graph label="Velocity" symbol="v / v max" fn={fnV} phase={phase} onScrub={scrubTo} />
          <Graph label="Acceleration" symbol="a / a max" fn={fnA} phase={phase} onScrub={scrubTo} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="rounded-full border-2 border-ink bg-kowhai px-5 py-2 font-bold"
        >
          {playing ? 'Pause' : 'Play'}
        </button>
        <label className="flex items-center gap-2 font-bold">
          Phase angle
          <input
            type="range"
            min={0}
            max={359}
            step={1}
            value={deg}
            onChange={(e) => scrubTo((Number(e.target.value) * Math.PI) / 180)}
            className="w-40 accent-fern"
          />
        </label>
        <dl className="flex flex-wrap gap-x-5 gap-y-1 text-sm" aria-hidden={playing}>
          <div><dt className="inline font-bold">Phase: </dt><dd className="inline">{deg}°</dd></div>
          <div><dt className="inline font-bold">x / A: </dt><dd className="inline">{formatFraction(x)}</dd></div>
          <div><dt className="inline font-bold">v / v max: </dt><dd className="inline">{formatFraction(v)}</dd></div>
          <div><dt className="inline font-bold">a / a max: </dt><dd className="inline">{formatFraction(a)}</dd></div>
        </dl>
      </div>

      <p id={descId} aria-live={playing ? 'off' : 'polite'} className="mt-3 text-sm">
        {describePhase(phase)}
      </p>
      <p className="mt-1 text-sm">
        Focus this box, then use the left and right arrow keys to scrub (hold Shift for bigger steps) and the space bar to play or pause.
      </p>
    </div>
  );
}
