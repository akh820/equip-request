import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import BasicLayout from "@/layouts/BasicLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Loading from "@/common/Loading";

const HomePage = lazy(() => import("@/pages/HomePage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const SignupPage = lazy(() => import("@/pages/SignupPage"));
const EquipmentListPage = lazy(
  () => import("@/pages/equipment/EquipmentListPage")
);
const EquipmentDetailPage = lazy(
  () => import("@/pages/equipment/EquipmentDetailPage")
);
const CartPage = lazy(() => import("@/pages/cart/CartPage"));
const MyRequestsPage = lazy(() => import("@/pages/requests/MyRequestsPage"));
const AdminPage = lazy(() => import("@/pages/admin/AdminPage"));
const AdminEquipmentPage = lazy(
  () => import("@/pages/admin/AdminEquipmentPage")
);
const AdminRequestsPage = lazy(() => import("@/pages/admin/AdminRequestsPage"));

const router = createBrowserRouter([
  // 로그인, 회원가입 별도 레이아웃
  {
    path: "/login",
    element: (
      <Suspense fallback={<Loading />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "/signup",
    element: (
      <Suspense fallback={<Loading />}>
        <SignupPage />
      </Suspense>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <BasicLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "equipment",
        element: (
          <Suspense fallback={<Loading />}>
            <EquipmentListPage />
          </Suspense>
        ),
      },
      {
        path: "equipment/:id",
        element: (
          <Suspense fallback={<Loading />}>
            <EquipmentDetailPage />
          </Suspense>
        ),
      },
      {
        path: "cart",
        element: (
          <Suspense fallback={<Loading />}>
            <CartPage />
          </Suspense>
        ),
      },
      {
        path: "my-requests",
        element: (
          <Suspense fallback={<Loading />}>
            <MyRequestsPage />
          </Suspense>
        ),
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute adminOnly>
            <Suspense fallback={<Loading />}>
              <AdminPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/equipment",
        element: (
          <ProtectedRoute adminOnly>
            <Suspense fallback={<Loading />}>
              <AdminEquipmentPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/requests",
        element: (
          <ProtectedRoute adminOnly>
            <Suspense fallback={<Loading />}>
              <AdminRequestsPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
