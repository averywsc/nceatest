import Link from 'next/link';

export default function ComingSoon({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold">{title}</h1>
      <p className="mt-4">{children ?? 'This page is planned for a later build phase. See the Roadmap section in the README.'}</p>
      <p className="mt-6">
        <Link href="/" className="font-bold underline">
          Back to the home page
        </Link>
      </p>
    </div>
  );
}
