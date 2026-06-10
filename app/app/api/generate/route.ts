import { NextRequest, NextResponse } from 'next/server'
import { generatePost } from '@/lib/ai/generate'
import { db } from '@/lib/db'
import { posts, quizzes } from '@/lib/db/schema'
import { slugify } from '@/lib/utils/slugify'

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('x-admin-key')
  if (authHeader !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { topic, hint, save } = await req.json()
  if (!topic) return NextResponse.json({ error: 'topic required' }, { status: 400 })

  const generated = await generatePost(topic, hint)

  if (save) {
    const slug = generated.slug || slugify(generated.title).replace(/[^\x00-\x7F]/g, '').replace(/--+/g, '-').slice(0, 80)
    const [saved] = await db
      .insert(posts)
      .values({
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
      })
      .returning()

    // 퀴즈 저장
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

    return NextResponse.json({ generated, saved })
  }

  return NextResponse.json({ generated })
}
