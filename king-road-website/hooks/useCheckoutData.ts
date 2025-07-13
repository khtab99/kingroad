import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useCheckoutData(language: string) {
  const [checkoutData, setCheckoutData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem("checkoutData");
    if (!data) {
      toast.error(
        language === "ar" ? "لا توجد بيانات طلب" : "No order data found"
      );
      router.push("/cart");
      return;
    }

    try {
      const parsedData = JSON.parse(data);
      
      // Validate checkout data has required fields
      if (!parsedData.cartItems || parsedData.cartItems.length === 0 ||
          !parsedData.addressType || !parsedData.name || !parsedData.phone) {
        throw new Error("Invalid checkout data");
      }
      
      // Check if checkout data is too old (more than 1 hour)
      if (parsedData.timestamp && (Date.now() - parsedData.timestamp > 60 * 60 * 1000)) {
        throw new Error("Checkout session expired");
      }
      
      setCheckoutData(parsedData);
    } catch (error) {
      toast.error(
        language === "ar" ? "خطأ في بيانات الطلب" : "Error in order data"
      );
      router.push("/cart");
    }
  }, [language, router]);

  return checkoutData;
}
