import { Input } from "@/components/ui/input";
import { User, Mail, Phone } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthModal } from "../auth/AuthModal";
import { useState } from "react";

const uaeCities = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ajman",
  "Ras Al Khaimah",
  "Fujairah",
  "Umm Al Quwain",
];

interface AddressFormProps {
  language: string;
  selectedAddressType: string;
  formData: {
    country: any;
    city: any;
    street: string;
    houseNumber: string;
    buildingNumber: string;
    floor: string;
    apartmentNumber: string;
    officeNumber: string;
    additionalDescription: string;
    name: string;
    phone: string;
    email: string;
    createAccount: boolean;
  };
  onInputChange: (field: string, value: string | boolean) => void;
  disabled: boolean;
}

export default function AddressForm({
  language,
  selectedAddressType,
  formData,
  onInputChange,
  disabled,
}: AddressFormProps) {
  const renderAddressFields = () => {
    switch (selectedAddressType) {
      case "house":
        return (
          <>
            {/* Street and House Number */}
            <div className="grid grid-cols-2 gap-4 ">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "ar" ? "الشارع" : "Street"}
                </label>
                <Input
                  value={formData.street}
                  onChange={(e) => onInputChange("street", e.target.value)}
                  disabled={disabled}
                  className={`${
                    language === "ar" ? "text-right" : "text-left"
                  } ${disabled ? "bg-gray-100 text-gray-400" : ""}`}
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "ar" ? "رقم المنزل" : "House No."}
                </label>
                <Input
                  value={formData.houseNumber}
                  onChange={(e) => onInputChange("houseNumber", e.target.value)}
                  disabled={disabled}
                  className={`${
                    language === "ar" ? "text-right" : "text-left"
                  } ${disabled ? "bg-gray-100 text-gray-400" : ""}`}
                  dir="ltr"
                />
              </div>
            </div>
          </>
        );

      case "apartment":
        return (
          <>
            {/* Street and Building Number */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "ar" ? "الشارع" : "Street"}
                </label>
                <Input
                  value={formData.street}
                  onChange={(e) => onInputChange("street", e.target.value)}
                  disabled={disabled}
                  className={`${
                    language === "ar" ? "text-right" : "text-left"
                  } ${disabled ? "bg-gray-100 text-gray-400" : ""}`}
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "ar" ? "رقم المبنى" : "Building No."}
                </label>
                <Input
                  value={formData.buildingNumber}
                  onChange={(e) =>
                    onInputChange("buildingNumber", e.target.value)
                  }
                  disabled={disabled}
                  className={`${
                    language === "ar" ? "text-right" : "text-left"
                  } ${disabled ? "bg-gray-100 text-gray-400" : ""}`}
                  dir="ltr"
                />
              </div>
            </div>

            {/* Floor and Apartment Number */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "ar" ? "الطابق" : "Floor"}
                </label>
                <Input
                  value={formData.floor}
                  onChange={(e) => onInputChange("floor", e.target.value)}
                  disabled={disabled}
                  className={`${
                    language === "ar" ? "text-right" : "text-left"
                  } ${disabled ? "bg-gray-100 text-gray-400" : ""}`}
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "ar" ? "رقم الشقة" : "Apartment No."}
                </label>
                <Input
                  value={formData.apartmentNumber}
                  onChange={(e) =>
                    onInputChange("apartmentNumber", e.target.value)
                  }
                  disabled={disabled}
                  className={`${
                    language === "ar" ? "text-right" : "text-left"
                  } ${disabled ? "bg-gray-100 text-gray-400" : ""}`}
                  dir="ltr"
                />
              </div>
            </div>
          </>
        );

      case "office":
        return (
          <>
            {/* Street and Building Number */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "ar" ? "الشارع" : "Street"}
                </label>
                <Input
                  value={formData.street}
                  onChange={(e) => onInputChange("street", e.target.value)}
                  disabled={disabled}
                  className={`${
                    language === "ar" ? "text-right" : "text-left"
                  } ${disabled ? "bg-gray-100 text-gray-400" : ""}`}
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "ar" ? "رقم المبنى" : "Building No."}
                </label>
                <Input
                  value={formData.buildingNumber}
                  onChange={(e) =>
                    onInputChange("buildingNumber", e.target.value)
                  }
                  disabled={disabled}
                  className={`${
                    language === "ar" ? "text-right" : "text-left"
                  } ${disabled ? "bg-gray-100 text-gray-400" : ""}`}
                  dir="ltr"
                />
              </div>
            </div>

            {/* Floor and Office Number/Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "ar" ? "الطابق" : "Floor"}
                </label>
                <Input
                  value={formData.floor}
                  onChange={(e) => onInputChange("floor", e.target.value)}
                  disabled={disabled}
                  className={`${
                    language === "ar" ? "text-right" : "text-left"
                  } ${disabled ? "bg-gray-100 text-gray-400" : ""}`}
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "ar"
                    ? "رقم المكتب / الاسم"
                    : "Office No. / Name"}
                </label>
                <Input
                  value={formData.officeNumber}
                  onChange={(e) =>
                    onInputChange("officeNumber", e.target.value)
                  }
                  disabled={disabled}
                  className={`${
                    language === "ar" ? "text-right" : "text-left"
                  } ${disabled ? "bg-gray-100 text-gray-400" : ""}`}
                  dir="ltr"
                />
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const renderCountryCityFields = () => {
    return (
      <>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === "ar" ? "الدولة" : "Country"}
          </label>
          <Select
            value={formData.country}
            onValueChange={(value) => onInputChange("country", value)}
            disabled={disabled}
          >
            <SelectTrigger
              className={`${language === "ar" ? "text-right" : "text-left"} ${
                disabled ? "bg-gray-100 text-gray-400" : ""
              }`}
              dir="ltr"
            >
              <SelectValue
                placeholder={
                  language === "ar" ? "اختر الدولة" : "Select a country"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UAE">
                {language === "ar" ? "الإمارات" : "United Arab Emirates"}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === "ar" ? "المدينة" : "City"}
          </label>
          <Select
            value={formData.city}
            onValueChange={(value) => onInputChange("city", value)}
            disabled={disabled}
          >
            <SelectTrigger
              className={`${language === "ar" ? "text-right" : "text-left"} ${
                disabled ? "bg-gray-100 text-gray-400" : ""
              }`}
              dir="ltr"
            >
              <SelectValue
                placeholder={
                  language === "ar" ? "اختر المدينة" : "Select a city"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {uaeCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {language === "ar"
                    ? // simple example of manual translation for common cities
                      city === "Dubai"
                      ? "دبي"
                      : city === "Abu Dhabi"
                      ? "أبو ظبي"
                      : city === "Sharjah"
                      ? "الشارقة"
                      : city === "Ajman"
                      ? "عجمان"
                      : city === "Ras Al Khaimah"
                      ? "رأس الخيمة"
                      : city === "Fujairah"
                      ? "الفجيرة"
                      : city === "Umm Al Quwain"
                      ? "أم القيوين"
                      : city
                    : city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </>
    );
  };

  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <>
      <div className="space-y-4 mb-6">
        {renderCountryCityFields()}
        {/* Dynamic Address Fields */}
        {renderAddressFields()}
        {/* Special Directions - Common for all types */}
        {selectedAddressType && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === "ar"
                ? "توجيهات خاصة (اختياري)"
                : "Special Directions (Optional)"}
            </label>
            <Input
              value={formData.additionalDescription}
              onChange={(e) =>
                onInputChange("additionalDescription", e.target.value)
              }
              placeholder={
                language === "ar" ? "أدخل التوجيهات" : "Enter Directions"
              }
              disabled={disabled}
              className={`${language === "ar" ? "text-right" : "text-left"} ${
                disabled ? "bg-gray-100 text-gray-400" : ""
              }`}
              dir="ltr"
            />
          </div>
        )}
        {/* Name and Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === "ar" ? "رقم الهاتف" : "Phone Number"}
            </label>
            <div className="relative">
              <Input
                value={formData.phone}
                onChange={(e) => onInputChange("phone", e.target.value)}
                placeholder={
                  language === "ar" ? "أدخل رقم هاتفك" : "Enter your phone"
                }
                disabled={disabled}
                className={`${
                  language === "ar" ? "text-right" : "text-left  "
                } pr-16 ${disabled ? "bg-gray-100 text-gray-400" : ""}`}
                dir="ltr"
              />
              <div
                className={`absolute  top-1/2 transform -translate-y-1/2 text-gray-500 text-sm ${
                  language === "ar" ? "left-3" : "right-3"
                }`}
              >
                <Phone className="h-4 w-4" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === "ar" ? "الاسم" : "Name"}
            </label>
            <div className="relative">
              <Input
                value={formData.name}
                onChange={(e) => onInputChange("name", e.target.value)}
                placeholder={
                  language === "ar" ? "أدخل اسمك" : "Enter your name"
                }
                disabled={disabled}
                className={`${
                  language === "ar" ? "text-right" : "text-left "
                } pr-10 ${disabled ? "bg-gray-100 text-gray-400" : ""}`}
                dir="ltr"
              />
              <User
                className={`absolute  top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 ${
                  language === "ar" ? "left-3" : "right-3"
                }`}
              />
            </div>
          </div>
        </div>
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === "ar"
              ? "البريد الإلكتروني (اختياري)"
              : "Email (Optional)"}
          </label>
          <div className="relative">
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => onInputChange("email", e.target.value)}
              placeholder={
                language === "ar" ? "أدخل بريدك الإلكتروني" : "Enter your email"
              }
              disabled={disabled}
              className={`${
                language === "ar" ? "text-right" : "text-left pl-3 "
              } pr-10 ${disabled ? "bg-gray-100 text-gray-400" : ""}`}
              dir="ltr"
            />
            <Mail
              className={`absolute  top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400  ${
                language === "ar" ? "left-3" : "right-3"
              } `}
            />
          </div>
        </div>
        {/* Create Account Checkbox */}
        <div className="flex items-center justify-end gap-3">
          <label className="text-sm text-gray-700">
            {language === "ar" ? "هل لديك حساب؟" : "Do you have an account?"}{" "}
            <Link
              href=""
              onClick={() => setAuthModalOpen(true)}
              className="text-blue-600 underline cursor-pointer"
            >
              {language === "ar" ? "تسجيل الدخول" : "Login"}
            </Link>
          </label>
          <input
            type="checkbox"
            checked={formData.createAccount}
            onChange={(e) => onInputChange("createAccount", e.target.checked)}
            disabled={disabled}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            {language === "ar" ? "إنشاء حساب" : "Create Account"}
          </span>
        </div>
      </div>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
