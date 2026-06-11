import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'hello@worldhistory.kr'

const SEQUENCE = [
  {
    dayOffset: 3,
    subject: '[AskHistory] 핶심 기능 안내: 퀴즈와 Q&A',
    html: `<h2>안녕하세요! AskHistory 핵심 기능을 안내해 드릴게요.</h2>
<ul>
  <li><strong>세계사 퀴즈</strong> — 시대별 퀴즈로 실력 확인</li>
  <li><strong>AI Q&A</strong> — 댈군지 세계사 질문에 즉시 응답</li>
  <li><strong>연표 정리</strong> — 시대별 핵심 사건 정리본</li>
</ul>
<p><a href="https://worldhistory.kr" style="background:#7c3aed;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">→ AskHistory 시작하기</a></p>`,
  },
  {
    dayOffset: 7,
    subject: '[AskHistory] 이번 주 인기 세계사 포스트 TOP 3',
    html: `<h2>이번 주 인기 세계사 포스트</h2>
<p>많은 독자들이 읽은 세계사 이야기를 모아와습니다.</p>
<p><a href="https://worldhistory.kr/posts">전체 포스트 보기 →</a></p>`,
  },
  {
    dayOffset: 14,
    subject: '[AskHistory] 수능 세계사 증템 팁, 아직도 모르셔나요?',
    html: `<h2>수능 세계사 마지막 트리크</h2>
<p>AI로 늘리는 세계사 퀴즈 트레이닝 방법을 안내해드립니다.</p>
<p><a href="https://worldhistory.kr/exam" style="background:#7c3aed;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">→ 퀴즈 도전하기</a></p>`,
  },
]

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  }).catch(() => {})
}

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  const auth = req.headers.get('authorization')
  if (cronSecret && auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await db.execute(`
    CREATE TABLE IF NOT EXISTS email_subscribers (
      id SERIAL PRIMARY KEY, email TEXT NOT NULL,
      service TEXT NOT NULL DEFAULT 'askhistory', source TEXT NOT NULL DEFAULT 'landing',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE (email, service)
    )
  `).catch(() => {})

  const now = new Date()
  let sent = 0

  for (const step of SEQUENCE) {
    const windowStart = new Date(now.getTime() - (step.dayOffset + 0.5) * 86400000).toISOString()
    const windowEnd = new Date(now.getTime() - (step.dayOffset - 0.5) * 86400000).toISOString()
    const rows = await db.execute(
      sql`SELECT email FROM email_subscribers WHERE service = 'askhistory' AND created_at BETWEEN ${windowStart} AND ${windowEnd}`
    ).catch(() => ({ rows: [] }))
    for (const row of (rows as { rows: { email: string }[] }).rows) {
      await sendEmail(row.email, step.subject, step.html)
      sent++
    }
  }

  return NextResponse.json({ sent })
}
