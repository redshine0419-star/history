'use client'

import { useState, useRef } from 'react'

interface Topic {
  topic: string
  hint: string
}

interface JobResult extends Topic {
  status: 'pending' | 'running' | 'done' | 'error' | 'exists'
  title?: string
  error?: string
}

interface ExistingPost {
  id: number
  title: string
  slug: string
  isPublished: boolean
  createdAt: string
}

export default function BatchGeneratePage() {
  const [adminKey, setAdminKey] = useState('')
  const [jobs, setJobs] = useState<JobResult[]>([])
  const [existingPosts, setExistingPosts] = useState<ExistingPost[]>([])
  const [running, setRunning] = useState(false)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [loadingTopics, setLoadingTopics] = useState(false)
  const [customTopics, setCustomTopics] = useState('')
  const stopRef = useRef(false)

  const done = jobs.filter((j) => j.status === 'done').length
  const errors = jobs.filter((j) => j.status === 'error').length
  const pending = jobs.filter((j) => j.status === 'pending').length
  const exists = jobs.filter((j) => j.status === 'exists').length

  async function loadExistingPosts() {
    if (!adminKey.trim()) { alert('관리자 키를 먼저 입력하세요.'); return }
    setLoadingPosts(true)
    try {
      const res = await fetch('/api/admin/posts-list', {
        headers: { 'x-admin-key': adminKey },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setExistingPosts(data.posts)
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : '불러오기 실패')
    } finally {
      setLoadingPosts(false)
    }
  }

  async function suggestTopics() {
    if (!adminKey.trim()) { alert('관리자 키를 먼저 입력하세요.'); return }
    setLoadingTopics(true)
    try {
      const res = await fetch('/api/admin/suggest-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify({ existingTitles: existingPosts.map((p) => p.title) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      const extras = customTopics
        .split('\n').map((s) => s.trim()).filter(Boolean)
        .map((t) => ({ topic: t, hint: '' }))
      setJobs([...data.topics.map((t: Topic) => ({ ...t, status: 'pending' as const })), ...extras.map((t) => ({ ...t, status: 'pending' as const }))])
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : '주제 추천 실패')
    } finally {
      setLoadingTopics(false)
    }
  }

  async function startBatch() {
    const targets = jobs.filter((j) => j.status === 'pending' || j.status === 'error')
    if (targets.length === 0) { alert('생성할 주제가 없습니다.'); return }
    stopRef.current = false
    setRunning(true)

    for (let i = 0; i < jobs.length; i++) {
      if (stopRef.current) break
      if (jobs[i].status !== 'pending' && jobs[i].status !== 'error') continue

      setJobs((prev) => prev.map((j, idx) => idx === i ? { ...j, status: 'running' } : j))

      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
          body: JSON.stringify({ topic: jobs[i].topic, hint: jobs[i].hint, save: true }),
        })
        const data = await res.json()
        if (!res.ok) {
          if (data.error?.includes('duplicate') || data.error?.includes('unique')) {
            setJobs((prev) => prev.map((j, idx) => idx === i ? { ...j, status: 'exists' } : j))
          } else {
            throw new Error(data.error ?? '생성 실패')
          }
        } else {
          setJobs((prev) => prev.map((j, idx) => idx === i ? { ...j, status: 'done', title: data.generated?.title } : j))
          setExistingPosts((prev) => [{ id: data.saved?.id, title: data.generated?.title, slug: data.saved?.slug, isPublished: false, createdAt: new Date().toISOString() }, ...prev])
        }
      } catch (e: unknown) {
        setJobs((prev) => prev.map((j, idx) => idx === i ? { ...j, status: 'error', error: e instanceof Error ? e.message : '오류' } : j))
      }

      if (i < jobs.length - 1 && !stopRef.current) {
        await new Promise((r) => setTimeout(r, 5000))
      }
    }

    setRunning(false)
  }

  function retryErrors() {
    setJobs((prev) => prev.map((j) => j.status === 'error' ? { ...j, status: 'pending', error: undefined } : j))
  }

  const statusIcon = (s: JobResult['status']) => {
    if (s === 'pending') return <span className="text-gray-400">⬜</span>
    if (s === 'running') return <span className="animate-pulse">⏳</span>
    if (s === 'done') return <span>✅</span>
    if (s === 'exists') return <span>⚠️</span>
    return <span>❌</span>
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">일괄 자동 생성</h1>

      {/* 관리자 키 */}
      <div className="bg-white border rounded-xl p-5 space-y-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">관리자 키 *</label>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="ADMIN_SECRET 값"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <button
            onClick={loadExistingPosts}
            disabled={loadingPosts || !adminKey.trim()}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-900 disabled:opacity-50 whitespace-nowrap"
          >
            {loadingPosts ? '불러오는 중...' : '기존 글 불러오기'}
          </button>
        </div>
      </div>

      {/* 기존 포스트 목록 */}
      {existingPosts.length > 0 && (
        <div className="bg-white border rounded-xl p-5">
          <h2 className="text-sm font-semibold mb-3">기존 글 ({existingPosts.length}개)</h2>
          <ul className="space-y-1 max-h-48 overflow-y-auto text-sm text-gray-600">
            {existingPosts.map((p) => (
              <li key={p.id} className="flex items-center gap-2">
                <span className={p.isPublished ? 'text-green-500' : 'text-gray-400'}>●</span>
                <span className="truncate">{p.title}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-400 mt-2">● 초록: 발행됨 / 회색: 미발행</p>
        </div>
      )}

      {/* 주제 생성 */}
      <div className="bg-white border rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold">새 주제 추천</h2>
        <div>
          <label className="block text-sm text-gray-600 mb-1">직접 추가할 주제 (선택 — 줄바꿈으로 구분)</label>
          <textarea
            value={customTopics}
            onChange={(e) => setCustomTopics(e.target.value)}
            rows={2}
            placeholder={'예:\n위그노 전쟁\n영국 동인도회사'}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <button
          onClick={suggestTopics}
          disabled={loadingTopics || !adminKey.trim()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          {loadingTopics ? 'AI가 주제 추천 중...' : '🤖 기존 글 제외하고 20개 주제 추천'}
        </button>
      </div>

      {/* 생성 목록 & 실행 */}
      {jobs.length > 0 && (
        <div className="bg-white border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">생성 목록 ({jobs.length}개)</h2>
            <div className="flex gap-2">
              {errors > 0 && !running && (
                <button onClick={retryErrors} className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs hover:bg-amber-600">
                  ❌ {errors}개 재시도
                </button>
              )}
              {!running ? (
                <button
                  onClick={startBatch}
                  disabled={pending === 0 && errors === 0}
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50"
                >
                  전체 생성 시작
                </button>
              ) : (
                <button onClick={() => { stopRef.current = true }} className="px-4 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">
                  중지
                </button>
              )}
            </div>
          </div>

          {/* 진행 바 */}
          <div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all"
                style={{ width: `${jobs.length ? (done / jobs.length) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">
              ✅ {done}개 완료 · ⬜ {pending}개 대기 · {errors > 0 && `❌ ${errors}개 오류 · `}{exists > 0 && `⚠️ ${exists}개 중복`}
            </p>
          </div>

          {/* 목록 */}
          <ul className="space-y-2 max-h-96 overflow-y-auto">
            {jobs.map((job, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 text-base">{statusIcon(job.status)}</span>
                <div className="flex-1 min-w-0">
                  <span className="font-medium">{job.topic}</span>
                  {job.hint && <span className="text-xs text-gray-400 ml-2">{job.hint}</span>}
                  {job.title && <p className="text-gray-500 text-xs truncate mt-0.5">{job.title}</p>}
                  {job.status === 'exists' && <p className="text-amber-500 text-xs">이미 유사한 글이 존재함</p>}
                  {job.error && <p className="text-red-500 text-xs">{job.error}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
