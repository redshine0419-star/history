import { NextRequest, NextResponse } from 'next/server'
import { generatePost } from '@/lib/ai/generate'
import { db } from '@/lib/db'
import { posts, quizzes, examTopics } from '@/lib/db/schema'
import { eq, desc, gte } from 'drizzle-orm'
import { slugify } from '@/lib/utils/slugify'
import { GoogleGenAI } from '@google/genai'
import { postTweet, buildTweetText } from '@/lib/twitter'

const DAILY_COUNT = 5

const AH_CTA = `\n\n---\n\n> 📚 **세계사를 AI와 함께 재미있게 공부하세요**  \n> AskHistory에서 퀴즈와 Q&A로 수능·세계사 시험을 완벽하게 준비해보세요.  \n> [→ AskHistory 무료 시작](https://askhistory.me)\n`

async function notifySlack(msg: string) {
  if (!process.env.SLACK_WEBHOOK_URL) return
  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: msg }),
  }).catch(() => {})
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: { topic: string; status: string; slug?: string }[] = []

  try {
    const existingPosts = await db
      .select({ title: posts.title })
      .from(posts)
      .catch(() => [])

    const existingTitles = existingPosts.map((p) => p.title)

    // Era-balanced selection: prefer eras not covered in the last 14 days
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    const recentEraRows = await db
      .select({ era: posts.era })
      .from(posts)
      .where(gte(posts.publishedAt, twoWeeksAgo))
      .catch(() => [])

    const eraCountMap: Record<string, number> = {}
    for (const r of recentEraRows) {
      if (r.era) eraCountMap[r.era] = (eraCountMap[r.era] || 0) + 1
    }

    // Get pending topics with era info, more than needed for sorting
    const pendingTopicsRaw = await db
      .select({ keyword: examTopics.keyword, era: examTopics.era })
      .from(examTopics)
      .where(eq(examTopics.postId, null as unknown as number))
      .orderBy(desc(examTopics.frequency))
      .limit(50)
      .catch(() => [])

    // Sort by era count ascending (eras with fewer recent posts come first)
    const sortedPending = [...pendingTopicsRaw].sort(
      (a, b) => (eraCountMap[a.era] || 0) - (eraCountMap[b.era] || 0)
    )

    let topics: string[] = sortedPending.slice(0, DAILY_COUNT).map((t) => t.keyword)

    // Fill remaining with Gemini suggestions if needed
    if (topics.length < DAILY_COUNT) {
      const needed = DAILY_COUNT - topics.length
      const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
      const existing = existingTitles.join('\n')
      const prompt = `세계사 블로그용 새로운 주제 ${needed}개를 추천해줘. 아래 제목과 겹치지 않게. 반드시 JSON 배열로만 응답: ["주제1", "주제2"]\n\n기존:\n${existing}`
      const res = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      })
      const suggested: string[] = JSON.parse(res.text ?? '[]')
      topics = [...topics, ...suggested.slice(0, needed)]
    }

    // Generate posts sequentially
    for (const topic of topics.slice(0, DAILY_COUNT)) {
      try {
        const generated = await generatePost(topic)
        const slug = generated.slug || slugify(generated.title).replace(/[^\x00-\x7F]/g, '').replace(/--+/g, '-').slice(0, 80)

        const [saved] = await db.insert(posts).values({
          slug,
          title: generated.title,
          question: generated.question,
          answer: generated.answer,
          fullStory: (generated.fullStory || '') + AH_CTA,
          summary: generated.summary,
          region: generated.region,
          era: generated.era,
          examLevel: generated.examLevel,
          examKeyword: generated.examKeyword,
          tags: generated.tags,
          seoTitle: generated.seoTitle,
          seoDesc: generated.seoDesc,
          isPublished: true,
          publishedAt: new Date(),
        }).returning()

        if (generated.quizzes?.length && saved.id) {
          await db.insert(quizzes).values(
            generated.quizzes.map((q) => ({
              postId: saved.id,
              question: q.question,
              options: q.options,
              answer: q.answer,
              explanation: q.explanation,
              isActive: true,
            }))
          )
        }

        await notifySlack(`📜 [AskHistory] 새 포스트 발행\n제목: ${saved.title}\n시대: ${generated.era || '-'}\nURL: https://askhistory.me/post/${saved.slug}`)

        const tweetText = buildTweetText(saved.title, generated.summary || '', `https://askhistory.me/post/${saved.slug}`, '#세계사 #역사 #공부')
        await postTweet(tweetText)

        results.push({ topic, status: 'done', slug: saved.slug })

        await new Promise((r) => setTimeout(r, 5000))
      } catch (e) {
        results.push({ topic, status: 'error: ' + String(e) })
      }
    }

    return NextResponse.json({ success: true, generated: results.length, results })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}
