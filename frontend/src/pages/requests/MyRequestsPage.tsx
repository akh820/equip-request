export default function MyRequestsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-lg font-bold mb-4 pb-2 border-b border-slate-300">
        내 신청 내역
      </h2>

      <div className="bg-white border border-slate-300 rounded overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="px-4 py-2 text-slate-600 font-bold border-r border-slate-200">
                신청일자
              </th>
              <th className="px-4 py-2 text-slate-600 font-bold border-r border-slate-200">
                품목 내역
              </th>
              <th className="px-4 py-2 text-slate-600 font-bold text-center">
                진행상태
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={3} className="p-8 text-center text-slate-500">
                <p>신청 내역이 없습니다.</p>
                <p className="text-xs mt-2">추후 연동</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
