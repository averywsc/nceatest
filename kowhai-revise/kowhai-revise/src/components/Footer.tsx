import Link from 'next/link';
import { CONTACT_EMAIL, SITE_NAME, SITE_TAGLINE } from '@/lib/site';
import FeedbackForm from './FeedbackForm';

const explore = [
  { label: 'Subjects', href: '/subjects' },
  { label: 'Achievement standards', href: '/standards' },
  { label: 'Past exam papers', href: '/past-papers' },
  { label: 'How NCEA works', href: '/how-ncea-works' },
  { label: 'How Scholarship works', href: '/how-scholarship-works' },
  { label: 'Reviews', href: '/reviews' },
];

export default function Footer() {
  return (
    <footer className="mt-16 bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-10 rounded-xl bg-white p-6 text-ink">
          <FeedbackForm />
        </div>
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <p className="font-display text-2xl font-bold">{SITE_NAME}</p>
            <p className="mt-2">{SITE_TAGLINE}</p>
          </div>
          <nav aria-label="Explore">
            <h2 className="font-display text-lg font-bold">Explore</h2>
            <ul className="mt-2 space-y-1">
              {explore.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className="font-display text-lg font-bold">About</h2>
            <p className="mt-2">
              {SITE_NAME} is an independent study resource. It is not affiliated with or endorsed by NZQA. For official past papers and assessment
              specifications, visit{' '}
              <a href="https://www.nzqa.govt.nz" className="underline" rel="noopener noreferrer">
                nzqa.govt.nz
              </a>
              .
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">Contact</h2>
            <p className="mt-2">
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
                {CONTACT_EMAIL}
              </a>
            </p>
            <h2 className="mt-6 font-display text-lg font-bold">Legal</h2>
            <ul className="mt-2 space-y-1">
              <li><Link href="/privacy-policy" className="underline">Privacy policy</Link></li>
              <li><Link href="/terms-and-conditions" className="underline">Terms and conditions</Link></li>
            </ul>
          </div>
        </div>
        <p className="mt-10 text-sm">© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
      </div>
    </footer>
  );
}
