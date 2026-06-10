import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

const ERAS = ['고대', '중세', '근대', '현대', '선사시대']

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`)
    return NextResponse.json({ error:'Unauthorized' }, { status:401 })

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return NextResponse.json({ skipped:true, reason:'No RESEND_API_KEY' })

  // Get subscribers
  const subsResult = await db.execute(sql`SELECT email FROM email_subscribers WHERE service = 'askhistory' LIMIT 100`).catch(()=>({rows:[]}))
  const subscribers = subsResult.rows as {email:string}[]

  // Find the era with fewest posts in last 7 days (weakest coverage = what users need most)
  const eraResult = await db.execute(sql`
    SELECT era, COUNT(*) as cnt FROM posts
    WHERE published_at > NOW() - INTERVAL '7 days' AND is_published = true AND era IS NOT NULL
    GROUP BY era ORDER BY cnt ASC LIMIT 1
  `).catch(()=>({rows:[]}))

  const weakEra = (eraResult.rows[0] as {era:string}|undefined)?.era || ERAS[Math.floor(Math.random() * ERAS.length)]

  // Get 2 posts about this era
  const eraPostsResult = await db.execute(sql`
    SELECT slug, title, summary FROM posts
    WHERE era = ${weakEra} AND is_published = true
    ORDER BY published_at DESC LIMIT 2
  `).catch(()=>({rows:[]}))
  const eraPosts = eraPostsResult.rows as {slug:string,title:string,summary:string}[]

  if (!eraPosts.length) return NextResponse.json({ skipped:true, reason:'No posts for era' })

  const postLinks = eraPosts.map(p => `• <a href="https://askhistory.me/post/${p.slug}?utm_source=email&utm_medium=personalized&utm_campaign=weak-era">${p.title}</a>`).join('<br>')

  let sent = 0
  for (const sub of subscribers) {
    await fetch('https://api.resend.com/emails', {
      method:'POST',
      headers:{ Authorization:`Bearer ${resendKey}`, 'Content-Type':'application/json' },
      body: JSON.stringify({
        from: 'AskHistory <noreply@askhistory.me>',
        to: sub.email,
        subject: `📚 ${weakEra} 역사, 놓치고 있지 않으신가요?`,
        html: `<p>안녕하세요!</p><p><strong>${weakEra}</strong> 시대 복습 자료를 준비했어요:</p><p>${postLinks}</p><p><a href="https://askhistory.me?utm_source=email&utm_medium=personalized">AskHistory에서 더 공부하기 →</a></p>`,
      })
    }).catch(()=>{})
    sent++
  }

  return NextResponse.json({ ok:true, weakEra, sent })
}
