import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useCheckoutData(language: string, initialData: any = null) {
  const [checkoutData, setCheckoutData] = useState(initialData);
  const router = useRouter();

  useEffect(() => {
    // If we already have data from props, use that
    if (initialData) {
      setCheckoutData(initialData);
      return;
    }
    
    const data = localStorage.getItem("checkoutData");
    if (!data) {
      // Try to get data from sessionStorage (for users returning from Stripe)
      const sessionData = sessionStorage.getItem("checkoutData");
      if (sessionData) {
        try {
          const parsedData = JSON.parse(sessionData);
          
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
          return;
        } catch (error) {
          toast.error(
            language === "ar" ? "خطأ في بيانات الطلب" : "Error in order data"
          );
          router.push("/cart");
          return;
        }
      } else {
        toast.error(
          language === "ar" ? "لا توجد بيانات طلب" : "No order data found"
        );
        router.push("/cart");
        return;
      }
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
  }, [language, router, initialData]);

  return checkoutData;
}
