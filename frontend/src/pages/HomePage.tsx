export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white border border-slate-300 rounded shadow-sm p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">
          사내 비품 신청 시스템
        </h1>
        <p className="text-slate-600 mb-6">
          Internal Equipment Request System
        </p>
        <div className="text-sm text-slate-500">
          <p>비품이 필요하신가요? 간편하게 신청하세요.</p>
          <p className="mt-2">관리자 승인 후 수령 가능합니다.</p>
        </div>
      </div>
    </div>
  );
}
