import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-56 bg-white border-r border-gray-200 p-4 flex flex-col gap-1">
        <Link href="/" className="font-bold text-indigo-700 mb-4 block">← 사이트로</Link>
        <Link href="/admin" className="block px-3 py-2 rounded hover:bg-gray-100 text-sm">대시보드</Link>
        <Link href="/admin/posts" className="block px-3 py-2 rounded hover:bg-gray-100 text-sm">포스트 관리</Link>
        <Link href="/admin/generate" className="block px-3 py-2 rounded hover:bg-gray-100 text-sm">AI 생성</Link>
        <Link href="/admin/generate/batch" className="block px-3 py-2 rounded hover:bg-gray-100 text-sm">일괄 자동 생성</Link>
        <Link href="/admin/exam/topics" className="block px-3 py-2 rounded hover:bg-gray-100 text-sm">기출 토픽</Link>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
