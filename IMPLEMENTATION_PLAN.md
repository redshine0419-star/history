# 세계사 Q&A 서비스 — 전체 구현 계획서 (v2)

## 프로젝트 개요

- **서비스명**: 세계사의 반전 (가칭) | `worldhistory.kr` 또는 `historyflip.kr`
- **핵심 콘텐츠**: 세계사 중심 흥미 Q&A + 세계사능력검정시험 대비 코너
- **핵심 수익**: 구글 애드센스 (검색 트래픽 기반)
- **보조 수익**: 유튜브 파트너, 인스타 협찬, 전자책
- **운영 형태**: 1인 운영, AI 반자동화

---

## 타깃 사용자 (2트랙)

| 트랙 | 타깃 | 유입 경로 | 체류 목적 |
|---|---|---|---|
| A. 흥미 독자 | 20~40대 일반인 | 인스타 릴스 / 구글 검색 | 재미로 소비 → 광고 노출 |
| B. 수험생 | 고등학생 / 수능 / 검정시험 준비생 | 구글 검색 | 시험 대비 학습 → 광고 노출 |

> 두 타깃 모두 **애드센스 광고 노출**로 수익화 — 콘텐츠는 분리, 수익 구조는 동일

---

## 기술 스택

| 레이어 | 기술 | 이유 |
|---|---|---|
| Frontend | Next.js 14 (App Router) | SSG/ISR, SEO 최적화 |
| Language | TypeScript | 안정성, 자동완성 |
| Styling | Tailwind CSS | 빠른 UI 개발 |
| Database | Neon (Serverless PostgreSQL) | 무료 tier, Vercel 네이티브 통합 |
| ORM | Drizzle ORM | 타입세이프, 경량, Neon 궁합 최고 |
| Deployment | Vercel | Neon + Next.js 네이티브 통합 |
| DNS/CDN | Cloudflare | 무료 CDN, 도메인 관리 |
| AI | Claude API (claude-sonnet-4-6) | 콘텐츠 생성 자동화 |
| 이미지 | Next/Image + Cloudflare Images | 최적화 |
| Analytics | Google Analytics 4 + Search Console | 트래픽 분석 |

---

## 메뉴 구조 (사이트맵)

```
[헤더 GNB]
├── 홈 (/)
├── 전체 이야기 (/posts)
│
├── 지역별                              ← 세계사 특화 분류 (흥미 독자용)
│   ├── 유럽사 (/region/europe)
│   ├── 아시아사 (/region/asia)
│   ├── 중동·아프리카사 (/region/middle-east-africa)
│   └── 아메리카사 (/region/americas)
│
├── 시대별                              ← 세계사 시대 분류
│   ├── 고대 문명 (/era/ancient)        ~AD 500
│   ├── 중세 (/era/medieval)            500~1400
│   ├── 근세 (/era/early-modern)        1400~1800  (대항해·르네상스·혁명)
│   ├── 근대 (/era/modern)              1800~1945  (산업혁명·제국주의·세계대전)
│   └── 현대 (/era/contemporary)        1945~현재
│
├── 세계사 검정 (/exam)                 ← 시험 대비 별도 섹션 (수험생용)
│   ├── 시험 안내 (/exam/guide)
│   ├── 급수별 핵심 정리
│   │   ├── 1·2급 심화 (/exam/level/advanced)
│   │   └── 3·4급 기본 (/exam/level/basic)
│   ├── 시대별 핵심 요약 (/exam/era)
│   ├── 기출 유형 Q&A (/exam/questions)
│   └── 모의고사 (/exam/mock-test)
│
├── 역사 퀴즈 (/quiz)                   ← 바이럴용 인터랙티브
└── 검색 (/search)

[푸터]
├── 서비스 소개 (/about)
├── 인스타그램 (외부링크)
├── 유튜브 (외부링크)
└── 관리자 (/admin) — 비노출, 직접 URL 접근
```

---

## 카테고리 체계 상세

### 지역별 (4개) — "어느 나라/지역의 역사인가"

| # | 지역 | URL | 주요 포함 내용 | 콘텐츠 예시 |
|---|---|---|---|---|
| 1 | 유럽사 | `/region/europe` | 그리스·로마·중세유럽·프랑스혁명·세계대전 | 38분 전쟁, 토마토 악마의 열매, 흑사병 비화 |
| 2 | 아시아사 | `/region/asia` | 중국·일본·인도·동남아·몽골제국 | 몽골 제국 속도의 비밀, 일본 사무라이 실화 |
| 3 | 중동·아프리카사 | `/region/middle-east-africa` | 이집트·메소포타미아·이슬람·오스만제국 | 피라미드 건설 노동자의 실제 대우 |
| 4 | 아메리카사 | `/region/americas` | 마야·잉카·아즈텍·미국 독립·남미 | 콜럼버스가 몰랐던 사실들 |

