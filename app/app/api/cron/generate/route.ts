import { NextRequest, NextResponse } from 'next/server'
import { generatePost } from '@/lib/ai/generate'
import { db } from '@/lib/db'
import { posts, quizzes, examTopics } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { slugify } from '@/lib/utils/slugify'
import { GoogleGenAI } from '@google/genai'

const DAILY_COUNT = 5

export async function GET(req: NextRequest) {
  // Vercel Cron 인증
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: { topic: string; status: string; slug?: string }[] = []

  try {
    // 기존 포스트 제목 목록
    const existingPosts = await db
      .select({ title: posts.title })
      .from(posts)
      .catch(() => [])

    const existingTitles = existingPosts.map((p) => p.title)

    // exam_topics에서 아직 포스트가 없는 토픽 우선 사용
    const pendingTopics = await db
      .select({ keyword: examTopics.keyword })
      .from(examTopics)
      .where(eq(examTopics.postId, null as unknown as number))
      .orderBy(desc(examTopics.frequency))
      .limit(DAILY_COUNT)
      .catch(() => [])

    let topics: string[] = pendingTopics.map((t) => t.keyword)

    // exam_topics가 부족하면 Gemini로 추가 추천
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

    // 순차 생성
    for (const topic of topics.slice(0, DAILY_COUNT)) {
      try {
        const generated = await generatePost(topic)
        const slug = generated.slug || slugify(generated.title).replace(/[^\x00-\x7F]/g, '').replace(/--+/g, '-').slice(0, 80)

        const [saved] = await db.insert(posts).values({
          slug,
          title: generated.title,
          question: generated.question,
          answer: generated.answer,
          fullStory: generated.fullStory,
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

        results.push({ topic, status: 'done', slug: saved.slug })

        // API 호출 간격
        await new Promise((r) => setTimeout(r, 5000))
      } catch (e) {
        results.push({ topic, status: 'error: ' + String(e) })
      }
    }

    // 마지막 성공한 글 1개만 푸시 발송
    const lastDone = results.filter((r) => r.status === 'done').slice(-1)[0]
    if (lastDone && lastDone.slug && process.env.ONESIGNAL_REST_API_KEY) {
      await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Key ${process.env.ONESIGNAL_REST_API_KEY}`,
        },
        body: JSON.stringify({
          app_id: 'e4019aab-d232-4083-a13f-fe2061fe438e',
          target_channel: 'push',
          included_segments: ['All'],
          headings: { en: '세계사의 반전 — 새 글', ko: '세계사의 반전 — 새 글' },
          contents: { en: lastDone.topic, ko: lastDone.topic },
          url: `https://www.askhistory.me/posts/${lastDone.slug}`,
        }),
      }).catch(() => {})
    }

    return NextResponse.json({ success: true, generated: results.length, results })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}
