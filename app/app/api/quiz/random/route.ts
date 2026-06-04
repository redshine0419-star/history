import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { quizzes, posts } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'

export async function GET() {
  const rows = await db
    .select({
      id: quizzes.id,
      postId: quizzes.postId,
      question: quizzes.question,
      options: quizzes.options,
      answer: quizzes.answer,
      explanation: quizzes.explanation,
      postTitle: posts.title,
      postSlug: posts.slug,
    })
    .from(quizzes)
    .leftJoin(posts, eq(quizzes.postId, posts.id))
    .where(eq(quizzes.isActive, true))
    .orderBy(sql`RANDOM()`)
    .limit(10)
    .catch(() => [])

  return NextResponse.json({ quizzes: rows })
}
