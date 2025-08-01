"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CheckoutSuccessContent from "./success";
import { useStore } from "@/store/useStore";

export default function SuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useStore();

  useEffect(() => {
    const orderNumber = searchParams.get("order");
    const customerPhone = searchParams.get("phone");

    if (!orderNumber || !customerPhone) {
      router.push("/");
      return;
    }

    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      clearCart();
      localStorage.removeItem("checkoutData");
      sessionStorage.removeItem("checkoutData");
      sessionStorage.removeItem("pendingOrderId");
      sessionStorage.removeItem("pendingPaymentTime");
    }
  }, [router, searchParams, clearCart]);

  return <CheckoutSuccessContent />;
}
