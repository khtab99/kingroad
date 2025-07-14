import axiosInstance from "@/util/axios";

export interface CreateCheckoutSessionParams {
  order_id: string | number;
  success_url: string;
  cancel_url: string;
}

export interface VerifyPaymentParams {
  session_id: string;
}

export const paymentApi = {
  // Create Stripe checkout session
  createCheckoutSession: async (params: CreateCheckoutSessionParams) => {
    try {
      const response = await axiosInstance.post(
        "/api/v1/payment/create-checkout-session",
        params
      );
      return response.data;
    } catch (error: any) {
      console.error("Failed to create checkout session:", error);
      throw error.response?.data || error;
    }
  },

  // Verify payment status
  verifyPayment: async (params: VerifyPaymentParams) => {
    try {
      const response = await axiosInstance.post("/api/v1/payment/verify", params);
      return response.data;
    } catch (error: any) {
      console.error("Failed to verify payment:", error);
      throw error.response?.data || error;
    }
  },
};