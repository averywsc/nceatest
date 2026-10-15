import type { Metadata } from 'next';
import ComingSoon from '@/components/ComingSoon';

export const metadata: Metadata = { title: 'Mock exams' };

export default function Page() {
  return <ComingSoon title="Mock exams">Original mock papers with downloadable PDFs and marking guides are planned for a later build phase.</ComingSoon>;
}
