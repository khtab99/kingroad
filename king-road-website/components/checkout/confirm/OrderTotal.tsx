// components/checkout/OrderTotal.tsx

interface OrderTotalProps {
  checkoutData: any;
  language: string;
}

export function OrderTotal({ checkoutData, language }: OrderTotalProps) {
  return (
    <div
      className="bg-white rounded-lg p-4 mb-6 border border-gray-200"
      dir={language === "ar" ? "ltr" : "rtl"}
    >
      <div className="space-y-3 text-right">
        <div className="flex justify-between items-center">
          <span
            className="text-gray-800"
            dir={language === "ar" ? "rtl" : "ltr"}
          >
            {checkoutData.subtotal} {language === "ar" ? "د.إ" : "AED"}
          </span>
          <span className="text-gray-600">
            {language === "ar" ? "المجموع الفرعي" : "Subtotal"}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span
            className="text-gray-800"
            dir={language === "ar" ? "rtl" : "ltr"}
          >
            {checkoutData.deliveryFee} {language === "ar" ? "د.إ" : "AED"}
          </span>
          <span className="text-gray-600">
            {language === "ar" ? "رسوم التوصيل" : "Delivery Fee"}
          </span>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between items-center">
            <span
              className="text-gray-800 font-medium text-lg"
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              {checkoutData.total} {language === "ar" ? "د.إ" : "AED"}
            </span>
            <span className="text-gray-800 font-medium">
              {language === "ar" ? "المجموع" : "Total"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
