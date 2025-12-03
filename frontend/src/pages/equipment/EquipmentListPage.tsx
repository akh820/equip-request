import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "@/lib/api";
import axios from "axios";
import Loading from "@/common/Loading";

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

export default function EquipmentListPage() {
  const navigate = useNavigate();
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const response = await api.get("/equipment");
        setEquipments(response.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "비품 목록을 불러오는데 실패했습니다."
          );
        } else {
          setError("알 수 없는 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEquipments();
  }, []);

  const handleCardClick = (id: number) => {
    navigate(`/equipment/${id}`);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-red-50 border border-red-200 p-4 rounded text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white p-4 border border-slate-300 rounded mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">비품 목록</h2>
        <p className="text-sm text-slate-500 mt-1">Equipment List</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipments.map((equipment) => (
          <div
            key={equipment.id}
            onClick={() => handleCardClick(equipment.id)}
            className="bg-white border border-slate-300 rounded shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden"
          >
            <div className="h-48 overflow-hidden bg-slate-100">
              <img
                src={equipment.imageUrl}
                alt={equipment.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  {equipment.category}
                </span>
                {!equipment.available && (
                  <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                    신청 불가
                  </span>
                )}
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-2">
                {equipment.name}
              </h3>
              <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                {equipment.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">재고</span>
                <span
                  className={`font-semibold ${
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
            </div>
          </div>
        ))}
      </div>

      {equipments.length === 0 && (
        <div className="bg-white border border-slate-300 rounded p-12 text-center text-slate-500">
          <p>등록된 비품이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
