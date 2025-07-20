import { Home, Building, Building2 } from "lucide-react";

interface AddressTypeSelectionProps {
  language: string;
  selectedAddressType: string;
  onSelectAddressType: (type: string) => void;
}

export default function AddressTypeSelection({
  language,
  selectedAddressType,
  onSelectAddressType,
}: AddressTypeSelectionProps) {
  const addressTypes = [
    {
      id: "house",
      nameAr: "منزل",
      nameEn: "House",
      icon: Home,
    },
    {
      id: "apartment",
      nameAr: "شقة",
      nameEn: "Apartment",
      icon: Building,
    },
    {
      id: "office",
      nameAr: "مكتب",
      nameEn: "Office",
      icon: Building2,
    },
  ];

  return (
    <div className="mb-6">
      <div className="grid grid-cols-3 gap-4">
        {addressTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => onSelectAddressType(type.id)}
              className={`p-6 rounded-lg border-2 transition-all ${
                selectedAddressType === type.id
                  ? "border-red-800 bg-red-50"
                  : "border-red-200 hover:border-red-300"
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <Icon className="h-8 w-8 text-red-600" />
                <span className="text-sm font-medium text-red-800">
                  {language === "ar" ? type.nameAr : type.nameEn}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
