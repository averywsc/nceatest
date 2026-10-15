'use client';
import { useId, useState } from 'react';

/** Inline term that reveals its definition on hover, keyboard focus or tap. Escape closes it. */
export default function GlossaryTerm({ definition, children }: { definition: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span className="relative inline" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-describedby={id}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
        className="cursor-help border-b-2 border-dotted border-fern font-bold text-ink"
      >
        {children}
      </button>
      <span
        id={id}
        role="tooltip"
        hidden={!open}
        className="absolute left-0 top-full z-20 mt-1 w-64 rounded-md border-2 border-ink bg-white p-3 text-sm font-normal leading-snug text-ink shadow-lg"
      >
        {definition}
      </span>
    </span>
  );
}
