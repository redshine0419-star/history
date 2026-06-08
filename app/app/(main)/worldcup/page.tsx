import type { Metadata } from 'next'
import { getPostsByTag, getPublishedPosts } from '@/lib/db/queries/posts'
import PostCard from '@/components/post/PostCard'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '월드컵 역사 특집 | 세계사의 반전',
  description: '월드컵과 스포츠로 읽는 세계사. 정치, 전쟁, 외교가 뒤얽힌 축구의 역사 이야기.',
}

const WORLDCUP_KEYWORDS = ['월드컵', '축구', '올림픽', '스포츠', 'FIFA', '펠레']

export default async function WorldcupPage() {
  const tagResults = await Promise.all(
    WORLDCUP_KEYWORDS.map((tag) => getPostsByTag(tag, 5).catch(() => []))
  )

  const seen = new Set<number>()
  const worldcupPosts = tagResults.flat().filter((p) => {
    if (seen.has(p.id)) return false
    seen.add(p.id)
    return true
  })

  const recentPosts = worldcupPosts.length < 6
    ? (await getPublishedPosts(6).catch(() => [])).filter((p) => !seen.has(p.id)).slice(0, 6 - worldcupPosts.length)
    : []

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 헤더 배너 */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-8 mb-10 text-white">
        <p className="text-green-200 text-sm font-medium mb-2">⚽ 월드컵 시즌 특집</p>
        <h1 className="text-3xl font-bold mb-3">축구로 읽는 세계사</h1>
        <p className="text-green-100 text-base max-w-xl">
          월드컵 뒤에 숨겨진 전쟁, 정치, 외교의 이야기. 스포츠는 단순한 경기가 아니었습니다.
        </p>
      </div>

      {/* 월드컵 관련 글 */}
      {worldcupPosts.length > 0 ? (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6">⚽ 월드컵·스포츠 역사 이야기</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {worldcupPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      ) : (
        <div className="bg-gray-50 rounded-xl p-8 text-center mb-12">
          <p className="text-gray-500 mb-2">월드컵 관련 글이 곧 업로드됩니다!</p>
          <p className="text-sm text-gray-400">매일 저녁 8시 자동 업데이트</p>
        </div>
      )}

      {/* 추천 읽을거리 */}
      {recentPosts.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-6">📖 함께 읽으면 좋은 이야기</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
