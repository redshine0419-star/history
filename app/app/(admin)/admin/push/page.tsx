'use client'

import { useState, useEffect } from 'react'

interface Post {
  id: number
  title: string
  slug: string
  summary: string | null
}

export default function PushPage() {
  const [adminKey, setAdminKey] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [selected, setSelected] = useState<Post | null>(null)
  const [customTitle, setCustomTitle] = useState('')
  const [customMessage, setCustomMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const loadPosts = async () => {
    if (!adminKey) return
    const res = await fetch('/api/admin/posts-list', { headers: { 'x-admin-key': adminKey } })
    if (res.ok) {
      const data = await res.json()
      setPosts(data.posts || [])
    }
  }

  useEffect(() => {
    if (selected) {
      setCustomTitle('세계사의 반전 — 새 글')
      setCustomMessage(selected.title)
    }
  }, [selected])

  const handleSend = async () => {
    if (!selected || !customTitle || !customMessage) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/admin/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify({
          title: customTitle,
          message: customMessage,
          url: `https://www.askhistory.me/posts/${selected.slug}`,
        }),
      })
      const data = await res.json()
      if (data.errors?.length) {
        setResult('오류: ' + data.errors.join(', '))
      } else {
        setResult(`발송 완료! 수신자: ${data.recipients ?? 0}명`)
      }
    } catch (e) {
      setResult('오류: ' + String(e))
    } finally {
      setLoading(false)
    }
  }

  const filtered = posts.filter((p) => p.title.includes(search))

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">푸시 알림 발송</h1>

      <div className="bg-white rounded-xl border p-5 mb-4 space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700">Admin Key</label>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="ADMIN_SECRET 입력"
          />
        </div>
        <button
          onClick={loadPosts}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
        >
          포스트 불러오기
        </button>
      </div>

      {posts.length > 0 && (
        <>
          <div className="bg-white rounded-xl border p-5 mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-2">포스트 선택</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="제목 검색..."
              className="w-full border rounded-lg px-3 py-2 text-sm mb-3"
            />
            <div className="max-h-60 overflow-y-auto space-y-1">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selected?.id === p.id
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>

          {selected && (
            <div className="bg-white rounded-xl border p-5 mb-4 space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">알림 제목</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">알림 내용</label>
                <input
                  type="text"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">링크</label>
                <p className="mt-1 text-sm text-gray-500">
                  https://www.askhistory.me/posts/{selected.slug}
                </p>
              </div>
              <button
                onClick={handleSend}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? '발송 중...' : '푸시 알림 발송'}
              </button>
              {result && (
                <p className={`text-sm font-medium ${result.startsWith('오류') ? 'text-red-600' : 'text-green-600'}`}>
                  {result}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
