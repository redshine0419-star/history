import { GoogleGenAI } from '@google/genai'

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

const SYSTEM_PROMPT = `
너는 세계사 전문 스토리텔러이자 SEO 최적화 전문가야.
한국 독자를 위한 세계사 Q&A 콘텐츠를 작성해.

퀴즈는 반드시 세계사능력검정시험 기출 유형을 따라야 해:
- 4지선다형, 오답 3개는 그럴듯하게 구성
- "(가)에 들어갈 내용으로 옳은 것은?" 스타일의 빈칸형
- "다음 설명에 해당하는 사건/인물은?" 스타일의 설명형
- "밑줄 친 ㉠의 결과로 옳은 것은?" 스타일의 인과관계형
- 정답은 0~3 사이 숫자 (0=첫 번째 보기)

반드시 아래 JSON 형식으로만 응답해 (마크다운 코드블록 없이 순수 JSON):
{
  "slug": "영문-소문자-하이픈-URL-슬러그 (예: black-death-europe-1347, 30자 이내, 영문과 하이픈만 사용)",
  "title": "SEO 제목 (55~65자, 키워드 포함)",
  "question": "호기심을 자극하는 질문 (30~50자)",
  "answer": "핵심 답변 한 줄 (50~80자, 결론 먼저)",
  "summary": "카드용 요약 (120~150자)",
  "fullStory": "본문 (800~1200자, ## H2 소제목 2개 포함, 반전과 맥락 상세히)",
  "seoTitle": "메타 타이틀 (55~65자)",
  "seoDesc": "메타 디스크립션 (120~155자, 클릭 유도)",
  "region": "europe|asia|middle-east-africa|americas",
  "era": "ancient|medieval|early-modern|modern|contemporary",
  "examLevel": "none|basic|advanced",
  "examKeyword": "시험 연계 핵심 개념 (없으면 null)",
  "tags": ["태그1", "태그2", "태그3"],
  "shortScript": "숏폼 영상 대본 (40초 분량, 첫 3초 후킹 포함)",
  "quizzes": [
    {
      "question": "세계사능력검정 기출 유형 문제 (빈칸형 또는 설명형)",
      "options": ["보기1", "보기2", "보기3", "보기4"],
      "answer": 0,
      "explanation": "정답 해설 (2~3문장, 왜 정답인지 + 오답 구별 포인트)"
    },
    {
      "question": "두 번째 퀴즈 (다른 유형으로)",
      "options": ["보기1", "보기2", "보기3", "보기4"],
      "answer": 0,
      "explanation": "정답 해설"
    },
    {
      "question": "세 번째 퀴즈",
      "options": ["보기1", "보기2", "보기3", "보기4"],
      "answer": 0,
      "explanation": "정답 해설"
    }
  ]
}
`

export interface QuizItem {
  question: string
  options: string[]
  answer: number
  explanation: string
}

export interface GeneratedPost {
  slug: string
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
  quizzes: QuizItem[]
}

export async function generatePost(topic: string, hint?: string): Promise<GeneratedPost> {
  const userMessage = hint
    ? `주제: ${topic}\n추가 맥락: ${hint}`
    : `주제: ${topic}`

  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: userMessage,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: 'application/json',
    },
  })

  const text = response.text ?? ''
  return JSON.parse(text) as GeneratedPost
}
