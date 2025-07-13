import axiosInstance from "@/util/axios";

export interface GuestOrderData {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  address_type: "house" | "apartment" | "office";
  street: string;
  house_number?: string;
  building_number?: string;
  floor?: string;
  apartment_number?: string;
  office_number?: string;
  additional_description?: string;
  city?: string;
  country?: string;
  delivery_fee?: number;
  payment_method?: string;
  customer_notes?: string;
}

export interface OrderLookupData {
  order_number: string;
  customer_phone: string;
}

export const guestApi = {
  // Create guest order
  createOrder: async (orderData: GuestOrderData) => {
    const response = await axiosInstance.post("/guest/orders", orderData);
    return response.data;
  },

  // Lookup guest order
  lookupOrder: async (lookupData: OrderLookupData) => {
    const response = await axiosInstance.post("/orders/lookup", lookupData);
    return response.data;
  },

  // Cancel guest order
  cancelOrder: async (lookupData: OrderLookupData) => {
    const response = await axiosInstance.post(
      "/guest/orders/cancel",
      lookupData
    );
    return response.data;
  },

  // Validate cart before checkout
  validateCart: async () => {
    const response = await axiosInstance.post("/cart/validate");
    return response.data;
  },
};
