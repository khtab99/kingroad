interface SelectedPaymentDisplayProps {
  selectedPaymentMethod: string;
  paymentMethods: any;
  language: string;
}

export function SelectedPaymentDisplay({
  selectedPaymentMethod,
  paymentMethods,
  language,
}: SelectedPaymentDisplayProps) {
  if (!selectedPaymentMethod) return null;

  const selectedMethod = paymentMethods.find(
    (m: any) => m.id === selectedPaymentMethod
  );

  return (
    <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
      <div className="text-right">
        <h3 className="text-gray-800 font-medium mb-2">
          {language === "ar" ? "طريقة الدفع" : "Payment Method"}
        </h3>
        <p className="text-gray-600">
          {language === "ar" ? selectedMethod?.nameAr : selectedMethod?.nameEn}
        </p>
      </div>
    </div>
  );
}
