import {
  Clock,
  Home,
  Building,
  Building2,
  User,
  Phone,
  Mail,
} from "lucide-react";
import { AddressDisplay } from "./AddressDisplay";

interface DeliveryInfoProps {
  checkoutData: any;
  language: string;
}

export function DeliveryInfo({ checkoutData, language }: DeliveryInfoProps) {
  const addressTypes = {
    house: { ar: "منزل", en: "House", icon: Home },
    apartment: { ar: "شقة", en: "Apartment", icon: Building },
    office: { ar: "مكتب", en: "Office", icon: Building2 },
  };

  const AddressIcon =
    addressTypes[checkoutData.addressType as keyof typeof addressTypes]?.icon ||
    Home;

  return (
    <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
      <div className="flex items-center justify-between text-right mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="h-4 w-4" />
          <span className="text-sm">
            {language === "ar" ? "2 يوم" : "2 days"}
          </span>
        </div>
        <div>
          <h3 className="text-gray-800 font-medium mb-1">
            {language === "ar" ? "معلومات التوصيل" : "Delivery Information"}
          </h3>
        </div>
      </div>

      <div className="space-y-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <span className="text-gray-700">
            {checkoutData.country} , {checkoutData.emirate}, {checkoutData.city}
          </span>
          <AddressIcon className="h-4 w-4 text-gray-600" />
        </div>

        <AddressDisplay checkoutData={checkoutData} language={language} />

        <div className="flex items-center justify-end gap-2">
          <span className="text-gray-700">{checkoutData.name}</span>
          <User className="h-4 w-4 text-gray-600" />
        </div>

        <div className="flex items-center justify-end gap-2">
          <span className="text-gray-700">+971{checkoutData.phone}</span>
          <Phone className="h-4 w-4 text-gray-600" />
        </div>

        {checkoutData.email && (
          <div className="flex items-center justify-end gap-2">
            <span className="text-gray-700">{checkoutData.email}</span>
            <Mail className="h-4 w-4 text-gray-600" />
          </div>
        )}
      </div>
    </div>
  );
}
