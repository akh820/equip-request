import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    // 브라우저는 submit 버튼을 누르면 무조건 페이지를 새로고침하여서버로 데이터를 보내려 하기때문에 방지용
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

      // authStore에 저장
      setAuth({ id, name, email: userEmail, role }, accessToken, refreshToken);

      // 홈으로 이동
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-200 p-4 min-h-screen">
      <div className="bg-white p-8 rounded border border-slate-300 shadow-sm max-w-md w-full">
        <h2 className="text-xl font-bold mb-1 text-slate-800 text-center">
          사내 비품 관리 시스템
        </h2>
        <p className="text-slate-500 mb-8 text-sm text-center">
          Internal Equipment Management System
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              이메일
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
              비밀번호
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
            {loading ? "로그인 중..." : "로그인"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          계정이 없으신가요?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            회원가입
          </Link>
        </div>

        <div className="mt-8 pt-4 border-t text-xs text-slate-400 text-center">
          Authorized Personnel Only
        </div>
      </div>
    </div>
  );
}
