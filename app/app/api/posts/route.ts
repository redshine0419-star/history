import { NextRequest, NextResponse } from 'next/server'
import { getPublishedPosts } from '@/lib/db/queries/posts'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = Math.min(Number(searchParams.get('limit') ?? 20), 50)
  const offset = Number(searchParams.get('offset') ?? 0)
  const data = await getPublishedPosts(limit, offset)
  return NextResponse.json(data)
}
