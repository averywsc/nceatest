'use client';
import dynamic from 'next/dynamic';

const ShmDiagram = dynamic(() => import('./ShmDiagram'), {
  ssr: false,
  loading: () => <p className="my-6 rounded-lg bg-mist p-4">Loading interactive diagram</p>,
});

export default function LazyShm() {
  return <ShmDiagram />;
}
