import { NextRequest, NextResponse } from 'next/server'
import { generatePost } from '@/lib/ai/generate'
import { db } from '@/lib/db'
import { posts, quizzes } from '@/lib/db/schema'
import { slugify } from '@/lib/utils/slugify'
import { fetchUnsplashThumbnail } from '@/lib/unsplash'

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('x-admin-key')
  if (authHeader !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { topic, hint, save } = await req.json()
  if (!topic) return NextResponse.json({ error: 'topic required' }, { status: 400 })

  const generated = await generatePost(topic, hint)

  if (save) {
    const baseSlug = generated.slug || slugify(generated.title).replace(/[^\x00-\x7F]/g, '').replace(/--+/g, '-').slice(0, 80)
    const thumbnail = await fetchUnsplashThumbnail(generated.tags?.[0] ?? topic)

    let slug = baseSlug
    let saved
    for (let attempt = 0; attempt < 5; attempt++) {
      if (attempt > 0) slug = `${baseSlug}-${attempt}`
      try {
        ;[saved] = await db.insert(posts).values({
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
          thumbnail: thumbnail ?? undefined,
          isPublished: true,
          publishedAt: new Date(),
        }).returning()
        break
      } catch (e: unknown) {
        const msg = String(e)
        if (msg.includes('duplicate') || msg.includes('unique')) continue
        throw e
      }
    }

    if (!saved) return NextResponse.json({ error: 'slug conflict' }, { status: 409 })

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
