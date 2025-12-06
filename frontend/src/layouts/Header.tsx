import { Link, NavLink, useNavigate } from "react-router";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { ShoppingCart, LogOut, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Header() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items } = useCartStore();

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const isAdmin = user?.role === "ADMIN";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "ko" ? "ja" : "ko";
    i18n.changeLanguage(newLang);
  };

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 h-full flex items-center text-sm font-medium ${
      isActive
        ? "bg-neutral-700 text-white border-b-2 border-neutral-400"
        : "text-neutral-300 hover:bg-neutral-700 hover:text-white"
    }`;

  return (
    <header className="bg-neutral-800 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex justify-between items-center">
        <Link
          to="/equipment"
          className="ml-3 flex items-center gap-3 hover:opacity-90"
        >
          <span className="font-bold text-lg tracking-tight">
            {t("header.systemName")}
          </span>
        </Link>

        <nav className="hidden md:flex h-full">
          <NavLink to="/equipment" className={getNavLinkClass}>
            {t("header.equipmentList")}
          </NavLink>

          {isAuthenticated && !isAdmin && (
            <NavLink to="/my-requests" className={getNavLinkClass}>
              {t("header.myRequests")}
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/admin" className={getNavLinkClass}>
              {t("header.admin")}
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-4 text-sm">
          {/* 언어 전환 버튼 */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 text-neutral-300 hover:text-white transition"
            title={t(`language.${i18n.language === "ko" ? "ja" : "ko"}`)}
          >
            <Globe size={16} />
            <span className="text-xs">
              {i18n.language === "ko" ? "日本語" : "한국어"}
            </span>
          </button>

          <div className="w-px h-4 bg-neutral-600"></div>

          {isAuthenticated ? (
            <>
              {!isAdmin && (
                <>
                  <NavLink
                    to="/cart"
                    className={({ isActive }) =>
                      `flex items-center gap-1 transition ${
                        isActive ? "text-neutral-100" : "hover:text-neutral-100"
                      }`
                    }
                  >
                    <ShoppingCart size={16} />
                    <span>{t("header.cart")}</span>
                    {cartCount > 0 && (
                      <span className="bg-neutral-600 text-white text-xs px-1.5  min-w-[20px] text-center">
                        {cartCount}
                      </span>
                    )}
                  </NavLink>

                  <div className="w-px h-4 bg-neutral-600"></div>
                </>
              )}

              <div className="flex items-center gap-2">
                <span className="text-neutral-200">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-neutral-400 hover:text-white text-xs rounded-sm border border-neutral-500 px-2 py-0.5 flex items-center gap-1 transition"
                >
                  <LogOut size={12} />
                  {t("common.logout")}
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="text-neutral-300 hover:text-white rounded-sm border border-neutral-500 px-3 py-1 rounded-sm transition"
            >
              {t("common.login")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

