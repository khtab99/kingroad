"use client";

import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useGetCartItems,
  useGetCartTotal,
  useCartActions,
  CartItem,
} from "@/api/cart";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function CartPage() {
  const { language } = useStore();
  const router = useRouter();
  const [discountCode, setDiscountCode] = useState("");
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});

  // Fetch cart data from API
  const { cartItems, cartLoading, cartError, cartEmpty, revalidateCart } =
    useGetCartItems();

  const { cartTotal, cartTotalLoading, cartTotalError } = useGetCartTotal();

  const { updateItemQuantity, removeItemFromCart } = useCartActions();

  const handleQuantityUpdate = async (
    cartItem: CartItem,
    newQuantity: number
  ) => {
    if (newQuantity < 1) {
      handleRemoveItem(cartItem);
      return;
    }

    setLoadingItems((prev) => ({ ...prev, [cartItem.id]: true }));

    try {
      await updateItemQuantity(cartItem.id, newQuantity);
      toast.success(
        language === "ar"
          ? "تم تحديث الكمية بنجاح"
          : "Quantity updated successfully"
      );
    } catch (error: any) {
      toast.error(
        error?.message ||
          (language === "ar"
            ? "فشل في تحديث الكمية"
            : "Failed to update quantity")
      );
    } finally {
      setLoadingItems((prev) => ({ ...prev, [cartItem.id]: false }));
    }
  };

  const handleRemoveItem = async (cartItem: CartItem) => {
    setLoadingItems((prev) => ({ ...prev, [cartItem.id]: true }));

    try {
      await removeItemFromCart(cartItem.id);
      revalidateCart(); // Force revalidation after removal
      toast.success(
        language === "ar" ? "تم حذف المنتج من السلة" : "Item removed from cart"
      );
    } catch (error: any) {
      console.error("Remove item error:", error);
      toast.error(
        error?.message ||
          (language === "ar" ? "فشل في حذف المنتج" : "Failed to remove item")
      );
    } finally {
      setLoadingItems((prev) => ({ ...prev, [cartItem.id]: false }));
    }
  };

  const handleCheckout = () => {
    if (cartEmpty) {
      return;
    }
    router.push("/checkout");
  };

  const handleGoBack = () => {
    router.back();
  };

  // Loading state
  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
              <p className="text-gray-600">
                {language === "ar" ? "جاري تحميل السلة..." : "Loading cart..."}
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (cartError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-4">
                {language === "ar"
                  ? "حدث خطأ في تحميل السلة"
                  : "Error loading cart"}
              </p>
              <Button onClick={revalidateCart} variant="outline">
                {language === "ar" ? "إعادة المحاولة" : "Try Again"}
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <ProtectedRoute>
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
            <h3 className="text-gray-800 font-medium mb-4 text-right">
              {language === "ar" ? "عناصر الطلب" : "Order Items"}
            </h3>

            {cartEmpty ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4 animate-bounce" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {language === "ar"
                    ? "عربة التسوق فارغة"
                    : "Your cart is empty"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {language === "ar"
                    ? "لا يوجد منتجات في عربة التسوق الخاصة بك."
                    : "There are no products in your cart."}
                </p>
                <Link href="/category/all">
                  <Button className="bg-gray-600 hover:bg-gray-700 text-white">
                    {language === "ar" ? "تسوق الآن" : "Shop Now"}
                  </Button>
                </Link>
              </div>
            ) : (
              cartItems.map((item: any) => {
                const isLoading = loadingItems[item.id];
                const productName =
                  language === "ar"
                    ? item.product.name_ar
                    : item.product.name_en;

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
                            item.product.featured_image ||
                            "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg"
                          }
                          alt={productName}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col items-start">
                        <h4 className="text-gray-800 font-medium text-sm leading-relaxed mb-2">
                          x{item.quantity} {productName}
                        </h4>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-end gap-3 mb-2">
                          <button
                            onClick={() =>
                              handleQuantityUpdate(item, item.quantity + 1)
                            }
                            disabled={isLoading || !item.product.is_in_stock}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                            ) : (
                              <Plus className="h-4 w-4 text-gray-600" />
                            )}
                          </button>

                          <span className="text-gray-800 font-medium min-w-[20px] text-center">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              handleQuantityUpdate(item, item.quantity - 1)
                            }
                            disabled={isLoading}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>

                        {/* Stock Status */}
                        {!item.product.is_in_stock && (
                          <p className="text-red-500 text-xs">
                            {language === "ar" ? "غير متوفر" : "Out of stock"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center flex-col gap-4">
                      {/* Price */}
                      <div className="text-left ml-4">
                        <span className="text-gray-800 font-medium">
                          {item.total.toFixed(2)}{" "}
                          {language === "ar" ? "د.إ" : "AED"}
                        </span>
                      </div>
                      <div className="flex items-center justify-end gap-4">
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item)}
                          disabled={isLoading}
                          className="text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Discount Code */}
          {!cartEmpty && (
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
          )}

          {/* Order Summary */}
          {!cartEmpty && (
            <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-800">
                    {cartTotalLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      `${cartTotal.subtotal.toFixed(2)} ${
                        language === "ar" ? "د.إ" : "AED"
                      }`
                    )}
                  </span>
                  <span className="text-gray-600">
                    {language === "ar" ? "المجموع الفرعي" : "Subtotal"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-800">
                    {cartTotal?.delivery_fee}{" "}
                    {language === "ar" ? "د.إ" : "AED"}
                  </span>
                  <span className="text-gray-600">
                    {language === "ar" ? "رسوم التوصيل" : "Delivery Fee"}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800 font-medium text-lg">
                      {cartTotal.total.toFixed(2)}{" "}
                      {language === "ar" ? "د.إ" : "AED"}
                    </span>
                    <span className="text-gray-800 font-medium">
                      {language === "ar" ? "المجموع" : "Total"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Checkout Button */}
          <Button
            onClick={handleCheckout}
            disabled={cartEmpty || cartTotalLoading}
            className={`w-full py-4 text-lg font-medium rounded-md ${
              !cartEmpty && !cartTotalLoading
                ? "bg-gray-600 hover:bg-gray-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {cartTotalLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {language === "ar" ? "جاري التحميل..." : "Loading..."}
              </div>
            ) : language === "ar" ? (
              "الذهاب لإتمام الطلب"
            ) : (
              "Proceed to Checkout"
            )}
          </Button>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}