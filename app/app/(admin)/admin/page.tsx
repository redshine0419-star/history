import { db } from '@/lib/db'
import { posts, examTopics } from '@/lib/db/schema'
import { eq, count } from 'drizzle-orm'

export default async function AdminDashboard() {
  const [totalPosts, publishedPosts, topicCount] = await Promise.all([
    db.select({ count: count() }).from(posts).catch(() => [{ count: 0 }]),
    db.select({ count: count() }).from(posts).where(eq(posts.isPublished, true)).catch(() => [{ count: 0 }]),
    db.select({ count: count() }).from(examTopics).catch(() => [{ count: 0 }]),
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">관리자 대시보드</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-5">
          <p className="text-gray-500 text-sm">전체 포스트</p>
          <p className="text-3xl font-bold mt-1">{totalPosts[0].count}</p>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <p className="text-gray-500 text-sm">발행된 포스트</p>
          <p className="text-3xl font-bold mt-1 text-green-600">{publishedPosts[0].count}</p>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <p className="text-gray-500 text-sm">기출 토픽</p>
          <p className="text-3xl font-bold mt-1 text-amber-600">{topicCount[0].count}</p>
        </div>
      </div>
    </div>
  )
}
