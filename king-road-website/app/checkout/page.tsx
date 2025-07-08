"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CheckoutHeader from "../../components/checkout/CheckoutHeader";
import AddressTypeSelection from "../../components/checkout/AddressTypeSelection";
import AddressForm from "../../components/checkout/AddressForm";
import DeliveryTab from "../../components/checkout/DeliveryTab";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useGetCartItems, useGetCartTotal } from "@/api/cart";

export default function CheckoutPage() {
  const { language } = useStore();
  const router = useRouter();

  // Get cart data from API
  const { cartItems, cartEmpty } = useGetCartItems();
  const { cartTotal } = useGetCartTotal();

  const [selectedAddressType, setSelectedAddressType] = useState("");
  const [formData, setFormData] = useState({
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

  // Redirect if cart is empty
  useEffect(() => {
    if (cartEmpty) {
      toast.error(language === "ar" ? "عربة التسوق فارغة" : "Cart is empty", {
        description:
          language === "ar"
            ? "يجب إضافة منتجات للمتابعة"
            : "Please add products to continue",
      });
      router.push("/category/all");
    }
  }, [cartEmpty, language, router]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid = () => {
    if (!selectedAddressType) return false;
    
    // Common required fields
    if (!formData.street.trim() || !formData.name.trim() || !formData.phone.trim()) {
      return false;
    }

    // Address type specific validation
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

    const checkoutData = {
      addressType: selectedAddressType,
      ...formData,
      cartItems,
      subtotal: cartTotal.subtotal,
      deliveryFee: cartTotal.delivery_fee || 0,
      total: cartTotal.total,
    };

    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
    router.push("/checkout/confirm");
  };

  if (cartEmpty) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="max-w-2xl mx-auto px-4 py-6">
        <CheckoutHeader
          language={language}
          onBack={() => router.back()}
          title={language === "ar" ? "تأكيد الطلب" : "Confirm Order"}
        />

        <DeliveryTab language={language} />

        <AddressTypeSelection
          language={language}
          selectedAddressType={selectedAddressType}
          onSelectAddressType={setSelectedAddressType}
        />

        <AddressForm
          language={language}
          selectedAddressType={selectedAddressType}
          formData={formData}
          onInputChange={handleInputChange}
          disabled={!selectedAddressType}
        />

        <Button
          onClick={handleNext}
          disabled={!isFormValid()}
          className={`w-full py-4 text-lg font-medium rounded-md ${
            isFormValid()
              ? "bg-gray-600 hover:bg-gray-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {language === "ar" ? "التالي" : "Next"}
        </Button>

        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}