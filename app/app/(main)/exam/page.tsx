import type { Metadata } from 'next'
import Link from 'next/link'
import AdsenseUnit from '@/components/ads/AdsenseUnit'
import { getExamTopics } from '@/lib/db/queries/exam'
import { getExamPosts } from '@/lib/db/queries/posts'
import PostCard from '@/components/post/PostCard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: '세계사 검정 대비',
  description: '세계사능력검정시험 대비 콘텐츠. 빈출 토픽 기반 독창 Q&A와 시대별 핵심 정리.',
}

const ERA_CARDS = [
  { label: '고대 문명', href: '/era/ancient', desc: '메소포타미아·이집트·그리스·로마' },
  { label: '중세', href: '/era/medieval', desc: '봉건제·십자군·이슬람·몽골' },
  { label: '근세', href: '/era/early-modern', desc: '대항해·르네상스·시민혁명' },
  { label: '근대', href: '/era/modern', desc: '산업혁명·제국주의·세계대전' },
  { label: '현대', href: '/era/contemporary', desc: '냉전·탈식민지·현대질서' },
]

export default async function ExamPage() {
  const [topics, examPosts] = await Promise.all([
    getExamTopics(),
    getExamPosts(6),
  ])

  const topTopics = topics.slice(0, 10)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">세계사 검정 대비</h1>
      <p className="text-gray-500 text-sm mb-2">
        세계사능력검정시험 빈출 토픽 기반 독창 콘텐츠 — 기출 문제 원문 재현이 아닌 학습 효과 중심
      </p>
      <Link href="/exam/guide" className="text-indigo-600 text-sm hover:underline">
        시험 안내 (급수·일정·합격 기준) 보기 →
      </Link>

      <AdsenseUnit slot="7777777777" className="my-8" />

      {/* 급수별 */}
      <section className="mb-10">
        <h2 className="text-lg font-bold mb-4">급수별 학습 시작</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/exam/level/advanced" className="flex flex-col gap-1 p-5 rounded-xl bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-colors">
            <span className="text-indigo-700 font-bold">1·2급 심화</span>
            <span className="text-indigo-600 text-sm">고급 개념·심화 역사 분석 중심</span>
          </Link>
          <Link href="/exam/level/basic" className="flex flex-col gap-1 p-5 rounded-xl bg-green-50 border border-green-100 hover:bg-green-100 transition-colors">
            <span className="text-green-700 font-bold">3·4급 기본</span>
            <span className="text-green-600 text-sm">핵심 흐름과 주요 사건 중심</span>
          </Link>
        </div>
      </section>

      {/* 시대별 */}
      <section className="mb-10">
        <h2 className="text-lg font-bold mb-4">시대별 핵심 정리</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {ERA_CARDS.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="flex flex-col p-4 rounded-xl bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            >
              <span className="font-bold text-sm">{e.label}</span>
              <span className="text-xs text-gray-500 mt-1">{e.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 빈출 토픽 */}
      {topTopics.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-4">📊 빈출 토픽 TOP {topTopics.length}</h2>
          <div className="flex flex-wrap gap-2">
            {topTopics.map((t) => (
              <span
                key={t.id}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-sm text-amber-800"
              >
                {t.keyword}
                {t.frequency >= 3 && <span className="text-red-500 text-xs font-bold">🔥</span>}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">🔥 = 3회 이상 출제 토픽</p>
        </section>
      )}

      {/* 최근 검정 Q&A */}
      {examPosts.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">최근 기출 유형 Q&A</h2>
            <Link href="/exam/questions" className="text-sm text-indigo-600 hover:underline">
              전체 보기 →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {examPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
