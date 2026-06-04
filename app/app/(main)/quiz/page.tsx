'use client'

import { useState, useEffect, useCallback } from 'react'

interface Quiz {
  id: number
  postId: number
  question: string
  options: string[]
  answer: number
  explanation: string
  postTitle?: string
  postSlug?: string
}

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState<boolean[]>([])

  const loadQuizzes = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/quiz/random')
      const data = await res.json()
      setQuizzes(data.quizzes ?? [])
      setCurrent(0)
      setSelected(null)
      setShowResult(false)
      setScore(0)
      setFinished(false)
      setAnswers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadQuizzes() }, [loadQuizzes])

  function handleSelect(idx: number) {
    if (selected !== null) return
    setSelected(idx)
    setShowResult(true)
    const correct = idx === quizzes[current].answer
    if (correct) setScore((s) => s + 1)
    setAnswers((prev) => [...prev, correct])
  }

  function handleNext() {
    if (current + 1 >= quizzes.length) {
      setFinished(true)
    } else {
      setCurrent((c) => c + 1)
      setSelected(null)
      setShowResult(false)
    }
  }

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center text-gray-400">
      퀴즈를 불러오는 중...
    </div>
  )

  if (quizzes.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <p className="text-gray-500 mb-4">아직 퀴즈가 없습니다.</p>
      <p className="text-sm text-gray-400">관리자 페이지에서 콘텐츠를 생성하면 퀴즈가 자동으로 추가됩니다.</p>
    </div>
  )

  if (finished) {
    const pct = Math.round((score / quizzes.length) * 100)
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white border rounded-2xl p-8 text-center shadow-sm">
          <div className="text-5xl mb-4">
            {pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚'}
          </div>
          <h2 className="text-2xl font-bold mb-2">퀴즈 완료!</h2>
          <p className="text-4xl font-bold text-indigo-600 mb-1">{score} / {quizzes.length}</p>
          <p className="text-gray-500 mb-6">정답률 {pct}%</p>
          <div className="flex gap-2 justify-center mb-6">
            {answers.map((correct, i) => (
              <span key={i} className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${correct ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                {correct ? '○' : '✕'}
              </span>
            ))}
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={loadQuizzes}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700"
            >
              다시 풀기
            </button>
          </div>
        </div>
      </div>
    )
  }

  const quiz = quizzes[current]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-lg font-bold text-gray-800">세계사 퀴즈</h1>
          <span className="text-sm text-gray-400">{current + 1} / {quizzes.length}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className="bg-indigo-500 h-1.5 rounded-full transition-all"
            style={{ width: `${((current + 1) / quizzes.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 문제 */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm mb-4">
        <p className="text-base font-medium text-gray-800 leading-relaxed mb-6">{quiz.question}</p>

        <div className="space-y-3">
          {quiz.options.map((opt, idx) => {
            let style = 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
            if (showResult) {
              if (idx === quiz.answer) style = 'border-green-400 bg-green-50 text-green-800'
              else if (idx === selected) style = 'border-red-300 bg-red-50 text-red-700'
              else style = 'border-gray-100 bg-gray-50 text-gray-400'
            }
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all ${style}`}
              >
                <span className="font-semibold mr-2">{['①', '②', '③', '④'][idx]}</span>
                {opt}
              </button>
            )
          })}
        </div>
      </div>

      {/* 해설 */}
      {showResult && (
        <div className={`rounded-xl p-4 mb-4 text-sm ${selected === quiz.answer ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <p className="font-semibold mb-1">
            {selected === quiz.answer ? '✅ 정답입니다!' : `❌ 오답 — 정답은 ${['①', '②', '③', '④'][quiz.answer]}`}
          </p>
          <p className="text-gray-600">{quiz.explanation}</p>
          {quiz.postSlug && (
            <a href={`/posts/${quiz.postSlug}`} className="inline-block mt-2 text-indigo-600 hover:underline text-xs">
              📖 관련 글 읽기 →
            </a>
          )}
        </div>
      )}

      {showResult && (
        <button
          onClick={handleNext}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          {current + 1 >= quizzes.length ? '결과 보기' : '다음 문제 →'}
        </button>
      )}
    </div>
  )
}
