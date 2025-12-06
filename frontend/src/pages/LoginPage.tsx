import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
              placeholder="user@test.com"
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
              placeholder="••••••••"
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

        <div className="mt-8 pt-4 border-t text-xs text-slate-400 text-center">
          {t("auth.authorizedOnly")}
        </div>
      </div>
    </div>
  );
}

