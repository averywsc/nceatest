'use client';
import { useId, useState } from 'react';

export default function WorkedExample({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <section aria-labelledby={`${id}-title`} className="my-8 rounded-xl border-2 border-ink bg-white">
      <div className="flex items-center justify-between gap-4 bg-kowhai px-4 py-3">
        <h3 id={`${id}-title`} className="!my-0 font-display text-lg font-bold">
          Worked example: {title}
        </h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => setOpen((o) => !o)}
          className="rounded-full border-2 border-ink bg-white px-4 py-1 font-bold"
        >
          {open ? 'Hide' : 'Show'}
          <span className="sr-only"> worked example: {title}</span>
        </button>
      </div>
      <div id={`${id}-panel`} hidden={!open} className="px-4 pb-4">
        {children}
      </div>
    </section>
  );
}
