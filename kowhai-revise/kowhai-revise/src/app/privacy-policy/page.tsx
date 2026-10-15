import type { Metadata } from 'next';
import ComingSoon from '@/components/ComingSoon';

export const metadata: Metadata = { title: 'Privacy policy' };

export default function Page() {
  return <ComingSoon title="Privacy policy">Placeholder: write this policy and have it reviewed against the New Zealand Privacy Act 2020 before launch.</ComingSoon>;
}
