import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { posts } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  await db.update(posts).set({ likeCount: sql`${posts.likeCount} + 1` }).where(eq(posts.id, id))
  const result = await db.select({ likeCount: posts.likeCount }).from(posts).where(eq(posts.id, id))
  return NextResponse.json({ likeCount: result[0]?.likeCount ?? 0 })
}
