import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: '세계사의 반전 — 몰랐던 세계사 이야기',
    template: '%s | 세계사의 반전',
  },
  description: '그리스·로마부터 현대까지, 교과서에 없는 세계사 반전 스토리. 세계사능력검정시험 대비 콘텐츠도 함께.',
  keywords: ['세계사', '세계사 퀴즈', '세계사능력검정', '세계사 상식', '역사 이야기'],
  openGraph: {
    siteName: '세계사의 반전',
    type: 'website',
    locale: 'ko_KR',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-M914VTSQ5M" />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-M914VTSQ5M');
        `}} />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5240608264303390"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  )
}
