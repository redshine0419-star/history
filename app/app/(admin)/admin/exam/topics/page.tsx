import { getExamTopics } from '@/lib/db/queries/exam'

export default async function ExamTopicsPage() {
  const topics = await getExamTopics()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">기출 토픽 관리</h1>
      <p className="text-gray-500 text-sm mb-6">
        12~14회차 PDF 분석 기반 빈출 토픽. AI 콘텐츠 생성 우선순위 나침반.
      </p>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">키워드</th>
              <th className="px-4 py-3 font-medium">시대</th>
              <th className="px-4 py-3 font-medium">지역</th>
              <th className="px-4 py-3 font-medium">급수</th>
              <th className="px-4 py-3 font-medium">빈도</th>
              <th className="px-4 py-3 font-medium">회차</th>
              <th className="px-4 py-3 font-medium">콘텐츠</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {topics.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{t.keyword}</td>
                <td className="px-4 py-3 text-gray-600">{t.era}</td>
                <td className="px-4 py-3 text-gray-600">{t.region}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${t.examLevel === 'advanced' ? 'bg-indigo-50 text-indigo-700' : 'bg-green-50 text-green-700'}`}>
                    {t.examLevel}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {t.frequency >= 3 ? (
                    <span className="text-red-500 font-bold">{t.frequency}🔥</span>
                  ) : (
                    <span>{t.frequency}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500">{t.rounds?.join(', ')}</td>
                <td className="px-4 py-3">
                  {t.postId ? (
                    <span className="text-green-600 text-xs">✓ 연결됨</span>
                  ) : (
                    <span className="text-gray-400 text-xs">미생성</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {topics.length === 0 && (
          <p className="text-center py-12 text-gray-400">토픽 없음. 시드 데이터를 실행하세요.</p>
        )}
      </div>
    </div>
  )
}
