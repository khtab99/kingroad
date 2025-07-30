"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Truck,
  Calendar,
  Edit,
  Send,
  FileText,
  Phone,
  Mail,
} from "lucide-react";
import {
  useGetOrderById,
  updateOrder,
  updateOrderStatus,
  addOrderTracking,
} from "@/api/order";
import {
  AddOrderTrackingData,
  Order,
  UpdateOrderStatusData,
} from "@/util/type";
import { set } from "date-fns";
import { AdminLayout } from "@/components/layout/admin-layout";

const statusOptions = [
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "confirmed",
    label: "Confirmed",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "processing",
    label: "Processing",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "shipped",
    label: "Shipped",
    color: "bg-indigo-100 text-indigo-800",
  },
  {
    value: "delivered",
    label: "Delivered",
    color: "bg-green-100 text-green-800",
  },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
];

const paymentStatusOptions = [
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  { value: "paid", label: "Paid", color: "bg-green-100 text-green-800" },
  { value: "failed", label: "Failed", color: "bg-red-100 text-red-800" },
  {
    value: "refunded",
    label: "Refunded",
    color: "bg-orange-100 text-orange-800",
  },
];

export default function OrderDetailsPage() {
  const { id: orderId } = useParams();
  const router = useRouter();

  const [updating, setUpdating] = useState(false);

  // Status update dialog
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusNotes, setStatusNotes] = useState("");

  // Tracking dialog
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
  const [trackingData, setTrackingData] = useState<AddOrderTrackingData>({
    tracking_number: "",
    shipping_method: "",
    estimated_delivery: "",
  });
  const { order, orderLoading, orderError, orderValidating, revalidateOrder } =
    useGetOrderById(orderId);

  const handleStatusUpdate = async () => {
    if (!newStatus) return;

    try {
      setUpdating(true);
      const data: UpdateOrderStatusData = {
        status: newStatus,
        notes: statusNotes,
      };

      await updateOrderStatus(orderId, data);
      toast.success("Order status updated successfully");
      setStatusDialogOpen(false);
      revalidateOrder();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  const handleTrackingUpdate = async () => {
    if (!trackingData.tracking_number) return;

    try {
      setUpdating(true);
      await addOrderTracking(orderId, trackingData);
      toast.success("Tracking information added successfully");
      setTrackingDialogOpen(false);
      setTrackingData({
        tracking_number: "",
        shipping_method: "",
        estimated_delivery: "",
      });
    } catch (error) {
      console.error("Error adding tracking:", error);
      toast.error("Failed to add tracking information");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string, type: "status" | "payment") => {
    const options = type === "status" ? statusOptions : paymentStatusOptions;
    const option = options.find((opt) => opt.value === status);
    return (
      <Badge className={option?.color || "bg-gray-100 text-gray-800"}>
        {option?.label || status}
      </Badge>
    );
  };

  const formatCurrency = (amount: string) => {
    return `AED ${parseFloat(amount).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (orderError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The order you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/orders")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      {orderLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              {/* <Button variant="outline" onClick={() => router.push("/orders")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button> */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-300">
                  Order #{order?.order_number}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Created on {formatDate(order?.created_at)}
                </p>
              </div>
            </div>

            <div className="flex space-x-2">
              <Dialog
                open={statusDialogOpen}
                onOpenChange={setStatusDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Update Status
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Order Status</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="status">New Status</Label>
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        value={statusNotes}
                        onChange={(e) => setStatusNotes(e.target.value)}
                        placeholder="Add any notes about this status change..."
                      />
                    </div>
                    <Button
                      onClick={handleStatusUpdate}
                      disabled={updating || !newStatus}
                    >
                      {updating ? "Updating..." : "Update Status"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog
                open={trackingDialogOpen}
                onOpenChange={setTrackingDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Truck className="w-4 h-4 mr-2" />
                    Add Tracking
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Tracking Information</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="tracking_number">Tracking Number *</Label>
                      <Input
                        id="tracking_number"
                        value={trackingData.tracking_number}
                        onChange={(e) =>
                          setTrackingData((prev) => ({
                            ...prev,
                            tracking_number: e.target.value,
                          }))
                        }
                        placeholder="Enter tracking number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="shipping_method">Shipping Method</Label>
                      <Input
                        id="shipping_method"
                        value={trackingData.shipping_method}
                        onChange={(e) =>
                          setTrackingData((prev) => ({
                            ...prev,
                            shipping_method: e.target.value,
                          }))
                        }
                        placeholder="e.g., Aramex, DHL, FedEx"
                      />
                    </div>
                    <div>
                      <Label htmlFor="estimated_delivery">
                        Estimated Delivery
                      </Label>
                      <Input
                        id="estimated_delivery"
                        type="datetime-local"
                        value={trackingData.estimated_delivery}
                        onChange={(e) =>
                          setTrackingData((prev) => ({
                            ...prev,
                            estimated_delivery: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <Button
                      onClick={handleTrackingUpdate}
                      disabled={updating || !trackingData.tracking_number}
                    >
                      {updating ? "Adding..." : "Add Tracking"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Order Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Order Status
                      </Label>
                      <div className="mt-1">
                        {getStatusBadge(order?.status, "status")}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Payment Status
                      </Label>
                      <div className="mt-1">
                        {getStatusBadge(order?.payment_status, "payment")}
                      </div>
                    </div>
                    {order?.tracking_number && (
                      <>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Tracking Number
                          </Label>
                          <p className="mt-1 font-mono text-sm">
                            {order?.tracking_number}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Shipping Method
                          </Label>
                          <p className="mt-1">
                            {order?.shipping_method || "N/A"}
                          </p>
                        </div>
                      </>
                    )}
                    {order?.estimated_delivery && (
                      <div className="col-span-2">
                        <Label className="text-sm font-medium text-gray-500">
                          Estimated Delivery
                        </Label>
                        <p className="mt-1">
                          {formatDate(order?.estimated_delivery)}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order?.items.map((item: any) => {
                      const cleanImageUrl = item?.image?.includes(
                        "assets/images/"
                      )
                        ? item.image.replace("http://localhost:8000", "")
                        : item?.image || "/assets/images/hero/1.jpg";
                      return (
                        <div
                          key={item.id}
                          className="flex items-center space-x-4 p-4 border rounded-lg"
                        >
                          <img
                            src={cleanImageUrl}
                            alt={item.product_name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.product_name}</h4>
                            <p className="text-sm text-gray-500">
                              SKU: {item.product_sku}
                            </p>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity} ×{" "}
                              {formatCurrency(item.price)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {formatCurrency(item.total)}
                            </p>
                            {item.product.is_low_stock && (
                              <Badge variant="destructive" className="text-xs">
                                Low Stock
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Separator className="my-4" />

                  {/* Order Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(order?.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span>{formatCurrency(order?.delivery_fee)}</span>
                    </div>
                    {parseFloat(order?.discount) > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-{formatCurrency(order?.discount)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>{formatCurrency(order?.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              {(order?.customer_notes || order?.internal_notes) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {order?.customer_notes && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Customer Notes
                        </Label>
                        <p className="mt-1 p-3 bg-blue-50 rounded-md">
                          {order?.customer_notes}
                        </p>
                      </div>
                    )}
                    {order?.internal_notes && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Internal Notes
                        </Label>
                        <p className="mt-1 p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
                          {order?.internal_notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium text-gray-500">
                      Name :
                    </Label>
                    <p className="mt-1">{order?.customer_name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium text-gray-500">
                      Phone :
                    </Label>
                    <div className="flex items-center mt-1">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <a
                        href={`tel:${order?.customer_phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {order?.customer_phone}
                      </a>
                    </div>
                  </div>
                  {order?.customer_email && (
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium text-gray-500">
                        Email :
                      </Label>
                      <div className="flex items-center mt-1">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <a
                          href={`mailto:${order?.customer_email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {order?.customer_email}
                        </a>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium text-gray-500">
                      Customer Type :
                    </Label>
                    <div className="mt-1">
                      <Badge
                        variant={
                          order?.is_guest_order ? "secondary" : "default"
                        }
                      >
                        {order?.is_guest_order ? "Guest" : "Registered"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge variant="outline" className="mb-2">
                      {order?.address_details?.type
                        ? order.address_details.type.charAt(0).toUpperCase() +
                          order.address_details.type.slice(1)
                        : ""}
                    </Badge>

                    <p className="text-sm leading-relaxed">
                      {order?.formatted_address}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Payment Method
                    </Label>
                    <p className="mt-1 capitalize">
                      {order?.payment_method || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Payment Status
                    </Label>
                    <div className="mt-1">
                      {getStatusBadge(order?.payment_status, "payment")}
                    </div>
                  </div>
                  {order?.payment_reference && (
                    <div className="overflow-hidden">
                      <Label className="text-sm font-medium text-gray-500">
                        Payment Reference
                      </Label>
                      <p className="mt-1 font-mono text-sm truncate">
                        {order?.payment_reference}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Order Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Created
                    </Label>
                    <p className="mt-1 text-sm">
                      {formatDate(order?.created_at)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Last Updated
                    </Label>
                    <p className="mt-1 text-sm">
                      {formatDate(order?.updated_at)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
