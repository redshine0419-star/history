import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const key = req.headers.get('x-admin-key')
  if (key !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title, message, url } = await req.json()

  if (!process.env.ONESIGNAL_REST_API_KEY) {
    return NextResponse.json({ error: 'ONESIGNAL_REST_API_KEY not set' }, { status: 500 })
  }

  const res = await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Key ${process.env.ONESIGNAL_REST_API_KEY}`,
    },
    body: JSON.stringify({
      app_id: 'e4019aab-d232-4083-a13f-fe2061fe438e',
      included_segments: ['All'],
      headings: { en: title, ko: title },
      contents: { en: message, ko: message },
      url,
    }),
  })

  const data = await res.json()
  return NextResponse.json(data)
}
