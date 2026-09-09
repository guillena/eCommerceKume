/**
 * Cart store using Zustand with localStorage persistence.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem } from '@/types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Computed
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product: Product) => {
        const existing = get().items.find((i) => i.product.id === product.id);
        if (existing) {
          // Products are digital — one copy per purchase
          return;
        }
        set((state) => ({
          items: [...state.items, { product, quantity: 1 }],
          isOpen: true,
        }));
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      totalItems: () => get().items.length,

      totalPrice: () =>
        get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    }),
    {
      name: 'kume-cart',
      skipHydration: true,   // ← prevents SSR/client mismatch
    },
  ),
);
