export default function EquipmentListPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white p-4 border border-slate-300 rounded mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">비품 목록</h2>
        <p className="text-sm text-slate-500 mt-1">Equipment List</p>
      </div>

      <div className="bg-white border border-slate-300 rounded p-12 text-center text-slate-500">
        <p>비품 목록이 여기에 표시됩니다.</p>
        <p className="text-xs mt-2">검색, 필터링, 페이징 기능 포함</p>
      </div>
    </div>
  );
}
