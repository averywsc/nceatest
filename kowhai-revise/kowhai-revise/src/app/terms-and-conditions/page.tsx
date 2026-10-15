import type { Metadata } from 'next';
import ComingSoon from '@/components/ComingSoon';

export const metadata: Metadata = { title: 'Terms and conditions' };

export default function Page() {
  return <ComingSoon title="Terms and conditions">Placeholder: write these terms and have them reviewed before launch.</ComingSoon>;
}
