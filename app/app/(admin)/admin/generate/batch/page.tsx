'use client'

import { useState, useRef } from 'react'

interface Topic {
  topic: string
  hint: string
}

interface JobResult {
  topic: string
  status: 'pending' | 'running' | 'done' | 'error'
  title?: string
  error?: string
}

const PRESET_TOPICS: Topic[] = [
  { topic: '십자군 전쟁', hint: '세계사능력검정 심화' },
  { topic: '몽골제국 징기스칸', hint: '세계사능력검정 심화' },
  { topic: '르네상스 메디치 가문', hint: '' },
  { topic: '나폴레옹 몰락', hint: '세계사능력검정 기본' },
  { topic: '아편전쟁', hint: '세계사능력검정 심화' },
  { topic: '명예혁명 영국', hint: '세계사능력검정 심화' },
  { topic: '히틀러 나치 집권', hint: '' },
  { topic: '베르사유 조약', hint: '세계사능력검정 기본' },
  { topic: '로마 멸망 원인', hint: '' },
  { topic: '잉카제국 정복', hint: '' },
  { topic: '마틴 루터 종교개혁', hint: '세계사능력검정 심화' },
  { topic: '미국 독립혁명', hint: '세계사능력검정 기본' },
  { topic: '러시아 혁명 레닌', hint: '세계사능력검정 심화' },
  { topic: '냉전 쿠바 미사일 위기', hint: '' },
  { topic: '이슬람 제국 팽창', hint: '세계사능력검정 심화' },
  { topic: '메이지 유신', hint: '세계사능력검정 심화' },
  { topic: '히로시마 원자폭탄', hint: '' },
  { topic: '인도 간디 비폭력 운동', hint: '' },
  { topic: '오스만제국 멸망', hint: '세계사능력검정 심화' },
  { topic: '베를린 장벽 붕괴', hint: '' },
]

export default function BatchGeneratePage() {
  const [adminKey, setAdminKey] = useState('')
  const [jobs, setJobs] = useState<JobResult[]>(
    PRESET_TOPICS.map((t) => ({ topic: t.topic, status: 'pending' }))
  )
  const [running, setRunning] = useState(false)
  const [customTopics, setCustomTopics] = useState('')
  const stopRef = useRef(false)

  const total = jobs.length
  const done = jobs.filter((j) => j.status === 'done').length
  const errors = jobs.filter((j) => j.status === 'error').length

  function resetJobs() {
    const base = PRESET_TOPICS.map((t) => ({ topic: t.topic, status: 'pending' as const }))
    const extras = customTopics
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((t) => ({ topic: t, status: 'pending' as const }))
    setJobs([...base, ...extras])
  }

  async function startBatch() {
    if (!adminKey.trim()) {
      alert('관리자 키를 입력하세요.')
      return
    }
    stopRef.current = false
    setRunning(true)

    const currentJobs = [...jobs]

    for (let i = 0; i < currentJobs.length; i++) {
      if (stopRef.current) break
      if (currentJobs[i].status === 'done') continue

      setJobs((prev) =>
        prev.map((j, idx) => (idx === i ? { ...j, status: 'running' } : j))
      )

      try {
        const topic = PRESET_TOPICS[i]?.topic ?? currentJobs[i].topic
        const hint = PRESET_TOPICS[i]?.hint ?? ''

        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-key': adminKey,
          },
          body: JSON.stringify({ topic, hint, save: true }),
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? '생성 실패')

        setJobs((prev) =>
          prev.map((j, idx) =>
            idx === i ? { ...j, status: 'done', title: data.generated?.title } : j
          )
        )
      } catch (e: unknown) {
        setJobs((prev) =>
          prev.map((j, idx) =>
            idx === i
              ? { ...j, status: 'error', error: e instanceof Error ? e.message : '오류' }
              : j
          )
        )
      }

      // Gemini 무료 티어 분당 15회 제한 대응 — 5초 간격
      if (i < currentJobs.length - 1 && !stopRef.current) {
        await new Promise((r) => setTimeout(r, 5000))
      }
    }

    setRunning(false)
  }

  function stopBatch() {
    stopRef.current = true
  }

  const statusIcon = (s: JobResult['status']) => {
    if (s === 'pending') return '⬜'
    if (s === 'running') return '⏳'
    if (s === 'done') return '✅'
    return '❌'
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">일괄 자동 생성</h1>
      <p className="text-sm text-gray-500 mb-6">주제 목록을 순차적으로 생성해 DB에 저장합니다.</p>

      <div className="bg-white border rounded-xl p-5 mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">관리자 키 *</label>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="ADMIN_SECRET 값 입력"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">추가 주제 (선택 — 줄바꿈으로 구분)</label>
          <textarea
            value={customTopics}
            onChange={(e) => setCustomTopics(e.target.value)}
            rows={3}
            placeholder={'예:\n위그노 전쟁\n영국 동인도회사'}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={resetJobs}
            disabled={running}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 disabled:opacity-50"
          >
            목록 초기화
          </button>
          {!running ? (
            <button
              onClick={startBatch}
              disabled={!adminKey.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              전체 생성 시작
            </button>
          ) : (
            <button
              onClick={stopBatch}
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
            >
              중지
            </button>
          )}
        </div>
      </div>

      {/* 진행 현황 */}
      <div className="bg-white border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium">진행 현황</span>
          <span className="text-sm text-gray-500">
            {done}/{total} 완료 {errors > 0 && `· ❌ ${errors}개 오류`}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 mb-5">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all"
            style={{ width: `${total ? (done / total) * 100 : 0}%` }}
          />
        </div>
        <ul className="space-y-2 max-h-96 overflow-y-auto">
          {jobs.map((job, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="mt-0.5">{statusIcon(job.status)}</span>
              <div className="flex-1 min-w-0">
                <span className="font-medium">{job.topic}</span>
                {job.title && (
                  <p className="text-gray-500 text-xs truncate">{job.title}</p>
                )}
                {job.error && (
                  <p className="text-red-500 text-xs">{job.error}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
