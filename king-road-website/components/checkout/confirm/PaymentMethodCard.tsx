// components/checkout/PaymentMethodCard.tsx

import Image from "next/image";

interface PaymentMethodCardProps {
  method: any;
  isSelected: boolean;
  onSelect: (methodId: string) => void;
  language: string;
}

export function PaymentMethodCard({
  method,
  isSelected,
  onSelect,
  language,
}: PaymentMethodCardProps) {
  return (
    <button
      onClick={() => onSelect(method.id)}
      className={`p-6 rounded-lg border-2 transition-all ${
        isSelected
          ? "border-red-800 bg-red-50"
          : "border-red-200 hover:border-red-300"
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-10 flex items-center justify-center">
          <Image
            src={method.icon}
            alt={language === "ar" ? method.nameAr : method.nameEn}
            width={64}
            height={40}
            className="object-contain"
          />
        </div>
        <span className="text-sm font-medium text-gray-800">
          {language === "ar" ? method.nameAr : method.nameEn}
        </span>
      </div>
    </button>
  );
}
