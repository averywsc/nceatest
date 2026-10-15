import { ImageResponse } from 'next/og';
import { loadAllPages } from '@/lib/content';
import { SITE_NAME } from '@/lib/site';
import { levelLabel } from '@/lib/types';

export const alt = 'Revision note';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image({ params }: { params: { subject: string; level: string; standard: string; group: string; page: string } }) {
  const p = loadAllPages().find((x) => x.key === `${params.subject}/${params.level}/${params.standard}/${params.group}/${params.page}`);
  const title = p?.title ?? SITE_NAME;
  const meta = p ? `${p.subjectTitle} ${levelLabel(p.level)}` : 'NCEA revision notes';
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#F5B700', padding: 72, color: '#0B2B3A' }}>
        <div style={{ display: 'flex', fontSize: 40, fontWeight: 700 }}>{SITE_NAME}</div>
        <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}>{title}</div>
        <div style={{ display: 'flex', fontSize: 40 }}>{meta}</div>
      </div>
    ),
    size,
  );
}
