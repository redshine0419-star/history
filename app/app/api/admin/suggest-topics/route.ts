import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('x-admin-key')
  if (authHeader !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { existingTitles } = await req.json()

  const existing = (existingTitles as string[]).join('\n')

  const prompt = `
너는 세계사 콘텐츠 기획자야. 한국 독자를 위한 세계사 블로그에 올릴 새로운 주제 20개를 추천해줘.

조건:
- 아래 이미 작성된 글 제목들과 겹치지 않는 새로운 주제
- 세계사능력검정시험 빈출 주제 포함
- 흥미로운 반전이나 의외의 사실이 있는 주제 우선
- 지역 균형: 유럽, 아시아, 중동/아프리카, 아메리카 골고루

이미 작성된 글:
${existing}

반드시 아래 JSON 형식으로만 응답해 (마크다운 코드블록 없이):
[
  { "topic": "주제명", "hint": "세계사능력검정 심화 또는 빈출 키워드" },
  ...
]
`

  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' },
  })

  const text = response.text ?? ''
  const topics = JSON.parse(text)
  return NextResponse.json({ topics })
}
