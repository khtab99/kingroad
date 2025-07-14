"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/components/providers/language-provider'
import { VendorHeader } from '@/components/layout/vendor-header'
import { VendorSidebar } from '@/components/layout/vendor-sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  MessageSquare,
  DollarSign,
  Calendar
} from 'lucide-react'

export default function OrdersPage() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  // Mock orders data
  const orders = [
    {
      id: 'ORD-001',
      customer: {
        name: 'Ahmed Hassan',
        email: 'ahmed.hassan@email.com',
        phone: '+971 50 123 4567'
      },
      products: [
        { name: 'Traditional Sudanese Thob', quantity: 1, price: 299 }
      ],
      total: 324,
      status: 'pending',
      paymentStatus: 'paid',
      shippingAddress: 'Dubai, UAE',
      orderDate: '2024-01-15T10:30:00Z',
      estimatedDelivery: '2024-01-20',
      trackingNumber: null
    },
    {
      id: 'ORD-002',
      customer: {
        name: 'Fatima Al-Rashid',
        email: 'fatima.rashid@email.com',
        phone: '+971 55 987 6543'
      },
      products: [
        { name: 'Handwoven Basket Set', quantity: 2, price: 129 }
      ],
      total: 283,
      status: 'shipped',
      paymentStatus: 'paid',
      shippingAddress: 'Abu Dhabi, UAE',
      orderDate: '2024-01-14T14:20:00Z',
      estimatedDelivery: '2024-01-19',
      trackingNumber: 'TRK123456789'
    },
    {
      id: 'ORD-003',
      customer: {
        name: 'Omar Khalil',
        email: 'omar.khalil@email.com',
        phone: '+971 52 456 7890'
      },
      products: [
        { name: 'Sudanese Spice Collection', quantity: 1, price: 89 },
        { name: 'Traditional Coffee Set', quantity: 1, price: 159 }
      ],
      total: 273,
      status: 'delivered',
      paymentStatus: 'paid',
      shippingAddress: 'Sharjah, UAE',
      orderDate: '2024-01-13T09:15:00Z',
      estimatedDelivery: '2024-01-18',
      trackingNumber: 'TRK987654321'
    },
    {
      id: 'ORD-004',
      customer: {
        name: 'Mariam Abdullah',
        email: 'mariam.abdullah@email.com',
        phone: '+971 56 234 5678'
      },
      products: [
        { name: 'Gold Plated Bracelet', quantity: 1, price: 199 }
      ],
      total: 224,
      status: 'processing',
      paymentStatus: 'paid',
      shippingAddress: 'Ajman, UAE',
      orderDate: '2024-01-12T16:45:00Z',
      estimatedDelivery: '2024-01-17',
      trackingNumber: null
    },
    {
      id: 'ORD-005',
      customer: {
        name: 'Hassan Mohamed',
        email: 'hassan.mohamed@email.com',
        phone: '+971 50 876 5432'
      },
      products: [
        { name: 'Embroidered Prayer Cap', quantity: 3, price: 45 }
      ],
      total: 160,
      status: 'cancelled',
      paymentStatus: 'refunded',
      shippingAddress: 'Ras Al Khaimah, UAE',
      orderDate: '2024-01-11T11:30:00Z',
      estimatedDelivery: null,
      trackingNumber: null
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'shipped': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock
      case 'processing': return Package
      case 'shipped': return Truck
      case 'delivered': return CheckCircle
      case 'cancelled': return AlertCircle
      default: return Clock
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      <VendorHeader />
      
      <div className="flex">
        <VendorSidebar />
        
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Orders</h1>
              <p className="text-muted-foreground">
                Manage and track your customer orders
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Total Orders</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
                  <div className="text-sm text-muted-foreground">Processing</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.shipped}</div>
                  <div className="text-sm text-muted-foreground">Shipped</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
                  <div className="text-sm text-muted-foreground">Delivered</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
                  <div className="text-sm text-muted-foreground">Cancelled</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.totalRevenue}</div>
                  <div className="text-sm text-muted-foreground">Revenue (AED)</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders by ID, customer name, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Orders ({filteredOrders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status)
                  return (
                    <div key={order.id} className="border rounded-lg p-6 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <StatusIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{order.id}</h3>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(order.orderDate)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="text-right mr-4">
                            <div className="font-bold text-lg">{order.total} AED</div>
                            <div className="text-sm text-muted-foreground">
                              {order.products.length} item{order.products.length > 1 ? 's' : ''}
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/orders/${order.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Contact Customer
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Download Invoice
                              </DropdownMenuItem>
                              {order.status === 'pending' && (
                                <DropdownMenuItem>
                                  <Package className="h-4 w-4 mr-2" />
                                  Mark as Processing
                                </DropdownMenuItem>
                              )}
                              {order.status === 'processing' && (
                                <DropdownMenuItem>
                                  <Truck className="h-4 w-4 mr-2" />
                                  Mark as Shipped
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <h4 className="font-medium mb-1">Customer</h4>
                          <p className="text-muted-foreground">{order.customer.name}</p>
                          <p className="text-muted-foreground">{order.customer.email}</p>
                          <p className="text-muted-foreground">{order.customer.phone}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-1">Products</h4>
                          {order.products.map((product, index) => (
                            <p key={index} className="text-muted-foreground">
                              {product.quantity}x {product.name}
                            </p>
                          ))}
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-1">Shipping</h4>
                          <p className="text-muted-foreground">{order.shippingAddress}</p>
                          {order.estimatedDelivery && (
                            <p className="text-muted-foreground">
                              Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                            </p>
                          )}
                          {order.trackingNumber && (
                            <p className="text-muted-foreground">
                              Tracking: {order.trackingNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || statusFilter !== 'all'
                      ? 'Try adjusting your filters to see more orders.'
                      : 'Orders will appear here when customers make purchases.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}