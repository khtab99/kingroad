import axiosInstance, { endpoints } from "@/util/axios";

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  total: number;
  product: {
    id: string;
    name_en: string;
    name_ar: string;
    name: string;
    featured_image: string;
    current_price: number;
    is_in_stock: boolean;
  };
}

export interface CartTotal {
  subtotal: number;
  item_count: number;
  total: number;
}

export const cartApi = {
  // Get cart items
  getCart: async () => {
    try {
      const response = await axiosInstance.get(endpoints.cart.list);
      return response.data;
    } catch (error: any) {
      console.error("Failed to get cart:", error);
      throw error.response?.data || error;
    }
  },

  // Add item to cart
  addToCart: async (productId: string, quantity: number) => {
    try {
      const response = await axiosInstance.post(endpoints.cart.add, {
        product_id: productId,
        quantity,
      });
      return response.data;
    } catch (error: any) {
      console.error("Failed to add to cart:", error);
      throw error.response?.data || error;
    }
  },

  // Update cart item quantity
  updateCartItem: async (cartItemId: string, quantity: number) => {
    try {
      const response = await axiosInstance.put(
        `${endpoints.cart.update}${cartItemId}`,
        { quantity }
      );
      return response.data;
    } catch (error: any) {
      console.error("Failed to update cart item:", error);
      throw error.response?.data || error;
    }
  },

  // Remove item from cart
  removeFromCart: async (cartItemId: string) => {
    try {
      const response = await axiosInstance.delete(
        `${endpoints.cart.remove}${cartItemId}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Failed to remove from cart:", error);
      throw error.response?.data || error;
    }
  },

  // Get cart count
  getCartCount: async () => {
    try {
      const response = await axiosInstance.get(endpoints.cart.count);
      return response.data;
    } catch (error: any) {
      console.error("Failed to get cart count:", error);
      throw error.response?.data || error;
    }
  },

  // Get cart total
  getCartTotal: async () => {
    try {
      const response = await axiosInstance.get(endpoints.cart.total);
      return response.data;
    } catch (error: any) {
      console.error("Failed to get cart total:", error);
      throw error.response?.data || error;
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      const response = await axiosInstance.post(endpoints.cart.clear);
      return response.data;
    } catch (error: any) {
      console.error("Failed to clear cart:", error);
      throw error.response?.data || error;
    }
  },

  // Validate cart
  validateCart: async () => {
    try {
      const response = await axiosInstance.get(endpoints.cart.validate);
      return response.data;
    } catch (error: any) {
      console.error("Failed to validate cart:", error);
      throw error.response?.data || error;
    }
  },
};