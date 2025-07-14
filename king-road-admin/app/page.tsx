"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/components/providers/language-provider'
import { useVendorAuth } from '@/contexts/vendor-auth-context'
import { VendorHeader } from '@/components/layout/vendor-header'
import { VendorSidebar } from '@/components/layout/vendor-sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  Users,
  Star,
  DollarSign,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  BarChart3
} from 'lucide-react'

export default function VendorDashboard() {
  const { t } = useLanguage()
  const { user, isAuthenticated } = useVendorAuth()

  // Mock vendor data
  const vendorStats = {
    totalRevenue: 15420,
    monthlyRevenue: 3240,
    revenueGrowth: 12.5,
    totalOrders: 156,
    monthlyOrders: 34,
    ordersGrowth: 8.3,
    totalProducts: 45,
    activeProducts: 42,
    outOfStock: 3,
    averageRating: 4.8,
    totalReviews: 234,
    profileCompletion: 85
  }

  const recentOrders = [
    {
      id: 'ORD-001',
      customer: 'Ahmed Hassan',
      product: 'Traditional Sudanese Thob',
      amount: 299,
      status: 'pending',
      date: '2024-01-15'
    },
    {
      id: 'ORD-002',
      customer: 'Fatima Al-Rashid',
      product: 'Handwoven Basket Set',
      amount: 129,
      status: 'shipped',
      date: '2024-01-14'
    },
    {
      id: 'ORD-003',
      customer: 'Omar Khalil',
      product: 'Sudanese Spice Collection',
      amount: 89,
      status: 'delivered',
      date: '2024-01-13'
    }
  ]

  const topProducts = [
    {
      id: 1,
      name: 'Traditional Sudanese Thob',
      sales: 23,
      revenue: 6877,
      rating: 4.9,
      stock: 12
    },
    {
      id: 2,
      name: 'Handwoven Basket Set',
      sales: 18,
      revenue: 2322,
      rating: 4.8,
      stock: 8
    },
    {
      id: 3,
      name: 'Sudanese Spice Collection',
      sales: 15,
      revenue: 1335,
      rating: 4.7,
      stock: 25
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-6">
              You need to be logged in as a vendor to access this dashboard.
            </p>
            <Button asChild>
              <Link href="/login">Login as Vendor</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      <VendorHeader />
      
      <div className="flex">
        <VendorSidebar />
        
        <main className="flex-1 p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your store today.
            </p>
          </div>

          {/* Profile Completion Alert */}
          {vendorStats.profileCompletion < 100 && (
            <Card className="mb-8 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <AlertTriangle className="h-8 w-8 text-amber-600" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                      Complete Your Profile
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                      Your profile is {vendorStats.profileCompletion}% complete. Complete it to increase visibility.
                    </p>
                    <Progress value={vendorStats.profileCompletion} className="mb-3" />
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/profile">
                        Complete Profile
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Revenue */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">{vendorStats.totalRevenue.toLocaleString()} AED</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">+{vendorStats.revenueGrowth}%</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Orders */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold">{vendorStats.totalOrders}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-blue-600">+{vendorStats.ordersGrowth}%</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Products</p>
                    <p className="text-2xl font-bold">{vendorStats.activeProducts}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-sm text-muted-foreground">{vendorStats.outOfStock} out of stock</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rating */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                    <p className="text-2xl font-bold">{vendorStats.averageRating}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-sm text-muted-foreground">{vendorStats.totalReviews} reviews</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Orders</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/orders">
                      View All
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{order.id}</span>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{order.customer}</p>
                        <p className="text-sm font-medium">{order.product}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{order.amount} AED</p>
                        <p className="text-sm text-muted-foreground">{order.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Top Products</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/products">
                      Manage Products
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{product.sales} sales</span>
                          <span>{product.revenue} AED</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{product.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Stock: {product.stock}</p>
                        <Badge variant={product.stock > 10 ? 'secondary' : 'destructive'}>
                          {product.stock > 10 ? 'In Stock' : 'Low Stock'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-8 border-0 shadow-lg">
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
                  <Link href="/analytics">
                    <BarChart3 className="h-6 w-6" />
                    Analytics
                  </Link>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                  <Link href="/messages">
                    <Users className="h-6 w-6" />
                    Messages
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}