interface DeliveryTabProps {
  language: string;
}

export default function DeliveryTab({ language }: DeliveryTabProps) {
  return (
    <div className="mb-8">
      <div className="border-b border-gray-200">
        <div className="text-center py-3">
          <span className="text-gray-800 font-medium border-b-2 border-gray-800 pb-3 px-4">
            {language === "ar" ? "توصيل" : "Delivery"}
          </span>
        </div>
      </div>
    </div>
  );
}
