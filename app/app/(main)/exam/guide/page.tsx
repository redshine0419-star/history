import type { Metadata } from 'next'
import Link from 'next/link'
import AdsenseUnit from '@/components/ads/AdsenseUnit'

export const metadata: Metadata = {
  title: '세계사능력검정시험 안내',
  description: '세계사능력검정시험 급수 체계, 시험 일정, 합격 기준을 안내합니다.',
}

export default function ExamGuidePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-xs text-gray-400 mb-4">
        <Link href="/" className="hover:text-indigo-600">홈</Link> /{' '}
        <Link href="/exam" className="hover:text-indigo-600">세계사 검정</Link> / 시험 안내
      </nav>
      <h1 className="text-2xl font-bold mb-2">세계사능력검정시험 안내</h1>
      <p className="text-gray-500 text-sm mb-6">한국역사교육진흥회 주관 세계사능력검정시험 기본 정보</p>

      <AdsenseUnit slot="8888888888" className="mb-8" />

      <section className="space-y-6">
        <div className="bg-indigo-50 rounded-xl p-5">
          <h2 className="font-bold text-indigo-800 mb-3">📋 시험 개요</h2>
          <ul className="text-sm text-indigo-900 space-y-1">
            <li>• 주관: 한국역사교육진흥회 (historyexam.co.kr)</li>
            <li>• 대상: 세계사에 관심 있는 누구나</li>
            <li>• 급수: 1급(최고) ~ 4급(기본), 초급 포함</li>
            <li>• 문항: 50문항 (객관식 46 + 단답·서술형 4)</li>
          </ul>
        </div>

        <div className="bg-amber-50 rounded-xl p-5">
          <h2 className="font-bold text-amber-800 mb-3">🏆 급수 체계</h2>
          <div className="text-sm space-y-2">
            <div className="flex gap-3">
              <span className="font-bold text-amber-700 w-16">1·2급</span>
              <span>심화 — 세계사 전반의 심층적 이해, 역사적 인과관계 분석</span>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-amber-700 w-16">3·4급</span>
              <span>기본 — 주요 사건·인물·흐름 파악, 시대별 핵심 내용</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-5">
          <h2 className="font-bold text-gray-800 mb-3">📝 시험 특징</h2>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Q1~46: 5지선다 객관식</li>
            <li>• Q47~50: 단답형·서술형 (부분 점수 있음)</li>
            <li>• Q43~46: 현재 시사 + 역사 연결 (매회 출제)</li>
            <li>• 동양사·서양사 비율 약 50:50</li>
          </ul>
        </div>

        <div className="text-center">
          <a
            href="https://historyexam.co.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            공식 사이트에서 일정 확인 →
          </a>
        </div>
      </section>
    </div>
  )
}
