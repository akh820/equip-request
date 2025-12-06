import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { useCartStore } from "./cartStore";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateToken: (accessToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) => {
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
        // 로그인 시 이전 사용자의 카트 데이터 초기화
        useCartStore.getState().clearCart();
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        // 로그아웃 시 카트도 함께 초기화
        useCartStore.getState().clearCart();
      },

      updateToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: "auth-storage",
    }
  )
);
