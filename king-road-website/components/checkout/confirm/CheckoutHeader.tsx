// components/checkout/CheckoutHeader.tsx
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRouter } from "next/navigation";

interface CheckoutHeaderProps {
  language: string;
}

export function CheckoutHeader({ language }: CheckoutHeaderProps) {
  const router = useRouter();
  
  const handleBack = () => {
    router.back();
  };
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
      >
        {language === "ar" ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <ChevronLeft className="h-5 w-5" />
        )}
      </button>

      <h1 className="text-lg font-medium text-gray-800">
        {language === "ar" ? "طريقة الدفع" : "Payment Method"}
      </h1>

      <div></div>
    </div>
  );
}
