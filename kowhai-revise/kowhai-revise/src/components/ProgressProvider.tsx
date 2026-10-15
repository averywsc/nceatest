'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { countDone, isDone, parseProgress, serialiseProgress, toggle, type ProgressMap } from '@/lib/progress';
import { PROGRESS_KEY } from '@/lib/storage';

interface ProgressContextValue {
  ready: boolean;
  isDone: (key: string) => boolean;
  countDone: (keys: string[]) => number;
  toggle: (key: string) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

/**
 * Holds completed-note state. Signed-out visitors: stored in localStorage.
 * When accounts are added, call mergeProgress(local, remote) on sign-in and write the result back here.
 */
export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [map, setMap] = useState<ProgressMap>({});
  const [ready, setReady] = useState(false);
  const mapRef = useRef<ProgressMap>({});

  useEffect(() => {
    let initial: ProgressMap = {};
    try {
      initial = parseProgress(localStorage.getItem(PROGRESS_KEY));
    } catch {
      /* storage blocked: start empty */
    }
    mapRef.current = initial;
    setMap(initial);
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== PROGRESS_KEY) return;
      const next = parseProgress(e.newValue);
      mapRef.current = next;
      setMap(next);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleKey = useCallback((key: string) => {
    const next = toggle(mapRef.current, key);
    mapRef.current = next;
    setMap(next);
    try {
      localStorage.setItem(PROGRESS_KEY, serialiseProgress(next));
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<ProgressContextValue>(
    () => ({ ready, isDone: (k) => isDone(map, k), countDone: (keys) => countDone(map, keys), toggle: toggleKey }),
    [map, ready, toggleKey],
  );
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>');
  return ctx;
}
