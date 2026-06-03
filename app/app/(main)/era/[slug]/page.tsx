import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PostCard from '@/components/post/PostCard'
import AdsenseUnit from '@/components/ads/AdsenseUnit'
import { getPostsByEra } from '@/lib/db/queries/posts'
import type { Post } from '@/lib/db/schema'

type Era = Post['era']

const ERAS: Record<Era, { label: string; range: string; description: string }> = {
  ancient: { label: '고대 문명', range: '~AD 500', description: '메소포타미아·이집트·그리스·로마의 고대 세계' },
  medieval: { label: '중세', range: '500~1400', description: '봉건제·십자군·이슬람·몽골 제국의 중세 역사' },
  'early-modern': { label: '근세', range: '1400~1800', description: '대항해시대·르네상스·종교개혁·시민혁명' },
  modern: { label: '근대', range: '1800~1945', description: '산업혁명·제국주의·1·2차 세계대전' },
  contemporary: { label: '현대', range: '1945~현재', description: '냉전·탈식민지·현대 국제질서' },
}

export async function generateStaticParams() {
  return (Object.keys(ERAS) as Era[]).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const era = ERAS[params.slug as Era]
  if (!era) return {}
  return { title: `${era.label} (${era.range})`, description: era.description }
}

export default async function EraPage({ params }: { params: { slug: string } }) {
  const era = ERAS[params.slug as Era]
  if (!era) notFound()

  const posts = await getPostsByEra(params.slug as Era, 24).catch(() => [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <p className="text-xs text-gray-400 mb-1">{era.range}</p>
      <h1 className="text-2xl font-bold mb-1">{era.label}</h1>
      <p className="text-gray-500 text-sm mb-6">{era.description}</p>
      <AdsenseUnit slot="6666666666" className="mb-8" />
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">🕰️</p>
          <p>아직 이 시대의 이야기가 없습니다.</p>
        </div>
      )}
    </div>
  )
}
