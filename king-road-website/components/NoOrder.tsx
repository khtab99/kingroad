import React from "react";
import {
  ShoppingBag,
  LogIn,
  Search,
  Package,
  ArrowRight,
  User,
  Shield,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

const NoOrders = () => {
  return (
    <Card>
      <CardContent className="text-center mx-auto py-12">
        <Package className="h-24 w-24 text-gray-400 mx-auto mb-4 animate-bounce" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No orders found
        </h3>
        <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
      </CardContent>
    </Card>
  );
};

export default NoOrders;
