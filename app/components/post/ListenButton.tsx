'use client'

import { useState, useRef } from 'react'

interface Props {
  title: string
  fullText: string
}

export default function ListenButton({ title, fullText }: Props) {
  const [speaking, setSpeaking] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

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
    <button
      onClick={handleSpeak}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors mb-6 ${
        speaking ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
      }`}
    >
      {speaking ? '⏹ 읽기 중지' : '🔊 듣기'}
    </button>
  )
}