### 시대별 (5개) — "언제의 역사인가"

| # | 시대 | URL | 범위 | 세계사 검정 연계 |
|---|---|---|---|---|
| 1 | 고대 문명 | `/era/ancient` | ~AD 500 | 1·2급 필수: 메소포타미아·이집트·그리스·로마 |
| 2 | 중세 | `/era/medieval` | 500~1400 | 1·2급 필수: 봉건제·십자군·이슬람·몽골 |
| 3 | 근세 | `/era/early-modern` | 1400~1800 | 3·4급 포함: 대항해·르네상스·종교개혁·시민혁명 |
| 4 | 근대 | `/era/modern` | 1800~1945 | 전 급수 핵심: 산업혁명·제국주의·1·2차 세계대전 |
| 5 | 현대 | `/era/contemporary` | 1945~현재 | 3·4급: 냉전·탈식민지·현대 국제질서 |

### 포스트 태깅 예시

| 포스트 제목 | 지역 | 시대 | 검정시험 연계 |
|---|---|---|---|
| 38분만에 끝난 전쟁의 진실 | 유럽사 | 근대 | 3급 — 제국주의 팽창 |
| 토마토가 악마의 열매였던 이유 | 유럽사 | 근세 | - (흥미 전용) |
| 피라미드는 노예가 만들었나? | 중동·아프리카 | 고대 문명 | 1·2급 — 이집트 문명 |
| 콜럼버스가 죽을 때까지 믿었던 것 | 아메리카 | 근세 | 3급 — 대항해시대 |
| 흑사병이 유럽을 바꾼 방식 | 유럽사 | 중세 | 1·2급 — 중세 유럽 사회 |

> 하나의 포스트 = **지역 1개 + 시대 1개** 태깅
> 시험 연계 포스트는 추가로 **검정 급수 태그** 부여 → `/exam` 섹션에도 노출

---

## DB 스키마 (Neon PostgreSQL + Drizzle ORM)

