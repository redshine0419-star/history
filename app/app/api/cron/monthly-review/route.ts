import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

async function notifySlack(msg: string) {
  if (!process.env.SLACK_WEBHOOK_URL) return
  await fetch(process.env.SLACK_WEBHOOK_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({text:msg}) }).catch(()=>{})
}

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`)
    return NextResponse.json({ error:'Unauthorized' }, { status:401 })

  const postResult = await db.execute(sql`SELECT COUNT(*) as cnt FROM posts WHERE published_at > NOW() - INTERVAL '30 days' AND is_published = true`)
  const postCount = (postResult.rows[0] as {cnt:string}).cnt

  const subResult = await db.execute(sql`SELECT COUNT(*) as cnt FROM email_subscribers WHERE created_at > NOW() - INTERVAL '30 days'`).catch(()=>({rows:[{cnt:'0'}]}))
  const subCount = (subResult.rows[0] as {cnt:string}).cnt

  const apiKey = process.env.GEMINI_API_KEY
  let aiSummary = ''
  if (apiKey) {
    const prompt = `다음 데이터를 바탕으로 AskHistory 서비스의 이번 달 마케팅 성과 요약과 다음 달 액션 플랜을 3줄로 작성해줘 (한국어):\n- 발행된 블로그 포스트: ${postCount}개\n- 신규 이메일 구독자: ${subCount}명\n- 서비스: AskHistory (세계사 퀴즈 & AI Q&A 학습 서비스)`
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ contents:[{parts:[{text:prompt}]}], generationConfig:{maxOutputTokens:512} })
    }).catch(()=>null)
    if (res?.ok) {
      const data = await res.json() as {candidates?:{content?:{parts?:{text?:string}[]}}[]}
      aiSummary = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    }
  }

  await notifySlack(`📅 [AskHistory] 월간 마케팅 리뷰\n📝 블로그 발행: ${postCount}개\n📧 신규 구독자: ${subCount}명\n\n🤖 AI 분석:\n${aiSummary || '(Gemini API 없음)'}`)
  return NextResponse.json({ ok:true, postCount, subCount })
}
