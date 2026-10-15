import type { Metadata } from 'next';
import ComingSoon from '@/components/ComingSoon';

export const metadata: Metadata = { title: 'How NCEA works' };

export default function Page() {
  return <ComingSoon title="How NCEA works">A plain-language guide to credits, endorsements and internal and external assessment is planned. For official rules, see nzqa.govt.nz.</ComingSoon>;
}
