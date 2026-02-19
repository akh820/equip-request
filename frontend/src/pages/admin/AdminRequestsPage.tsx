import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";
import axios from "axios";
import Loading from "@/common/Loading";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ConfirmButton } from "@/components/ui/alert-dialog";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";

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
  status: "PENDING" | "APPROVED" | "REJECTED" | "RETURNED";
  items: RequestItem[];
  createdAt: string;
  processedAt?: string;
  rejectReason?: string;
  returnToken?: string;
  returnedAt?: string;
}

interface ReturnInfo {
  tokenStatus: string;
  requestId: number;
  userName: string;
  items: { equipmentName: string; quantity: number }[];
  approvedAt: string;
  expiresAt: string;
  returnedAt?: string;
}

export default function AdminRequestsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // QR 코드 팝업
  const [qrModalToken, setQrModalToken] = useState<string | null>(null);

  // 반납 확인 모달 (QR 스캔 후)
  const [returnInfo, setReturnInfo] = useState<ReturnInfo | null>(null);
  const [returnConfirmLoading, setReturnConfirmLoading] = useState(false);

  useEffect(() => {
    if (user?.role !== "ADMIN") {
      toast.error(t("admin.accessDenied"));
      navigate("/");
      return;
    }

    fetchRequests();

    // QR 스캔 후 returnToken 쿼리 파라미터가 있으면 반납 정보 조회
    const returnToken = searchParams.get("returnToken");
    if (returnToken) {
      fetchReturnInfo(returnToken);
    }
  }, [user, navigate, t]);

  const fetchRequests = async () => {
    try {
      const response = await api.get("/requests/admin/all");
      setRequests(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || t("requests.failedToLoad"));
      } else {
        setError(t("auth.unknownError"));
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchReturnInfo = async (token: string) => {
    try {
      const response = await api.get(`/requests/admin/return?token=${token}`);
      setReturnInfo(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || t("return.returnFailed"));
      } else {
        toast.error(t("auth.unknownError"));
      }
    }
  };

  const handleConfirmReturn = async () => {
    const token = searchParams.get("returnToken");
    if (!token) return;

    setReturnConfirmLoading(true);
    try {
      await api.post(`/requests/admin/return/confirm?token=${token}`);
      toast.success(t("return.success"));
      setReturnInfo(null);
      navigate("/admin/requests", { replace: true });
      fetchRequests();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data || t("return.returnFailed"));
      } else {
        toast.error(t("auth.unknownError"));
      }
    } finally {
      setReturnConfirmLoading(false);
    }
  };

  const handleApprove = async (requestId: number) => {
    try {
      await api.post(`/requests/admin/${requestId}/approve`);
      toast.success(t("admin.requests.approved"));
      fetchRequests();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(
          err.response?.data?.message || t("admin.requests.approveFailed")
        );
      } else {
        toast.error(t("auth.unknownError"));
      }
    }
  };

  const handleRejectSubmit = async (requestId: number) => {
    if (!rejectReason.trim()) {
      toast.error(t("admin.requests.rejectReasonPlaceholder"));
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
        toast.error(
          err.response?.data?.message || t("admin.requests.rejectFailed")
        );
      } else {
        toast.error(t("auth.unknownError"));
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="px-3 rounded py-1 bg-amber-50 text-amber-700 text-xs border border-amber-200">
            {t("requests.status.pending")}
          </span>
        );
      case "APPROVED":
        return (
          <span className="px-3 rounded py-1 bg-blue-50 text-blue-700 text-xs border border-blue-200">
            {t("requests.status.approved")}
          </span>
        );
      case "REJECTED":
        return (
          <span className="px-3 rounded py-1 bg-red-100 text-red-600 text-xs border border-red-200">
            {t("requests.status.rejected")}
          </span>
        );
      case "RETURNED":
        return (
          <span className="px-3 rounded py-1 bg-emerald-50 text-emerald-700 text-xs border border-emerald-200">
            {t("requests.status.returned")}
          </span>
        );
      default:
        return (
          <span className="px-3 rounded py-1 bg-neutral-100 text-neutral-700 text-xs">
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

  const getQrUrl = (token: string) => {
    return `${window.location.origin}/admin/requests?returnToken=${token}`;
  };

  const stats = {
    pending: requests.filter((r) => r.status === "PENDING").length,
    approved: requests.filter((r) => r.status === "APPROVED").length,
    rejected: requests.filter((r) => r.status === "REJECTED").length,
    returned: requests.filter((r) => r.status === "RETURNED").length,
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-neutral-100 rounded-sm border border-neutral-200 p-4 text-neutral-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="bg-white p-4 rounded-sm border border-neutral-200 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-neutral-700">
          {t("admin.requests.title")}
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          {/* {t("admin.requests.subtitle")} */}
        </p>
      </div>

      {/* 통계 */}
      <div className="bg-white rounded-sm border border-neutral-200 mb-4 p-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-sm border border-neutral-200 p-3 border-l-4 border-l-amber-400">
            <div className="text-xs text-neutral-500 font-bold">
              {t("requests.stats.pending")}
            </div>
            <div className="text-2xl font-bold text-neutral-700 mt-1">
              {stats.pending}{" "}
              <span className="text-sm font-normal text-neutral-500">
                {i18n.language === "ja" ? "件" : "건"}
              </span>
            </div>
          </div>
          <div className="rounded-sm border border-neutral-200 p-3 border-l-4 border-l-blue-400">
            <div className="text-xs text-neutral-500 font-bold">
              {t("requests.stats.approved")}
            </div>
            <div className="text-2xl font-bold text-neutral-700 mt-1">
              {stats.approved}{" "}
              <span className="text-sm font-normal text-neutral-500">
                {i18n.language === "ja" ? "件" : "건"}
              </span>
            </div>
          </div>
          <div className="rounded-sm border border-neutral-200 p-3 border-l-4 border-l-red-400">
            <div className="text-xs text-neutral-500 font-bold">
              {t("requests.stats.rejected")}
            </div>
            <div className="text-2xl font-bold text-neutral-700 mt-1">
              {stats.rejected}{" "}
              <span className="text-sm font-normal text-neutral-500">
                {i18n.language === "ja" ? "件" : "건"}
              </span>
            </div>
          </div>
          <div className="rounded-sm border border-neutral-200 p-3 border-l-4 border-l-emerald-400">
            <div className="text-xs text-neutral-500 font-bold">
              {t("requests.stats.returned")}
            </div>
            <div className="text-2xl font-bold text-neutral-700 mt-1">
              {stats.returned}{" "}
              <span className="text-sm font-normal text-neutral-500">
                {i18n.language === "ja" ? "件" : "건"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 신청 목록 */}
      {requests.length === 0 ? (
        <div className="bg-white rounded-sm border border-neutral-200 p-12 text-center text-neutral-500">
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
                className="bg-white rounded-sm border border-neutral-200 shadow-sm overflow-hidden"
              >
                {/* 헤더 */}
                <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-neutral-50">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-neutral-600">
                      {t("admin.requests.applicant")}:{" "}
                      <span className="font-medium">{request.userName}</span>
                    </span>
                    <span className="text-sm text-neutral-600">
                      {t("requests.requestDate")}:{" "}
                      {formatDate(request.createdAt)}
                    </span>
                    {request.processedAt && (
                      <span className="text-sm text-neutral-600">
                        {t("requests.processedDate")}:{" "}
                        {formatDate(request.processedAt)}
                      </span>
                    )}
                    {request.returnedAt && (
                      <span className="text-sm text-neutral-600">
                        {t("return.returnedAt")}:{" "}
                        {formatDate(request.returnedAt)}
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
                        <span className="text-neutral-700 font-medium">
                          {item.equipmentName}
                        </span>
                        <span className="text-neutral-600">
                          {t("equipment.stockCount", { count: item.quantity })}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* 반려 사유 */}
                  {request.status === "REJECTED" && request.rejectReason && (
                    <div className="mb-4 p-3 bg-neutral-100 border border-red-200 rounded">
                      <p className="text-xs text-red-600 font-medium mb-1">
                        {t("requests.rejectReason")}
                      </p>
                      <p className="text-sm text-black">
                        {request.rejectReason}
                      </p>
                    </div>
                  )}

                  {/* 승인/반려 버튼 (PENDING인 경우만) */}
                  {request.status === "PENDING" && (
                    <div className="border-t border-neutral-200 pt-4">
                      {rejectingId === request.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder={t(
                              "admin.requests.rejectReasonPlaceholder"
                            )}
                            className="w-full rounded-sm border border-neutral-200 p-3 text-sm"
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleRejectSubmit(request.id)}
                              className="bg-red-500 hover:bg-red-600 text-white rounded"
                            >
                              {t("admin.requests.reject")}
                            </Button>
                            <Button
                              onClick={() => {
                                setRejectingId(null);
                                setRejectReason("");
                              }}
                              className="bg-neutral-200 rounded hover:bg-neutral-300 text-neutral-700"
                            >
                              {t("common.cancel")}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <ConfirmButton
                            buttonTitle={t("admin.requests.approve")}
                            buttonClassName="bg-green-500 rounded hover:bg-green-600 text-white"
                            alertTitle={t("admin.requests.approveConfirm")}
                            alertDescription=""
                            cancelText={t("common.cancel")}
                            confirmText={t("admin.requests.approve")}
                            onConfirm={() => handleApprove(request.id)}
                          />
                          <Button
                            onClick={() => setRejectingId(request.id)}
                            className="bg-red-500 rounded hover:bg-red-600 text-white"
                          >
                            {t("admin.requests.reject")}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 반납 QR 버튼 (APPROVED인 경우만) */}
                  {request.status === "APPROVED" && request.returnToken && (
                    <div className="border-t border-neutral-200 pt-4">
                      <Button
                        onClick={() => setQrModalToken(request.returnToken!)}
                        className="rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
                      >
                        {t("return.showQR")}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* QR 코드 팝업 */}
      {qrModalToken && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setQrModalToken(null)}
        >
          <div
            className="bg-white rounded-sm border border-neutral-200 p-6 max-w-sm w-full mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-neutral-700 mb-1">
              {t("return.qrTitle")}
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              {t("return.qrDescription")}
            </p>
            <div className="flex justify-center p-4 bg-white border border-neutral-200 rounded">
              <QRCode value={getQrUrl(qrModalToken)} size={200} />
            </div>
            <Button
              onClick={() => setQrModalToken(null)}
              className="mt-4 w-full rounded bg-neutral-700 hover:bg-neutral-800 text-white"
            >
              {t("return.close")}
            </Button>
          </div>
        </div>
      )}

      {/* 반납 확인 모달 (QR 스캔 후 자동 표시) */}
      {returnInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm border border-neutral-200 p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-base font-bold text-neutral-700 mb-4">
              {t("return.confirmTitle")}
            </h3>

            {returnInfo.tokenStatus === "ALREADY_RETURNED" && (
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded text-sm text-neutral-600 mb-4">
                {t("return.alreadyReturned")}
                {returnInfo.returnedAt && (
                  <span className="block mt-1 text-xs">
                    {t("return.returnedAt")}: {formatDate(returnInfo.returnedAt)}
                  </span>
                )}
              </div>
            )}

            {returnInfo.tokenStatus === "EXPIRED" && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-700 mb-4">
                {t("return.expired")}
              </div>
            )}

            {returnInfo.tokenStatus === "NOT_FOUND" && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600 mb-4">
                {t("return.invalid")}
              </div>
            )}

            {returnInfo.tokenStatus === "VALID" && (
              <>
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">{t("return.requester")}</span>
                    <span className="font-medium text-neutral-700">{returnInfo.userName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">{t("return.approvedAt")}</span>
                    <span className="text-neutral-700">{formatDate(returnInfo.approvedAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">{t("return.expiresAt")}</span>
                    <span className="text-neutral-700">{formatDate(returnInfo.expiresAt)}</span>
                  </div>
                </div>
                <div className="mb-4 p-3 bg-neutral-50 border border-neutral-200 rounded">
                  <p className="text-xs text-neutral-500 font-medium mb-2">{t("return.items")}</p>
                  <div className="space-y-1">
                    {returnInfo.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-neutral-700">{item.equipmentName}</span>
                        <span className="text-neutral-500">
                          {t("equipment.stockCount", { count: item.quantity })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <Button
                  onClick={handleConfirmReturn}
                  disabled={returnConfirmLoading}
                  className="w-full rounded bg-emerald-600 hover:bg-emerald-700 text-white mb-2"
                >
                  {returnConfirmLoading ? t("common.loading") : t("return.confirm")}
                </Button>
              </>
            )}

            <Button
              onClick={() => {
                setReturnInfo(null);
                navigate("/admin/requests", { replace: true });
              }}
              className="w-full rounded bg-neutral-200 hover:bg-neutral-300 text-neutral-700"
            >
              {t("return.close")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
