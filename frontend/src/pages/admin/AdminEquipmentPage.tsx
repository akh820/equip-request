import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";
import Loading from "@/common/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ConfirmButton } from "@/components/ui/alert-dialog";
import { SelectCustom } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

interface EquipmentForm {
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  stock: number;
  available: boolean;
}

type AxiosErrorType = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export default function AdminEquipmentPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const queryClient = useQueryClient(); // 캐시 관리 도구
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<EquipmentForm>({
    name: "",
    description: "",
    category: "",
    imageUrl: "",
    stock: 0,
    available: true,
  });

  const {
    data: equipments = [],
    isLoading,
    error,
  } = useQuery<Equipment[]>({
    queryKey: ["equipments"],
    queryFn: async () => {
      const response = await api.get("/equipment");
      return response.data;
    },
    enabled: user?.role === "ADMIN", // 관리자일 때만 쿼리 실행
  });

  useEffect(() => {
    if (user?.role !== "ADMIN") {
      toast.error("관리자만 접근 가능합니다.");
      navigate("/");
    }
  }, [user, navigate]);

  const createMutation = useMutation({
    mutationFn: (data: EquipmentForm) => api.post("/equipment", data),
    onSuccess: () => {
      toast.success("비품이 등록되었습니다.");
      handleCloseForm();
      // 캐시 무효화 → 자동으로 목록 새로고침!
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
    },
    onError: (error: Error) => {
      const err = error as AxiosErrorType;
      toast.error(err.response?.data?.message || "등록에 실패했습니다.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: EquipmentForm }) =>
      api.put(`/equipment/${id}`, data),
    onSuccess: () => {
      toast.success("비품이 수정되었습니다.");
      handleCloseForm();
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
    },
    onError: (error: Error) => {
      const err = error as AxiosErrorType;
      toast.error(err.response?.data?.message || "수정에 실패했습니다.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/equipment/${id}`),
    onSuccess: () => {
      toast.success("비품이 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
    },
    onError: (error: Error) => {
      const err = error as AxiosErrorType;
      toast.error(err.response?.data?.message || "삭제에 실패했습니다.");
    },
  });

  const handleOpenForm = (equipment?: Equipment) => {
    if (equipment) {
      setEditingId(equipment.id);
      setFormData({
        name: equipment.name,
        description: equipment.description,
        category: equipment.category,
        imageUrl: equipment.imageUrl,
        stock: equipment.stock,
        available: equipment.available,
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        description: "",
        category: "",
        imageUrl: "",
        stock: 0,
        available: true,
      });
    }
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category) {
      toast.error("이름과 카테고리는 필수입니다.");
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
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
            : "비품 목록을 불러오는데 실패했습니다."}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white p-4 border border-slate-300 rounded mb-6 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            관리자 - 비품 관리
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Admin - Equipment Management
          </p>
        </div>
        <Button
          onClick={() => handleOpenForm()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          비품 등록
        </Button>
      </div>

      {/* 등록/수정 폼 */}
      {isFormOpen && (
        <div className="bg-white border border-slate-300 rounded shadow-sm p-6 mb-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            {editingId ? "비품 수정" : "비품 등록"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  비품명 <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="비품명을 입력하세요"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  카테고리 <span className="text-red-500">*</span>
                </label>
                <SelectCustom
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                  options={[
                    { value: "laptop", label: "노트북" },
                    { value: "monitor", label: "모니터" },
                    { value: "peripherals", label: "주변기기" },
                    { value: "office_supplies", label: "사무용품" },
                    { value: "furniture", label: "가구" },
                    { value: "others", label: "기타" },
                  ]}
                  placeholder="카테고리를 선택하세요"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                설명
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="설명을 입력하세요"
                className="w-full border border-slate-300 rounded p-2 text-sm"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                이미지 URL
              </label>
              <Input
                type="text"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                placeholder="이미지 URL을 입력하세요"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  재고
                </label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock: parseInt(e.target.value) || 0,
                    })
                  }
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  신청 가능 여부
                </label>
                <SelectCustom
                  value={formData.available ? "true" : "false"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      available: value === "true",
                    })
                  }
                  options={[
                    { value: "true", label: "가능" },
                    { value: "false", label: "불가" },
                  ]}
                  placeholder="신청 가능 여부"
                  label="신청 가능 여부"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {editingId ? "수정" : "등록"}
              </Button>
              <Button
                type="button"
                onClick={handleCloseForm}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700"
              >
                취소
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* 비품 목록 */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  이미지
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  비품명
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700">
                  카테고리
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-700">
                  재고
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-700">
                  상태
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-700">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {equipments.map((equipment) => (
                <tr key={equipment.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <img
                      src={equipment.imageUrl}
                      alt={equipment.name}
                      className="w-12 h-12 object-cover rounded border border-slate-200"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-slate-800">
                      {equipment.name}
                    </div>
                    <div className="text-xs text-slate-500 line-clamp-1">
                      {equipment.description}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                      {equipment.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-sm font-medium ${
                        equipment.stock === 0
                          ? "text-red-600"
                          : equipment.stock < 5
                          ? "text-orange-600"
                          : "text-green-600"
                      }`}
                    >
                      {equipment.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        equipment.available
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {equipment.available ? "사용 가능" : "사용 불가"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        onClick={() => handleOpenForm(equipment)}
                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1"
                      >
                        수정
                      </Button>
                      <ConfirmButton
                        buttonTitle="삭제"
                        buttonClassName="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1"
                        alertTitle="비품을 삭제하시겠습니까?"
                        alertDescription="이 작업은 되돌릴 수 없습니다."
                        confirmText="삭제"
                        onConfirm={() => handleDelete(equipment.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {equipments.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            등록된 비품이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
