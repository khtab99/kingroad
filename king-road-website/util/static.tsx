import {
  Search,
  Package,
  MapPin,
  Phone,
  Calendar,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Truck,
} from "lucide-react";

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case "confirmed":
      return <CheckCircle className="h-5 w-5 text-blue-500" />;
    case "processing":
      return <Package className="h-5 w-5 text-purple-500" />;
    case "shipped":
      return <Truck className="h-5 w-5 text-indigo-500" />;
    case "delivered":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "cancelled":
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Clock className="h-5 w-5 text-gray-500" />;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "processing":
      return "bg-purple-100 text-purple-800";
    case "shipped":
      return "bg-indigo-100 text-indigo-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusSteps = (currentStatus: string) => {
  const steps = [
    {
      key: "pending",
      label: "Order Placed",
      description: "Your order has been received",
    },
    {
      key: "confirmed",
      label: "Confirmed",
      description: "Order confirmed and being prepared",
    },
    {
      key: "processing",
      label: "Processing",
      description: "Items are being prepared",
    },
    { key: "shipped", label: "Shipped", description: "Order is on the way" },
    {
      key: "delivered",
      label: "Delivered",
      description: "Order has been delivered",
    },
  ];

  const statusOrder = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
  ];
  const currentIndex = statusOrder.indexOf(currentStatus);

  return steps.map((step, index) => ({
    ...step,
    completed: index <= currentIndex,
    current: index === currentIndex,
  }));
};
