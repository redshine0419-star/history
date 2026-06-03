import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { posts } from '@/lib/db/schema'
import { sql, eq, and } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) return NextResponse.json([])

  const results = await db
    .select()
    .from(posts)
    .where(
      and(
        eq(posts.isPublished, true),
        sql`(${posts.title} ILIKE ${'%' + q + '%'} OR ${posts.summary} ILIKE ${'%' + q + '%'})`,
      ),
    )
    .limit(20)

  return NextResponse.json(results)
}
