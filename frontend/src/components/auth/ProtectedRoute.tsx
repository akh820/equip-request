import { useAuthStore } from "@/stores/authStore";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({
  children,
  adminOnly = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 관리자 권한이 필요한데 관리자가 아니면 홈으로 리다이렉트
  if (adminOnly && user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  // 인증 통과 시 자식 컴포넌트 렌더링
  return <>{children}</>;
}
