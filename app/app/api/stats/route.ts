import { NextResponse } from 'next/server';
import { getPublishedPosts } from '@/lib/db/queries/posts';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allPosts = await getPublishedPosts(200, 0);

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentWeekCount = allPosts.filter(
      (p) => p.publishedAt && new Date(p.publishedAt) > sevenDaysAgo,
    ).length;

    const recent5 = allPosts.slice(0, 5).map((p) => ({
      id: p.id,
      title: (p as Record<string, unknown>).title as string ?? p.slug,
      slug: p.slug,
      publishedAt: p.publishedAt,
    }));

    let emailSubscribers = 0;
    try {
      const result = await db.execute(
        `SELECT COUNT(*) as count FROM email_subscribers WHERE service = 'askhistory'`
      );
      emailSubscribers = Number((result as unknown as { rows: { count: string }[] }).rows[0]?.count ?? 0);
    } catch { /* table may not exist yet */ }

    return NextResponse.json({
      service: 'askhistory',
      domain: 'askhistory.me',
      blog: { total: allPosts.length, recentWeek: recentWeekCount, recent: recent5 },
      emailSubscribers,
      updatedAt: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
