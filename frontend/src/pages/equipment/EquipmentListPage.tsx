import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import api from "@/lib/api";
import axios from "axios";
import Loading from "@/common/Loading";
import { RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Virtuoso } from "react-virtuoso";

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
  const [allEquipments, setAllEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const response = await api.get("/equipment");
        setAllEquipments(response.data);
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

  // 클라이언트 사이드 필터링
  const filteredEquipments = searchKeyword.trim()
    ? allEquipments.filter((equipment) =>
        equipment.name.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    : allEquipments;

  // Virtual Scroll을 위해 행 단위로 그룹화 (한 행에 3개씩)
  const equipmentRows = useMemo(() => {
    const itemsPerRow = 3;
    const rows: Equipment[][] = [];
    for (let i = 0; i < filteredEquipments.length; i += itemsPerRow) {
      rows.push(filteredEquipments.slice(i, i + itemsPerRow));
    }
    return rows;
  }, [filteredEquipments]);

  const handleReset = () => {
    setSearchKeyword("");
  };

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
      <div className="flex items-center justify-between bg-white p-4 border border-slate-300 rounded mb-6 shadow-sm">
        <div className="">
          <h2 className="text-lg font-bold text-slate-800">비품 목록</h2>
          <p className="text-sm text-slate-500 mt-1">Equipment List</p>
        </div>

        {/* 검색 */}
        <div className="flex items-center">
          <div className="relative max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="비품 이름으로 검색..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>
          <div className="mx-2">
            <Button
              onClick={handleReset}
              className="px-5 py-5 border"
              variant="outline"
              size="icon"
            >
              <RotateCcw />
            </Button>
          </div>
        </div>
      </div>

      {filteredEquipments.length === 0 ? (
        <div className="bg-white border border-slate-300 rounded p-12 text-center text-slate-500">
          <p>
            {searchKeyword
              ? `"${searchKeyword}"에 대한 검색 결과가 없습니다.`
              : "등록된 비품이 없습니다."}
          </p>
        </div>
      ) : (
        <Virtuoso
          useWindowScroll
          data={equipmentRows}
          itemContent={(index, row) => (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
              key={`row-${index}`}
            >
              {row.map((equipment) => (
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
          )}
        />
      )}
    </div>
  );
}
