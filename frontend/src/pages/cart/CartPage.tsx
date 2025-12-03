import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/api";
import axios from "axios";
import { useState } from "react";
import type { CartItem } from "@/types";

export default function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (equipmentId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const targetItem = items.find(
      (item: CartItem) => item.equipmentId === equipmentId
    );

    if (!targetItem) {
      console.error("장바구니에서 해당 아이템을 찾을 수 없습니다.");
      return;
    }

    if (newQuantity > (targetItem.stock ?? 0)) {
      toast.error(`재고가 부족합니다. (현재 ${targetItem.stock}개)`);
      return;
    }

    updateQuantity(equipmentId, newQuantity);
  };

  const handleRemoveItem = (equipmentId: number) => {
    removeItem(equipmentId);
    toast.success("장바구니에서 제거되었습니다.");
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    if (items.length === 0) {
      toast.error("장바구니가 비어있습니다.");
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        userId: user.id,
        items: items.map((item) => ({
          equipmentId: item.equipmentId,
          quantity: item.quantity,
        })),
      };

      await api.post("/requests", requestData);

      toast.success("비품 신청이 완료되었습니다!");
      clearCart();
      navigate("/my-requests");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "신청에 실패했습니다.");
      } else {
        toast.error("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white p-4 border border-slate-300 rounded mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">장바구니</h2>
        <p className="text-sm text-slate-500 mt-1">Shopping Cart</p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-slate-300 rounded p-12 text-center text-slate-500">
          <p className="mb-4">장바구니가 비어있습니다.</p>
          <Button
            onClick={() => navigate("/equipment")}
            className="bg-slate-700 hover:bg-slate-800 text-white"
          >
            비품 목록 보기
          </Button>
        </div>
      ) : (
        <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
          {/* 테이블 헤더 */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-200 bg-slate-50 text-sm font-medium text-slate-700">
            <div className="col-span-5">비품</div>
            <div className="col-span-3 text-center">수량</div>
            <div className="col-span-3 text-center">재고</div>
            <div className="col-span-1"></div>
          </div>

          {/* 아이템 목록 */}
          <div className="divide-y divide-slate-200">
            {items.map((item) => (
              <div
                key={item.equipmentId}
                className="grid grid-cols-12 gap-4 p-4 items-center"
              >
                {/* 비품 정보 */}
                <div className="col-span-5 flex items-center gap-3">
                  <img
                    src={item.imageUrl}
                    alt={item.equipmentName}
                    className="w-16 h-16 object-cover rounded border border-slate-200"
                  />
                  <span className="text-sm font-medium text-slate-800">
                    {item.equipmentName}
                  </span>
                </div>

                {/* 수량 조절 */}
                <div className="col-span-3 flex items-center justify-center gap-2">
                  <Button
                    onClick={() =>
                      handleQuantityChange(item.equipmentId, item.quantity - 1)
                    }
                    className="w-8 h-8 border bg-whiteborder-slate-300 rounded hover:bg-slate-50 text-slate-700"
                  >
                    -
                  </Button>
                  <span className="w-12 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <Button
                    onClick={() =>
                      handleQuantityChange(item.equipmentId, item.quantity + 1)
                    }
                    className="w-8 h-8 border bg-whiteborder-slate-300 rounded hover:bg-slate-50 text-slate-700"
                  >
                    +
                  </Button>
                </div>

                {/* 재고 정보 */}
                <div className="col-span-3 text-center">
                  <span className="text-sm text-slate-500">{item.stock}</span>
                </div>

                {/* 삭제 버튼 */}
                <div className="col-span-1 text-right">
                  <button
                    onClick={() => handleRemoveItem(item.equipmentId)}
                    className="text-red-600 hover:text-red-700 text-sm cursor-pointer"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 신청하기 버튼 */}
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-600">
                총 {items.length}개 비품
              </span>
              <span className="text-sm text-slate-600">
                총 수량: {items.reduce((sum, item) => sum + item.quantity, 0)}개
              </span>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-5 bg-slate-700 hover:bg-slate-800 text-white rounded font-medium transition disabled:opacity-50"
            >
              {loading ? "신청 중..." : "비품 신청하기"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
