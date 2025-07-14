import axiosInstance from "@/util/axios";

export interface GuestOrderData {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  address_type: string;
  street: string;
  house_number?: string;
  building_number?: string;
  floor?: string;
  apartment_number?: string;
  office_number?: string;
  additional_description?: string;
  city?: string;
  country?: string;
  payment_method: string;
  customer_notes?: string;
}

export const guestApi = {
  // Create a guest order
  createOrder: async (data: GuestOrderData) => {
    try {
      // Get cart items from local storage
      const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
      
      // Create order data
      const orderData = {
        ...data,
        items: cartItems.map((item: any) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        checkout_session_id: localStorage.getItem("checkoutSessionId") || undefined,
      };
      
      const response = await axiosInstance.post("/api/v1/orders", orderData);
      return response.data;
    } catch (error: any) {
      console.error("Failed to create order:", error);
      throw error.response?.data || error;
    }
  },
  
  // Validate cart before checkout
  validateCart: async () => {
    try {
      const response = await axiosInstance.get("/api/v1/cart/validate");
      return response.data;
    } catch (error: any) {
      console.error("Failed to validate cart:", error);
      throw error.response?.data || error;
    }
  },
};