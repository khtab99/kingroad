"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  ChevronRight,
  ChevronLeft,
  Trash2,
  Edit3,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cartItems, language, updateQuantity, removeFromCart } = useStore();
  const [discountCode, setDiscountCode] = useState("");
  const router = useRouter();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = 35;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      return;
    }
    router.push("/checkout");
  };
  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            {language === "ar" ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>

          <h1 className="text-lg font-medium text-gray-800">
            {language === "ar" ? "قم بمراجعة الطلب" : "Review Order"}
          </h1>

          <div></div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
          <h3 className="text-gray-800 font-medium mb-4 text-center">
            {language === "ar" ? "عناصر الطلب" : "Order Items"}
          </h3>
          {cartItems.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4 animate-bounce" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {language === "ar" ? "عربة التسوق فارغة" : "Your cart is empty"}
              </h3>
              <p className="text-gray-600">
                {language === "ar"
                  ? "لا يوجد منتجات في عربة التسوق الخاصة بك."
                  : "There are no products in your cart."}
              </p>
            </div>
          )}

          {cartItems.map((item: any) => {
            console.log("item", item);

            const cleanImageUrl = item?.image?.includes(
              "assets/images/product/"
            )
              ? item.image.replace("http://localhost:8000", "")
              : item?.image || "/assets/images/product/1.jpg";
            return (
              <div
                key={item.id}
                className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0"
              >
                {/* Product Image */}
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={
                        cleanImageUrl ||
                        "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg"
                      }
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <h4 className="text-gray-800 font-medium text-sm leading-relaxed mb-2">
                      x{item.quantity} {item.name}
                    </h4>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-end gap-3 mb-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            // In a real app, we would check inventory here
                            // For now, we'll just increment
                            item.quantity + 1
                          )
                        }
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        <Plus className="h-4 w-4 text-gray-600" />
                      </button>

                      <span className="text-gray-800 font-medium min-w-[20px] text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Math.max(0, item.quantity - 1)
                          )
                        }
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        <Minus className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center flex-col gap-4">
                  {/* Price */}
                  <div className="text-left ml-4">
                    <span className="text-gray-800 font-medium">
                      {item.price * item.quantity}{" "}
                      {language === "ar" ? "د.إ" : "AED"}
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-4">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Discount Code */}
        {cartItems.length > 0 && (
          <>
            <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
              <h3 className="text-gray-800 font-medium mb-4 text-right">
                {language === "ar" ? "كود الخصم" : "Discount Code"}
              </h3>

              <div className="flex gap-3">
                <Button
                  variant="default"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-2 rounded-md"
                >
                  {language === "ar" ? "تأكيد" : "Apply"}
                </Button>

                <Input
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder={
                    language === "ar" ? "أدخل كود الخصم" : "Enter discount code"
                  }
                  className="flex-1 text-right border-gray-300 rounded-md"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-800">
                    {subtotal} {language === "ar" ? "د.إ" : "AED"}
                  </span>
                  <span className="text-gray-600">
                    {language === "ar" ? "المجموع الفرعي" : "Subtotal"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-800">
                    {deliveryFee} {language === "ar" ? "د.إ" : "AED"}
                  </span>
                  <span className="text-gray-600">
                    {language === "ar" ? "رسوم التوصيل" : "Delivery Fee"}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800 font-medium text-lg">
                      {total} {language === "ar" ? "د.إ" : "AED"}
                    </span>
                    <span className="text-gray-800 font-medium">
                      {language === "ar" ? "المجموع" : "Total"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
              className={`w-full py-4 text-lg font-medium rounded-md ${
                cartItems.length > 0
                  ? "bg-gray-600 hover:bg-gray-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {language === "ar"
                ? "الذهاب لإتمام الطلب"
                : "Proceed to Checkout"}
            </Button>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
