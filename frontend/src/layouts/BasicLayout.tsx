import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { ShoppingCart, LogOut } from "lucide-react";

export default function BasicLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items } = useCartStore();

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const isAdmin = user?.role === "ADMIN";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 네비게이션 활성 체크 (정확한 경로 매칭)
  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="bg-slate-100 text-slate-800 min-h-screen flex flex-col text-sm">
      {/* Header - Enterprise Dark Style */}
      <header className="bg-slate-800 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90">
            <div className="w-8 h-8 bg-white text-slate-800 rounded flex items-center justify-center font-bold">
              EQ
            </div>
            <span className="font-bold text-lg tracking-tight">
              사내비품관리시스템
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex h-full">
            <Link
              to="/"
              className={`px-4 h-full flex items-center text-sm font-medium ${
                location.pathname === "/"
                  ? "bg-slate-700 text-white border-b-2 border-blue-400"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              홈
            </Link>
            <Link
              to="/equipment"
              className={`px-4 h-full flex items-center text-sm font-medium ${
                isActive("/equipment")
                  ? "bg-slate-700 text-white border-b-2 border-blue-400"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              비품목록
            </Link>
            {isAuthenticated && (
              <Link
                to="/my-requests"
                className={`px-4 h-full flex items-center text-sm font-medium ${
                  isActive("/my-requests")
                    ? "bg-slate-700 text-white border-b-2 border-blue-400"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                신청내역
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin/equipment"
                className={`px-4 h-full flex items-center text-sm font-medium ${
                  isActive("/admin")
                    ? "bg-slate-700 text-white border-b-2 border-blue-400"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                관리자
              </Link>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4 text-sm">
            {isAuthenticated ? (
              <>
                <Link
                  to="/cart"
                  className="flex items-center gap-1 hover:text-blue-300 transition"
                >
                  <ShoppingCart size={16} />
                  <span>장바구니</span>
                  {cartCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs px-1.5 rounded-full min-w-[20px] text-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <div className="w-px h-4 bg-slate-600"></div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-200">{user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-slate-400 hover:text-white text-xs border border-slate-500 px-2 py-0.5 rounded flex items-center gap-1 transition"
                  >
                    <LogOut size={12} />
                    로그아웃
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="text-slate-300 hover:text-white border border-slate-500 px-3 py-1 rounded transition"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-slate-100">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-400 py-4 text-xs text-center border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4">
          Internal Equipment Management System © 2024
        </div>
      </footer>
    </div>
  );
}