```typescript
// lib/db/schema.ts

import { pgTable, serial, varchar, text, boolean, integer,
         timestamp, pgEnum } from 'drizzle-orm/pg-core'

// 지역 분류 (세계사 특화)
export const regionEnum = pgEnum('region', [
  'europe',             // 유럽사
  'asia',               // 아시아사
  'middle-east-africa', // 중동·아프리카사
  'americas',           // 아메리카사
])

// 시대 분류
export const eraEnum = pgEnum('era', [
  'ancient',        // 고대 문명 (~AD 500)
  'medieval',       // 중세 (500~1400)
  'early-modern',   // 근세 (1400~1800)
  'modern',         // 근대 (1800~1945)
  'contemporary',   // 현대 (1945~)
])

// 세계사능력검정 급수
export const examLevelEnum = pgEnum('exam_level', [
  'none',     // 시험 미연계 (흥미 전용)
  'basic',    // 3·4급 (기본)
  'advanced', // 1·2급 (심화)
])

// 메인 포스트 테이블
export const posts = pgTable('posts', {
  id:           serial('id').primaryKey(),
  slug:         varchar('slug', { length: 250 }).unique().notNull(),
  title:        varchar('title', { length: 300 }).notNull(),
  question:     text('question').notNull(),
  answer:       text('answer').notNull(),
  fullStory:    text('full_story').notNull(),   // 본문 800자+
  summary:      text('summary'),                // 카드 요약 150자
  region:       regionEnum('region').notNull(),
  era:          eraEnum('era').notNull(),
  examLevel:    examLevelEnum('exam_level').default('none').notNull(),
  examKeyword:  varchar('exam_keyword', { length: 100 }), // ex) "산업혁명", "제국주의"
  tags:         text('tags').array(),
  seoTitle:     varchar('seo_title', { length: 65 }),
  seoDesc:      varchar('seo_desc', { length: 160 }),
  thumbnail:    varchar('thumbnail', { length: 500 }),
  viewCount:    integer('view_count').default(0).notNull(),
  likeCount:    integer('like_count').default(0).notNull(),
  isPublished:  boolean('is_published').default(false).notNull(),
  isFeatured:   boolean('is_featured').default(false).notNull(),
  createdAt:    timestamp('created_at').defaultNow().notNull(),
  publishedAt:  timestamp('published_at'),
  updatedAt:    timestamp('updated_at').defaultNow().notNull(),
})

// 세계사 검정 시험 기출 Q&A (별도 테이블)
export const examQuestions = pgTable('exam_questions', {
  id:           serial('id').primaryKey(),
  postId:       integer('post_id').references(() => posts.id), // 연관 포스트 (nullable)
  era:          eraEnum('era').notNull(),
  examLevel:    examLevelEnum('exam_level').notNull(),
  keyword:      varchar('keyword', { length: 100 }).notNull(), // 핵심 개념
  question:     text('question').notNull(),
  options:      text('options').array().notNull(),             // 4지선다
  answer:       integer('answer').notNull(),                   // 정답 index (0~3)
  explanation:  text('explanation').notNull(),                 // 해설
  year:         integer('year'),                               // 기출 연도
  isActive:     boolean('is_active').default(true),
  createdAt:    timestamp('created_at').defaultNow(),
})

// 모의고사 세트
export const mockTests = pgTable('mock_tests', {
  id:          serial('id').primaryKey(),
  title:       varchar('title', { length: 200 }).notNull(),
  examLevel:   examLevelEnum('exam_level').notNull(),
  description: text('description'),
  isActive:    boolean('is_active').default(true),
  createdAt:   timestamp('created_at').defaultNow(),
})

// 모의고사 ↔ 문제 연결
export const mockTestQuestions = pgTable('mock_test_questions', {
  id:         serial('id').primaryKey(),
  testId:     integer('test_id').references(() => mockTests.id, { onDelete: 'cascade' }),
  questionId: integer('question_id').references(() => examQuestions.id),
  order:      integer('order').notNull(),
})

// 흥미 퀴즈 (바이럴용, /quiz 페이지)
export const quizzes = pgTable('quizzes', {
  id:          serial('id').primaryKey(),
  postId:      integer('post_id').references(() => posts.id),
  question:    text('question').notNull(),
  options:     text('options').array().notNull(),
  answer:      integer('answer').notNull(),
  explanation: text('explanation'),
  isActive:    boolean('is_active').default(true),
  createdAt:   timestamp('created_at').defaultNow(),
})

// SNS 콘텐츠 연결
export const socialLinks = pgTable('social_links', {
  id:        serial('id').primaryKey(),
  postId:    integer('post_id').references(() => posts.id, { onDelete: 'cascade' }),
  platform:  varchar('platform', { length: 20 }).notNull(), // instagram|youtube|tiktok
  url:       varchar('url', { length: 500 }),
  views:     integer('views').default(0),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// 페이지뷰 트래킹 (일별 집계)
export const pageViews = pgTable('page_views', {
  id:      serial('id').primaryKey(),
  postId:  integer('post_id').references(() => posts.id),
  date:    varchar('date', { length: 10 }).notNull(), // YYYY-MM-DD
  count:   integer('count').default(0).notNull(),
})
```

---

## 디렉토리 구조

