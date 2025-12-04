import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router";
import api from "@/lib/api";
import axios from "axios";
import Loading from "@/common/Loading";
import { Button } from "@/components/ui/button";

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
          setError(
            err.response?.data?.message ||
              "신청 내역을 불러오는데 실패했습니다."
          );
        } else {
          setError("알 수 없는 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user, navigate]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
            대기 중
          </span>
        );
      case "APPROVED":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            승인됨
          </span>
        );
      case "REJECTED":
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full">
            반려됨
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
    return date.toLocaleDateString("ko-KR", {
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
        <div className="bg-red-50 border border-red-200 p-4 rounded text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="bg-white p-4 border border-slate-300 rounded mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">내 신청 내역</h2>
        <p className="text-sm text-slate-500 mt-1">My Requests</p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white border border-slate-300 rounded p-12 text-center text-slate-500">
          <p className="mb-4">신청 내역이 없습니다.</p>
          <Button
            onClick={() => navigate("/equipment")}
            className="bg-slate-700 hover:bg-slate-800 text-white"
          >
            비품 목록 보기
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
                className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden"
              >
                {/* 헤더 */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-600">
                      신청일: {formatDate(request.createdAt)}
                    </span>
                    {request.processedAt && (
                      <span className="text-sm text-slate-600">
                        처리일: {formatDate(request.processedAt)}
                      </span>
                    )}
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                {/* 비품 목록 */}
                <div className="p-4">
                  <div className="space-y-2">
                    {request.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-slate-800 font-medium">
                          {item.equipmentName}
                        </span>
                        <span className="text-slate-600">
                          {item.quantity}개
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* 반려 사유 */}
                  {request.status === "REJECTED" && request.rejectReason && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                      <p className="text-xs text-red-600 font-medium mb-1">
                        반려 사유
                      </p>
                      <p className="text-sm text-red-700">
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
