export default function AdminEquipmentPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800">관리자 - 비품 관리</h2>
        <button className="px-3 py-1.5 bg-slate-700 text-white text-xs rounded hover:bg-slate-800">
          + 비품 등록
        </button>
      </div>

      <div className="bg-white border border-slate-300 rounded overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="px-4 py-2 text-slate-600 font-bold border-r border-slate-200">
                비품명
              </th>
              <th className="px-4 py-2 text-slate-600 font-bold border-r border-slate-200 w-32">
                카테고리
              </th>
              <th className="px-4 py-2 text-slate-600 font-bold text-center w-24">
                재고
              </th>
              <th className="px-4 py-2 text-slate-600 font-bold text-center w-24">
                관리
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="p-8 text-center text-slate-500">
                <p>등록된 비품이 없습니다.</p>
                <p className="text-xs mt-2">CRUD 기능 구현 예정</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
