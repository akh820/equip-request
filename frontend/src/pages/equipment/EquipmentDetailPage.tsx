import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import api from "@/lib/api";
import axios from "axios";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Loading from "@/common/Loading";
import { Input } from "@/components/ui/input";

interface Equipment {
  id: number;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  stock: number;
  available: boolean;
  createdAt: string;
}

export default function EquipmentDetailPage() {
  const { id } = useParams();
  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await api.get(`/equipment/${id}`);
        setEquipment(response.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "비품 정보를 불러오는데 실패했습니다."
          );
        } else {
          setError("알 수 없는 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [id]);

  const handleAddToCart = () => {
    if (!equipment) return;

    if (quantity > equipment.stock) {
      toast.error("재고가 부족합니다.");
      return;
    }

    addItem({
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      imageUrl: equipment.imageUrl,
      quantity,
      stock: equipment.stock,
    });

    toast.success("장바구니에 추가되었습니다!");
  };

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    if (equipment && value > equipment.stock) {
      toast.error("재고가 부족합니다.");
      return;
    }
    setQuantity(value);
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !equipment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-red-50 border border-red-200 p-4 rounded text-red-700 mb-4">
          {error || "비품을 찾을 수 없습니다."}
        </div>
        <Link
          to="/equipment"
          className="px-4 py-2 border border-slate-300 text-slate-700 rounded text-sm hover:bg-slate-50 inline-block"
        >
          ← 목록으로
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* 이미지 */}
          <div className="bg-slate-100 rounded overflow-hidden">
            <img
              src={equipment.imageUrl}
              alt={equipment.name}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* 정보 */}
          <div className="flex flex-col">
            <div className="mb-2">
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                {equipment.category}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              {equipment.name}
            </h2>

            <p className="text-slate-600 mb-6 whitespace-pre-line">
              {equipment.description}
            </p>

            <div className="border-t border-slate-200 pt-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500">재고</span>
                <span
                  className={`text-lg font-semibold ${
                    equipment.stock === 0
                      ? "text-red-600"
                      : equipment.stock < 5
                      ? "text-orange-600"
                      : "text-green-600"
                  }`}
                >
                  {equipment.stock}개
                </span>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500">신청 가능 여부</span>
                <span
                  className={`text-sm font-medium ${
                    equipment.available ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {equipment.available ? "가능" : "불가"}
                </span>
              </div>
            </div>

            {/* 수량 선택 (관리자는 숨김) */}
            {!isAdmin && equipment.available && equipment.stock > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  수량
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="w-10 h-10 border bg-white border-slate-300 rounded hover:bg-slate-50 text-slate-700 font-medium"
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(parseInt(e.target.value) || 1)
                    }
                    className="w-20 h-10 border border-slate-300 rounded text-center"
                    min="1"
                    max={equipment.stock}
                  />
                  <Button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="w-10 h-10 border bg-white border-slate-300 rounded hover:bg-slate-50 text-slate-700 font-medium"
                  >
                    +
                  </Button>
                </div>
              </div>
            )}

            {/* 버튼 */}
            <div className="mt-auto space-y-3">
              {!isAdmin && (
                <Button
                  onClick={handleAddToCart}
                  disabled={!equipment.available || equipment.stock === 0}
                  className="w-full py-5 bg-slate-700 hover:bg-slate-800 text-white rounded font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {equipment.stock === 0
                    ? "재고 없음"
                    : !equipment.available
                    ? "신청 불가"
                    : "장바구니 담기"}
                </Button>
              )}

              <Link
                to="/equipment"
                className="block text-center px-4 py-2.5 border border-slate-300 text-slate-700 rounded hover:bg-slate-50"
              >
                ← 목록으로
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
