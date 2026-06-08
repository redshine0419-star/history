import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { posts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

function auth(req: NextRequest) {
  return req.headers.get('x-admin-key') === process.env.ADMIN_SECRET
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = parseInt(params.id)
  const { isPublished } = await req.json()
  await db.update(posts).set({ isPublished, publishedAt: isPublished ? new Date() : null }).where(eq(posts.id, id))
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = parseInt(params.id)
  await db.delete(posts).where(eq(posts.id, id))
  return NextResponse.json({ ok: true })
}
