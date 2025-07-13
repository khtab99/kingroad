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
