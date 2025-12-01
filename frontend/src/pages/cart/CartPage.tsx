import { useCartStore } from "@/stores/cartStore";

export default function CartPage() {
  const { items } = useCartStore();

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-lg font-bold mb-4 pb-2 border-b border-slate-300">
        장바구니
      </h2>

      {items.length === 0 ? (
        <div className="bg-white border border-slate-300 rounded p-12 text-center text-slate-500 text-sm">
          장바구니가 비어있습니다.
        </div>
      ) : (
        <div className="bg-white border border-slate-300 rounded p-6">
          <p className="text-sm text-slate-600 mb-4">
            장바구니 아이템: {items.length}개
          </p>
          <p className="text-xs text-slate-500">추후 테이블로 구현</p>
          <p className="text-xs text-slate-500 mt-1">
            - 수량 조절, 삭제, 신청서 제출 기능 포함
          </p>
        </div>
      )}
    </div>
  );
}
