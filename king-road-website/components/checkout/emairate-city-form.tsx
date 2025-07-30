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

  // Memoize available cities when emirate changes
  const availableCities = useMemo(() => {
    if (!formData.emirate) return [];

    const selectedEmirate = locations.find(
      (emirate) => emirate.details.city_id === formData.emirate
    );

    return selectedEmirate?.areas || [];
  }, [formData.emirate]);

  const handleEmirateChange = (value: string) => {
    onInputChange("emirate", value);
    onInputChange("city", ""); // reset city on emirate change
  };

  return (
    <>
      {/* Emirate Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {isArabic ? "الامارة" : "Emirate"}
        </label>
        <Select
          value={formData.emirate || ""}
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
          value={formData.city || ""}
          onValueChange={(value) => onInputChange("city", value)}
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
