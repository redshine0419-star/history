import type { Metadata } from 'next'
import PostCard from '@/components/post/PostCard'
import AdsenseUnit from '@/components/ads/AdsenseUnit'
import { getExamPosts } from '@/lib/db/queries/posts'

export const revalidate = 3600

export const metadata: Metadata = {
  title: '기출 유형 Q&A',
  description: '세계사능력검정시험 빈출 토픽 기반 독창 Q&A 콘텐츠',
}

export default async function ExamQuestionsPage() {
  const posts = await getExamPosts(24).catch(() => [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">기출 유형 Q&A</h1>
      <p className="text-gray-500 text-sm mb-6">
        세계사능력검정시험 빈출 토픽으로 생성한 독창 학습 콘텐츠입니다.
        기출 문제 원문이 아닌 토픽·키워드 기반 오리지널 Q&A입니다.
      </p>

      <AdsenseUnit slot="9999999999" className="mb-8" />

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📝</p>
          <p>아직 등록된 Q&A가 없습니다.</p>
        </div>
      )}
    </div>
  )
}
