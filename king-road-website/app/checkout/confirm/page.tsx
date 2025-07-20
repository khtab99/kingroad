"use client";

import { useState, useEffect, useMemo } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Import all the new components
import { CheckoutHeader } from "@/components/checkout/confirm/CheckoutHeader";
import { LoadingSpinner } from "@/components/checkout/confirm/LoadingSpinner";
import { PaymentMethodSelector } from "@/components/checkout/confirm/PaymentMethodSelector";
import { OrderSummary } from "@/components/checkout/confirm/OrderSummary";
import { DeliveryInfo } from "@/components/checkout/confirm/DeliveryInfo";
import { SelectedPaymentDisplay } from "@/components/checkout/confirm/SelectedPaymentDisplay";
import { OrderTotal } from "@/components/checkout/confirm/OrderTotal";

// Import hooks

import { usePaymentHandler } from "@/hooks/usePaymentHandler";
import { useCheckoutData } from "@/hooks/useCheckoutData";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";

export default function CheckoutConfirmPage() {
  const { language } = useStore();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const router = useRouter();

  // Try to get checkout data from localStorage first, then from sessionStorage if not found
  const checkoutDataFromStorage = useMemo(() => {
    if (typeof window === "undefined") return null;

    // First try localStorage (normal flow)
    const localData = localStorage.getItem("checkoutData");
    if (localData) return JSON.parse(localData);

    // Then try sessionStorage (for users who navigated back from Stripe)
    const sessionData = sessionStorage.getItem("checkoutData");
    if (sessionData) return JSON.parse(sessionData);

    return null;
  }, []);

  const checkoutData = useCheckoutData(language, checkoutDataFromStorage);
  const paymentMethods = usePaymentMethods();
  const { handlePayment, isProcessing } = usePaymentHandler(language);

  // Validate direct access to confirm page
  useEffect(() => {
    // Check if user navigated here directly without checkout data
    if (
      typeof window !== "undefined" &&
      !localStorage.getItem("checkoutData")
    ) {
      toast.error(
        language === "ar"
          ? "يجب إكمال معلومات الشحن أولاً"
          : "You must complete shipping information first"
      );
      router.push("/checkout");
    }
  }, [language, router]);

  // Handle back button from Stripe
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isProcessingOrder) {
        // This will show a confirmation dialog when user tries to leave during processing
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isProcessingOrder]);

  // Check for pending payment when returning from Stripe
  useEffect(() => {
    const pendingOrderId = sessionStorage.getItem("pendingOrderId");
    const pendingPaymentTime = sessionStorage.getItem("pendingPaymentTime");

    if (pendingOrderId && pendingPaymentTime) {
      const timeElapsed = Date.now() - parseInt(pendingPaymentTime);

      // If it's been less than 30 minutes, show a message
      if (timeElapsed < 30 * 60 * 1000) {
        toast.info(
          language === "ar"
            ? "يبدو أنك عدت من صفحة الدفع. يمكنك المحاولة مرة أخرى أو اختيار طريقة دفع أخرى."
            : "It looks like you returned from the payment page. You can try again or choose another payment method."
        );
      }
    }
  }, [language]);

  if (!checkoutData) {
    return <LoadingSpinner language={language} />;
  }

  const handlePayNow = () => {
    setIsProcessingOrder(true);
    handlePayment(selectedPaymentMethod, checkoutData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-6">
        <CheckoutHeader language={language} />

        <PaymentMethodSelector
          paymentMethods={paymentMethods}
          selectedPaymentMethod={selectedPaymentMethod}
          onPaymentMethodChange={setSelectedPaymentMethod}
          language={language}
        />

        <OrderSummary checkoutData={checkoutData} language={language} />

        <DeliveryInfo checkoutData={checkoutData} language={language} />

        <SelectedPaymentDisplay
          selectedPaymentMethod={selectedPaymentMethod}
          paymentMethods={paymentMethods}
          language={language}
        />

        <OrderTotal checkoutData={checkoutData} language={language} />

        <Button
          onClick={handlePayNow}
          disabled={!selectedPaymentMethod || isProcessing || isProcessingOrder}
          className={`w-full py-4 text-lg font-medium rounded-md ${
            selectedPaymentMethod && !isProcessing && !isProcessingOrder
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-red-300 text-red-500 cursor-not-allowed"
          }`}
        >
          {isProcessing || isProcessingOrder
            ? language === "ar"
              ? "جاري المعالجة..."
              : "Processing..."
            : language === "ar"
            ? "ادفع الآن"
            : "Pay Now"}
        </Button>
      </div>

      <Footer />
    </div>
  );
}
