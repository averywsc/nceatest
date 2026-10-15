'use client';
import { useEffect, useState } from 'react';
import { loadSavedSubjects, storeSavedSubjects } from '@/lib/storage';

export default function SaveSubject({ subject, title }: { subject: string; title: string }) {
  const [saved, setSaved] = useState(false);
  useEffect(() => setSaved(loadSavedSubjects().includes(subject)), [subject]);

  const toggle = () => {
    const list = loadSavedSubjects();
    const next = list.includes(subject) ? list.filter((s) => s !== subject) : [...list, subject];
    storeSavedSubjects(next);
    setSaved(next.includes(subject));
  };

  return (
    <button
      type="button"
      aria-pressed={saved}
      onClick={toggle}
      className={`rounded-full border-2 border-ink px-5 py-2 font-bold ${saved ? 'bg-fern text-white' : 'bg-kowhai'}`}
    >
      {saved ? `${title} is saved` : `Save ${title}`}
    </button>
  );
}
