import { eq, desc, and, sql } from 'drizzle-orm'
import { db } from '../index'
import { posts } from '../schema'
import type { Post } from '../schema'

export async function getPublishedPosts(limit = 20, offset = 0) {
  return db
    .select()
    .from(posts)
    .where(eq(posts.isPublished, true))
    .orderBy(desc(posts.publishedAt))
    .limit(limit)
    .offset(offset)
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const result = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1)
    .catch(() => [])
  return result[0]
}

export async function getPostsByRegion(region: Post['region'], limit = 20, offset = 0) {
  return db
    .select()
    .from(posts)
    .where(and(eq(posts.region, region), eq(posts.isPublished, true)))
    .orderBy(desc(posts.publishedAt))
    .limit(limit)
    .offset(offset)
}

export async function getPostsByEra(era: Post['era'], limit = 20, offset = 0) {
  return db
    .select()
    .from(posts)
    .where(and(eq(posts.era, era), eq(posts.isPublished, true)))
    .orderBy(desc(posts.publishedAt))
    .limit(limit)
    .offset(offset)
}

export async function getFeaturedPost(): Promise<Post | undefined> {
  const result = await db
    .select()
    .from(posts)
    .where(and(eq(posts.isFeatured, true), eq(posts.isPublished, true)))
    .orderBy(desc(posts.publishedAt))
    .limit(1)
  return result[0]
}

export async function getPopularPosts(limit = 5) {
  return db
    .select()
    .from(posts)
    .where(eq(posts.isPublished, true))
    .orderBy(desc(posts.viewCount))
    .limit(limit)
}

export async function getExamPosts(limit = 20, offset = 0) {
  return db
    .select()
    .from(posts)
    .where(
      and(
        eq(posts.isPublished, true),
        sql`${posts.examLevel} != 'none'`,
      ),
    )
    .orderBy(desc(posts.publishedAt))
    .limit(limit)
    .offset(offset)
}

export async function incrementViewCount(id: number) {
  await db
    .update(posts)
    .set({ viewCount: sql`${posts.viewCount} + 1` })
    .where(eq(posts.id, id))
}

export async function getPostsByTag(tag: string, limit = 20) {
  return db
    .select()
    .from(posts)
    .where(and(eq(posts.isPublished, true), sql`${posts.tags} @> ARRAY[${tag}]::text[]`))
    .orderBy(desc(posts.publishedAt))
    .limit(limit)
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  const result = await db
    .select({ slug: posts.slug })
    .from(posts)
    .where(eq(posts.isPublished, true))
  return result.map((r) => r.slug)
}
