"use client";

import { useState, useEffect, useMemo } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, Edit } from "lucide-react";
import Link from "next/link";
import { useAdminAuth } from "@/contexts/admin-auth-context";
import { useGetOrderList } from "@/api/order";

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  total: number;
  status: string;
  payment_status: string;
  payment_method: string;
  created_at: string;
}

export default function OrdersPage() {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    payment_status: "all",
  });

  const { orderList, orderLoading, orderEmpty } = useGetOrderList(filters);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const getStatusColor = (status) => {
    const colorMap = {
      pending: "default",
      confirmed: "default",
      processing: "default",
      shipped: "default",
      delivered: "default",
      cancelled: "destructive",
    };
    return colorMap[status] || "secondary";
  };

  const getPaymentStatusColor = (status) => {
    const colorMap = {
      paid: "default",
      pending: "secondary",
      failed: "destructive",
      refunded: "outline",
    };
    return colorMap[status] || "secondary";
  };

  const filteredOrders = useMemo(() => {
    const { search } = filters;
    return orderList.filter((order) =>
      [
        order.order_number,
        order.customer_name,
        order.customer_phone,
        order.customer_email,
      ]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(search.toLowerCase()))
    );
  }, [orderList, filters]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">
            Manage customer orders and track their status
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Management</CardTitle>
            <CardDescription>
              View and manage all customer orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "all",
                    "pending",
                    "confirmed",
                    "processing",
                    "shipped",
                    "delivered",
                    "cancelled",
                  ].map((status) => (
                    <SelectItem key={status} value={status}>
                      {status[0].toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.payment_status}
                onValueChange={(value) =>
                  handleFilterChange("payment_status", value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Payment status" />
                </SelectTrigger>
                <SelectContent>
                  {["all", "pending", "paid", "failed", "refunded"].map(
                    (status) => (
                      <SelectItem key={status} value={status}>
                        {status[0].toUpperCase() + status.slice(1)}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.order_number}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {order.customer_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.customer_phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>AED {order.total}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getPaymentStatusColor(order.payment_status)}
                        >
                          {order.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Link href={`/orders/${order.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
