import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import api from "@/lib/api";
import Loading from "@/common/Loading";
import { RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Virtuoso } from "react-virtuoso";
import { useQuery } from "@tanstack/react-query";
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

export default function EquipmentListPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchKeyword, setSearchKeyword] = useState("");

  const {
    data: allEquipments = [],
    isLoading,
    error,
  } = useQuery<Equipment[]>({
    queryKey: ["equipments"],
    queryFn: async () => {
      const response = await api.get("/equipment");
      return response.data;
    },
  });

  const filteredEquipments = searchKeyword.trim()
    ? allEquipments.filter((equipment) =>
        equipment.name.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    : allEquipments;

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

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-red-50 border border-red-200 p-4 rounded text-red-700">
          {error instanceof Error
            ? error.message
            : t("equipment.failedToLoad")}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between bg-white p-4 border border-slate-300 rounded mb-6 shadow-sm">
        <div className="">
          <h2 className="text-lg font-bold text-slate-800">{t("equipment.title")}</h2>
          <p className="text-sm text-slate-500 mt-1">{t("equipment.subtitle")}</p>
        </div>

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
              placeholder={t("equipment.searchPlaceholder")}
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
              ? t("equipment.noResults", { keyword: searchKeyword })
              : t("equipment.noEquipment")}
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
                          {t("equipment.notAvailable")}
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
                      <span className="text-slate-500">{t("equipment.stock")}</span>
                      <span
                        className={`font-semibold ${
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

