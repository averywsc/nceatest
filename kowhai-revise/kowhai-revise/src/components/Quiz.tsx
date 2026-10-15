'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { recordScore } from '@/lib/storage';
import type { PracticeQuestion } from '@/lib/types';

interface Props {
  pageKey: string;
  noteHref: string;
  questions: PracticeQuestion[];
}

export default function Quiz({ pageKey, noteHref, questions }: Props) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [typed, setTyped] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<(boolean | null)[]>(() => questions.map(() => null));
  const saved = useRef(false);

  const finished = index >= questions.length;
  const score = results.filter((r) => r === true).length;

  useEffect(() => {
    if (finished && !saved.current) {
      saved.current = true;
      recordScore(pageKey, score, questions.length);
    }
  }, [finished, pageKey, score, questions.length]);

  const record = (i: number, ok: boolean) => setResults((r) => r.map((x, j) => (j === i ? ok : x)));

  const next = () => {
    setIndex((i) => i + 1);
    setPicked(null);
    setTyped('');
    setRevealed(false);
  };

  const restart = () => {
    saved.current = false;
    setResults(questions.map(() => null));
    setIndex(0);
    setPicked(null);
    setTyped('');
    setRevealed(false);
  };

  if (questions.length === 0) return <p>There are no practice questions for this note yet.</p>;

  if (finished) {
    return (
      <section aria-labelledby="score-heading" className="rounded-xl border-2 border-ink bg-white p-6">
        <h2 id="score-heading" className="font-display text-2xl font-bold">
          You scored {score} out of {questions.length}
        </h2>
        <ol className="mt-4 list-decimal space-y-1 pl-6">
          {questions.map((q, i) => (
            <li key={q.id}>
              {q.prompt.slice(0, 70)}
              {q.prompt.length > 70 ? '…' : ''}: <strong>{results[i] ? 'correct' : 'review this one'}</strong>
              {!results[i] && q.noteSection && (
                <>
                  {' '}
                  <Link href={`${noteHref}#${q.noteSection}`} className="font-bold text-fern underline">
                    Back to the note
                  </Link>
                </>
              )}
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={restart} className="rounded-full border-2 border-ink bg-kowhai px-5 py-2 font-bold">
            Try again
          </button>
          <Link href={noteHref} className="rounded-full border-2 border-ink bg-white px-5 py-2 font-bold">
            Back to the note
          </Link>
        </div>
      </section>
    );
  }

  const q = questions[index];
  const answered = results[index] !== null;

  return (
    <section aria-labelledby="q-heading" className="rounded-xl border-2 border-ink bg-white p-6">
      <p className="text-sm font-bold">
        Question {index + 1} of {questions.length}
      </p>
      <h2 id="q-heading" className="mt-1 font-display text-xl font-bold">
        {q.prompt}
      </h2>

      {q.type === 'mcq' ? (
        <ul className="mt-4 space-y-2">
          {q.options.map((opt, i) => {
            const chosen = picked === i;
            const isAnswer = answered && i === q.answer;
            return (
              <li key={opt}>
                <button
                  type="button"
                  disabled={answered}
                  aria-pressed={chosen}
                  onClick={() => {
                    setPicked(i);
                    setRevealed(true);
                    record(index, i === q.answer);
                  }}
                  className={`w-full rounded-lg border-2 px-4 py-3 text-left ${
                    isAnswer ? 'border-fern bg-mist' : chosen ? 'border-pohutukawa bg-red-50' : 'border-ink bg-white hover:bg-kowhai'
                  }`}
                >
                  {opt}
                  {isAnswer && <span className="font-bold"> (correct answer)</span>}
                  {answered && chosen && i !== q.answer && <span className="font-bold"> (your answer)</span>}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-4">
          <label htmlFor="short-answer" className="font-bold">
            Your working and answer
          </label>
          <textarea
            id="short-answer"
            rows={3}
            value={typed}
            disabled={revealed}
            onChange={(e) => setTyped(e.target.value)}
            className="mt-1 w-full rounded-lg border-2 border-ink p-2"
          />
          {!revealed && (
            <button type="button" onClick={() => setRevealed(true)} className="mt-2 rounded-full border-2 border-ink bg-kowhai px-5 py-2 font-bold">
              Check answer
            </button>
          )}
        </div>
      )}

      {revealed && (
        <div role="status" className="mt-4 rounded-lg bg-mist p-4">
          {q.type === 'mcq' ? (
            <p className="font-bold">{results[index] ? 'Correct.' : 'Not quite.'}</p>
          ) : (
            <p className="font-bold">Answer: {q.answer}</p>
          )}
          <p className="mt-1">
            <strong>Worked solution:</strong> {q.solution}
          </p>
          {q.noteSection && (
            <p className="mt-2">
              <Link href={`${noteHref}#${q.noteSection}`} className="font-bold text-fern underline">
                Review this in the note
              </Link>
            </p>
          )}
          {q.type === 'short' && !answered && (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="font-bold">Compare with your answer. Did you get it?</span>
              <button type="button" onClick={() => record(index, true)} className="rounded-full border-2 border-ink bg-white px-4 py-1 font-bold">
                I got it
              </button>
              <button type="button" onClick={() => record(index, false)} className="rounded-full border-2 border-ink bg-white px-4 py-1 font-bold">
                Not yet
              </button>
            </div>
          )}
        </div>
      )}

      {answered && (
        <button type="button" onClick={next} className="mt-4 rounded-full border-2 border-ink bg-ink px-5 py-2 font-bold text-white">
          {index + 1 === questions.length ? 'See my score' : 'Next question'}
        </button>
      )}
    </section>
  );
}
