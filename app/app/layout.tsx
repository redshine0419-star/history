import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const lang = headersList.get('x-lang') ?? 'ko'
  const isEn = lang === 'en'

  return {
    title: {
      default: isEn ? 'History Twists — Untold World History' : '세계사의 반전 — 몰랐던 세계사 이야기',
      template: isEn ? '%s | History Twists' : '%s | 세계사의 반전',
    },
    description: isEn
      ? 'From Ancient Greece to modern times — surprising twists in world history you never learned in school.'
      : '그리스·로마부터 현대까지, 교과서에 없는 세계사 반전 스토리. 세계사능력검정시험 대비 콘텐츠도 함께.',
    keywords: isEn
      ? ['world history', 'history facts', 'history quiz', 'historical stories', 'world history trivia']
      : ['세계사', '세계사 퀴즈', '세계사능력검정', '세계사 상식', '역사 이야기'],
    openGraph: {
      siteName: isEn ? 'History Twists' : '세계사의 반전',
      type: 'website',
      locale: isEn ? 'en_US' : 'ko_KR',
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const lang = headersList.get('x-lang') ?? 'ko'

  return (
    <html lang={lang}>
      <head>
        <link rel="alternate" hrefLang="ko" href="https://worldhistory.kr/" />
        <link rel="alternate" hrefLang="en" href="https://en.worldhistory.kr/" />
        <link rel="alternate" hrefLang="x-default" href="https://worldhistory.kr/" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-M914VTSQ5M" />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-M914VTSQ5M');
        `}} />
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  )
}
