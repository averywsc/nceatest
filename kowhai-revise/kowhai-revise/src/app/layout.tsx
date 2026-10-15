import type { Metadata } from 'next';
import { Atkinson_Hyperlegible, Bricolage_Grotesque } from 'next/font/google';
import 'katex/dist/katex.min.css';
import './globals.css';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { ProgressProvider } from '@/components/ProgressProvider';
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/site';

const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const body = Atkinson_Hyperlegible({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-body', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME}: NCEA revision notes`, template: `%s | ${SITE_NAME}` },
  description: SITE_TAGLINE,
  openGraph: { type: 'website', locale: 'en_NZ', siteName: SITE_NAME },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NZ" className={`${display.variable} ${body.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-full focus:border-2 focus:border-ink focus:bg-kowhai focus:px-4 focus:py-2 focus:font-bold"
        >
          Skip to content
        </a>
        <ProgressProvider>
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </ProgressProvider>
      </body>
    </html>
  );
}
