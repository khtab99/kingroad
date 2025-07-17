"use client";

import CheckoutSuccessContent from "@/components/checkout/success/success";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useStore();

  useEffect(() => {
    // Validate required parameters
    const orderNumber = searchParams.get("order");
    const customerPhone = searchParams.get("phone");

    // If missing required parameters, redirect to home
    if (!orderNumber || !customerPhone) {
      router.push("/");
      return;
    }

    // If we have a session_id, this is a return from Stripe
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      // Clear cart after successful payment
      if (typeof window !== "undefined") {
        clearCart();
        localStorage.removeItem("checkoutData");
        sessionStorage.removeItem("checkoutData");
        sessionStorage.removeItem("pendingOrderId");
        sessionStorage.removeItem("pendingPaymentTime");
      }
    }
  }, [router, searchParams, clearCart]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <CheckoutSuccessContent />
        <Footer />
      </div>
    </Suspense>
  );
}
