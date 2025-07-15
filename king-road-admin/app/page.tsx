"use client";

import { AdminLayout } from "@/components/layout/admin-layout";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  FolderTree,
  ArrowRight,
  Star,
  Eye,
  TrendingUp,
} from "lucide-react";

import { useLanguage } from "@/components/providers/language-provider";
import { useVendorAuth } from "@/contexts/vendor-auth-context";
import {
  useGetRecentOrders,
  useGetStatistics,
  useGetTopProducts,
} from "@/api/statistics";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import Link from "next/link";

function getStatusColor(status) {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "shipped":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "confirmed":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
}

export default function DashboardPage() {
  const { t } = useLanguage();
  const { user } = useVendorAuth();

  const { statistics, statisticsLoading, statisticsError } = useGetStatistics();

  const { recentOrders, recentOrdersLoading, recentOrdersError } =
    useGetRecentOrders();

  const { topProducts, topProductsLoading, topProductsError } =
    useGetTopProducts();

  return (
    <AdminLayout>
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your store today.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statisticsLoading || statisticsError ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))
          ) : (
            <>
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Revenue
                      </p>
                      <p className="text-2xl font-bold">
                        {statistics.total_revenue} AED
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">
                          +{statistics.revenue_growth}%
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Orders
                      </p>
                      <p className="text-2xl font-bold">
                        {statistics.total_orders}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-blue-600">
                          +{statistics.orders_growth}%
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                      <ShoppingCart className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Active Products
                      </p>
                      <p className="text-2xl font-bold">
                        {statistics.total_products}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-sm text-red-600">
                          {statistics.low_stock_products} low stock
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Out of Stock
                      </p>
                      <p className="text-2xl font-bold">
                        {statistics.out_of_stock_products}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-sm text-muted-foreground">
                          {statistics.out_of_stock_products} out of stock
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <Star className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Recent Orders and Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/orders">
                    View All <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentOrdersLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : recentOrdersError ? (
                <p className="text-red-500">Failed to load recent orders.</p>
              ) : (
                <div className="space-y-4">
                  {recentOrders?.map((order: any) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">
                            {order.order_number}
                          </span>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {order.customer_name} ({order.customer_phone})
                        </p>
                        <p className="text-sm font-medium">
                          {order.items?.[0]?.product_name || "-"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{order.total} AED</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Top Products</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/products">
                    Manage Products <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {topProductsLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : topProductsError ? (
                <p className="text-red-500">Failed to load top products.</p>
              ) : (
                <div className="space-y-4">
                  {topProducts?.map((product: any, index: number) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-primary">
                          #{index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{product.total_sold} sales</span>
                          <span>{product.current_price} AED</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{product.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          Stock: {product.inventory}
                        </p>
                        <Badge
                          variant={
                            product.inventory > 10 ? "secondary" : "destructive"
                          }
                        >
                          {product.inventory > 10 ? "In Stock" : "Low Stock"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          {/* Quick Actions */}
        </div>
        <Card className="mt-8 border-0 shadow-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-20 flex-col gap-2" asChild>
                <Link href="/products/new">
                  <Package className="h-6 w-6" />
                  Add Product
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                <Link href="/orders">
                  <ShoppingCart className="h-6 w-6" />
                  View Orders
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                <Link href="/categories/new">
                  <FolderTree className="h-6 w-6" />
                  Add Category
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                <Link href="/products">
                  <Eye className="h-6 w-6" />
                  View Products
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </AdminLayout>
  );
}
