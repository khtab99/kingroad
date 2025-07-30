interface AddressDisplayProps {
  checkoutData: any;
  language: string;
}

export function AddressDisplay({
  checkoutData,
  language,
}: AddressDisplayProps) {
  const getAddressDetails = () => {
    const {
      addressType,
      street,
      houseNumber,
      buildingNumber,
      floor,
      apartmentNumber,
      officeNumber,
      additionalDescription,
    } = checkoutData;

    let details = `${language === "ar" ? "الشارع:" : "Street:"} ${street}`;

    switch (addressType) {
      case "house":
        details += `, ${
          language === "ar" ? "رقم المنزل:" : "House No.:"
        } ${houseNumber}`;
        break;
      case "apartment":
        details += `, ${
          language === "ar" ? "رقم المبنى:" : "Building No.:"
        } ${buildingNumber}`;
        details += `, ${language === "ar" ? "الطابق:" : "Floor:"} ${floor}`;
        details += `, ${
          language === "ar" ? "رقم الشقة:" : "Apartment No.:"
        } ${apartmentNumber}`;
        break;
      case "office":
        details += `, ${
          language === "ar" ? "رقم المبنى:" : "Building No.:"
        } ${buildingNumber}`;
        details += `, ${language === "ar" ? "الطابق:" : "Floor:"} ${floor}`;
        details += `, ${
          language === "ar" ? "رقم المكتب:" : "Office No.:"
        } ${officeNumber}`;
        break;
    }

    if (additionalDescription) {
      details += `, ${
        language === "ar" ? "توجيهات:" : "Directions:"
      } ${additionalDescription}`;
    }

    return details;
  };

  return (
    <div
      className={`text-sm text-gray-600  ${
        language === "ar" ? "text-right" : "text-left"
      }`}
    >
      {getAddressDetails()}
    </div>
  );
}
