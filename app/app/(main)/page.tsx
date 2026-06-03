import Link from 'next/link'
import PostCard from '@/components/post/PostCard'
import AdsenseUnit from '@/components/ads/AdsenseUnit'
import { getPublishedPosts, getFeaturedPost, getPopularPosts } from '@/lib/db/queries/posts'

export const revalidate = 3600

const REGION_LINKS = [
  { label: '유럽사', href: '/region/europe', emoji: '🏛️' },
  { label: '아시아사', href: '/region/asia', emoji: '🏯' },
  { label: '중동·아프리카', href: '/region/middle-east-africa', emoji: '🌍' },
  { label: '아메리카사', href: '/region/americas', emoji: '🗽' },
]

export default async function HomePage() {
  const [featured, recentPosts, popularPosts] = await Promise.all([
    getFeaturedPost(),
    getPublishedPosts(6),
    getPopularPosts(5),
  ])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      {featured ? (
        <section className="mb-10">
          <Link href={`/posts/${featured.slug}`} className="group block rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-8 hover:shadow-xl transition-shadow">
            <div className="max-w-2xl">
              <p className="text-indigo-200 text-sm font-medium mb-2">오늘의 세계사 Q&A</p>
              <h1 className="text-2xl md:text-3xl font-bold leading-snug mb-3 group-hover:underline">
                {featured.title}
              </h1>
              <p className="text-indigo-100 text-base leading-relaxed line-clamp-2">
                {featured.summary}
              </p>
            </div>
          </Link>
        </section>
      ) : (
        <section className="mb-10">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-8">
            <p className="text-indigo-200 text-sm font-medium mb-2">세계사의 반전</p>
            <h1 className="text-2xl md:text-3xl font-bold leading-snug mb-3">
              몰랐던 세계사 이야기를 만나보세요
            </h1>
            <p className="text-indigo-100">그리스·로마부터 냉전까지, 교과서엔 없는 반전 역사</p>
          </div>
        </section>
      )}

      {/* 지역별 퀵링크 */}
      <section className="mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {REGION_LINKS.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="flex items-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 transition-colors font-medium text-sm"
            >
              <span className="text-xl">{r.emoji}</span>
              {r.label}
            </Link>
          ))}
        </div>
      </section>

      <AdsenseUnit slot="1234567890" className="mb-10" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 메인 콘텐츠 */}
        <div className="lg:col-span-3">
          <h2 className="text-lg font-bold mb-4">최신 세계사 이야기</h2>
          {recentPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {recentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">아직 등록된 이야기가 없습니다.</p>
          )}
          <div className="mt-6 text-center">
            <Link
              href="/posts"
              className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              전체 이야기 보기
            </Link>
          </div>
        </div>

        {/* 사이드바 */}
        <aside className="lg:col-span-1 space-y-6">
          {/* 세계사 검정 배너 */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-amber-800 font-bold text-sm mb-1">📝 세계사능력검정 준비 중?</p>
            <p className="text-amber-700 text-xs mb-3">빈출 토픽 기반 독창 콘텐츠로 효율 학습</p>
            <Link
              href="/exam"
              className="block text-center bg-amber-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-amber-600 transition-colors"
            >
              검정 코너 바로가기 →
            </Link>
          </div>

          {/* 인기글 */}
          {popularPosts.length > 0 && (
            <div>
              <h3 className="font-bold text-sm mb-3">🔥 인기 이야기</h3>
              <ul className="space-y-2">
                {popularPosts.map((post, i) => (
                  <li key={post.id}>
                    <Link
                      href={`/posts/${post.slug}`}
                      className="flex gap-2 text-sm hover:text-indigo-600 transition-colors"
                    >
                      <span className="text-gray-400 font-mono w-4 shrink-0">{i + 1}</span>
                      <span className="line-clamp-2">{post.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <AdsenseUnit slot="0987654321" format="rectangle" />
        </aside>
      </div>
    </div>
  )
}
