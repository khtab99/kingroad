import useSWR, { mutate } from "swr";
import { useMemo } from "react";
import {
  endpoints,
  kingRoadCreator,
  kingRoadCreatorForm,
  kingRoadFetcher,
  kingRoadSmasher,
  kingRoadUpdatePatch,
  kingRoadUpdatePut,
} from "@/util/axios";
import axiosInstance from "@/util/axios";

// Types
export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  price: number;
  total: number;
  product: {
    id: string;
    name_en: string;
    name_ar: string;
    name: string;
    slug: string;
    sku: string;
    price: number;
    current_price: number;
    featured_image?: string;
    is_active: boolean;
    is_in_stock: boolean;
    inventory: number;
    category?: {
      id: string;
      name_en: string;
      name_ar: string;
      name: string;
    };
  };
  created_at: string;
  updated_at: string;
}

export interface CartResponse {
  data: CartItem[];
}

export interface CartTotalResponse {
  data: {
    subtotal: number;
    item_count: number;
    delivery_fee: number;
    total: number;
  };
}

export interface CartCountResponse {
  data: {
    count: number;
  };
}

// Hook for fetching cart items
export function useGetCartItems() {
  const { data, error, isLoading, isValidating } = useSWR(
    endpoints.cart.list,
    async (url) => {
      // First get CSRF token
      await axiosInstance.get("/sanctum/csrf-cookie");
      return kingRoadFetcher(url);
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000, // Cache for 10 seconds
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    }
  );

  const revalidateCart = () => {
    mutate(endpoints.cart.list);
    mutate(endpoints.cart.count);
    mutate(endpoints.cart.total);
  };

  const memoizedValue = useMemo(() => {
    const cartData = data?.data || [];
    return {
      cartItems: cartData,
      cartLoading: isLoading,
      cartError: error,
      cartValidating: isValidating,
      cartEmpty: cartData.length === 0,
    };
  }, [data?.data, error, isLoading, isValidating]);

  return {
    ...memoizedValue,
    revalidateCart,
  };
}

// Hook for getting cart count
export function useGetCartCount() {
  const { data, error, isLoading } = useSWR(
    endpoints.cart.count,
    kingRoadFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Cache for 5 seconds
      errorRetryCount: 2,
    }
  );

  const memoizedValue = useMemo(() => {
    return {
      cartCount: data?.data?.count || 0,
      cartCountLoading: isLoading,
      cartCountError: error,
    };
  }, [data?.data?.count, error, isLoading]);

  return memoizedValue;
}

// Hook for getting cart total
export function useGetCartTotal() {
  const { data, error, isLoading } = useSWR(
    endpoints.cart.total,
    kingRoadFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Cache for 5 seconds
      errorRetryCount: 2,
    }
  );

  const memoizedValue = useMemo(() => {
    const totalData = data?.data || {
      subtotal: 0,
      item_count: 0,
      delivery_fee: 0,
      total: 0,
    };
    return {
      cartTotal: totalData,
      cartTotalLoading: isLoading,
      cartTotalError: error,
    };
  }, [data?.data, error, isLoading]);

  return memoizedValue;
}

// Add item to cart
export async function addProductToCart(body: any) {
  const URL = endpoints.cart.add;

  try {
    const response = await kingRoadCreator([URL, body]);

    // Revalidate cart data
    mutate(endpoints.cart.list);
    mutate(endpoints.cart.count);
    mutate(endpoints.cart.total);

    return response;
  } catch (error: any) {
    console.error("addProductToCart failed:", error);
    throw error?.response?.data || error?.message || error;
  }
}

// Transfer guest cart to authenticated user
export async function transferGuestCart() {
  try {
    const response = await kingRoadCreator([endpoints.cart.transferGuest, {}]);

    // Revalidate cart data after transfer
    mutate(endpoints.cart.list);
    mutate(endpoints.cart.count);
    mutate(endpoints.cart.total);

    return response;
  } catch (error) {
    throw error;
  }
}

// Update cart item quantity
export async function updateCartQuantity(cartItemId: string, quantity: number) {
  try {
    const response = await kingRoadUpdatePut([
      `${endpoints.cart.update}/${cartItemId}`,
      {
        quantity: quantity,
      },
    ]);

    // Revalidate cart data
    mutate(endpoints.cart.list);
    mutate(endpoints.cart.count);
    mutate(endpoints.cart.total);

    return response;
  } catch (error) {
    throw error;
  }
}

// Remove item from cart
export async function removeFromCart(cartItemId: string) {
  try {
    const response = await kingRoadSmasher(
      `${endpoints.cart.remove}/${cartItemId}`
    );

    // Revalidate cart data
    mutate(endpoints.cart.list);
    mutate(endpoints.cart.count);
    mutate(endpoints.cart.total);

    return response;
  } catch (error) {
    console.error("Remove from cart error:", error);
    throw error;
  }
}

// Clear entire cart
export async function clearCart() {
  try {
    const response = await kingRoadSmasher(endpoints.cart.clear);

    // Revalidate cart data
    mutate(endpoints.cart.list);
    mutate(endpoints.cart.count);
    mutate(endpoints.cart.total);

    return response;
  } catch (error) {
    throw error;
  }
}

// Hook for cart actions
export function useCartActions() {
  const addItemToCart = async (productId: string, quantity: number = 1) => {
    return addProductToCart({ product_id: productId, quantity });
  };

  const updateItemQuantity = async (cartItemId: string, quantity: number) => {
    return updateCartQuantity(cartItemId, quantity);
  };

  const removeItemFromCart = async (cartItemId: string) => {
    return removeFromCart(cartItemId);
  };

  const clearAllCart = async () => {
    return clearCart();
  };

  const transferGuestCartToUser = async () => {
    return transferGuestCart();
  };
  return {
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    clearAllCart,
    transferGuestCartToUser,
  };
}

// Cart API object
export const cartApi = {
  // Get cart items and total
  getCart: async () => {
    try {
      const [itemsResponse, totalResponse] = await Promise.all([
        kingRoadFetcher(endpoints.cart.list),
        kingRoadFetcher(endpoints.cart.total),
      ]);

      const items = itemsResponse.data || [];
      const total = totalResponse.data || {
        subtotal: 0,
        item_count: 0,
        delivery_fee: 0,
        total: 0,
      };

      return {
        status: 1,
        items,
        total,
        count: items.length,
        loading: false,
        error: null,
      };
    } catch (error) {
      console.error("Error fetching cart:", error);
      return {
        status: 0,
        items: [],
        total: {
          subtotal: 0,
          item_count: 0,
          delivery_fee: 0,
          total: 0,
        },
        count: 0,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch cart",
      };
    }
  },

  // Get cart items
  getCartItems: useGetCartItems,

  // Get cart count
  getCartCount: useGetCartCount,

  // Get cart total
  getCartTotal: useGetCartTotal,

  // Add item to cart
  addToCart: addProductToCart,

  // Update cart quantity
  updateCartQuantity,

  // Remove item from cart
  removeFromCart,

  // Clear cart
  clearCart,

  // Transfer guest cart
  transferGuestCart,

  // Get cart actions
  useCartActions,
};
