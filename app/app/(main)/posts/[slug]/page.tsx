import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AdsenseUnit from '@/components/ads/AdsenseUnit'
import { getPostBySlug, incrementViewCount, getPublishedPosts } from '@/lib/db/queries/posts'
import { buildPostMetadata } from '@/lib/seo/metadata'
import PostCard from '@/components/post/PostCard'
import PostActions from '@/components/post/PostActions'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const ERA_LABEL: Record<string, string> = {
  ancient: '고대 문명',
  medieval: '중세',
  'early-modern': '근세',
  modern: '근대',
  contemporary: '현대',
}
const REGION_LABEL: Record<string, string> = {
  europe: '유럽사',
  asia: '아시아사',
  'middle-east-africa': '중동·아프리카',
  americas: '아메리카사',
}
const EXAM_BADGE: Record<string, string | null> = {
  none: null,
  basic: '세계사능력검정 3·4급 빈출',
  advanced: '세계사능력검정 1·2급 빈출',
}


export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  if (!post) return {}
  return buildPostMetadata(post)
}

export default async function PostDetailPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  // Fire-and-forget view increment
  incrementViewCount(post.id).catch(() => {})

  const relatedPosts = (await getPublishedPosts(4)).filter((p) => p.id !== post.id).slice(0, 3)

  const examBadge = EXAM_BADGE[post.examLevel]

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-4 flex gap-1">
        <Link href="/" className="hover:text-indigo-600">홈</Link>
        <span>/</span>
        <Link href={`/region/${post.region}`} className="hover:text-indigo-600">
          {REGION_LABEL[post.region]}
        </Link>
        <span>/</span>
        <Link href={`/era/${post.era}`} className="hover:text-indigo-600">
          {ERA_LABEL[post.era]}
        </Link>
      </nav>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
          {REGION_LABEL[post.region]}
        </span>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
          {ERA_LABEL[post.era]}
        </span>
        {examBadge && (
          <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">
            📝 {examBadge}
          </span>
        )}
      </div>

      <h1 className="text-2xl md:text-3xl font-bold leading-snug mb-6">{post.title}</h1>

      <AdsenseUnit slot="2222222222" className="mb-8" />

      {/* Q&A */}
      <div className="bg-indigo-50 rounded-xl p-5 mb-8">
        <p className="text-indigo-800 font-semibold text-base mb-3">❓ {post.question}</p>
        <div className="bg-white rounded-lg p-4 border border-indigo-100">
          <p className="text-gray-800 font-medium">💡 {post.answer}</p>
        </div>
      </div>

      {/* 본문 */}
      <div
        className="prose prose-gray max-w-none leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.fullStory.replace(/\n/g, '<br/>') }}
      />

      <AdsenseUnit slot="3333333333" className="my-10" />

      <PostActions
        postId={post.id}
        slug={post.slug}
        title={post.title}
        initialLikeCount={post.likeCount}
        fullText={post.fullStory}
      />

      {/* 관련 포스트 */}
      {relatedPosts.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-4">관련 이야기</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedPosts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}

      <AdsenseUnit slot="4444444444" className="mt-10" />
    </article>
  )
}
