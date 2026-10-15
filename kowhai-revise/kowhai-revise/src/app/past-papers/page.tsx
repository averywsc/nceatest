import type { Metadata } from 'next';
import ComingSoon from '@/components/ComingSoon';

export const metadata: Metadata = { title: 'Past exams' };

export default function Page() {
  return <ComingSoon title="Past exams">Past exam papers are hosted by NZQA, so this page will list them by subject, level and year with links to the official NZQA pages. Until then, find them at nzqa.govt.nz.</ComingSoon>;
}
