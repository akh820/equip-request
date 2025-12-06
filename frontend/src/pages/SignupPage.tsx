import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function SignupPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/signup", { name, email, password });

      toast.success(t("auth.signupSuccess"));
      navigate("/login");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message || t("auth.signupFailed");
        setError(errorMessage);
      } else {
        setError(t("auth.unknownError"));
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-neutral-200 p-4 min-h-screen">
      <div className="bg-white p-8 rounded-sm border border-neutral-200 shadow-sm max-w-md w-full">
        <h2 className="text-xl font-bold mb-1 text-neutral-700 text-center">
          {t("auth.signupTitle")}
        </h2>
        <p className="text-neutral-500 mb-8 text-sm text-center">
          {/* {t("auth.signupSubtitle")} */}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-neutral-100 rounded-sm border border-neutral-200 text-neutral-700 text-sm rounded">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              {t("common.name")}
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded"
              placeholder={t("auth.namePlaceholder")}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              {t("common.email")}
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded"
              placeholder="user@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
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
            className="w-full rounded my-5 py-5 bg-neutral-700 hover:bg-neutral-800 text-white font-medium transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t("auth.signingUp") : t("auth.signupButton")}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-neutral-500">
          {t("auth.hasAccount")}{" "}
          <Link to="/login" className="text-blue-500 hover:underline hover:text-blue-600 font-medium transition">
            {t("common.login")}
          </Link>
        </div>
      </div>
    </div>
  );
}

