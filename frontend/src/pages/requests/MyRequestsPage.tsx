import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router";
import api from "@/lib/api";
import axios from "axios";
import Loading from "@/common/Loading";
import { Button } from "@/components/ui/button";
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

export default function MyRequestsPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const response = await api.get("/requests/my");
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

    fetchRequests();
  }, [user, navigate, t]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs rounded border border-amber-200">
            {t("requests.status.pending")}
          </span>
        );
      case "APPROVED":
        return (
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs rounded border border-emerald-200">
            {t("requests.status.approved")}
          </span>
        );
      case "REJECTED":
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded border border-red-200">
            {t("requests.status.rejected")}
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded bg-neutral-100 text-neutral-700 text-xs">
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

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="bg-neutral-100 rounded-sm border border-neutral-200 p-4 text-neutral-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="bg-white p-4 rounded-sm border border-neutral-200 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-neutral-700">
          {t("requests.myTitle")}
        </h2>
        {/* <p className="text-sm text-neutral-500 mt-1">{t("requests.mySubtitle")}</p> */}
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-sm border border-neutral-200 p-12 text-center text-neutral-500">
          <p className="mb-4">{t("requests.noRequests")}</p>
          <Button
            onClick={() => navigate("/equipment")}
            className="rounded bg-neutral-700 hover:bg-neutral-800 text-white"
          >
            {t("cart.viewEquipment")}
          </Button>
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
                <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-neutral-50">
                  <div className="flex items-center gap-4">
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
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                <div className="p-4">
                  <div className="space-y-2">
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

                  {request.status === "REJECTED" && request.rejectReason && (
                    <div className="mt-4 p-3 bg-neutral-50 border border-red-200 rounded">
                      <p className="text-xs text-red-600 font-medium mb-1">
                        {t("requests.rejectReason")}
                      </p>
                      <p className="text-sm text-black">
                        {request.rejectReason}
                      </p>
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
