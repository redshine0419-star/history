import type { Metadata } from 'next'
import PostCard from '@/components/post/PostCard'
import AdsenseUnit from '@/components/ads/AdsenseUnit'
import { getPublishedPosts } from '@/lib/db/queries/posts'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: '전체 이야기',
  description: '세계 각지의 반전 역사 이야기를 모두 만나보세요.',
}

export default async function PostsPage() {
  const posts = await getPublishedPosts(24).catch(() => [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">전체 세계사 이야기</h1>
      <p className="text-gray-500 text-sm mb-6">그리스·로마부터 현대까지, 몰랐던 역사 이야기</p>

      <AdsenseUnit slot="1111111111" className="mb-8" />

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📜</p>
          <p>아직 등록된 이야기가 없습니다.</p>
        </div>
      )}
    </div>
  )
}
