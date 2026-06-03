// 12·13·14회차 분석 기반 examTopics 시드 데이터
// 실행: npx tsx lib/db/seed.ts

import { db } from './index'
import { examTopics } from './schema'

const SEED_TOPICS = [
  // 빈출 3회 — 최우선
  { keyword: '그리스 민주정·아테네', era: 'ancient', region: 'europe', examLevel: 'advanced', frequency: 3, rounds: [12, 13, 14] },
  { keyword: '로마 공화정·제정', era: 'ancient', region: 'europe', examLevel: 'advanced', frequency: 3, rounds: [12, 13, 14] },
  { keyword: '오스만제국', era: 'medieval', region: 'middle-east-africa', examLevel: 'advanced', frequency: 3, rounds: [12, 13, 14] },
  { keyword: '명·청 왕조', era: 'early-modern', region: 'asia', examLevel: 'advanced', frequency: 3, rounds: [12, 13, 14] },
  { keyword: '윌슨·민족자결·파리강화회의', era: 'modern', region: 'europe', examLevel: 'basic', frequency: 3, rounds: [12, 13, 14] },
  { keyword: '스페인의 아메리카 식민지', era: 'early-modern', region: 'americas', examLevel: 'basic', frequency: 2, rounds: [12, 13] },
  { keyword: '도쿄 전범 재판', era: 'contemporary', region: 'asia', examLevel: 'basic', frequency: 2, rounds: [13, 14] },
  { keyword: '이스라엘·팔레스타인 분쟁', era: 'contemporary', region: 'middle-east-africa', examLevel: 'basic', frequency: 2, rounds: [13, 14] },
  { keyword: '대만 현대사', era: 'contemporary', region: 'asia', examLevel: 'basic', frequency: 2, rounds: [12, 14] },
  { keyword: '마르코 폴로·원 제국', era: 'medieval', region: 'asia', examLevel: 'basic', frequency: 2, rounds: [12, 14] },
  { keyword: '닉슨 독트린', era: 'contemporary', region: 'americas', examLevel: 'basic', frequency: 2, rounds: [12, 14] },
  { keyword: '아편전쟁·난징조약', era: 'modern', region: 'asia', examLevel: 'advanced', frequency: 2, rounds: [12, 13] },
  { keyword: '중국 근대화 (양무운동·변법자강)', era: 'modern', region: 'asia', examLevel: 'advanced', frequency: 2, rounds: [13, 14] },
  { keyword: '중국 혁명 (문화대혁명·톈안먼)', era: 'contemporary', region: 'asia', examLevel: 'advanced', frequency: 3, rounds: [12, 13, 14] },
  // 빈출 2회 — 2순위
  { keyword: '십자군 전쟁', era: 'medieval', region: 'europe', examLevel: 'advanced', frequency: 2, rounds: [12, 13] },
  { keyword: '흑사병', era: 'medieval', region: 'europe', examLevel: 'basic', frequency: 2, rounds: [12, 14] },
  { keyword: '르네상스', era: 'early-modern', region: 'europe', examLevel: 'basic', frequency: 2, rounds: [13, 14] },
  { keyword: '종교개혁 (루터·칼뱅)', era: 'early-modern', region: 'europe', examLevel: 'basic', frequency: 2, rounds: [12, 13] },
  { keyword: '프랑스 혁명', era: 'early-modern', region: 'europe', examLevel: 'advanced', frequency: 2, rounds: [12, 14] },
  { keyword: '나폴레옹', era: 'modern', region: 'europe', examLevel: 'advanced', frequency: 2, rounds: [13, 14] },
  { keyword: '산업혁명', era: 'modern', region: 'europe', examLevel: 'basic', frequency: 2, rounds: [12, 13] },
  { keyword: '제국주의·아프리카 분할', era: 'modern', region: 'middle-east-africa', examLevel: 'basic', frequency: 2, rounds: [13, 14] },
  { keyword: '제1차 세계대전', era: 'modern', region: 'europe', examLevel: 'advanced', frequency: 2, rounds: [12, 14] },
  { keyword: '러시아 혁명', era: 'modern', region: 'europe', examLevel: 'advanced', frequency: 2, rounds: [13, 14] },
  { keyword: '히틀러·나치즘', era: 'modern', region: 'europe', examLevel: 'advanced', frequency: 2, rounds: [12, 13] },
  { keyword: '태평양 전쟁', era: 'modern', region: 'asia', examLevel: 'basic', frequency: 2, rounds: [12, 14] },
  { keyword: '인도 독립 (간디)', era: 'modern', region: 'asia', examLevel: 'basic', frequency: 2, rounds: [13, 14] },
  { keyword: '냉전 (트루먼·마샬플랜)', era: 'contemporary', region: 'europe', examLevel: 'basic', frequency: 2, rounds: [12, 13] },
  { keyword: '유럽 통합 (EU 역사)', era: 'contemporary', region: 'europe', examLevel: 'basic', frequency: 2, rounds: [13, 14] },
] as const

async function seed() {
  console.log('Seeding examTopics...')
  await db.insert(examTopics).values(
    SEED_TOPICS.map((t) => ({
      ...t,
      era: t.era as any,
      region: t.region as any,
      examLevel: t.examLevel as any,
      rounds: [...t.rounds],
    })),
  )
  console.log(`Inserted ${SEED_TOPICS.length} exam topics.`)
  process.exit(0)
}

seed().catch((e) => { console.error(e); process.exit(1) })
