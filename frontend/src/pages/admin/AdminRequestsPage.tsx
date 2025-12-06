import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";
import axios from "axios";
import Loading from "@/common/Loading";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ConfirmButton } from "@/components/ui/alert-dialog";
import { useTranslation } from "react-i18next";

interface RequestItem {
  id: number;
  equipmentId: number;
  equipmentName: string;
  quantity: number;
}

interface Request {
  id: number;
  userId: number;
  userName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  items: RequestItem[];
  createdAt: string;
  processedAt?: string;
  rejectReason?: string;
}

export default function AdminRequestsPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    if (user?.role !== "ADMIN") {
      toast.error(t("admin.accessDenied"));
      navigate("/");
      return;
    }

    fetchRequests();
  }, [user, navigate, t]);

  const fetchRequests = async () => {
    try {
      const response = await api.get("/requests/admin/all");
      setRequests(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || t("requests.failedToLoad")
        );
      } else {
        setError(t("auth.unknownError"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: number) => {
    try {
      await api.post(`/requests/admin/${requestId}/approve`);
      toast.success(t("admin.requests.approved"));
      fetchRequests();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || t("admin.requests.approveFailed"));
      } else {
        toast.error(t("auth.unknownError"));
      }
    }
  };

  const handleRejectSubmit = async (requestId: number) => {
    if (!rejectReason.trim()) {
      toast.error("반려 사유를 입력해주세요.");
      return;
    }

    try {
      await api.post(`/requests/admin/${requestId}/reject`, {
        reason: rejectReason,
      });
      toast.success(t("admin.requests.rejected"));
      setRejectingId(null);
      setRejectReason("");
      fetchRequests();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || t("admin.requests.rejectFailed"));
      } else {
        toast.error(t("auth.unknownError"));
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
            {t("requests.status.pending")}
          </span>
        );
      case "APPROVED":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            {t("requests.status.approved")}
          </span>
        );
      case "REJECTED":
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full">
            {t("requests.status.rejected")}
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === "ja" ? "ja-JP" : "ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const stats = {
    pending: requests.filter((r) => r.status === "PENDING").length,
    approved: requests.filter((r) => r.status === "APPROVED").length,
    rejected: requests.filter((r) => r.status === "REJECTED").length,
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-red-50 border border-red-200 p-4 rounded text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="bg-white p-4 border border-slate-300 rounded mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">{t("admin.requests.title")}</h2>
        <p className="text-sm text-slate-500 mt-1">
          {t("admin.requests.subtitle")}
        </p>
      </div>

      {/* 통계 */}
      <div className="bg-white border border-slate-300 rounded mb-4 p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="border border-slate-300 rounded p-3 border-l-4 border-l-yellow-500">
            <div className="text-xs text-slate-500 font-bold">처리 대기</div>
            <div className="text-2xl font-bold text-slate-800 mt-1">
              {stats.pending}{" "}
              <span className="text-sm font-normal text-slate-500">건</span>
            </div>
          </div>
          <div className="border border-slate-300 rounded p-3 border-l-4 border-l-green-500">
            <div className="text-xs text-slate-500 font-bold">승인 완료</div>
            <div className="text-2xl font-bold text-slate-800 mt-1">
              {stats.approved}{" "}
              <span className="text-sm font-normal text-slate-500">건</span>
            </div>
          </div>
          <div className="border border-slate-300 rounded p-3 border-l-4 border-l-red-500">
            <div className="text-xs text-slate-500 font-bold">반려</div>
            <div className="text-2xl font-bold text-slate-800 mt-1">
              {stats.rejected}{" "}
              <span className="text-sm font-normal text-slate-500">건</span>
            </div>
          </div>
        </div>
      </div>

      {/* 신청 목록 */}
      {requests.length === 0 ? (
        <div className="bg-white border border-slate-300 rounded p-12 text-center text-slate-500">
          {t("admin.requests.noRequests")}
        </div>
      ) : (
        <div className="space-y-4">
          {requests
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((request) => (
              <div
                key={request.id}
                className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden"
              >
                {/* 헤더 */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-600">
                      {t("admin.requests.applicant")}:{" "}
                      <span className="font-medium">{request.userName}</span>
                    </span>
                    <span className="text-sm text-slate-600">
                      {t("requests.requestDate")}: {formatDate(request.createdAt)}
                    </span>
                    {request.processedAt && (
                      <span className="text-sm text-slate-600">
                        {t("requests.processedDate")}: {formatDate(request.processedAt)}
                      </span>
                    )}
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                {/* 비품 목록 */}
                <div className="p-4">
                  <div className="space-y-2 mb-4">
                    {request.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-slate-800 font-medium">
                          {item.equipmentName}
                        </span>
                        <span className="text-slate-600">
                          {t("equipment.stockCount", { count: item.quantity })}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* 반려 사유 */}
                  {request.status === "REJECTED" && request.rejectReason && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                      <p className="text-xs text-red-600 font-medium mb-1">
                        {t("requests.rejectReason")}
                      </p>
                      <p className="text-sm text-red-700">
                        {request.rejectReason}
                      </p>
                    </div>
                  )}

                  {/* 승인/반려 버튼 (PENDING인 경우만) */}
                  {request.status === "PENDING" && (
                    <div className="border-t border-slate-200 pt-4">
                      {rejectingId === request.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder={t("admin.requests.rejectReasonPlaceholder")}
                            className="w-full border border-slate-300 rounded p-3 text-sm"
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleRejectSubmit(request.id)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              {t("admin.requests.reject")}
                            </Button>
                            <Button
                              onClick={() => {
                                setRejectingId(null);
                                setRejectReason("");
                              }}
                              className="bg-slate-200 hover:bg-slate-300 text-slate-700"
                            >
                              {t("common.cancel")}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <ConfirmButton
                            buttonTitle={t("admin.requests.approve")}
                            buttonClassName="bg-green-600 hover:bg-green-700 text-white"
                            alertTitle={t("admin.requests.approve") + "?"}
                            alertDescription=""
                            confirmText={t("admin.requests.approve")}
                            onConfirm={() => handleApprove(request.id)}
                          />
                          <Button
                            onClick={() => setRejectingId(request.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            {t("admin.requests.reject")}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
