import type { Metadata } from 'next';
import ComingSoon from '@/components/ComingSoon';

export const metadata: Metadata = { title: 'Reviews' };

export default function Page() {
  return <ComingSoon title="Reviews">There are no reviews yet. Real reviews will be added here once students have given permission.</ComingSoon>;
}
