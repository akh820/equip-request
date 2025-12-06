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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
            err.response?.data?.message || t("equipment.failedToLoad")
          );
        } else {
          setError(t("auth.unknownError"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [id, t]);

  const handleAddToCart = () => {
    if (!equipment) return;

    if (quantity > equipment.stock) {
      toast.error(t("equipment.stockInsufficient"));
      return;
    }

    addItem({
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      imageUrl: equipment.imageUrl,
      quantity,
      stock: equipment.stock,
    });

    toast.success(t("equipment.addedToCart"));
  };

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    if (equipment && value > equipment.stock) {
      toast.error(t("equipment.stockInsufficient"));
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
          {error || t("equipment.notFound")}
        </div>
        <Link
          to="/equipment"
          className="px-4 py-2 border border-slate-300 text-slate-700 rounded text-sm hover:bg-slate-50 inline-block"
        >
          {t("common.backToList")}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
        <div className="grid md:grid-cols-2 gap-6 p-6">
          <div className="bg-slate-100 rounded overflow-hidden">
            <img
              src={equipment.imageUrl}
              alt={equipment.name}
              className="w-full h-96 object-cover"
            />
          </div>

          <div className="flex flex-col">
            <div className="mb-2">
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                {t(`admin.equipment.categories.${equipment.category}`)}
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
                <span className="text-sm text-slate-500">{t("equipment.stock")}</span>
                <span
                  className={`text-lg font-semibold ${
                    equipment.stock === 0
                      ? "text-red-600"
                      : equipment.stock < 5
                      ? "text-orange-600"
                      : "text-green-600"
                  }`}
                >
                  {t("equipment.stockCount", { count: equipment.stock })}
                </span>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500">{t("equipment.availabilityLabel")}</span>
                <span
                  className={`text-sm font-medium ${
                    equipment.available ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {equipment.available ? t("equipment.available") : t("equipment.unavailable")}
                </span>
              </div>
            </div>

            {!isAdmin && equipment.available && equipment.stock > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t("equipment.quantity")}
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

            <div className="mt-auto space-y-3">
              {!isAdmin && (
                <Button
                  onClick={handleAddToCart}
                  disabled={!equipment.available || equipment.stock === 0}
                  className="w-full py-5 bg-slate-700 hover:bg-slate-800 text-white rounded font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {equipment.stock === 0
                    ? t("equipment.outOfStock")
                    : !equipment.available
                    ? t("equipment.notAvailable")
                    : t("equipment.addToCart")}
                </Button>
              )}

              <Link
                to="/equipment"
                className="block text-center px-4 py-2.5 border border-slate-300 text-slate-700 rounded hover:bg-slate-50"
              >
                {t("common.backToList")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

