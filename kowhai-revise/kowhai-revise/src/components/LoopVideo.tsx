'use client';
import { useEffect, useRef, useState } from 'react';

/** Short muted looping clip. Loads lazily, plays only on screen, and shows controls instead of autoplay for reduced motion. */
export default function LoopVideo({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduced(isReduced);
    const el = ref.current;
    if (!el || isReduced) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void el.play().catch(() => undefined);
      else el.pause();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      aria-label={label}
      muted
      loop
      playsInline
      preload="none"
      controls={reduced}
      className="w-full rounded-xl border-2 border-ink bg-white"
    />
  );
}