```
worldhistory/
├── app/
│   ├── (main)/
│   │   ├── page.tsx                      # 홈
│   │   ├── posts/
│   │   │   ├── page.tsx                  # 전체 목록
│   │   │   └── [slug]/page.tsx           # 상세 포스트
│   │   ├── region/
│   │   │   └── [slug]/page.tsx           # 지역별 목록
│   │   ├── era/
│   │   │   └── [slug]/page.tsx           # 시대별 목록
│   │   ├── exam/                         # 세계사 검정 섹션
│   │   │   ├── page.tsx                  # 검정 메인 (시험 안내)
│   │   │   ├── guide/page.tsx            # 시험 안내 상세
│   │   │   ├── level/
│   │   │   │   ├── advanced/page.tsx     # 1·2급 핵심 정리
│   │   │   │   └── basic/page.tsx        # 3·4급 핵심 정리
│   │   │   ├── era/
│   │   │   │   └── [slug]/page.tsx       # 시대별 핵심 요약
│   │   │   ├── questions/page.tsx        # 기출 유형 Q&A
│   │   │   └── mock-test/
│   │   │       ├── page.tsx              # 모의고사 목록
│   │   │       └── [id]/page.tsx         # 모의고사 풀기
│   │   ├── quiz/page.tsx                 # 흥미 퀴즈 (바이럴)
│   │   ├── search/page.tsx               # 검색
│   │   └── about/page.tsx
│   ├── (admin)/
│   │   └── admin/
│   │       ├── layout.tsx
│   │       ├── page.tsx                  # 대시보드
│   │       ├── posts/
│   │       │   ├── page.tsx
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── exam/
│   │       │   ├── questions/page.tsx    # 기출 문제 관리
│   │       │   └── mock-tests/page.tsx   # 모의고사 관리
│   │       ├── generate/page.tsx         # AI 생성
│   │       └── analytics/page.tsx
│   ├── api/
│   │   ├── posts/route.ts
│   │   ├── posts/[id]/route.ts
│   │   ├── exam/questions/route.ts
│   │   ├── generate/route.ts             # Claude API 연동
│   │   ├── search/route.ts
│   │   └── revalidate/route.ts
│   ├── sitemap.ts
│   ├── robots.ts
│   └── layout.tsx                        # AdSense 스크립트 삽입
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileNav.tsx
│   │   └── Sidebar.tsx
│   ├── post/
│   │   ├── PostCard.tsx
│   │   ├── PostDetail.tsx
│   │   ├── RelatedPosts.tsx
│   │   ├── ExamBadge.tsx               # 검정 급수 뱃지
│   │   └── ShareButtons.tsx
│   ├── exam/
│   │   ├── ExamQuestionCard.tsx        # 기출 문제 카드
│   │   ├── MockTestRunner.tsx          # 모의고사 진행
│   │   ├── ScoreResult.tsx             # 결과 화면
│   │   └── EraTimeline.tsx             # 시대별 타임라인
│   ├── quiz/
│   │   └── QuizWidget.tsx
│   ├── ads/
│   │   ├── AdsenseUnit.tsx
│   │   └── AdsenseSidebar.tsx
│   └── admin/
│       ├── PostEditor.tsx
│       ├── ExamEditor.tsx
│       └── GenerateForm.tsx
├── lib/
│   ├── db/
│   │   ├── index.ts                    # Neon + Drizzle 연결
│   │   ├── schema.ts
│   │   └── queries/
│   │       ├── posts.ts
│   │       ├── exam.ts
│   │       └── quiz.ts
│   ├── ai/
│   │   └── generate.ts                 # Claude API 호출
│   ├── seo/
│   │   └── metadata.ts
│   └── utils/
│       ├── slugify.ts
│       └── pagination.ts
├── drizzle/
│   └── migrations/
├── public/images/
├── drizzle.config.ts
├── next.config.ts
└── .env.local
```

---

## 페이지별 상세 기획

### 홈 (/)
```
[히어로]
- 오늘의 세계사 Q&A 1개 (featured)
- 후킹 질문 대형 텍스트 + 지역 태그

[최신 Q&A 그리드] — 카드 6개
- 썸네일 | 지역 태그 | 시대 태그 | 질문 제목 | 요약 2줄

[세계사 검정 입문 배너]
- "세계사능력검정 준비 중이라면? → 검정 코너 바로가기"

[지역별 탭]
- 유럽사 | 아시아사 | 중동·아프리카 | 아메리카

[인기 포스트 TOP 5] — 사이드바
[애드센스 배너]
```

### 포스트 상세 (/posts/[slug])
```
[브레드크럼] 홈 > 유럽사 > 근대

[제목 H1] + 지역 태그 + 시대 태그
[검정 급수 뱃지] — "세계사능력검정 3급 빈출"  ← 시험 연계 포스트만 표시

[애드센스 상단 배너]

[Q&A 섹션]
- 질문 박스
- 한줄 답변 (스포일러)
- 본문 전체 스토리 (800~1500자, H2 소제목 포함)

[애드센스 본문 중간 배너]

[시험 연계 포스트 전용 박스] — examLevel != 'none' 일 때만 렌더
- "이 내용은 세계사능력검정 3급 시험에 자주 출제됩니다"
- 관련 기출 문제 2~3개 미리보기 → /exam/questions 링크

[관련 포스트 3개]
[공유 버튼]
[애드센스 하단 배너]
```

### 세계사 검정 메인 (/exam)
```
[시험 안내 요약]
- 급수 체계 (1~4급) | 시험 일정 | 합격 기준

[애드센스 배너]

[급수별 학습 시작]
- [3·4급 기본 과정] [1·2급 심화 과정]

[시대별 핵심 정리 바로가기]
- 고대 | 중세 | 근세 | 근대 | 현대 타임라인 카드

[최근 추가된 기출 Q&A]
[모의고사 시작하기 CTA]
```

### 모의고사 (/exam/mock-test/[id])
```
- 20문항 4지선다
- 문제당 제한시간 표시 (선택)
- 제출 후: 점수 + 급수 환산 + 틀린 문제 해설
- 결과 SNS 공유 → 바이럴
```

