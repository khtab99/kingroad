"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  ChevronRight,
  ChevronLeft,
  Home,
  Building,
  Building2,
  User,
  Phone,
  Mail,
  Clock,
  CreditCard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { createNewOrder } from "@/api/order";
import { paymentApi } from "@/api/payment";

interface CheckoutData {
  addressType: string;
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
  cartItems: any[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export default function CheckoutConfirmPage() {
  const { language, clearCart } = useStore();
  const router = useRouter();

  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  console.log("checkoutData", checkoutData);

  useEffect(() => {
    const data = localStorage.getItem("checkoutData");
    if (!data) {
      toast.error(
        language === "ar" ? "لا توجد بيانات طلب" : "No order data found"
      );
      router.push("/cart");
      return;
    }

    try {
      const parsedData = JSON.parse(data);
      setCheckoutData(parsedData);
    } catch (error) {
      toast.error(
        language === "ar" ? "خطأ في بيانات الطلب" : "Error in order data"
      );
      router.push("/cart");
    }
  }, [language, router]);

  const paymentMethods = [
    {
      id: "cards",
      nameAr: "بطاقات الإمارات",
      nameEn: "UAE Cards",
      icon: "/assets/icons/visa.svg",
    },
    {
      id: "apple-pay",
      nameAr: "آبل باي",
      nameEn: "Apple Pay",
      icon: "/assets/icons/apple.svg",
    },
  ];

  const addressTypes = {
    house: { ar: "منزل", en: "House", icon: Home },
    apartment: { ar: "شقة", en: "Apartment", icon: Building },
    office: { ar: "مكتب", en: "Office", icon: Building2 },
  };

  const getAddressDetails = () => {
    if (!checkoutData) return "";

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

  const handlePayNow = async () => {
    if (!selectedPaymentMethod) {
      toast.error(
        language === "ar"
          ? "يرجى اختيار طريقة الدفع"
          : "Please select payment method"
      );
      return;
    }

    if (!checkoutData) return;

    try {
      // First create the order
      const orderResponse = await fetch("/api/v1/guest/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_phone: `+971${checkoutData.phone}`,
          customer_name: checkoutData.name,
          customer_email: checkoutData.email || "",
          address_type: checkoutData.addressType,
          street: checkoutData.street,
          house_number: checkoutData.houseNumber || "",
          building_number: checkoutData.buildingNumber || "",
          floor: checkoutData.floor || "",
          apartment_number: checkoutData.apartmentNumber || "",
          office_number: checkoutData.officeNumber || null,
          additional_description: checkoutData.additionalDescription || "",
          delivery_fee: checkoutData.deliveryFee,
          payment_method: selectedPaymentMethod,
          customer_notes: "",
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const orderData = await orderResponse.json();
      const orderId = orderData.data.order.id;
      
      // For cash on delivery, redirect to success page
      if (selectedPaymentMethod === "cash_on_delivery") {
        toast.success(
          language === "ar"
            ? "تم تأكيد الطلب بنجاح"
            : "Order confirmed successfully",
          {
            description:
              language === "ar"
                ? "سيتم التواصل معك قريباً"
                : "We will contact you soon",
          }
        );
        
        clearCart();
        localStorage.removeItem("checkoutData");
        router.push(`/checkout/success?order=${orderData.data.order.order_number}&phone=${encodeURIComponent(orderData.data.order.customer_phone)}`);
        return;
      }
      
      // For card payments, create Stripe checkout session
      if (selectedPaymentMethod === "cards" || selectedPaymentMethod === "apple-pay") {
        const baseUrl = window.location.origin;
        const successUrl = `${baseUrl}/checkout/success`;
        const cancelUrl = `${baseUrl}/checkout/confirm`;
        
        const stripeResponse = await paymentApi.createCheckoutSession({
          order_id: orderId,
          success_url: successUrl,
          cancel_url: cancelUrl,
        });
        
        if (stripeResponse.status === 1 && stripeResponse.data.checkout_url) {
          // Redirect to Stripe checkout
          window.location.href = stripeResponse.data.checkout_url;
        } else {
          throw new Error(stripeResponse.message || "Failed to create payment session");
        }
      }

    } catch (error) {
      console.error(error);
      toast.error(
        language === "ar" ? "فشل في تأكيد الطلب" : "Failed to confirm order"
      );
    }
  };

  if (!checkoutData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {language === "ar" ? "جاري التحميل..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  const AddressIcon =
    addressTypes[checkoutData.addressType as keyof typeof addressTypes]?.icon ||
    Home;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            {language === "ar" ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>

          <h1 className="text-lg font-medium text-gray-800">
            {language === "ar" ? "طريقة الدفع" : "Payment Method"}
          </h1>

          <div></div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-8">
          <h2 className="text-center text-gray-700 mb-6">
            {language === "ar"
              ? "اختر طريقة الدفع المفضلة لديك"
              : "Choose your preferred payment method"}
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedPaymentMethod(method.id)}
                className={`p-6 rounded-lg border-2 transition-all ${
                  selectedPaymentMethod === method.id
                    ? "border-gray-800 bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-10 flex items-center justify-center">
                    <Image
                      src={method.icon}
                      alt={language === "ar" ? method.nameAr : method.nameEn}
                      width={64}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {language === "ar" ? method.nameAr : method.nameEn}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
          <h3 className="text-gray-800 font-medium mb-4 text-center">
            {language === "ar" ? "عناصر الطلب" : "Order Items"}
          </h3>

          {checkoutData.cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2 text-right"
            >
              <span className="text-gray-800 font-medium">
                {item.price} {language === "ar" ? "د.إ" : "AED"}
              </span>
              <span className="text-gray-600">
                x{item.quantity} {item.name}
              </span>
            </div>
          ))}
        </div>

        {/* Delivery Information */}
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

          {/* Address Details */}
          <div className="space-y-3 text-right">
            <div className="flex items-center justify-end gap-2">
              <span className="text-gray-700">
                {checkoutData.country}, {checkoutData.city}
              </span>
              <AddressIcon className="h-4 w-4 text-gray-600" />
            </div>

            <div className="text-sm text-gray-600">{getAddressDetails()}</div>

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

        {/* Payment Method Display */}
        {selectedPaymentMethod && (
          <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
            <div className="text-right">
              <h3 className="text-gray-800 font-medium mb-2">
                {language === "ar" ? "طريقة الدفع" : "Payment Method"}
              </h3>
              <p className="text-gray-600">
                {language === "ar"
                  ? paymentMethods.find((m) => m.id === selectedPaymentMethod)
                      ?.nameAr
                  : paymentMethods.find((m) => m.id === selectedPaymentMethod)
                      ?.nameEn}
              </p>
            </div>
          </div>
        )}

        {/* Order Total */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
          <div className="space-y-3 text-right">
            <div className="flex justify-between items-center">
              <span className="text-gray-800">
                {checkoutData.subtotal} {language === "ar" ? "د.إ" : "AED"}
              </span>
              <span className="text-gray-600">
                {language === "ar" ? "المجموع الفرعي" : "Subtotal"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-800">
                {checkoutData.deliveryFee} {language === "ar" ? "د.إ" : "AED"}
              </span>
              <span className="text-gray-600">
                {language === "ar" ? "رسوم التوصيل" : "Delivery Fee"}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-800 font-medium text-lg">
                  {checkoutData.total} {language === "ar" ? "د.إ" : "AED"}
                </span>
                <span className="text-gray-800 font-medium">
                  {language === "ar" ? "المجموع" : "Total"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pay Now Button */}
        <Button
          onClick={handlePayNow}
          disabled={!selectedPaymentMethod}
          className={`w-full py-4 text-lg font-medium rounded-md ${
            selectedPaymentMethod
              ? "bg-gray-600 hover:bg-gray-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {language === "ar" ? "ادفع الآن" : "Pay Now"}
        </Button>
      </div>

      <Footer />
    </div>
  );
}
