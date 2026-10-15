import type { Metadata } from 'next';
import ComingSoon from '@/components/ComingSoon';

export const metadata: Metadata = { title: 'Dashboard' };

export default function Page() {
  return <ComingSoon title="Dashboard">Sign-in and the personal dashboard arrive in a later build phase. For now, your progress and saved subjects are stored in this browser.</ComingSoon>;
}
