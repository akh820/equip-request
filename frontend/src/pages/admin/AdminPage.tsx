import { useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { ClipboardList, Package } from "lucide-react";

export default function AdminPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.role !== "ADMIN") {
      toast.error("관리자만 접근 가능합니다.");
      navigate("/");
    }
  }, [user, navigate]);

  const menuItems = [
    {
      title: "신청 관리",
      description: "비품 신청 승인/반려 처리",
      path: "/admin/requests",
      icon: ClipboardList,
      color: "blue",
    },
    {
      title: "비품 관리",
      description: "비품 등록 및 재고 관리",
      path: "/admin/equipment",
      icon: Package,
      color: "blue",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="bg-white p-4 border border-slate-300 rounded mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">관리자 페이지</h2>
        <p className="text-sm text-slate-500 mt-1">Admin Dashboard</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="bg-white border border-slate-300 rounded shadow-sm hover:shadow-md transition-shadow p-6 group"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    item.color === "blue"
                      ? "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
                      : "bg-green-100 text-green-600 group-hover:bg-green-200"
                  } transition-colors`}
                >
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500">{item.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
