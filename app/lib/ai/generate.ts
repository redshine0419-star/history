import { GoogleGenerativeAI } from '@google/generative-ai'

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const SYSTEM_PROMPT = `
너는 세계사 전문 스토리텔러이자 SEO 최적화 전문가야.
한국 독자를 위한 세계사 Q&A 콘텐츠를 작성해.

반드시 아래 JSON 형식으로만 응답해 (마크다운 코드블록 없이 순수 JSON):
{
  "title": "SEO 제목 (55~65자, 키워드 포함)",
  "question": "호기심을 자극하는 질문 (30~50자)",
  "answer": "핵심 답변 한 줄 (50~80자, 결론 먼저)",
  "summary": "카드용 요약 (120~150자)",
  "fullStory": "본문 (800~1200자, H2 소제목 2개 포함, 반전과 맥락 상세히)",
  "seoTitle": "메타 타이틀 (55~65자)",
  "seoDesc": "메타 디스크립션 (120~155자, 클릭 유도)",
  "region": "europe|asia|middle-east-africa|americas",
  "era": "ancient|medieval|early-modern|modern|contemporary",
  "examLevel": "none|basic|advanced",
  "examKeyword": "시험 연계 핵심 개념 (없으면 null)",
  "tags": ["태그1", "태그2", "태그3"],
  "shortScript": "숏폼 영상 대본 (40초 분량, 첫 3초 후킹 포함)",
  "quizQuestion": "관련 퀴즈 문제 1개",
  "quizOptions": ["보기1", "보기2", "보기3", "보기4"],
  "quizAnswer": 0,
  "quizExplanation": "정답 해설 (2~3문장)"
}
`

export interface GeneratedPost {
  title: string
  question: string
  answer: string
  summary: string
  fullStory: string
  seoTitle: string
  seoDesc: string
  region: 'europe' | 'asia' | 'middle-east-africa' | 'americas'
  era: 'ancient' | 'medieval' | 'early-modern' | 'modern' | 'contemporary'
  examLevel: 'none' | 'basic' | 'advanced'
  examKeyword: string | null
  tags: string[]
  shortScript: string
  quizQuestion: string
  quizOptions: string[]
  quizAnswer: number
  quizExplanation: string
}

export async function generatePost(topic: string, hint?: string): Promise<GeneratedPost> {
  const userMessage = hint
    ? `주제: ${topic}\n추가 맥락: ${hint}`
    : `주제: ${topic}`

  const model = client.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: { responseMimeType: 'application/json' },
  })

  const result = await model.generateContent(userMessage)
  const text = result.response.text()
  return JSON.parse(text) as GeneratedPost
}
