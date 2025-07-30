import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import locations from "@/data/locations.json";

export const EmiratesCitySelector = ({
  formData,
  onInputChange,
  disabled = false,
  language = "en",
}: {
  formData: { emirate: string; city: string };
  onInputChange: (field: string, value: string) => void;
  disabled?: boolean;
  language?: string;
}) => {
  const isArabic = language === "ar";

  // Find selected emirate by name to get available cities
  const selectedEmirateData = useMemo(() => {
    if (!formData.emirate) return null;

    return locations.find((emirate) => {
      const emirateName = isArabic
        ? emirate.details?.name_ar
        : emirate.details?.name;
      return emirateName === formData.emirate;
    });
  }, [formData.emirate, isArabic]);

  // Memoize available cities when emirate changes
  const availableCities = useMemo(() => {
    return selectedEmirateData?.areas || [];
  }, [selectedEmirateData]);

  const handleEmirateChange = (emirateId: string) => {
    // Find the emirate by ID and store its name in form data
    const selectedEmirate = locations.find(
      (emirate) => emirate.details.city_id === emirateId
    );

    if (selectedEmirate) {
      const emirateName = isArabic
        ? selectedEmirate.details?.name_ar
        : selectedEmirate.details?.name;

      onInputChange("emirate", emirateName || "");
      onInputChange("city", ""); // reset city on emirate change
    }
  };

  const handleCityChange = (cityId: string) => {
    // Find the city by ID and store its name in form data
    const selectedCity = availableCities.find(
      (city: any) => city?.area_id === cityId
    );

    if (selectedCity) {
      const cityName = isArabic ? selectedCity?.name_ar : selectedCity?.name;
      onInputChange("city", cityName || "");
    }
  };

  // Get current emirate ID for Select value (reverse lookup)
  const currentEmirateId = useMemo(() => {
    if (!formData.emirate) return "";

    const emirate = locations.find((emirate) => {
      const emirateName = isArabic
        ? emirate.details?.name_ar
        : emirate.details?.name;
      return emirateName === formData.emirate;
    });

    return emirate ? String(emirate.details.city_id) : "";
  }, [formData.emirate, isArabic]);

  // Get current city ID for Select value (reverse lookup)
  const currentCityId = useMemo(() => {
    if (!formData.city || !availableCities.length) return "";

    const city = availableCities.find((city: any) => {
      const cityName = isArabic ? city?.name_ar : city?.name;
      return cityName === formData.city;
    });

    return city ? city.area_id : "";
  }, [formData.city, availableCities, isArabic]);

  return (
    <>
      {/* Emirate Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {isArabic ? "الامارة" : "Emirate"}
        </label>
        <Select
          value={currentEmirateId}
          onValueChange={handleEmirateChange}
          disabled={disabled}
        >
          <SelectTrigger
            className={`${isArabic ? "text-right" : "text-left"} ${
              disabled ? "bg-gray-100 text-gray-400" : ""
            }`}
            dir={isArabic ? "rtl" : "ltr"}
          >
            <SelectValue
              placeholder={isArabic ? "اختر الامارة" : "Select an emirate"}
            />
          </SelectTrigger>
          <SelectContent>
            {locations.map((emirate) => (
              <SelectItem
                key={emirate.details.city_id}
                value={String(emirate.details.city_id)}
              >
                {isArabic ? emirate.details?.name_ar : emirate.details?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {isArabic ? "المدينة" : "City"}
        </label>
        <Select
          value={currentCityId}
          onValueChange={handleCityChange}
          disabled={disabled || !formData.emirate}
        >
          <SelectTrigger
            className={`${isArabic ? "text-right" : "text-left"} ${
              disabled || !formData.emirate ? "bg-gray-100 text-gray-400" : ""
            }`}
            dir={isArabic ? "rtl" : "ltr"}
          >
            <SelectValue
              placeholder={
                !formData.emirate
                  ? isArabic
                    ? "اختر الامارة أولاً"
                    : "Select an emirate first"
                  : isArabic
                  ? "اختر المدينة"
                  : "Select a city"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {availableCities.map((city: any) => (
              <SelectItem key={city?.area_id} value={city?.area_id}>
                {isArabic ? city?.name_ar : city?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
