import { Link } from "react-router";

export default function SignupPage() {
  return (
    <div className="flex-1 flex items-center justify-center bg-slate-200 p-4 min-h-screen">
      <div className="bg-white p-8 rounded border border-slate-300 shadow-sm max-w-md w-full">
        <h2 className="text-xl font-bold mb-1 text-slate-800 text-center">
          회원가입
        </h2>
        <p className="text-slate-500 mb-8 text-sm text-center">
          Sign Up
        </p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              이름
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-slate-500"
              placeholder="홍길동"
            />
          </div>
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
            가입하기
          </button>
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
