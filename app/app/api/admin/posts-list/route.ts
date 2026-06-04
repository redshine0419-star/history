import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { posts } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('x-admin-key')
  if (authHeader !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await db
    .select({ id: posts.id, title: posts.title, slug: posts.slug, isPublished: posts.isPublished, createdAt: posts.createdAt })
    .from(posts)
    .orderBy(desc(posts.createdAt))

  return NextResponse.json({ posts: result })
}
