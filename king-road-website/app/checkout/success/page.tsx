"use client";

import CheckoutSuccessContent from "@/components/checkout/success/success";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Validate required parameters
    const orderNumber = searchParams.get("order");
    const customerPhone = searchParams.get("phone");

    // If missing required parameters, redirect to home
    if (!orderNumber || !customerPhone) {
      router.push("/");
    }

    // If we have a session_id, this is a return from Stripe
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      // Clear cart after successful payment
      if (typeof window !== "undefined") {
        localStorage.removeItem("checkoutData");
      }
    }
  }, [router, searchParams]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
