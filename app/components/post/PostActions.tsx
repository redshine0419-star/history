'use client'

import { useState } from 'react'

interface Props {
  postId: number
  slug: string
  title: string
  initialLikeCount: number
  fullText: string
}

export default function PostActions({ postId, slug, initialLikeCount }: Props) {
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [liked, setLiked] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleLike = async () => {
    if (liked) return
    setLiked(true)
    setLikeCount((c) => c + 1)
    await fetch(`/api/posts/${postId}/like`, { method: 'POST' }).catch(() => {})
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`https://www.askhistory.me/posts/${slug}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSpeak = () => {
    if (!window.speechSynthesis) return

    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }

    const text = `${title}. ${fullText.replace(/<[^>]*>/g, '').replace(/#{1,6}\s/g, '').replace(/\n+/g, ' ')}`
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ko-KR'
    utterance.rate = 1.0
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    utteranceRef.current = utterance

    window.speechSynthesis.speak(utterance)
    setSpeaking(true)
  }

  return (
    <div className="flex flex-wrap items-center gap-3 py-6 border-t border-b border-gray-100 mb-8">
      <button
        onClick={handleLike}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          liked ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-500'
        }`}
      >
        ❤️ {likeCount > 0 ? likeCount : ''} 좋아요
      </button>

      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
      >
        {copied ? '✅ 복사됨' : '🔗 링크 복사'}
      </button>

    </div>
  )
}
