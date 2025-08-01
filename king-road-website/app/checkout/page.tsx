"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import CheckoutHeader from "../../components/checkout/CheckoutHeader";
import AddressTypeSelection from "../../components/checkout/AddressTypeSelection";
import AddressForm from "../../components/checkout/AddressForm";
import DeliveryTab from "../../components/checkout/DeliveryTab";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import {
  getCheckOutData,
  getToken,
  getUserData,
  setPhoneData,
} from "@/util/storage";
import { LoadingSpinner } from "@/components/checkout/confirm/LoadingSpinner";
import { useGetDeliveryFeeList } from "@/api/delivery_fees";

// Zod validation schemas
const baseAddressSchema = z.object({
  country: z.string().min(1, "Country is required"),
  emirate: z.string().min(1, "Emirate is required"),
  city: z.string().min(1, "City is required"),
  street: z.string().min(1, "Street is required"),
  additionalDescription: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  createAccount: z.boolean().optional(),
});

const houseAddressSchema = baseAddressSchema.extend({
  houseNumber: z.string().min(1, "House number is required"),
  buildingNumber: z.string().optional(),
  floor: z.string().optional(),
  apartmentNumber: z.string().optional(),
  officeNumber: z.string().optional(),
});

const apartmentAddressSchema = baseAddressSchema.extend({
  houseNumber: z.string().optional(),
  buildingNumber: z.string().min(1, "Building number is required"),
  floor: z.string().min(1, "Floor is required"),
  apartmentNumber: z.string().min(1, "Apartment number is required"),
  officeNumber: z.string().optional(),
});

const officeAddressSchema = baseAddressSchema.extend({
  houseNumber: z.string().optional(),
  buildingNumber: z.string().min(1, "Building number is required"),
  floor: z.string().min(1, "Floor is required"),
  apartmentNumber: z.string().optional(),
  officeNumber: z.string().min(1, "Office number is required"),
});

type AddressType = "house" | "apartment" | "office" | "";

type FormData = z.infer<typeof baseAddressSchema> & {
  houseNumber: string;
  buildingNumber: string;
  floor: string;
  apartmentNumber: string;
  officeNumber: string;
};

