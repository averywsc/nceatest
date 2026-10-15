'use client';
import { useProgress } from './ProgressProvider';

export default function MarkComplete({ pageKey }: { pageKey: string }) {
  const { isDone, toggle } = useProgress();
  const done = isDone(pageKey);
  return (
    <button
      type="button"
      aria-pressed={done}
      onClick={() => toggle(pageKey)}
      className={`rounded-full border-2 border-ink px-5 py-2 font-bold ${done ? 'bg-fern text-white' : 'bg-white text-ink hover:bg-kowhai'}`}
    >
      {done ? 'Completed. Select to undo' : 'Mark as complete'}
    </button>
  );
}
