import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useStore } from "@/store/useStore";
import { createNewOrder } from "@/api/order";
import { paymentApi } from "@/api/payment";
import { cartApi } from "@/api/cart";

export function usePaymentHandler(language: string) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { clearCart } = useStore();
  const router = useRouter();

  const handlePayment = async (
    selectedPaymentMethod: string,
    checkoutData: any
  ) => {
    if (!selectedPaymentMethod) {
      toast.error(
        language === "ar"
          ? "يرجى اختيار طريقة الدفع"
          : "Please select payment method"
      );
      return;
    }

    if (!checkoutData) return;

    setIsProcessing(true);

    try {
      // Validate cart before proceeding

      const validationData = await cartApi.validateCart();

      if (!validationData.data.valid) {
        toast.error(
          language === "ar"
            ? "هناك مشكلة في سلة التسوق الخاصة بك"
            : "There's an issue with your cart"
        );

        // Show specific errors
        if (
          validationData.data.errors &&
          validationData.data.errors.length > 0
        ) {
          validationData.data.errors.forEach((error: string) => {
            toast.error(error);
          });
        }

        setIsProcessing(false);
        return;
      }

      const orderBody = {
        customer_phone: `${checkoutData.phone}`,
        customer_name: checkoutData.name,
        checkout_session_id: checkoutData.checkoutSessionId,
        customer_email: checkoutData.email || "",
        address_type: checkoutData.addressType,
        street: checkoutData.street,
        country: checkoutData.country,
        emirate: checkoutData.emirate,
        city: checkoutData.city,
        house_number: checkoutData.houseNumber || "",
        building_number: checkoutData.buildingNumber || "",
        floor: checkoutData.floor || "",
        apartment_number: checkoutData.apartmentNumber || "",
        office_number: checkoutData.officeNumber || null,
        additional_description: checkoutData.additionalDescription || "",
        delivery_fee: checkoutData.deliveryFee,
        payment_method: selectedPaymentMethod,
        customer_notes: "",
        items: checkoutData.cartItems.map((item: any) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };

      const orderResponse = await createNewOrder(orderBody);

      const orderId = orderResponse?.data?.id;

      console.log("Order response:", orderResponse);

      if (selectedPaymentMethod === "cash_on_delivery") {
        toast.success(
          language === "ar"
            ? "تم تأكيد الطلب بنجاح"
            : "Order confirmed successfully",
          {
            description:
              language === "ar"
                ? "سيتم التواصل معك قريباً"
                : "We will contact you soon",
          }
        );

        clearCart();
        localStorage.removeItem("checkoutData");
        router.push(
          `/checkout/success?order=${
            orderResponse.order.order_number
          }&phone=${encodeURIComponent(orderResponse.order.customer_phone)}`
        );
        return;
      }

      if (
        selectedPaymentMethod === "cards" ||
        selectedPaymentMethod === "apple-pay"
      ) {
        const baseUrl = window.location.origin;
        const successUrl = `${baseUrl}/checkout/success`;
        const cancelUrl = `${baseUrl}/checkout/confirm`;

        const stripeResponse = await paymentApi.createCheckoutSession({
          order_id: orderId,
          success_url: successUrl,
          cancel_url: cancelUrl,
        });

        if (stripeResponse.status === 1 && stripeResponse.data.checkout_url) {
          // Don't clear cart or checkout data yet - only after successful payment
          // Store the order ID in session storage for verification on return
          sessionStorage.setItem("pendingOrderId", orderId);
          sessionStorage.setItem("pendingPaymentTime", Date.now().toString());
          // Store checkout data in session storage to preserve it if user navigates back
          sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData));
          window.location.href = stripeResponse.data.checkout_url;
        } else {
          throw new Error(
            stripeResponse.message || "Failed to create payment session"
          );
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(
        language === "ar" ? "فشل في تأكيد الطلب" : "Failed to confirm order"
      );
      // Reset processing state to allow retry
      setIsProcessing(false);
    } finally {
      // Don't reset processing state here - it will be reset after redirect
      // or in the catch block for errors
    }
  };

  return { handlePayment, isProcessing };
}
