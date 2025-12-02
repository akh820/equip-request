import { Link, NavLink, useNavigate } from "react-router";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { ShoppingCart, LogOut } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items } = useCartStore();

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const isAdmin = user?.role === "ADMIN";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 h-full flex items-center text-sm font-medium ${
      isActive
        ? "bg-slate-700 text-white border-b-2 border-blue-400"
        : "text-slate-300 hover:bg-slate-700 hover:text-white"
    }`;

  return (
    <header className="bg-slate-800 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 hover:opacity-90">
          <div className="w-8 h-8 bg-white text-slate-800 rounded flex items-center justify-center font-bold">
            EQ
          </div>
          <span className="font-bold text-lg tracking-tight">
            사내비품관리시스템
          </span>
        </Link>

        <nav className="hidden md:flex h-full">
          <NavLink to="/" className={getNavLinkClass} end>
            홈
          </NavLink>

          <NavLink to="/equipment" className={getNavLinkClass}>
            비품목록
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/my-requests" className={getNavLinkClass}>
              신청내역
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/admin" className={getNavLinkClass}>
              관리자
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-4 text-sm">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `flex items-center gap-1 transition ${
                    isActive ? "text-blue-300" : "hover:text-blue-300"
                  }`
                }
              >
                <ShoppingCart size={16} />
                <span>장바구니</span>
                {cartCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs px-1.5 rounded-full min-w-[20px] text-center">
                    {cartCount}
                  </span>
                )}
              </NavLink>

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
  );
}
