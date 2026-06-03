# 역사 Q&A 서비스 — 전체 구현 계획서

## 프로젝트 개요

- **서비스명**: 역사의 반전 (가칭) | `historyflip.kr`
- **핵심 수익**: 구글 애드센스 (검색 트래픽 기반)
- **보조 수익**: 유튜브 파트너, 인스타 협찬, 전자책
- **운영 형태**: 1인 운영, AI 반자동화

---

## 기술 스택

| 레이어 | 기술 | 이유 |
|---|---|---|
| Frontend | Next.js 14 (App Router) | SSG/ISR, SEO 최적화 |
| Language | TypeScript | 안정성, 자동완성 |
| Styling | Tailwind CSS | 빠른 UI 개발 |
| Database | Neon (Serverless PostgreSQL) | 무료 tier, Vercel 통합 |
| ORM | Drizzle ORM | 타입세이프, 경량, Neon 궁합 최고 |
| Deployment | Vercel | Neon + Next.js 네이티브 통합 |
| DNS/CDN | Cloudflare | 무료 CDN, 도메인 관리 |
| AI | Claude API (claude-sonnet-4-6) | 콘텐츠 생성 자동화 |
| 이미지 | Cloudflare Images or Next/Image | 최적화 |
| Analytics | Google Analytics 4 + Search Console | 트래픽 분석 |

---

## 디렉토리 구조

```
history-flip/
├── app/                          # Next.js App Router
│   ├── (main)/                   # 일반 사용자 라우트 그룹
│   │   ├── page.tsx              # 홈 (최신 Q&A 목록)
│   │   ├── posts/
│   │   │   ├── page.tsx          # 전체 목록
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # 상세 포스트
│   │   ├── category/
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # 카테고리별 목록
│   │   ├── era/
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # 시대별 목록
│   │   ├── quiz/
│   │   │   └── page.tsx          # 역사 퀴즈
│   │   ├── search/
│   │   │   └── page.tsx          # 검색 결과
│   │   └── about/
│   │       └── page.tsx          # 서비스 소개
│   ├── (admin)/                  # 관리자 라우트 그룹
│   │   └── admin/
│   │       ├── layout.tsx        # 관리자 레이아웃 (인증 체크)
│   │       ├── page.tsx          # 대시보드
│   │       ├── posts/
│   │       │   ├── page.tsx      # 포스트 목록/관리
│   │       │   ├── new/
│   │       │   │   └── page.tsx  # 새 포스트 작성
│   │       │   └── [id]/
│   │       │       └── page.tsx  # 포스트 수정
│   │       ├── generate/
│   │       │   └── page.tsx      # AI 콘텐츠 생성
│   │       └── analytics/
│   │           └── page.tsx      # 통계
│   ├── api/
│   │   ├── posts/
│   │   │   ├── route.ts          # GET(목록), POST(생성)
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET, PUT, DELETE
│   │   ├── generate/
│   │   │   └── route.ts          # Claude API 콘텐츠 생성
│   │   ├── search/
│   │   │   └── route.ts          # 검색
│   │   └── revalidate/
│   │       └── route.ts          # ISR 수동 갱신
│   ├── sitemap.ts                # 동적 사이트맵 생성
│   ├── robots.ts                 # robots.txt
│   └── layout.tsx                # 루트 레이아웃 (AdSense 스크립트)
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileNav.tsx
│   │   └── Sidebar.tsx           # 최근 포스트, 인기 카테고리
│   ├── post/
│   │   ├── PostCard.tsx          # 목록용 카드
│   │   ├── PostDetail.tsx        # 상세 본문
│   │   ├── RelatedPosts.tsx      # 관련 포스트
│   │   └── ShareButtons.tsx      # 공유 버튼
│   ├── ads/
│   │   ├── AdsenseUnit.tsx       # 광고 단위 컴포넌트
│   │   └── AdsenseSidebar.tsx
│   ├── quiz/
│   │   └── QuizWidget.tsx
│   └── admin/
│       ├── PostEditor.tsx        # 포스트 에디터
│       └── GenerateForm.tsx      # AI 생성 폼
├── lib/
│   ├── db/
│   │   ├── index.ts              # Neon + Drizzle 연결
│   │   ├── schema.ts             # 전체 DB 스키마
│   │   └── queries/
│   │       ├── posts.ts          # 포스트 쿼리
│   │       └── categories.ts
│   ├── ai/
│   │   └── generate.ts           # Claude API 호출 로직
│   ├── seo/
│   │   └── metadata.ts           # 동적 메타데이터 생성
│   └── utils/
│       ├── slugify.ts
│       └── pagination.ts
├── drizzle/
│   └── migrations/               # DB 마이그레이션 파일
├── public/
│   └── images/
├── drizzle.config.ts
├── next.config.ts
└── .env.local
```

