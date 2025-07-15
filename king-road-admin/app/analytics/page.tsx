"use client";

import { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { VendorHeader } from "@/components/layout/vendor-header";
import { VendorSidebar } from "@/components/layout/vendor-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Star,
  Eye,
  Download,
  Calendar,
  Target,
  Award,
} from "lucide-react";

export default function AnalyticsPage() {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState("30d");

  // Mock analytics data
  const analytics = {
    revenue: {
      current: 15420,
      previous: 13250,
      growth: 16.4,
      data: [
        { period: "Week 1", value: 3200 },
        { period: "Week 2", value: 3800 },
        { period: "Week 3", value: 4100 },
        { period: "Week 4", value: 4320 },
      ],
    },
    orders: {
      current: 156,
      previous: 142,
      growth: 9.9,
      data: [
        { period: "Week 1", value: 35 },
        { period: "Week 2", value: 42 },
        { period: "Week 3", value: 38 },
        { period: "Week 4", value: 41 },
      ],
    },
    customers: {
      current: 89,
      previous: 76,
      growth: 17.1,
      returning: 34,
      newCustomers: 55,
    },
    products: {
      views: 2340,
      viewsGrowth: 12.5,
      topProducts: [
        {
          name: "Dashboard Shell 88-97 Gray New",
          sales: 23,
          revenue: 6877,
          views: 456,
        },
        {
          name: "Lighter Illumination Green Color",
          sales: 18,
          revenue: 2322,
          views: 389,
        },
        {
          name: "Door Handle Set Spiral",
          sales: 15,
          revenue: 1335,
          views: 298,
        },
        { name: "Gold Plated Bracelet", sales: 12, revenue: 2388, views: 267 },
        { name: "Traditional Coffee Set", sales: 9, revenue: 1431, views: 234 },
      ],
    },
    performance: {
      conversionRate: 3.8,
      averageOrderValue: 187,
      customerSatisfaction: 4.8,
      returnRate: 2.1,
    },
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} AED`;
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      <VendorHeader />

      <div className="flex">
        <VendorSidebar />

        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Analytics</h1>
              <p className="text-muted-foreground">
                Track your store performance and insights
              </p>
            </div>
            <div className="flex gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-48">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Revenue */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <Badge
                    variant={
                      analytics.revenue.growth > 0 ? "default" : "destructive"
                    }
                  >
                    {analytics.revenue.growth > 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {formatPercentage(analytics.revenue.growth)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(analytics.revenue.current)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    vs {formatCurrency(analytics.revenue.previous)} last period
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Orders */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-white" />
                  </div>
                  <Badge
                    variant={
                      analytics.orders.growth > 0 ? "default" : "destructive"
                    }
                  >
                    {analytics.orders.growth > 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {formatPercentage(analytics.orders.growth)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold">
                    {analytics.orders.current}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    vs {analytics.orders.previous} last period
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Customers */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <Badge
                    variant={
                      analytics.customers.growth > 0 ? "default" : "destructive"
                    }
                  >
                    {analytics.customers.growth > 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {formatPercentage(analytics.customers.growth)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Customers
                  </p>
                  <p className="text-2xl font-bold">
                    {analytics.customers.current}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {analytics.customers.newCustomers} new,{" "}
                    {analytics.customers.returning} returning
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Product Views */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <Badge
                    variant={
                      analytics.products.viewsGrowth > 0
                        ? "default"
                        : "destructive"
                    }
                  >
                    {analytics.products.viewsGrowth > 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {formatPercentage(analytics.products.viewsGrowth)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Product Views
                  </p>
                  <p className="text-2xl font-bold">
                    {analytics.products.views.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Across all products
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Chart */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.revenue.data.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-muted-foreground">
                        {item.period}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(item.value / 5000) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-20 text-right">
                          {formatCurrency(item.value)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-primary" />
                      <span className="font-medium">Conversion Rate</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">
                        {analytics.performance.conversionRate}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Industry avg: 2.5%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <span className="font-medium">Avg. Order Value</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">
                        {formatCurrency(
                          analytics.performance.averageOrderValue
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        +12% vs last month
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Star className="h-5 w-5 text-primary" />
                      <span className="font-medium">Customer Satisfaction</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">
                        {analytics.performance.customerSatisfaction}/5.0
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Based on 234 reviews
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-primary" />
                      <span className="font-medium">Return Rate</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">
                        {analytics.performance.returnRate}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Industry avg: 8.9%
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Top Performing Products</CardTitle>
                <Badge variant="secondary">Last 30 days</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.products.topProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-primary">
                        #{index + 1}
                      </span>
                    </div>

                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 flex-shrink-0">
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                        <div className="text-lg opacity-40">🏺</div>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{product.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{product.sales} sales</span>
                        <span>•</span>
                        <span>{product.views} views</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-primary">
                        {formatCurrency(product.revenue)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Revenue
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
