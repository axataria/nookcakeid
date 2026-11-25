import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CartItem,
  CartItemAddon,
  PreOrderSlot,
  Product,
} from "@/types/catalog";
import { INITIAL_PREORDER_SLOTS } from "@/data/catalogData";

interface CartState {
  // Slots
  slots: PreOrderSlot[];
  selectedSlot: PreOrderSlot | null;
  setSelectedSlot: (slot: PreOrderSlot) => void;

  // Cart Items
  items: CartItem[];
  addItem: (
    product: Product,
    quantity?: number,
    addons?: CartItemAddon[],
    customNote?: string,
  ) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;

  // Drawer UI state
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Computed Values
  getTotalCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      slots: INITIAL_PREORDER_SLOTS,
      selectedSlot: INITIAL_PREORDER_SLOTS[0] || null, // Default to earliest open slot

      setSelectedSlot: (slot) => {
        if (slot.isSoldOut || slot.isCutOff) return;
        set({ selectedSlot: slot });
      },

      items: [],

      addItem: (product, quantity = 1, addons = [], customNote = "") => {
        const { items } = get();
        const units = (v: string) =>
          v === "WHOLE" ? 20 : v === "SLICE" ? 4 : 5;
        if (
          !Number.isInteger(quantity) ||
          quantity < 1 ||
          items.reduce((n, i) => n + units(i.variant) * i.quantity, 0) +
            units(product.variant) * quantity >
            80
        )
          return;

        // Unique identifier combining product ID, addons, and notes
        const addonKey = addons
          .map((a) => a.sauceId)
          .sort()
          .join("-");
        const cartItemId = `${product.id}-${addonKey}-${customNote.trim()}`;

        const existingIndex = items.findIndex(
          (i) => i.cartItemId === cartItemId,
        );

        const effectiveUnitPrice = product.promoPrice ?? product.price;
        const addonsPriceTotal = addons.reduce((sum, a) => sum + a.price, 0);
        const itemPrice = effectiveUnitPrice + addonsPriceTotal;

        if (existingIndex > -1) {
          const updatedItems = [...items];
          updatedItems[existingIndex].quantity += quantity;
          set({ items: updatedItems, isCartDrawerOpen: true });
        } else {
          const newItem: CartItem = {
            cartItemId,
            productId: product.id,
            name: product.name,
            variant: product.variant,
            unitPrice: itemPrice,
            quantity,
            selectedAddons: addons,
            customNote: customNote.trim() || undefined,
          };
          set({ items: [...items, newItem], isCartDrawerOpen: true });
        }
      },

      updateQuantity: (cartItemId, quantity) => {
        const { items } = get();
        if (quantity <= 0) {
          set({ items: items.filter((i) => i.cartItemId !== cartItemId) });
          return;
        }

        const units = (v: string) =>
          v === "WHOLE" ? 20 : v === "SLICE" ? 4 : 5;
        if (
          !Number.isInteger(quantity) ||
          items.reduce(
            (n, i) =>
              n +
              units(i.variant) *
                (i.cartItemId === cartItemId ? quantity : i.quantity),
            0,
          ) > 80
        )
          return;
        const updatedItems = items.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity } : item,
        );
        set({ items: updatedItems });
      },

      removeItem: (cartItemId) => {
        const { items } = get();
        set({ items: items.filter((i) => i.cartItemId !== cartItemId) });
      },

      clearCart: () => {
        set({ items: [] });
      },

      isCartDrawerOpen: false,
      setIsCartDrawerOpen: (open) => set({ isCartDrawerOpen: open }),

      getTotalCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.unitPrice * item.quantity,
          0,
        );
      },
    }),
    {
      name: "nook-and-cake-cart-v2",
      partialize: (state) => ({
        items: state.items,
      }),
    },
  ),
);
