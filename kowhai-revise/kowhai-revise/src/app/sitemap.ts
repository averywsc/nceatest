import type { MetadataRoute } from 'next';
import { getCatalog, loadAllPages } from '@/lib/content';
import { SITE_URL } from '@/lib/site';
import { LEVELS } from '@/lib/types';

export default function sitemap(): MetadataRoute.Sitemap {
  const fixed = ['', '/levels', '/subjects', '/standards', '/past-papers', '/mock-exams', '/how-ncea-works', '/how-scholarship-works', '/reviews', '/privacy-policy', '/terms-and-conditions'];
  const urls = [
    ...fixed,
    ...LEVELS.map((l) => `/levels/${l.slug}`),
    ...getCatalog().subjects.flatMap((s) => [`/subjects/${s.slug}`, ...s.levels.map((l) => `/subjects/${s.slug}/${l}`)]),
    ...loadAllPages().flatMap((p) => [p.href, p.practiceHref]),
  ];
  return urls.map((u) => ({ url: `${SITE_URL}${u}` }));
}
