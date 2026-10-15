import type { Metadata } from 'next';
import ComingSoon from '@/components/ComingSoon';

export const metadata: Metadata = { title: 'How Scholarship works' };

export default function Page() {
  return <ComingSoon title="How Scholarship works">A plain-language guide to NZ Scholarship is planned. For official details, see nzqa.govt.nz.</ComingSoon>;
}
