import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PostCard from '@/components/post/PostCard'
import AdsenseUnit from '@/components/ads/AdsenseUnit'
import { getPostsByRegion } from '@/lib/db/queries/posts'
import type { Post } from '@/lib/db/schema'

type Region = Post['region']

const REGIONS: Record<Region, { label: string; description: string }> = {
  europe: { label: '유럽사', description: '그리스·로마부터 세계대전까지 유럽의 역사' },
  asia: { label: '아시아사', description: '중국·일본·인도·몽골 제국 등 아시아의 역사' },
  'middle-east-africa': { label: '중동·아프리카사', description: '이집트·오스만제국·이슬람·아프리카의 역사' },
  americas: { label: '아메리카사', description: '마야·잉카·아즈텍·미국 독립 등 아메리카의 역사' },
}

export async function generateStaticParams() {
  return (Object.keys(REGIONS) as Region[]).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const region = REGIONS[params.slug as Region]
  if (!region) return {}
  return { title: region.label, description: region.description }
}

export default async function RegionPage({ params }: { params: { slug: string } }) {
  const region = REGIONS[params.slug as Region]
  if (!region) notFound()

  const posts = await getPostsByRegion(params.slug as Region, 24).catch(() => [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">{region.label}</h1>
      <p className="text-gray-500 text-sm mb-6">{region.description}</p>
      <AdsenseUnit slot="5555555555" className="mb-8" />
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📜</p>
          <p>아직 이 지역의 이야기가 없습니다.</p>
        </div>
      )}
    </div>
  )
}
