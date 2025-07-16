interface OrderSummaryProps {
  checkoutData: any;
  language: string;
}

export function OrderSummary({ checkoutData, language }: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
      <h3 className="text-gray-800 font-medium mb-4 text-center">
        {language === "ar" ? "عناصر الطلب" : "Order Items"}
      </h3>

      {checkoutData.cartItems.map((item: any) => (
        <div
          key={item.id}
          className="flex items-center justify-between py-2 text-right"
        >
          <span className="text-gray-800 font-medium">
            {item.price} {language === "ar" ? "د.إ" : "AED"}
          </span>
          <span className="text-gray-600">
            x{item.quantity} {item.name}
          </span>
        </div>
      ))}
    </div>
  );
}
