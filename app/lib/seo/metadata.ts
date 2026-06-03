import type { Metadata } from 'next'
import type { Post } from '../db/schema'

const SITE_NAME = '세계사의 반전'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://worldhistory.kr'

export function buildPostMetadata(post: Post): Metadata {
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDesc ?? post.summary ?? undefined,
    openGraph: {
      title: post.seoTitle ?? post.title,
      description: post.seoDesc ?? post.summary ?? undefined,
      url: `${SITE_URL}/posts/${post.slug}`,
      siteName: SITE_NAME,
      images: post.thumbnail ? [{ url: post.thumbnail }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle ?? post.title,
      description: post.seoDesc ?? post.summary ?? undefined,
      images: post.thumbnail ? [post.thumbnail] : [],
    },
    alternates: { canonical: `${SITE_URL}/posts/${post.slug}` },
  }
}

export function buildPageMetadata(title: string, description?: string): Metadata {
  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      siteName: SITE_NAME,
    },
  }
}
