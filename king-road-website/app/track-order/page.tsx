"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  Package,
  MapPin,
  Phone,
  Calendar,
  Loader2,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Eye,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { lookupOrder, useGetOrderList } from "@/api/order";
import { Order } from "@/util/type";
import { getPhoneData, getToken } from "@/util/storage";
import { getStatusColor, getStatusIcon, getStatusSteps } from "@/util/static";
import NoOrders from "@/components/NoOrder";
import { useStore } from "@/store/useStore";

type ViewMode = "list" | "search" | "details";

export default function TrackOrderPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { language } = useStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const token = getToken();

  const [phone, setPhone] = useState<any>();

  useEffect(() => {
    const data = getPhoneData();
    setPhone(data?.replace(/^"|"$/g, ""));
  }, []);

  console.log("Phone:", phone);

  const { orderList, orderLoading, orderError, revalidateOrder } =
    useGetOrderList({ phone: !token && phone });

  // Handle order search
  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    setSelectedOrder(null);

    try {
      const response = await lookupOrder(data);

      if (response.status === 1) {
        setSelectedOrder(response.data);
        setViewMode("details");
        toast({
          title: "Order Found",
          description: `Order #${response.data.order_number} details loaded successfully.`,
        });
      } else {
        throw new Error(response.message || "Order not found");
      }
    } catch (error: any) {
      console.error("Order lookup failed:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to find order";
      setError(errorMessage);
      toast({
        title: "Order Not Found",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle order selection from list
  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
    setViewMode("details");
    setError(null);
  };

  // Handle back navigation
  const handleBack = () => {
    setSelectedOrder(null);
    setError(null);
    setViewMode("list");
    reset();
  };

  // Handle switch to search mode
  const handleSearchMode = () => {
    setViewMode("search");
    setError(null);
    reset();
  };

  // Render order list view
  const renderOrderList = () => (
    <div className="space-y-6">
      {/* Header with search option */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {language === "ar" ? "طلباتك" : "Your Orders"}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === "ar"
              ? "عرض وتتبع جميع طلباتك"
              : "View and track all your orders"}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleSearchMode}
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          {language === "ar" ? "البحث برقم الطلب" : "Search by Order Number"}
        </Button>
      </div>

      {/* Orders List */}
      {orderLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">
                {language === "ar"
                  ? "جاري تحميل طلباتك..."
                  : "Loading your orders..."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : orderError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <NoOrders />
        </Alert>
      ) : orderList && orderList.length > 0 ? (
        <div className="space-y-4">
          {orderList.map((order: any) => (
            <Card
              key={order.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleOrderSelect(order)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(order.status)}
                    </div>
                    <div
                      className={`flex-1 min-w-0 ${
                        language === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      <div
                        className={`flex items-center gap-3 mb-2 ${
                          language === "ar" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <h3 className="font-semibold text-gray-900">
                          {language === "ar" ? "الطلب #" : "Order #"}
                          {order.order_number}
                        </h3>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </Badge>
                      </div>
                      <div
                        className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 ${
                          language === "ar" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(order.created_at).toLocaleDateString(
                            language === "ar" ? "ar-AE" : "en-US"
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          {order.items?.length || 0}{" "}
                          {language === "ar" ? "عناصر" : "items"}
                        </div>
                        <div className="font-medium text-gray-900">
                          AED {order.total}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {language === "ar" ? "عرض التفاصيل" : "View Details"}
                      </span>
                    </Button>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <NoOrders />
      )}
    </div>
  );
  // Render search form view
  const renderSearchForm = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          {language === "ar" ? (
            <ArrowRight className="h-4 w-4 mr-2" />
          ) : (
            <ArrowLeft className="h-4 w-4 mr-2" />
          )}
          Back to Orders
        </Button>
      </div>

      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Search Your Order
        </h1>
        <p className="text-gray-600">
          Enter your order number and phone number to track your order
        </p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Your Order
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="order_number">Order Number</Label>
                <Input
                  id="order_number"
                  {...register("order_number", {
                    required: "Order number is required",
                  })}
                  placeholder="e.g., KR250104001"
                />
                {/* {errors.order_number && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.order_number.message}
                  </p>
                )} */}
              </div>
              <div>
                <Label htmlFor="customer_phone">Phone Number</Label>
                <Input
                  id="customer_phone"
                  {...register("customer_phone", {
                    required: "Phone number is required",
                  })}
                  placeholder="+971 XX XXX XXXX"
                />
                {/* {errors.customer_phone && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.customer_phone.message}
                  </p>
                )} */}
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Track Order
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );

  // Render order details view
  const renderOrderDetails = () => {
    if (!selectedOrder) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            {language === "ar" ? (
              <ArrowRight className="h-4 w-4 mr-2" />
            ) : (
              <ArrowLeft className="h-4 w-4 mr-2" />
            )}
            {language === "ar" ? "العودة إلى الطلبات" : "Back to Orders"}
          </Button>
        </div>

        {/* Order Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                {getStatusIcon(selectedOrder.status)}
                {language === "ar" ? "الطلب #" : "Order #"}
                {selectedOrder.order_number}
              </span>
              <Badge className={getStatusColor(selectedOrder.status)}>
                {selectedOrder.status.charAt(0).toUpperCase() +
                  selectedOrder.status.slice(1)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Status Timeline */}
            <div className="space-y-4">
              <h4 className="font-medium">
                {language === "ar" ? "تقدم الطلب" : "Order Progress"}
              </h4>
              <div className="space-y-3">
                {getStatusSteps(selectedOrder.status).map((step, index) => (
                  <div key={step.key} className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed
                          ? "bg-green-100 text-green-600"
                          : step.current
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-current" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          step.completed || step.current
                            ? "text-gray-900"
                            : "text-gray-500"
                        }`}
                      >
                        {language === "ar" ? step.labelAr : step.label}
                      </p>
                      <p className="text-sm text-gray-600">
                        {language === "ar"
                          ? step.descriptionAr
                          : step.description}
                      </p>
                    </div>
                    {step.current && (
                      <Badge
                        variant="outline"
                        className="text-blue-600 border-blue-600"
                      >
                        {language === "ar" ? "حالي" : "Current"}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking Information */}
            {selectedOrder.tracking_number && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  {language === "ar"
                    ? "معلومات التتبع"
                    : "Tracking Information"}
                </h4>
                <p className="text-sm text-blue-800">
                  {language === "ar" ? "رقم التتبع: " : "Tracking Number: "}
                  <span className="font-mono">
                    {selectedOrder.tracking_number}
                  </span>
                </p>
                {selectedOrder.estimated_delivery && (
                  <p className="text-sm text-blue-800 mt-1">
                    {language === "ar"
                      ? "موعد التسليم المتوقع: "
                      : "Estimated Delivery: "}
                    {new Date(
                      selectedOrder.estimated_delivery
                    ).toLocaleDateString(language === "ar" ? "ar-AE" : "en-US")}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer & Delivery Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  {language === "ar"
                    ? "معلومات العميل"
                    : "Customer Information"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{selectedOrder.customer_name}</p>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.customer_phone}
                  </p>
                  {selectedOrder.customer_email && (
                    <p className="text-sm text-gray-600">
                      {selectedOrder.customer_email}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {language === "ar" ? "عنوان التوصيل" : "Delivery Address"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                3
                <p className="text-gray-700">
                  {selectedOrder.formatted_address}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "ar" ? "ملخص الطلب" : "Order Summary"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>
                    {language === "ar" ? "تاريخ الطلب" : "Order Date"}
                  </span>
                  <span>
                    {new Date(selectedOrder.created_at).toLocaleDateString(
                      language === "ar" ? "ar-AE" : "en-US"
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>
                    {language === "ar" ? "طريقة الدفع" : "Payment Method"}
                  </span>
                  <span>
                    {selectedOrder.payment_method === "cash_on_delivery"
                      ? language === "ar"
                        ? "الدفع عند الاستلام"
                        : "Cash on Delivery"
                      : selectedOrder.payment_method}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>
                    {language === "ar" ? "المجموع الفرعي" : "Subtotal"}
                  </span>
                  <span>AED {selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    {language === "ar" ? "رسوم التوصيل" : "Delivery Fee"}
                  </span>
                  <span
                    className={
                      selectedOrder.delivery_fee === 0 ? "text-green-600" : ""
                    }
                  >
                    {selectedOrder.delivery_fee === 0
                      ? language === "ar"
                        ? "مجاناً"
                        : "FREE"
                      : `AED ${selectedOrder.delivery_fee}`}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>{language === "ar" ? "الإجمالي" : "Total"}</span>
                  <span>AED {selectedOrder.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === "ar" ? "عناصر الطلب" : "Order Items"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedOrder.items.map((item: any) => {
                const cleanImageUrl = item?.image?.includes("assets/images/")
                  ? item.image.replace("http://localhost:8000", "")
                  : item?.image || "/assets/images/hero/1.jpg";
                return (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      {item.product_image ? (
                        <img
                          src={cleanImageUrl}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {item.product_name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {language === "ar" ? "الرقم التسلسلي: " : "SKU: "}
                        {item.product_sku}
                      </p>
                      <p className="text-sm text-gray-600">
                        {language === "ar" ? "الكمية: " : "Quantity: "}
                        {item.quantity} × AED {item.price}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">AED {item.total}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Render no Auth view */}

      <div className="mt-4">
        {viewMode === "list" && renderOrderList()}
        {viewMode === "search" && renderSearchForm()}
        {viewMode === "details" && renderOrderDetails()}
      </div>
    </div>
  );
}
