# 세계사 Q&A 사이트 — 운영 인수인계 문서

## 서비스 개요

한국 독자 대상 세계사 Q&A 블로그. Gemini API로 콘텐츠 자동 생성, AdSense 수익화 목표.

- **라이브 사이트**: https://www.askhistory.me
- **관리자 페이지**: https://www.askhistory.me/admin
- **GitHub 저장소**: https://github.com/redshine0419-star/history
- **개발 브랜치**: `claude/sleepy-archimedes-ImsNP`

---

## 기술 스택

| 항목 | 내용 |
|---|---|
| 프레임워크 | Next.js 14 (App Router, TypeScript) |
| 스타일 | Tailwind CSS |
| DB | Neon PostgreSQL (서버리스) |
| ORM | Drizzle ORM |
| AI | Google Gemini 2.5 Flash (`@google/genai`) |
| 배포 | Vercel (브랜치: `claude/sleepy-archimedes-ImsNP`) |
| 푸시 알림 | OneSignal (Web Push) |

---

## 디렉토리 구조

```
app/
├── app/
│   ├── (main)/              # 일반 사용자 페이지
│   │   ├── page.tsx         # 홈
│   │   ├── posts/[slug]/    # 포스트 상세
│   │   ├── region/[slug]/   # 지역별 필터
│   │   ├── era/[slug]/      # 시대별 필터
│   │   ├── quiz/            # 역사 퀴즈
│   │   └── search/          # 검색
│   ├── (admin)/admin/       # 관리자 페이지
│   │   ├── page.tsx         # 대시보드
│   │   ├── generate/        # AI 단건 생성
│   │   ├── generate/batch/  # AI 일괄 생성
│   │   ├── posts/           # 포스트 관리
│   │   ├── exam/topics/     # 기출 토픽 관리
│   │   └── push/            # 푸시 알림 수동 발송
│   └── api/
│       ├── generate/        # AI 콘텐츠 생성 API
│       ├── quiz/random/     # 랜덤 퀴즈 API
│       ├── cron/generate/   # Vercel Cron 자동 생성
│       ├── admin/posts-list/     # 관리자 포스트 목록
│       ├── admin/suggest-topics/ # AI 주제 추천
│       ├── admin/push/          # 푸시 알림 발송
│       └── admin/run-cron/      # Cron 수동 실행
├── lib/
│   ├── db/
│   │   ├── schema.ts        # DB 스키마 (posts, quizzes, examTopics 등)
│   │   ├── index.ts         # Drizzle 연결
│   │   └── queries/         # DB 쿼리 함수들
│   ├── ai/generate.ts       # Gemini API 호출 + 프롬프트
│   └── utils/slugify.ts     # URL 슬러그 생성
├── components/
│   ├── layout/Header.tsx
│   ├── layout/Footer.tsx
│   ├── post/PostCard.tsx
│   └── ads/AdsenseUnit.tsx
├── public/
│   └── OneSignalSDKWorker.js  # OneSignal 서비스워커
└── scripts/
    ├── exam-topics-round10.sql  # 10회 기출 토픽 (47개)
    └── exam-topics-round11.sql  # 11회 기출 토픽 (50개)
```

---

## DB 스키마

```sql
-- 핵심 테이블
posts (id, slug, title, question, answer, full_story, summary,
       region, era, exam_level, exam_keyword, tags,
       seo_title, seo_desc, thumbnail,
       view_count, like_count, is_published, is_featured,
       created_at, published_at, updated_at)

quizzes (id, post_id, question, options[], answer, explanation, is_active, created_at)

exam_topics (id, keyword, era, region, exam_level, frequency, rounds[], post_id, created_at)

page_views (id, post_id, date, count)

social_links (id, post_id, platform, url, views, updated_at)

-- ENUM 타입
region: europe | asia | middle-east-africa | americas
era: ancient | medieval | early-modern | modern | contemporary
exam_level: none | basic | advanced
```

---

## Vercel 환경변수

