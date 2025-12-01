import { Link } from "react-router";

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center bg-slate-200 p-4 min-h-screen">
      <div className="bg-white p-8 rounded border border-slate-300 shadow-sm max-w-md w-full">
        <h2 className="text-xl font-bold mb-1 text-slate-800 text-center">
          사내 비품 관리 시스템
        </h2>
        <p className="text-slate-500 mb-8 text-sm text-center">
          Internal Equipment Management System
        </p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              이메일
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-slate-500"
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              비밀번호
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-slate-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-slate-700 hover:bg-slate-800 text-white rounded font-medium transition text-sm"
          >
            로그인
          </button>
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
