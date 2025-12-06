import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { Globe } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === "ko" ? "ja" : "ko";
    i18n.changeLanguage(newLang);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      const {
        id,
        name,
        email: userEmail,
        role,
        accessToken,
        refreshToken,
      } = response.data;

      setAuth({ id, name, email: userEmail, role }, accessToken, refreshToken);

      navigate("/equipment");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message || t("auth.loginFailed");
        setError(errorMessage);
      } else {
        setError(t("auth.unknownError"));
      }
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-200 p-4 min-h-screen">
      <div className="bg-white p-8 rounded border border-slate-300 shadow-sm max-w-md w-full">
        <h2 className="text-xl font-bold mb-1 text-slate-800 text-center">
          {t("auth.loginTitle")}
        </h2>
        <p className="text-slate-500 mb-8 text-sm text-center">
          {t("auth.loginSubtitle")}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t("common.email")}
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded"
              placeholder="user@test.com / admin@test.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t("common.password")}
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded"
              placeholder="user : 1111 / admin : 1111"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full my-5 py-5 bg-slate-700 hover:bg-slate-800 text-white rounded font-medium transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t("auth.loggingIn") : t("auth.loginButton")}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          {t("auth.noAccount")}{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            {t("common.signup")}
          </Link>
        </div>

        {/* 언어 전환 버튼 */}
        <div className="flex flex-col items-center mt-2">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 text-slate-700 hover:text-blue-500 transition"
            title={t(`language.${i18n.language === "ko" ? "ja" : "ko"}`)}
          >
            <Globe size={16} />
            <span className="text-xs">
              {i18n.language === "ko" ? "日本語" : "한국어"}
            </span>
          </button>
        </div>

        <div className="mt-4 pt-4 border-t text-xs text-slate-400 text-center">
          {t("auth.authorizedOnly")}
        </div>
      </div>
    </div>
  );
}
