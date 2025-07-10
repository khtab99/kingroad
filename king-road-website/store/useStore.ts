import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartApi } from "@/api/cart";

interface CartItem {
  id: string;
  user_id?: number;
  product_id: number;
  quantity: number;
  price: number;
  total: number;
  product: {
    id: number;
    name_en: string;
    name_ar: string;
    name: string;
    slug: string;
    sku: string;
    price: number;
    current_price: number;
    featured_image: string;
    is_active: boolean;
    is_in_stock: boolean;
    inventory: number;
    category?: {
      id: number;
      name_en: string;
      name_ar: string;
      name: string;
    };
  };
  created_at: string;
  updated_at: string;
}

interface CartTotal {
  subtotal: number;
  item_count: number;
  total: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  language?: string;
  is_active: boolean;
  created_at: string;
}

interface StoreState {
  // User state
  user: User | null;
  isAuthenticated: boolean;

  // Cart state
  cartItems: CartItem[];
  cartTotal: CartTotal;
  isCartLoading: boolean;

  // UI state
  language: "en" | "ar";
  isMenuOpen: boolean;

  // Actions
  setUser: (user: User | null) => void;
  logout: () => void;

  // Cart actions
  addToCart: (product: any, quantity: number) => Promise<void>;
  updateCartQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loadCart: () => Promise<void>;
  refreshCartTotal: () => Promise<void>;

  // UI actions
  toggleLanguage: () => void;
  setMenuOpen: (open: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      cartItems: [],
      cartTotal: { subtotal: 0, item_count: 0, total: 0 },
      isCartLoading: false,
      language: "en",
      isMenuOpen: false,

      // User actions
      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
        });

        // Load cart when user logs in
        if (user) {
          get().loadCart();
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          cartItems: [],
          cartTotal: { subtotal: 0, item_count: 0, total: 0 },
        });
      },

      // Cart actions
      addToCart: async (product, quantity) => {
        try {
          const response = await cartApi.addToCart({
            product_id: product.id,
            quantity,
          });

          // Reload cart after successful addition
          await get().loadCart();
        } catch (error) {
          console.error("Failed to add to cart:", error);
          throw error;
        }
      },

      updateCartQuantity: async (productId, quantity) => {
        try {
          const cartItem = get().cartItems.find(
            (item) => item.product_id === productId
          );
          if (!cartItem) {
            throw new Error("Cart item not found");
          }

          if (quantity <= 0) {
            return get().removeFromCart(productId);
          }

          await cartApi.updateCartQuantity(cartItem.id, quantity);
          // Reload cart after successful update
          await get().loadCart();
        } catch (error) {
          console.error("Failed to update cart quantity:", error);
          throw error;
        }
      },

      removeFromCart: async (productId) => {
        try {
          const cartItem = get().cartItems.find(
            (item) => item.product_id === productId
          );
          if (!cartItem) {
            throw new Error("Cart item not found");
          }

          await cartApi.removeFromCart(cartItem.id);
          // Reload cart after successful removal
          await get().loadCart();
        } catch (error) {
          console.error("Failed to remove from cart:", error);
          throw error;
        }
      },

      clearCart: async () => {
        try {
          await cartApi.clearCart();
          set({
            cartItems: [],
            cartTotal: { subtotal: 0, item_count: 0, total: 0 },
          });
        } catch (error) {
          console.error("Failed to clear cart:", error);
          throw error;
        }
      },

      loadCart: async () => {
        try {
          const cart = await cartApi.getCart();
          if (cart.status === 1) {
            set({
              cartItems: cart.items,
              cartTotal: cart.total,
              isCartLoading: false,
            });
          } else {
            throw new Error(cart.error || "Failed to load cart");
          }
        } catch (error) {
          console.error("Failed to load cart:", error);
          set({ isCartLoading: false });
          throw error;
        }
      },

      refreshCartTotal: async () => {
        try {
          const cart = await cartApi.getCart();
          if (cart.status === 1) {
            set({ cartTotal: cart.total });
          } else {
            throw new Error(cart.error || "Failed to refresh cart total");
          }
        } catch (error) {
          console.error("Failed to refresh cart total:", error);
          throw error;
        }
      },

      // UI actions
      toggleLanguage: () => {
        set((state) => ({
          language: state.language === "en" ? "ar" : "en",
        }));
      },

      setMenuOpen: (open) => {
        set({ isMenuOpen: open });
      },
    }),
    {
      name: "king-road-store",
      partialize: (state) => ({
        user: state.user,
        language: state.language,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
