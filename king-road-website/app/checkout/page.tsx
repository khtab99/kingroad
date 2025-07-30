"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CheckoutHeader from "../../components/checkout/CheckoutHeader";
import AddressTypeSelection from "../../components/checkout/AddressTypeSelection";
import AddressForm from "../../components/checkout/AddressForm";
import DeliveryTab from "../../components/checkout/DeliveryTab";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid"; // ✅ Import uuid
import {
  getCheckOutData,
  getToken,
  getUserData,
  setPhoneData,
} from "@/util/storage";
import { LoadingSpinner } from "@/components/checkout/confirm/LoadingSpinner";

export default function CheckoutPage() {
  const { cartItems, language, cartCount } = useStore();
  const router = useRouter();

  const [selectedAddressType, setSelectedAddressType] = useState("");

  const token = getToken(); // however you're checking auth

  const [parsedUserData, setParsedUserData] = useState<any>({});

  const checkoutData = getCheckOutData();

  useEffect(() => {
    try {
      const raw: any = getUserData();
      setParsedUserData(JSON.parse(raw) || {});
    } catch {
      setParsedUserData({});
    }
  }, []);

  const [formData, setFormData] = useState({
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
  console.log(formData);

  useEffect(() => {
    if (checkoutData) {
      setFormData(JSON.parse(checkoutData));
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
  };

  if (!cartCount) {
    return <LoadingSpinner language={language} />;
  }

  const isFormValid = () => {
    if (!selectedAddressType) return false;

    if (
      !formData.street.trim() ||
      !formData.name.trim() ||
      !formData.phone.trim()
    ) {
      return false;
    }

    switch (selectedAddressType) {
      case "house":
        return formData.houseNumber.trim() !== "";

      case "apartment":
        return (
          formData.buildingNumber.trim() !== "" &&
          formData.floor.trim() !== "" &&
          formData.apartmentNumber.trim() !== ""
        );

      case "office":
        return (
          formData.buildingNumber.trim() !== "" &&
          formData.floor.trim() !== "" &&
          formData.officeNumber.trim() !== ""
        );

      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!isFormValid()) {
      toast.error(
        language === "ar"
          ? "يرجى ملء جميع الحقول المطلوبة"
          : "Please fill all required fields"
      );
      return;
    }
    const deliveryfee = 35;

    const checkoutData = {
      checkoutSessionId: uuidv4(), // ✅ Generate unique session ID
      timestamp: Date.now(), // Add timestamp for session expiry checking
      addressType: selectedAddressType,
      ...formData,
      cartItems,
      subtotal: cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      deliveryFee: deliveryfee,
      total: cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity + deliveryfee,
        0
      ),
    };

    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
    if (!token) {
      setPhoneData(checkoutData.phone);
    }
    router.push("/checkout/confirm");
  };

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
        />
      </div>

      <Button
        onClick={handleNext}
        disabled={!isFormValid()}
        className={`w-full py-4 text-lg font-medium rounded-md ${
          isFormValid()
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-red-400 text-white cursor-not-allowed"
        }`}
      >
        {language === "ar" ? "التالي" : "Next"}
      </Button>
    </div>
  );
}
