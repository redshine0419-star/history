'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Post {
  id: number
  title: string
  slug: string
  isPublished: boolean
  createdAt: string
}

export default function AdminPostsPage() {
  const [adminKey, setAdminKey] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [loaded, setLoaded] = useState(false)
  const [search, setSearch] = useState('')

  const loadPosts = async () => {
    const res = await fetch('/api/admin/posts-list', { headers: { 'x-admin-key': adminKey } })
    if (res.ok) {
      const data = await res.json()
      setPosts(data.posts || [])
      setLoaded(true)
    } else {
      alert('인증 실패')
    }
  }

  const filtered = posts.filter((p) => p.title.includes(search))

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">포스트 관리</h1>

      <div className="bg-white rounded-xl border p-5 mb-4 flex gap-3">
        <input
          type="password"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm flex-1"
          placeholder="Admin Key 입력"
          onKeyDown={(e) => e.key === 'Enter' && loadPosts()}
        />
        <button
          onClick={loadPosts}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
        >
          불러오기
        </button>
      </div>

      {loaded && (
        <>
          <div className="mb-3 flex items-center justify-between">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="제목 검색..."
              className="border rounded-lg px-3 py-2 text-sm w-72"
            />
            <span className="text-sm text-gray-500">총 {filtered.length}개</span>
          </div>

          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">제목</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium w-24">상태</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium w-32">생성일</th>
                  <th className="px-4 py-3 w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 line-clamp-1">{p.title}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${p.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.isPublished ? '발행' : '미발행'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(p.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/posts/${p.slug}`}
                        target="_blank"
                        className="text-indigo-600 hover:underline text-xs"
                      >
                        보기
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