---

## DB 스키마 (Neon PostgreSQL + Drizzle ORM)

```typescript
// lib/db/schema.ts

import { pgTable, serial, varchar, text, boolean, integer,
         timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const categoryEnum = pgEnum('category', [
  'korean',    // 한국사
  'world',     // 세계사
  'modern',    // 근현대사
  'culture',   // 문화/생활사
  'war',       // 전쟁/군사사
])

export const eraEnum = pgEnum('era', [
  'ancient',       // 고대
  'medieval',      // 중세
  'joseon',        // 조선시대
  'modern',        // 근대
  'contemporary',  // 현대
])

// 메인 포스트 테이블
export const posts = pgTable('posts', {
  id:           serial('id').primaryKey(),
  slug:         varchar('slug', { length: 250 }).unique().notNull(),
  title:        varchar('title', { length: 300 }).notNull(),
  question:     text('question').notNull(),
  answer:       text('answer').notNull(),
  fullStory:    text('full_story').notNull(),     // 본문 (800자+, 애드센스용)
  summary:      text('summary'),                  // 카드용 요약 (150자)
  category:     categoryEnum('category').notNull(),
  era:          eraEnum('era').notNull(),
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

// SNS 콘텐츠 연결
export const socialLinks = pgTable('social_links', {
  id:        serial('id').primaryKey(),
  postId:    integer('post_id').references(() => posts.id, { onDelete: 'cascade' }),
  platform:  varchar('platform', { length: 20 }).notNull(), // instagram|youtube|tiktok
  url:       varchar('url', { length: 500 }),
  views:     integer('views').default(0),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// 퀴즈 테이블
export const quizzes = pgTable('quizzes', {
  id:         serial('id').primaryKey(),
  postId:     integer('post_id').references(() => posts.id),
  question:   text('question').notNull(),
  options:    text('options').array().notNull(),  // 4지선다
  answer:     integer('answer').notNull(),         // 정답 index
  explanation: text('explanation'),
  isActive:   boolean('is_active').default(true),
  createdAt:  timestamp('created_at').defaultNow(),
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

## 메뉴 구조 (사이트맵)

```
[헤더 GNB]
├── 홈 (/)
├── 전체 이야기 (/posts)
├── 카테고리
│   ├── 한국사 (/category/korean)
│   ├── 세계사 (/category/world)
│   ├── 근현대사 (/category/modern)
│   ├── 문화/생활사 (/category/culture)
│   └── 전쟁/군사 (/category/war)
├── 시대별
│   ├── 고대 (/era/ancient)
│   ├── 중세 (/era/medieval)
│   ├── 조선시대 (/era/joseon)
│   ├── 근대 (/era/modern)
│   └── 현대 (/era/contemporary)
├── 역사 퀴즈 (/quiz)
└── 🔍 검색 (/search)

[푸터]
├── 서비스 소개 (/about)
├── 인스타그램 (외부링크)
├── 유튜브 (외부링크)
└── 관리자 (/admin) — 비노출, 직접 URL 접근
```

---

## 페이지별 상세 기획

### 홈 (/)
```
[히어로 섹션]
- 오늘의 Q&A 1개 (featured) — 애드센스 상단 배너
- 후킹 질문 대형 텍스트

[최신 Q&A 그리드]
- 카드 6개 (2열 3행 / 모바일 1열)
- 카드 구성: 썸네일 | 카테고리 태그 | 질문 제목 | 요약 2줄

[카테고리별 모아보기]
- 탭 형태: 한국사 | 세계사 | 근현대사 | 문화사

[인기 포스트 TOP 5] — 사이드바
[애드센스 배너] — 콘텐츠 사이 삽입
```

### 포스트 상세 (/posts/[slug])
```
[상단]
- 브레드크럼: 홈 > 카테고리 > 포스트명
- 제목 (H1)
- 카테고리 + 시대 태그 + 조회수

[애드센스 상단 배너]

[Q&A 메인 섹션]
- 질문 박스 (강조 디자인)
- 한줄 답변 (스포일러 느낌)
- 본문 전체 스토리 (800~1500자)
  - H2, H3 소제목 포함
  - 인용구, 하이라이트 블록

[애드센스 본문 중간 배너]

