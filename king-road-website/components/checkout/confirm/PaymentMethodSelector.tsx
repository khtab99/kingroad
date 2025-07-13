import { PaymentMethodCard } from "./PaymentMethodCard";

interface PaymentMethodSelectorProps {
  paymentMethods: any;
  selectedPaymentMethod: string;
  onPaymentMethodChange: (methodId: string) => void;
  language: string;
}

export function PaymentMethodSelector({
  paymentMethods,
  selectedPaymentMethod,
  onPaymentMethodChange,
  language,
}: PaymentMethodSelectorProps) {
  return (
    <div className="mb-8">
      <h2 className="text-center text-gray-700 mb-6">
        {language === "ar"
          ? "اختر طريقة الدفع المفضلة لديك"
          : "Choose your preferred payment method"}
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {paymentMethods.map((method: any) => (
          <PaymentMethodCard
            key={method.id}
            method={method}
            isSelected={selectedPaymentMethod === method.id}
            onSelect={onPaymentMethodChange}
            language={language}
          />
        ))}
      </div>
    </div>
  );
}
