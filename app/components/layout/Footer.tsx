import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-600">
        <div>
          <p className="font-bold text-gray-900 mb-2">세계사의 반전</p>
          <p>교과서 밖의 세계사 이야기와<br />세계사능력검정 대비 콘텐츠</p>
        </div>
        <div>
          <p className="font-bold text-gray-900 mb-2">둘러보기</p>
          <ul className="space-y-1">
            <li><Link href="/posts" className="hover:text-indigo-600">전체 이야기</Link></li>
            <li><Link href="/exam" className="hover:text-indigo-600">세계사 검정</Link></li>
            <li><Link href="/quiz" className="hover:text-indigo-600">역사 퀴즈</Link></li>
            <li><Link href="/about" className="hover:text-indigo-600">서비스 소개</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-bold text-gray-900 mb-2">SNS</p>
          <ul className="space-y-1">
            <li><a href="#" className="hover:text-indigo-600">인스타그램</a></li>
            <li><a href="#" className="hover:text-indigo-600">유튜브</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center py-4 text-xs text-gray-400 border-t border-gray-100">
        © {new Date().getFullYear()} 세계사의 반전. All rights reserved.
      </div>
    </footer>
  )
}
