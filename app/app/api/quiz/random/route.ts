import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const rows = await sql`
      SELECT q.id, q.post_id, q.question, q.options, q.answer, q.explanation,
             p.title as post_title, p.slug as post_slug
      FROM quizzes q
      LEFT JOIN posts p ON q.post_id = p.id
      WHERE q.is_active = true
      ORDER BY RANDOM()
      LIMIT 10
    `
    return NextResponse.json({ quizzes: rows })
  } catch (e) {
    console.error('Quiz error:', e)
    return NextResponse.json({ quizzes: [], error: String(e) })
  }
}
