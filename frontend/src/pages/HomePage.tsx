import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { Link } from "react-router";
import { Package, ShoppingCart, ClipboardList, Settings } from "lucide-react";

export default function HomePage() {
  const { user, isAuthenticated } = useAuthStore();
  const { items } = useCartStore();

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  if (!isAuthenticated) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white border border-slate-300 rounded shadow-sm p-12 text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            사내 비품 신청 시스템
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            Internal Equipment Request System
          </p>
          <div className="text-slate-500 mb-8 space-y-2">
            <p>비품이 필요하신가요? 간편하게 신청하세요.</p>
            <p>관리자 승인 후 수령 가능합니다.</p>
          </div>
          <div className="flex gap-4 justify-center">
            <Link
              to="/login"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white rounded font-medium transition"
            >
              로그인
            </Link>
            <Link
              to="/signup"
              className="px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded font-medium transition"
            >
              회원가입
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const quickLinks = [
    {
      title: "비품 목록",
      description: "필요한 비품을 찾아보세요",
      path: "/equipment",
      icon: Package,
      color: "blue",
    },
    {
      title: "장바구니",
      description: `${cartCount}개 항목`,
      path: "/cart",
      icon: ShoppingCart,
      color: "green",
    },
    {
      title: "신청 내역",
      description: "내 신청 상태를 확인하세요",
      path: "/my-requests",
      icon: ClipboardList,
      color: "purple",
    },
  ];

  if (user?.role === "ADMIN") {
    quickLinks.push({
      title: "관리자 페이지",
      description: "비품 및 신청 관리",
      path: "/admin",
      icon: Settings,
      color: "red",
    });
  }

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-100 text-blue-600 group-hover:bg-blue-200";
      case "green":
        return "bg-green-100 text-green-600 group-hover:bg-green-200";
      case "purple":
        return "bg-purple-100 text-purple-600 group-hover:bg-purple-200";
      case "red":
        return "bg-red-100 text-red-600 group-hover:bg-red-200";
      default:
        return "bg-slate-100 text-slate-600 group-hover:bg-slate-200";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* 환영 메시지 */}
      <div className="bg-white border border-slate-300 rounded shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          환영합니다, {user?.name}님! 👋
        </h1>
        <p className="text-slate-600">
          필요한 비품을 신청하고 관리할 수 있습니다.
        </p>
      </div>

      {/* 빠른 링크 */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4">빠른 링크</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className="bg-white border border-slate-300 rounded shadow-sm hover:shadow-md transition-all p-6 group"
              >
                <div className="flex flex-col items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(
                      link.color
                    )} transition-colors`}
                  >
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1 group-hover:text-slate-900">
                      {link.title}
                    </h3>
                    <p className="text-xs text-slate-500">{link.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 안내 사항 */}
      <div className="mt-6 bg-slate-50 border border-slate-200 rounded p-4">
        <h3 className="text-sm font-bold text-slate-700 mb-2">
          📌 이용 안내
        </h3>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• 비품 목록에서 필요한 비품을 장바구니에 담아주세요.</li>
          <li>• 장바구니에서 수량을 조절하고 신청하기를 클릭하세요.</li>
          <li>• 관리자 승인 후 수령이 가능합니다.</li>
          <li>• 신청 내역에서 승인 상태를 확인할 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}
