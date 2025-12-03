import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";
import axios from "axios";

export default function SignupPage() {
  const navigate = useNavigate();
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

      // 회원가입 성공 시 toast 표시
      toast.success("회원가입이 완료되었습니다!");

      // toast를 보여주고 로그인 페이지로 이동
      navigate("/login");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message || "회원가입에 실패했습니다.";
        setError(errorMessage);
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-200 p-4 min-h-screen">
      <div className="bg-white p-8 rounded border border-slate-300 shadow-sm max-w-md w-full">
        <h2 className="text-xl font-bold mb-1 text-slate-800 text-center">
          회원가입
        </h2>
        <p className="text-slate-500 mb-8 text-sm text-center">Sign Up</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              이름
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded"
              placeholder="홍길동"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              이메일
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
            {loading ? "가입 중..." : "가입하기"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
