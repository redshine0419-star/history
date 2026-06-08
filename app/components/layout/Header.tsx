'use client'

import Link from 'next/link'
import { useState } from 'react'

const NAV_ITEMS = [
  { label: '전체 이야기', href: '/posts' },
  {
    label: '지역별',
    children: [
      { label: '유럽사', href: '/region/europe' },
      { label: '아시아사', href: '/region/asia' },
      { label: '중동·아프리카사', href: '/region/middle-east-africa' },
      { label: '아메리카사', href: '/region/americas' },
    ],
  },
  {
    label: '시대별',
    children: [
      { label: '고대 문명', href: '/era/ancient' },
      { label: '중세', href: '/era/medieval' },
      { label: '근세', href: '/era/early-modern' },
      { label: '근대', href: '/era/modern' },
      { label: '현대', href: '/era/contemporary' },
    ],
  },
  { label: '⚽ 월드컵 특집', href: '/worldcup' },
  { label: '역사 퀴즈', href: '/quiz' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="font-bold text-lg text-indigo-700 tracking-tight">
          세계사의 반전
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="px-3 py-2 text-sm font-medium hover:text-indigo-600 transition-colors flex items-center gap-1">
                  {item.label}
                  <span className="text-xs">▾</span>
                </button>
                {openDropdown === item.label && (
                  <div className="absolute top-full left-0 bg-white border border-gray-100 rounded-lg shadow-lg py-1 min-w-36 z-50">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href!}
                className="px-3 py-2 text-sm font-medium hover:text-indigo-600 transition-colors"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            className="hidden md:block p-2 text-gray-500 hover:text-indigo-600 transition-colors"
            aria-label="검색"
          >
            🔍
          </Link>
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="메뉴"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-gray-100 bg-white px-4 pb-4">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <div key={item.label}>
                <p className="mt-3 mb-1 text-xs font-bold text-gray-400 uppercase tracking-wide">
                  {item.label}
                </p>
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block py-2 pl-2 text-sm hover:text-indigo-600"
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href!}
                className="block py-2 mt-1 text-sm font-medium hover:text-indigo-600"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
      )}
    </header>
  )
}
