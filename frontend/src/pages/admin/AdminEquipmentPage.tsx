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
import ImageUpload from "@/components/ImageUpload";
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

interface EquipmentForm {
  name: string;
  description: string;
  category: string;
  imageFile: File | null;
  currentImageUrl?: string; // 수정 시 기존 이미지 URL
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
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const queryClient = useQueryClient(); // 캐시 관리 도구
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<EquipmentForm>({
    name: "",
    description: "",
    category: "",
    imageFile: null,
    currentImageUrl: "",
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
      toast.error(t("admin.accessDenied"));
      navigate("/");
    }
  }, [user, navigate, t]);

  const createMutation = useMutation({
    mutationFn: (formData: FormData) =>
      api.post("/equipment", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      toast.success(t("admin.equipment.registered"));
      handleCloseForm();
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
    },
    onError: (error: Error) => {
      const err = error as AxiosErrorType;
      toast.error(err.response?.data?.message || t("admin.equipment.registerFailed"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      api.put(`/equipment/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      toast.success(t("admin.equipment.updated"));
      handleCloseForm();
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
    },
    onError: (error: Error) => {
      const err = error as AxiosErrorType;
      toast.error(err.response?.data?.message || t("admin.equipment.updateFailed"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/equipment/${id}`),
    onSuccess: () => {
      toast.success(t("admin.equipment.deleted"));
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
    },
    onError: (error: Error) => {
      const err = error as AxiosErrorType;
      toast.error(err.response?.data?.message || t("admin.equipment.deleteFailed"));
    },
  });

  const handleOpenForm = (equipment?: Equipment) => {
    if (equipment) {
      setEditingId(equipment.id);
      setFormData({
        name: equipment.name,
        description: equipment.description,
        category: equipment.category,
        imageFile: null,
        currentImageUrl: equipment.imageUrl,
        stock: equipment.stock,
        available: equipment.available,
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        description: "",
        category: "",
        imageFile: null,
        currentImageUrl: "",
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
      toast.error(t("admin.equipment.nameRequired"));
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append("name", formData.name);
    submitFormData.append("description", formData.description || "");
    submitFormData.append("category", formData.category);
    submitFormData.append("stock", formData.stock.toString());
    submitFormData.append("available", formData.available.toString());

    if (formData.imageFile) {
      submitFormData.append("image", formData.imageFile);
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, formData: submitFormData });
    } else {
      createMutation.mutate(submitFormData);
    }
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  // 카테고리 옵션 (다국어 처리)
  const categoryOptions = [
    { value: "laptop", label: t("admin.equipment.categories.laptop") },
    { value: "monitor", label: t("admin.equipment.categories.monitor") },
    { value: "peripherals", label: t("admin.equipment.categories.peripherals") },
    { value: "office_supplies", label: t("admin.equipment.categories.office_supplies") },
    { value: "furniture", label: t("admin.equipment.categories.furniture") },
    { value: "others", label: t("admin.equipment.categories.others") },
  ];

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-neutral-100 rounded-sm border border-neutral-200 p-4 text-neutral-700">
          {error instanceof Error
            ? error.message
            : t("equipment.failedToLoad")}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white p-4 rounded-sm border border-neutral-200 mb-6 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-neutral-700">
            {t("admin.equipment.title")}
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            {/* {t("admin.equipment.subtitle")} */}
          </p>
        </div>
        <Button
          onClick={() => handleOpenForm()}
          className="bg-neutral-700 hover:bg-neutral-800 text-white rounded"
        >
          {t("admin.equipment.register")}
        </Button>
      </div>

      {/* 등록/수정 폼 */}
      {isFormOpen && (
        <div className="bg-white rounded-sm border border-neutral-200 shadow-sm p-6 mb-6">
          <h3 className="text-lg font-bold text-neutral-700 mb-4">
            {editingId ? t("admin.equipment.editTitle") : t("admin.equipment.registerTitle")}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                {t("admin.equipment.nameLabel")} <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder={t("admin.equipment.namePlaceholder")}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                {t("admin.equipment.categoryLabel")} <span className="text-red-500">*</span>
                </label>
                <SelectCustom
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                  options={categoryOptions}
                  placeholder={t("admin.equipment.categoryPlaceholder")}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                {t("admin.equipment.descriptionLabel")}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder={t("admin.equipment.descriptionPlaceholder")}
                className="w-full rounded-sm border border-neutral-200 p-2 text-sm"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                {t("admin.equipment.imageLabel")}
              </label>
              <ImageUpload
                onChange={(file) =>
                  setFormData({ ...formData, imageFile: file })
                }
                initialPreview={formData.currentImageUrl}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  {t("admin.equipment.stockLabel")}
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
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  {t("admin.equipment.availabilityLabel")}
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
                    { value: "true", label: t("equipment.available") },
                    { value: "false", label: t("equipment.unavailable") },
                  ]}
                  placeholder={t("admin.equipment.availabilityLabel")}
                  label={t("admin.equipment.availabilityLabel")}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-neutral-700 hover:bg-neutral-800 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createMutation.isPending || updateMutation.isPending
                  ? t("common.loading") || "처리 중..."
                  : editingId ? t("common.edit") : t("common.submit")}
              </Button>
              <Button
                type="button"
                onClick={handleCloseForm}
                className="bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded"
              >
                {t("common.cancel")}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* 비품 목록 */}
      <div className="bg-white rounded-sm border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700">
                  {t("admin.equipment.imageColumn")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700">
                  {t("admin.equipment.nameColumn")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700">
                  {t("admin.equipment.categoryColumn")}
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-neutral-700">
                  {t("admin.equipment.stockColumn")}
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-neutral-700">
                  {t("admin.equipment.statusColumn")}
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-neutral-700">
                  {t("admin.equipment.actionColumn")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {equipments.map((equipment) => (
                <tr key={equipment.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <img
                      src={equipment.imageUrl}
                      alt={equipment.name}
                      className="w-12 h-12 object-cover rounded border border-neutral-200"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-neutral-700">
                      {equipment.name}
                    </div>
                    <div className="text-xs text-neutral-500 line-clamp-1">
                      {equipment.description}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded">
                      {t(`admin.equipment.categories.${equipment.category}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-sm font-medium ${
                        equipment.stock === 0
                          ? "text-rose-500"
                          : equipment.stock < 5
                          ? "text-amber-600"
                          : "text-neutral-700"
                      }`}
                    >
                      {equipment.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-xs px-2 py-1 border ${
                        equipment.available
                          ? "rounded bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "rounded bg-red-100 text-red-600 border-red-200"
                      }`}
                    >
                      {equipment.available ? t("admin.equipment.statusAvailable") : t("admin.equipment.statusUnavailable")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        onClick={() => handleOpenForm(equipment)}
                        className="text-xs bg-neutral-700 hover:bg-neutral-800 text-white px-3 py-1 rounded"
                      >
                        {t("common.edit")}
                      </Button>
                      <ConfirmButton
                        buttonTitle={t("common.delete")}
                        buttonClassName="text-xs bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded"
                        alertTitle={t("admin.equipment.deleteConfirm")}
                        alertDescription={t("admin.equipment.deleteWarning")}
                        confirmText={t("common.delete")}
                        cancelText={t("common.cancel")}
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
          <div className="p-12 text-center text-neutral-500">
            {t("equipment.noEquipment")}
          </div>
        )}
      </div>
    </div>
  );
}
