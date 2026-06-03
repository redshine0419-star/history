import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PostCard from '@/components/post/PostCard'
import AdsenseUnit from '@/components/ads/AdsenseUnit'
import { getPublishedPosts } from '@/lib/db/queries/posts'
import { db } from '@/lib/db'
import { posts } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'

const LEVELS: Record<string, { label: string; description: string; value: 'basic' | 'advanced' }> = {
  advanced: {
    label: '1·2급 심화',
    description: '세계사 심층 이해와 역사적 인과관계 분석 중심',
    value: 'advanced',
  },
  basic: {
    label: '3·4급 기본',
    description: '주요 사건·인물·흐름 파악 중심의 기본 콘텐츠',
    value: 'basic',
  },
}

export async function generateStaticParams() {
  return Object.keys(LEVELS).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const level = LEVELS[params.slug]
  if (!level) return {}
  return { title: `세계사 검정 ${level.label}`, description: level.description }
}

export default async function ExamLevelPage({ params }: { params: { slug: string } }) {
  const level = LEVELS[params.slug]
  if (!level) notFound()

  const levelPosts = await db
    .select()
    .from(posts)
    .where(and(eq(posts.isPublished, true), eq(posts.examLevel, level.value)))
    .orderBy(desc(posts.publishedAt))
    .limit(24)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">세계사 검정 {level.label}</h1>
      <p className="text-gray-500 text-sm mb-6">{level.description}</p>

      <AdsenseUnit slot="1122334455" className="mb-8" />

      {levelPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {levelPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📚</p>
          <p>아직 등록된 콘텐츠가 없습니다.</p>
        </div>
      )}
    </div>
  )
}
