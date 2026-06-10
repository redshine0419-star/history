import type { MetadataRoute } from 'next'
import { getAllPublishedSlugs } from '@/lib/db/queries/posts'

export const dynamic = 'force-dynamic'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://worldhistory.kr'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllPublishedSlugs().catch(() => [] as string[])

  const postEntries = slugs.map((slug) => ({
    url: `${BASE_URL}/posts/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const staticPages = [
    { url: BASE_URL, priority: 1.0 },
    { url: `${BASE_URL}/posts`, priority: 0.9 },
    { url: `${BASE_URL}/exam`, priority: 0.9 },
    { url: `${BASE_URL}/exam/guide`, priority: 0.7 },
    { url: `${BASE_URL}/exam/questions`, priority: 0.8 },
    { url: `${BASE_URL}/quiz`, priority: 0.7 },
    { url: `${BASE_URL}/region/europe`, priority: 0.7 },
    { url: `${BASE_URL}/region/asia`, priority: 0.7 },
    { url: `${BASE_URL}/region/middle-east-africa`, priority: 0.7 },
    { url: `${BASE_URL}/region/americas`, priority: 0.7 },
    { url: `${BASE_URL}/era/ancient`, priority: 0.7 },
    { url: `${BASE_URL}/era/medieval`, priority: 0.7 },
    { url: `${BASE_URL}/era/early-modern`, priority: 0.7 },
    { url: `${BASE_URL}/era/modern`, priority: 0.7 },
    { url: `${BASE_URL}/era/contemporary`, priority: 0.7 },
  ].map((p) => ({
    ...p,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
  }))

  return [...staticPages, ...postEntries]
}