[관련 포스트 3개]
[공유 버튼: 카카오, 인스타, 링크복사]

[애드센스 하단 배너]
```

### 역사 퀴즈 (/quiz)
```
- 랜덤 4지선다 퀴즈 10문제
- 결과 페이지: 점수 + 등급 + SNS 공유
- 바이럴 유도: "이 결과 인스타에 공유하기"
```

### 관리자 (/admin)
```
[대시보드]
- 오늘 PV / 주간 PV / 총 포스트 수
- 최근 발행 5개

[AI 생성] ← 핵심 자동화
- 주제 입력 or 랜덤 생성 버튼
- Claude API 호출 → 초안 자동 채움
- 검수 후 저장/발행

[포스트 관리]
- 목록: 제목 | 카테고리 | PV | 발행여부 | 수정
- 필터: 카테고리 / 발행상태 / 날짜

[통계]
- 일별 PV 차트
- 카테고리별 조회수
- 인기 포스트 TOP 10
```

---

## AI 자동화 스크립트

```typescript
// lib/ai/generate.ts
// Claude API로 콘텐츠 초안 자동 생성

const SYSTEM_PROMPT = `
너는 역사 전문 스토리텔러이자 SEO 최적화 전문가야.
주어진 주제로 한국 독자를 위한 역사 Q&A 콘텐츠를 작성해.

반드시 아래 JSON 형식으로만 응답해:
{
  "title": "SEO 제목 (55~65자, 키워드 포함)",
  "question": "호기심을 자극하는 질문 (30~50자)",
  "answer": "핵심 답변 한 줄 (50~80자, 결론 먼저)",
  "summary": "카드용 요약 (120~150자)",
  "fullStory": "본문 (800~1200자, H2 소제목 2개 포함, 반전과 맥락 상세히)",
  "seoTitle": "메타 타이틀 (55~65자)",
  "seoDesc": "메타 디스크립션 (120~155자, 클릭 유도)",
  "tags": ["태그1", "태그2", "태그3"],
  "shortScript": "숏폼 영상 대본 (40초 분량, 첫 3초 후킹 포함)"
}
`
```

---

## 개발 순서 (Sprint)

### Sprint 1 — 2주 (기반)
- [ ] Next.js 14 프로젝트 초기화
- [ ] Neon DB 생성 + Drizzle 스키마 마이그레이션
- [ ] 포스트 목록 + 상세 페이지 (정적 렌더링)
- [ ] 기본 SEO 메타태그 (title, description, OG)
- [ ] Vercel 배포 + 도메인 연결

### Sprint 2 — 1주 (콘텐츠)
- [ ] 카테고리 / 시대별 페이지
- [ ] 사이드바 (인기글, 카테고리)
- [ ] 검색 기능 (PostgreSQL Full-Text Search)
- [ ] Sitemap + robots.txt 자동 생성

### Sprint 3 — 1주 (관리자)
- [ ] 관리자 로그인 (Next-Auth + 환경변수 단순 인증)
- [ ] 포스트 CRUD 에디터
- [ ] AI 생성 페이지 (Claude API 연동)

### Sprint 4 — 1주 (수익화)
- [ ] 애드센스 코드 삽입 + 광고 단위 배치
- [ ] 구글 애드센스 신청 (포스트 20개 이상 확보 후)
- [ ] GA4 + Search Console 연결
- [ ] 퀴즈 페이지

### Sprint 5 — 지속 (SNS 연동)
- [ ] 포스트별 숏폼 대본 자동 생성
- [ ] 카드뉴스 소재 텍스트 자동 추출
- [ ] SNS 링크 관리 (관리자 페이지)

---

## 환경변수 목록

```bash
# .env.local

# Neon PostgreSQL
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/historyflip?sslmode=require"

# Claude API
ANTHROPIC_API_KEY="sk-ant-..."

# 관리자 인증 (단순)
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
| 이미지 | Cloudflare Images | 무료 (100,000장/월) |
| **합계** | | **약 5,000원/월** |

> Neon Free tier: 0.5 GB 스토리지, 컴퓨트 191시간/월 — 초기 운영 충분

---

## 성능 목표 (Core Web Vitals — 애드센스 수익 직결)

| 지표 | 목표값 | 달성 방법 |
|---|---|---|
| LCP | < 2.5초 | SSG + 이미지 최적화 |
| FID/INP | < 100ms | 클라이언트 JS 최소화 |
| CLS | < 0.1 | 이미지 크기 명시, 광고 레이아웃 고정 |
| Lighthouse | 90+ | Next.js 기본 최적화 |
