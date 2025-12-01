import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

interface CartState {
  items: CartItem[];

  addItem: (item: CartItem) => void;
  removeItem: (equipmentId: number) => void;
  updateQuantity: (equipmentId: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      // 장바구니에 아이템 추가
      addItem: (newItem) =>
        set((state) => {
          // 이미 장바구니에 있는 상품인지 확인
          const existingItemIndex = state.items.findIndex(
            (item) => item.equipmentId === newItem.equipmentId
          );

          if (existingItemIndex >= 0) {
            // 이미 있으면 수량만 증가
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += newItem.quantity;
            return { items: updatedItems };
          } else {
            // 없으면 새로 추가
            return { items: [...state.items, newItem] };
          }
        }),

      // 장바구니에서 아이템 제거
      removeItem: (equipmentId) =>
        set((state) => ({
          items: state.items.filter((item) => item.equipmentId !== equipmentId),
        })),

      // 특정 아이템의 수량 변경
      updateQuantity: (equipmentId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.equipmentId === equipmentId ? { ...item, quantity } : item
          ),
        })),

      // 장바구니 전체 비우기 (신청 완료 후 호출)
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
    }
  )
);
