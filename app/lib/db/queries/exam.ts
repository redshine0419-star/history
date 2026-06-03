import { eq, desc } from 'drizzle-orm'
import { db } from '../index'
import { examTopics } from '../schema'
import type { ExamTopic } from '../schema'

export async function getExamTopics() {
  return db.select().from(examTopics).orderBy(desc(examTopics.frequency))
}

export async function getExamTopicsByLevel(level: ExamTopic['examLevel']) {
  return db
    .select()
    .from(examTopics)
    .where(eq(examTopics.examLevel, level))
    .orderBy(desc(examTopics.frequency))
}

export async function getExamTopicsByEra(era: ExamTopic['era']) {
  return db
    .select()
    .from(examTopics)
    .where(eq(examTopics.era, era))
    .orderBy(desc(examTopics.frequency))
}
