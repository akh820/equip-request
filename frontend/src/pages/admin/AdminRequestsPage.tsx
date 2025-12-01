export default function AdminRequestsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-lg font-bold mb-4 pb-2 border-b border-slate-300">
        관리자 - 신청 관리
      </h2>

      <div className="bg-white border border-slate-300 rounded mb-4 p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="border border-slate-300 rounded p-3 border-l-4 border-l-yellow-500">
            <div className="text-xs text-slate-500 font-bold">처리 대기</div>
            <div className="text-2xl font-bold text-slate-800 mt-1">
              0 <span className="text-sm font-normal text-slate-500">건</span>
            </div>
          </div>
          <div className="border border-slate-300 rounded p-3 border-l-4 border-l-blue-500">
            <div className="text-xs text-slate-500 font-bold">승인 완료</div>
            <div className="text-2xl font-bold text-slate-800 mt-1">
              0 <span className="text-sm font-normal text-slate-500">건</span>
            </div>
          </div>
          <div className="border border-slate-300 rounded p-3 border-l-4 border-l-slate-500">
            <div className="text-xs text-slate-500 font-bold">반려</div>
            <div className="text-2xl font-bold text-slate-800 mt-1">
              0 <span className="text-sm font-normal text-slate-500">건</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-300 rounded overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="px-4 py-2 text-slate-600 font-bold border-r border-slate-200">
                신청일자
              </th>
              <th className="px-4 py-2 text-slate-600 font-bold border-r border-slate-200">
                신청자
              </th>
              <th className="px-4 py-2 text-slate-600 font-bold border-r border-slate-200">
                품목 내역
              </th>
              <th className="px-4 py-2 text-slate-600 font-bold text-center w-24">
                상태
              </th>
              <th className="px-4 py-2 text-slate-600 font-bold text-center w-32">
                처리
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="p-8 text-center text-slate-500">
                <p>처리할 신청이 없습니다.</p>
                <p className="text-xs mt-2">승인 / 반려 기능 구현 예정</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
