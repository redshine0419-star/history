import Link from 'next/link'
import type { Post } from '@/lib/db/schema'

const ERA_LABEL: Record<Post['era'], string> = {
  ancient: '고대 문명',
  medieval: '중세',
  'early-modern': '근세',
  modern: '근대',
  contemporary: '현대',
}

const REGION_LABEL: Record<Post['region'], string> = {
  europe: '유럽사',
  asia: '아시아사',
  'middle-east-africa': '중동·아프리카',
  americas: '아메리카사',
}

const EXAM_BADGE: Record<Post['examLevel'], string | null> = {
  none: null,
  basic: '검정 3·4급',
  advanced: '검정 1·2급',
}

interface Props {
  post: Post
}

export default function PostCard({ post }: Props) {
  const examBadge = EXAM_BADGE[post.examLevel]

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      {post.thumbnail && (
        <div className="aspect-video overflow-hidden bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex flex-wrap gap-1">
          <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
            {REGION_LABEL[post.region]}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {ERA_LABEL[post.era]}
          </span>
          {examBadge && (
            <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
              {examBadge}
            </span>
          )}
        </div>
        <h2 className="font-bold text-gray-900 leading-snug group-hover:text-indigo-700 transition-colors line-clamp-2">
          {post.title}
        </h2>
        {post.summary && (
          <p className="text-sm text-gray-500 line-clamp-2">{post.summary}</p>
        )}
        <div className="mt-auto pt-2 text-xs text-gray-400 flex gap-3">
          <span>👁 {post.viewCount.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  )
}
