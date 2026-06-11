import { NextRequest, NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'hello@worldhistory.kr'

async function sendWelcomeEmail(email: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: email,
      subject: '[AskHistory] 수능 세계사 핵심 연표 PDF를 받아보세요 📚',
      html: `
        <h2>AskHistory에 오신 것을 환영합니다!</h2>
        <p>AI와 함께 세계사를 재미있게 공부하세요. 퀴즈와 Q&A로 실력을 높여보세요.</p>
        <p><a href="https://worldhistory.kr" style="background:#7c3aed;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;">→ AskHistory 시작하기</a></p>
        <hr/>
        <p style="color:#6b7280;font-size:12px;">세계사 블로그: <a href="https://worldhistory.kr/posts">https://worldhistory.kr/posts</a></p>
      `,
    }),
  }).catch(() => {})
}

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json() as { email?: string; source?: string }
    if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      return NextResponse.json({ error: '유효하지 않은 이메일' }, { status: 400 })
    }

    const { db } = await import('@/lib/db')
    await db.execute(`
      CREATE TABLE IF NOT EXISTS email_subscribers (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        service TEXT NOT NULL DEFAULT 'askhistory',
        source TEXT NOT NULL DEFAULT 'landing',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (email, service)
      )
    `).catch(() => {})
    await db.execute(
      sql`INSERT INTO email_subscribers (email, service, source) VALUES (${email}, 'askhistory', ${source ?? 'landing'}) ON CONFLICT (email, service) DO NOTHING`
    ).catch(() => {})

    await sendWelcomeEmail(email)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
