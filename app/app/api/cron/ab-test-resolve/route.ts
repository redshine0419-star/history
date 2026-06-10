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

  await db.execute(sql`CREATE TABLE IF NOT EXISTS blog_ab_tests (
    id SERIAL PRIMARY KEY, post_slug TEXT NOT NULL,
    variant_a TEXT NOT NULL, variant_b TEXT NOT NULL,
    clicks_a INTEGER DEFAULT 0, clicks_b INTEGER DEFAULT 0,
    impressions_a INTEGER DEFAULT 0, impressions_b INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(), resolved BOOLEAN DEFAULT false, winner TEXT
  )`)

  const oldTests = await db.execute(sql`SELECT * FROM blog_ab_tests WHERE resolved = false AND created_at < NOW() - INTERVAL '7 days'`)
  let resolved = 0
  for (const test of oldTests.rows as {id:number,post_slug:string,variant_a:string,variant_b:string,clicks_a:number,clicks_b:number,impressions_a:number,impressions_b:number}[]) {
    const ctrA = test.impressions_a > 0 ? test.clicks_a / test.impressions_a : 0
    const ctrB = test.impressions_b > 0 ? test.clicks_b / test.impressions_b : 0
    const winner = ctrA >= ctrB ? 'A' : 'B'
    const winTitle = winner === 'A' ? test.variant_a : test.variant_b
    await db.execute(sql`UPDATE posts SET title = ${winTitle} WHERE slug = ${test.post_slug}`)
    await db.execute(sql`UPDATE blog_ab_tests SET resolved = true, winner = ${winner} WHERE id = ${test.id}`)
    await notifySlack(`📊 [AskHistory] A/B 테스트 결과\n슬러그: ${test.post_slug}\n승자(${winner}): "${winTitle}"`)
    resolved++
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (apiKey) {
    const recentPosts = await db.execute(sql`SELECT slug, title FROM posts WHERE published_at > NOW() - INTERVAL '7 days' AND is_published = true`)
    for (const post of recentPosts.rows as {slug:string,title:string}[]) {
      const exists = await db.execute(sql`SELECT 1 FROM blog_ab_tests WHERE post_slug = ${post.slug} AND resolved = false LIMIT 1`)
      if (exists.rows.length > 0) continue
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ contents:[{parts:[{text:`세계사 블로그 제목 대안 1개를 JSON 배열로: ["대안제목"]\n원제: "${post.title}"`}]}], generationConfig:{maxOutputTokens:256} })
        })
        const data = await res.json() as {candidates?:{content?:{parts?:{text?:string}[]}}[]}
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
        const alts = JSON.parse(text.replace(/```(?:json)?/gi,'').trim()) as string[]
        if (alts[0]) await db.execute(sql`INSERT INTO blog_ab_tests (post_slug, variant_a, variant_b) VALUES (${post.slug}, ${post.title}, ${alts[0]})`)
      } catch { /* skip */ }
    }
  }

  return NextResponse.json({ ok:true, resolved })
}
