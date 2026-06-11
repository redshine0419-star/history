import {
  pgTable, serial, varchar, text, boolean, integer,
  timestamp, pgEnum,
} from 'drizzle-orm/pg-core'

export const regionEnum = pgEnum('region', [
  'europe',
  'asia',
  'middle-east-africa',
  'americas',
])

export const eraEnum = pgEnum('era', [
  'ancient',
  'medieval',
  'early-modern',
  'modern',
  'contemporary',
])

export const examLevelEnum = pgEnum('exam_level', [
  'none',
  'basic',
  'advanced',
])

export const posts = pgTable('posts', {
  id:          serial('id').primaryKey(),
  slug:        varchar('slug', { length: 250 }).unique().notNull(),
  title:       varchar('title', { length: 300 }).notNull(),
  question:    text('question').notNull(),
  answer:      text('answer').notNull(),
  fullStory:   text('full_story').notNull(),
  summary:     text('summary'),
  region:      regionEnum('region').notNull(),
  era:         eraEnum('era').notNull(),
  examLevel:   examLevelEnum('exam_level').default('none').notNull(),
  examKeyword: varchar('exam_keyword', { length: 100 }),
  tags:        text('tags').array(),
  seoTitle:    varchar('seo_title', { length: 65 }),
  seoDesc:     varchar('seo_desc', { length: 160 }),
  thumbnail:   varchar('thumbnail', { length: 500 }),
  lang:        varchar('lang', { length: 10 }).default('ko').notNull(),
  viewCount:   integer('view_count').default(0).notNull(),
  likeCount:   integer('like_count').default(0).notNull(),
  isPublished: boolean('is_published').default(false).notNull(),
  isFeatured:  boolean('is_featured').default(false).notNull(),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
  publishedAt: timestamp('published_at'),
  updatedAt:   timestamp('updated_at').defaultNow().notNull(),
})

// 기출 토픽 나침반 — 기출 문제 재현 금지, 토픽/키워드만 저장
export const examTopics = pgTable('exam_topics', {
  id:        serial('id').primaryKey(),
  keyword:   varchar('keyword', { length: 100 }).notNull(),
  era:       eraEnum('era').notNull(),
  region:    regionEnum('region').notNull(),
  examLevel: examLevelEnum('exam_level').notNull(),
  frequency: integer('frequency').default(1).notNull(),
  rounds:    integer('rounds').array(),
  postId:    integer('post_id').references(() => posts.id),
  createdAt: timestamp('created_at').defaultNow(),
})

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

export const socialLinks = pgTable('social_links', {
  id:        serial('id').primaryKey(),
  postId:    integer('post_id').references(() => posts.id, { onDelete: 'cascade' }),
  platform:  varchar('platform', { length: 20 }).notNull(),
  url:       varchar('url', { length: 500 }),
  views:     integer('views').default(0),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const pageViews = pgTable('page_views', {
  id:     serial('id').primaryKey(),
  postId: integer('post_id').references(() => posts.id),
  date:   varchar('date', { length: 10 }).notNull(),
  count:  integer('count').default(0).notNull(),
})

export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert
export type ExamTopic = typeof examTopics.$inferSelect
export type NewExamTopic = typeof examTopics.$inferInsert
export type Quiz = typeof quizzes.$inferSelect