### 역사 퀴즈 (/quiz)
```
- 흥미 위주 10문제 (시험 무관)
- "나의 세계사 등급은?" 결과 카드
- 인스타 스토리 공유 이미지 자동 생성
```

---

## AI 자동화 — Claude API 프롬프트

```typescript
// lib/ai/generate.ts

const SYSTEM_PROMPT = `
너는 세계사 전문 스토리텔러이자 SEO 최적화 전문가야.
한국 독자를 위한 세계사 Q&A 콘텐츠를 작성해.

반드시 아래 JSON 형식으로만 응답해:
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
```

---

## 개발 Sprint

### Sprint 1 — 2주 (기반)
- [ ] Next.js 14 프로젝트 초기화 + TypeScript + Tailwind
- [ ] Neon DB 생성 + Drizzle 스키마 마이그레이션
- [ ] 포스트 목록 + 상세 페이지 (SSG)
- [ ] 지역별 / 시대별 필터 페이지
- [ ] 기본 SEO 메타태그 + OG 태그
- [ ] Vercel 배포 + 도메인 연결

### Sprint 2 — 1주 (검색 + SEO)
- [ ] 검색 기능 (PostgreSQL Full-Text Search)
- [ ] Sitemap 자동 생성 (포스트 + 검정 페이지 포함)
- [ ] robots.txt
- [ ] 사이드바 (인기글 / 지역별 카테고리)

### Sprint 3 — 1주 (관리자 + AI)
- [ ] 관리자 로그인 (Next-Auth)
- [ ] 포스트 CRUD 에디터
- [ ] AI 생성 페이지 (Claude API 연동)
- [ ] 검정 문제 등록 관리 화면

### Sprint 4 — 1주 (수익화)
- [ ] 애드센스 코드 삽입 + 광고 단위 배치
- [ ] 구글 애드센스 신청 (포스트 20개+ 확보 후)
- [ ] GA4 + Search Console 연결
- [ ] 흥미 퀴즈 페이지

### Sprint 5 — 1주 (검정 섹션)
- [ ] 세계사 검정 메인 페이지
- [ ] 급수별 핵심 정리 페이지
- [ ] 시대별 핵심 요약 페이지
- [ ] 기출 Q&A 페이지
- [ ] 모의고사 기능

### Sprint 6 — 지속 (SNS 연동)
- [ ] 포스트별 숏폼 대본 추출 자동화
- [ ] 카드뉴스 소재 텍스트 자동 추출
- [ ] 모의고사 결과 공유 이미지 생성

---

## 환경변수 목록

```bash
# .env.local

# Neon PostgreSQL
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/worldhistory?sslmode=require"

# Claude API
ANTHROPIC_API_KEY="sk-ant-..."

# 관리자 인증
ADMIN_PASSWORD="..."
NEXTAUTH_SECRET="..."

# Google AdSense
NEXT_PUBLIC_ADSENSE_CLIENT="ca-pub-xxxxxxxxxxxxxxxx"

# Revalidation
REVALIDATE_SECRET="..."
```

---

## 초기 비용 구조

| 항목 | 서비스 | 월 비용 |
|---|---|---|
| 호스팅 | Vercel (Hobby) | 무료 |
| DB | Neon (Free tier) | 무료 |
| 도메인 | .kr 도메인 | 약 2,000원 |
| AI 생성 | Claude API | 콘텐츠 50개 기준 약 3,000원 |
| 이미지 | Next/Image + Cloudflare | 무료 |
| **합계** | | **약 5,000원/월** |

---

## SEO 키워드 전략 (세계사 특화)

```
[고트래픽 타겟 키워드]
- "세계사능력검정 기출문제"
- "세계사 상식 퀴즈"
- "세계사 시대별 정리"

[롱테일 키워드 (초기 집중)]
- "중세 유럽 토마토 먹지 않은 이유"
- "38분 전쟁 잔지바르 영국"
- "피라미드 건설 노예 아닌 이유"
- "세계사 능력검정 3급 산업혁명 정리"

[수험생 타겟 키워드]
- "세계사 능력 검정 3급 준비"
- "세계사 기출 문제 풀기"
- "시대별 세계사 핵심 정리"
```

---

## 성능 목표 (Core Web Vitals)

| 지표 | 목표 | 달성 방법 |
|---|---|---|
| LCP | < 2.5초 | SSG + 이미지 최적화 |
| INP | < 100ms | 클라이언트 JS 최소화 |
| CLS | < 0.1 | 광고 레이아웃 고정 크기 |
| Lighthouse | 90+ | Next.js 기본 최적화 |
