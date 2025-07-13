"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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

  const checkoutData = useCheckoutData(language);
  const paymentMethods = usePaymentMethods();
  const { handlePayment, isProcessing } = usePaymentHandler(language);

  if (!checkoutData) {
    return <LoadingSpinner language={language} />;
  }

  const handlePayNow = () => {
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
          disabled={!selectedPaymentMethod || isProcessing}
          className={`w-full py-4 text-lg font-medium rounded-md ${
            selectedPaymentMethod && !isProcessing
              ? "bg-gray-600 hover:bg-gray-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isProcessing
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
