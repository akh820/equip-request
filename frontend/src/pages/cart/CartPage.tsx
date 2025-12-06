import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/api";
import axios from "axios";
import { useState } from "react";
import type { CartItem } from "@/types";
import { useTranslation } from "react-i18next";

export default function CartPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (equipmentId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const targetItem = items.find(
      (item: CartItem) => item.equipmentId === equipmentId
    );

    if (!targetItem) {
      console.error("Item not found in cart");
      return;
    }

    if (newQuantity > (targetItem.stock ?? 0)) {
      toast.error(t("cart.stockInsufficient", { stock: targetItem.stock }));
      return;
    }

    updateQuantity(equipmentId, newQuantity);
  };

  const handleRemoveItem = (equipmentId: number) => {
    removeItem(equipmentId);
    toast.success(t("cart.removed"));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error(t("cart.loginRequired"));
      navigate("/login");
      return;
    }

    if (items.length === 0) {
      toast.error(t("cart.cartEmpty"));
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        items: items.map((item) => ({
          equipmentId: item.equipmentId,
          quantity: item.quantity,
        })),
      };

      await api.post("/requests", requestData);

      toast.success(t("cart.requestSuccess"));
      clearCart();
      navigate("/my-requests");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || t("cart.requestFailed"));
      } else {
        toast.error(t("auth.unknownError"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white p-4 rounded-sm border border-neutral-200 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-neutral-700">{t("cart.title")}</h2>
        {/* <p className="text-sm text-neutral-500 mt-1">{t("cart.subtitle")}</p> */}
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-sm border border-neutral-200 p-12 text-center text-neutral-500">
          <p className="mb-4">{t("cart.empty")}</p>
          <Button
            onClick={() => navigate("/equipment")}
            className="bg-neutral-700 hover:bg-neutral-800 text-white rounded"
          >
            {t("cart.viewEquipment")}
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-sm border border-neutral-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-neutral-200 bg-neutral-50 text-sm font-medium text-neutral-700">
            <div className="col-span-5">{t("cart.equipmentColumn")}</div>
            <div className="col-span-3 text-center">{t("cart.quantityColumn")}</div>
            <div className="col-span-3 text-center">{t("cart.stockColumn")}</div>
            <div className="col-span-1"></div>
          </div>

          <div className="divide-y divide-slate-200">
            {items.map((item) => (
              <div
                key={item.equipmentId}
                className="grid grid-cols-12 gap-4 p-4 items-center"
              >
                <div className="col-span-5 flex items-center gap-3">
                  <img
                    src={item.imageUrl}
                    alt={item.equipmentName}
                    className="w-16 h-16 object-cover rounded-sm border border-neutral-200"
                  />
                  <span className="text-sm font-medium text-neutral-700">
                    {item.equipmentName}
                  </span>
                </div>

                <div className="col-span-3 flex items-center justify-center gap-2">
                  <Button
                    onClick={() =>
                      handleQuantityChange(item.equipmentId, item.quantity - 1)
                    }
                    className="w-8 h-8 border bg-whiteborder-neutral-200 hover:bg-neutral-50 text-neutral-700"
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
                    className="w-8 h-8 border bg-whiteborder-neutral-200 hover:bg-neutral-50 text-neutral-700"
                  >
                    +
                  </Button>
                </div>

                <div className="col-span-3 text-center">
                  <span className="text-sm text-neutral-500">{item.stock}</span>
                </div>

                <div className="col-span-1 text-right">
                  <button
                    onClick={() => handleRemoveItem(item.equipmentId)}
                    className="text-rose-400 hover:text-rose-500 text-sm cursor-pointer"
                  >
                    {t("common.delete")}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-neutral-200 bg-neutral-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-neutral-600">
                {t("cart.totalItems", { count: items.length })}
              </span>
              <span className="text-sm text-neutral-600">
                {t("cart.totalQuantity", { count: items.reduce((sum, item) => sum + item.quantity, 0) })}
              </span>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-5 bg-neutral-700 hover:bg-neutral-800 text-white font-medium transition disabled:opacity-50"
            >
              {loading ? t("cart.submitting") : t("cart.submitRequest")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

