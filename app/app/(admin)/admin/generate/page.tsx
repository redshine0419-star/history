'use client'

import { useState } from 'react'
import type { GeneratedPost } from '@/lib/ai/generate'

export default function GeneratePage() {
  const [topic, setTopic] = useState('')
  const [hint, setHint] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GeneratedPost | null>(null)
  const [error, setError] = useState('')

  async function handleGenerate(save: boolean) {
    if (!topic.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': prompt('관리자 키를 입력하세요') ?? '',
        },
        body: JSON.stringify({ topic, hint, save }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data.generated)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">AI 콘텐츠 생성</h1>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">주제 *</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="예: 그리스 민주정, 흑사병, 오스만제국"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">추가 힌트 (선택)</label>
          <input
            type="text"
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            placeholder="예: 세계사능력검정 1·2급 심화, 시험 빈출 내용 강조"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleGenerate(false)}
            disabled={loading || !topic.trim()}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-900 disabled:opacity-50 transition-colors"
          >
            {loading ? '생성 중...' : '미리보기'}
          </button>
          <button
            onClick={() => handleGenerate(true)}
            disabled={loading || !topic.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            생성 후 저장
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {result && (
        <div className="bg-white border rounded-xl p-5 space-y-4 text-sm">
          <h2 className="font-bold text-base">{result.title}</h2>
          <div className="flex gap-2">
            <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full text-xs">{result.region}</span>
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{result.era}</span>
            <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-xs">{result.examLevel}</span>
          </div>
          <div>
            <p className="font-medium">❓ {result.question}</p>
            <p className="mt-1 text-gray-600">💡 {result.answer}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">본문 미리보기</p>
            <p className="text-gray-600 line-clamp-5 whitespace-pre-wrap">{result.fullStory}</p>
          </div>
          {result.examKeyword && (
            <p className="text-amber-700">📝 시험 키워드: {result.examKeyword}</p>
          )}
        </div>
      )}
    </div>
  )
}
