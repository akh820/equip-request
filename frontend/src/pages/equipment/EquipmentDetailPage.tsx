import { useParams, Link } from "react-router";

export default function EquipmentDetailPage() {
  const { id } = useParams();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white border border-slate-300 rounded shadow-sm p-8">
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          비품 상세 정보 (ID: {id})
        </h2>
        <p className="text-sm text-slate-500 mb-6">Equipment Detail</p>

        <div className="border-t border-slate-200 pt-4 text-slate-500 text-sm">
          <p>이미지, 상세 설명, 재고 정보 등이 표시됩니다.</p>
          <p className="mt-2">"장바구니 담기" 버튼 기능 구현 예정</p>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200">
          <Link
            to="/equipment"
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded text-sm hover:bg-slate-50 inline-block"
          >
            ← 목록으로
          </Link>
        </div>
      </div>
    </div>
  );
}