| 변수명 | 용도 |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL 연결 |
| `GEMINI_API_KEY` | Google AI Studio API 키 |
| `ADMIN_SECRET` | 관리자 API 인증 키 |
| `CRON_SECRET` | Vercel Cron 인증 키 |
| `NEXT_PUBLIC_SITE_URL` | `https://www.askhistory.me` |
| `ONESIGNAL_REST_API_KEY` | OneSignal 푸시 알림 REST API 키 |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | AdSense 게시자 ID (미설정 시 광고 미노출) |

---

## 자동 콘텐츠 생성 (Cron Job)

매일 **저녁 8시(KST)** 자동 실행 (`vercel.json` 스케줄: `0 11 * * *` UTC)

1. `exam_topics` 테이블에서 `post_id = NULL` 토픽 우선 선택 (5개)
2. 부족하면 Gemini가 새 주제 추천
3. 글 5개 순차 생성 (5초 간격)
4. 마지막 글 1개에 대해 OneSignal 푸시 알림 발송

**수동 실행:**
```
https://www.askhistory.me/api/admin/run-cron?key={CRON_SECRET}
```

---

## 주요 API

### POST /api/generate
AI로 포스트 + 퀴즈 생성 및 저장

```bash
curl -X POST https://www.askhistory.me/api/generate \
  -H "Content-Type: application/json" \
  -H "x-admin-key: {ADMIN_SECRET}" \
  -d '{"topic": "나폴레옹 몰락", "hint": "세계사능력검정 기본", "save": true}'
```

### GET /api/quiz/random
랜덤 퀴즈 10개 반환 (인증 불필요)

### GET /api/admin/posts-list
전체 포스트 목록 (x-admin-key 헤더 필요)

### POST /api/admin/push
OneSignal 푸시 알림 수동 발송 (x-admin-key 헤더 필요)

```json
{ "title": "알림 제목", "message": "알림 내용", "url": "https://..." }
```

---

## 콘텐츠 생성 워크플로우

1. `/admin/generate/batch` 접속
2. 관리자 키 입력 → **[기존 글 불러오기]**
3. **[🤖 기존 글 제외하고 20개 주제 추천]** 클릭
4. **[전체 생성 시작]** — 5초 간격으로 순차 생성+저장+발행
5. 오류 항목은 **[❌ N개 재시도]** 버튼으로 재실행

---

## OneSignal 푸시 알림

- **App ID**: `e4019aab-d232-4083-a13f-fe2061fe438e`
- **대시보드**: https://dashboard.onesignal.com
- 수동 발송: `/admin/push` 페이지에서 글 선택 후 발송
- 자동 발송: 매일 저녁 8시 Cron Job 실행 시 마지막 글 1개 발송

---

## Neon DB 직접 접근

이 원격 실행환경(Claude Code Web)에서는 Neon TCP 연결이 차단됨.
SQL 변경이 필요하면 반드시 **Neon 콘솔 → SQL Editor** 에서 직접 실행.

- Neon 콘솔: https://console.neon.tech
- 프로젝트: history (redshine0419@gmail.com 계정)

자주 쓰는 SQL:
```sql
-- 포스트 수 확인
SELECT COUNT(*) FROM posts WHERE is_published = true;

-- 미발행 글 전체 발행
UPDATE posts SET is_published = true, published_at = NOW() WHERE is_published = false;

-- 기출 토픽 중 아직 글 없는 것 수 확인
SELECT COUNT(*) FROM exam_topics WHERE post_id IS NULL;

-- 퀴즈 수 확인
SELECT COUNT(*) FROM quizzes;
```

---

## 배포

```bash
# 변경 후 항상 이 브랜치에 푸시
git push -u origin claude/sleepy-archimedes-ImsNP

# Vercel은 이 브랜치를 자동 감지해 배포
```

---

## 남은 작업 (TODO)

- [ ] Google AdSense 신청 (트래픽 충분할 때)
- [ ] 썸네일 이미지 자동 생성 (현재 없음)
- [ ] 영문 버전 확장 (글로벌 트래픽)

---

## 주의사항

- **세계사능력검정 기출문제 직접 재현 금지** — 토픽/키워드 기반 오리지널 콘텐츠만 생성
- Gemini 사용량: 분당 15회, 하루 1500회 제한 → 배치 생성 시 5초 간격 적용 중
- DB 마이그레이션은 `drizzle-kit`이 아닌 Neon SQL Editor로 직접 실행