export default function CheckoutPage() {
  const { cartItems, language, cartCount } = useStore();
  const router = useRouter();

  const [selectedAddressType, setSelectedAddressType] =
    useState<AddressType>("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const token = getToken();
  const [parsedUserData, setParsedUserData] = useState<any>({});
  const checkoutData = getCheckOutData();
  const { deliveryFeeList } = useGetDeliveryFeeList();
  const [fee, setFee] = useState(0);

  useEffect(() => {
    const fee = deliveryFeeList[0]?.base_fee || 0;
    setFee(fee);
  }, [deliveryFeeList]);

  useEffect(() => {
    try {
      const raw: any = getUserData();
      setParsedUserData(JSON.parse(raw) || {});
    } catch {
      setParsedUserData({});
    }
  }, []);

  const [formData, setFormData] = useState<FormData>({
    country: "UAE",
    emirate: "",
    city: "",
    street: "",
    houseNumber: "",
    buildingNumber: "",
    floor: "",
    apartmentNumber: "",
    officeNumber: "",
    additionalDescription: "",
    name: "",
    phone: "",
    email: "",
    createAccount: false,
  });

  useEffect(() => {
    if (checkoutData) {
      try {
        const parsed = JSON.parse(checkoutData);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error("Error parsing checkout data:", error);
      }
    }
  }, [checkoutData]);

  // Update name/email/phone only after login
  useEffect(() => {
    if (token && parsedUserData?.name) {
      setFormData((prev) => ({
        ...prev,
        name: parsedUserData.name || "",
        phone: parsedUserData.phone || "",
        email: parsedUserData.email || "",
      }));
    }
  }, [token, parsedUserData]);

  // Redirect if cart is empty
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (cartCount === 0) {
      toast.error(language === "ar" ? "عربة التسوق فارغة" : "Cart is empty", {
        description:
          language === "ar"
            ? "يجب إضافة منتجات للمتابعة"
            : "Please add products to continue",
      });
      router.push("/product");
    }
  }, [cartCount, language, router]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Get the appropriate schema based on address type
  const getValidationSchema = (addressType: AddressType) => {
    switch (addressType) {
      case "house":
        return houseAddressSchema;
      case "apartment":
        return apartmentAddressSchema;
      case "office":
        return officeAddressSchema;
      default:
        return baseAddressSchema;
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    if (!selectedAddressType) {
      toast.error(
        language === "ar"
          ? "يرجى اختيار نوع العنوان"
          : "Please select address type"
      );
      return false;
    }

    const schema = getValidationSchema(selectedAddressType);
    const result = schema.safeParse(formData);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        const field = error.path[0] as string;
        errors[field] = getLocalizedErrorMessage(error.message);
      });

      setValidationErrors(errors);

      // Show first error message
      const firstError = Object.values(errors)[0];
      toast.error(firstError);

      return false;
    }

    setValidationErrors({});
    return true;
  };

  // Get localized error messages
  const getLocalizedErrorMessage = (message: string): string => {
    if (language === "ar") {
      const arabicMessages: Record<string, string> = {
        "Country is required": "الدولة مطلوبة",
        "Emirate is required": "الإمارة مطلوبة",
        "City is required": "المدينة مطلوبة",
        "Street is required": "الشارع مطلوب",
        "House number is required": "رقم المنزل مطلوب",
        "Building number is required": "رقم المبنى مطلوب",
        "Floor is required": "الطابق مطلوب",
        "Apartment number is required": "رقم الشقة مطلوب",
        "Office number is required": "رقم المكتب مطلوب",
        "Name is required": "الاسم مطلوب",
        "Phone number must be at least 10 digits":
          "رقم الهاتف يجب أن يكون 10 أرقام على الأقل",
        "Invalid email format": "صيغة البريد الإلكتروني غير صحيحة",
      };
      return arabicMessages[message] || message;
    }
    return message;
  };

  // Check if form is valid (for button state)
  const isFormValid = useMemo(() => {
    if (!selectedAddressType) return false;

    const schema = getValidationSchema(selectedAddressType);
    const result = schema.safeParse(formData);

    return result.success;
  }, [selectedAddressType, formData]);

  const handleNext = () => {
    if (!validateForm()) {
      return;
    }

    const checkoutData = {
      checkoutSessionId: uuidv4(),
      timestamp: Date.now(),
      addressType: selectedAddressType,
      ...formData,
      cartItems,
      subtotal: cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      deliveryFee: fee,
      total:
        cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) +
        fee,
    };

    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
    if (!token) {
      setPhoneData(checkoutData.phone);
    }
    router.push("/checkout/confirm");
  };

  if (!cartCount) {
    return <LoadingSpinner language={language} />;
  }

  if (cartCount === 0) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <CheckoutHeader
        language={language}
        onBack={() => router.back()}
        title={language === "ar" ? "معلومات شخصية" : "Personal Information"}
      />

      <DeliveryTab language={language} />

      <AddressTypeSelection
        language={language}
        selectedAddressType={selectedAddressType}
        onSelectAddressType={setSelectedAddressType}
      />

      <div className="" dir={language === "ar" ? "rtl" : "ltr"}>
        <AddressForm
          language={language}
          selectedAddressType={selectedAddressType}
          formData={formData}
          onInputChange={handleInputChange}
          disabled={!selectedAddressType}
          validationErrors={validationErrors}
        />
      </div>

      <Button
        onClick={handleNext}
        // disabled={!isFormValid}
        className={`w-full py-4 text-lg font-medium rounded-md transition-colors ${
          isFormValid
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-red-400 text-white cursor-not-allowed"
        }`}
      >
        {language === "ar" ? "التالي" : "Next"}
      </Button>
    </div>
  );
}
