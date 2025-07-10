'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Truck
} from 'lucide-react';
import { guestApi, OrderLookupData } from '@/api/guest';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  status: string;
  payment_method: string;
  payment_status: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  formatted_address: string;
  customer_notes?: string;
  created_at: string;
  tracking_number?: string;
  estimated_delivery?: string;
  items: Array<{
    id: number;
    product_name: string;
    product_sku: string;
    product_image?: string;
    quantity: number;
    price: number;
    total: number;
  }>;
}

export default function TrackOrderPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<OrderLookupData>();

  const onSubmit = async (data: OrderLookupData) => {
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const response = await guestApi.lookupOrder(data);
      
      if (response.status === 1) {
        setOrder(response.data);
        toast({
          title: "Order Found",
          description: `Order #${response.data.order_number} details loaded successfully.`,
        });
      } else {
        throw new Error(response.message || 'Order not found');
      }
    } catch (error: any) {
      console.error('Order lookup failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to find order';
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'confirmed': return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'processing': return <Package className="h-5 w-5 text-purple-500" />;
      case 'shipped': return <Truck className="h-5 w-5 text-indigo-500" />;
      case 'delivered': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusSteps = (currentStatus: string) => {
    const steps = [
      { key: 'pending', label: 'Order Placed', description: 'Your order has been received' },
      { key: 'confirmed', label: 'Confirmed', description: 'Order confirmed and being prepared' },
      { key: 'processing', label: 'Processing', description: 'Items are being prepared' },
      { key: 'shipped', label: 'Shipped', description: 'Order is on the way' },
      { key: 'delivered', label: 'Delivered', description: 'Order has been delivered' }
    ];

    const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">
            Enter your order number and phone number to track your order status
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
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
                    {...register('order_number', { required: 'Order number is required' })}
                    placeholder="e.g., KR250104001"
                  />
                  {errors.order_number && (
                    <p className="text-sm text-red-600 mt-1">{errors.order_number.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="customer_phone">Phone Number</Label>
                  <Input
                    id="customer_phone"
                    {...register('customer_phone', { required: 'Phone number is required' })}
                    placeholder="+971 XX XXX XXXX"
                  />
                  {errors.customer_phone && (
                    <p className="text-sm text-red-600 mt-1">{errors.customer_phone.message}</p>
                  )}
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full md:w-auto">
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
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Order Details */}
        {order && (
          <div className="space-y-8">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    Order #{order.order_number}
                  </span>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Status Timeline */}
                <div className="space-y-4">
                  <h4 className="font-medium">Order Progress</h4>
                  <div className="space-y-3">
                    {getStatusSteps(order.status).map((step, index) => (
                      <div key={step.key} className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed 
                            ? 'bg-green-100 text-green-600' 
                            : step.current 
                              ? 'bg-blue-100 text-blue-600' 
                              : 'bg-gray-100 text-gray-400'
                        }`}>
                          {step.completed ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-current" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${
                            step.completed || step.current ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {step.label}
                          </p>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                        {step.current && (
                          <Badge variant="outline" className="text-blue-600 border-blue-600">
                            Current
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tracking Information */}
                {order.tracking_number && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Tracking Information</h4>
                    <p className="text-sm text-blue-800">
                      Tracking Number: <span className="font-mono">{order.tracking_number}</span>
                    </p>
                    {order.estimated_delivery && (
                      <p className="text-sm text-blue-800 mt-1">
                        Estimated Delivery: {new Date(order.estimated_delivery).toLocaleDateString()}
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
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-sm text-gray-600">{order.customer_phone}</p>
                      {order.customer_email && (
                        <p className="text-sm text-gray-600">{order.customer_email}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Delivery Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{order.formatted_address}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Order Date</span>
                      <span>{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Method</span>
                      <span>
                        {order.payment_method === 'cash_on_delivery' ? 'Cash on Delivery' : order.payment_method}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>AED {order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span className={order.delivery_fee === 0 ? 'text-green-600' : ''}>
                        {order.delivery_fee === 0 ? 'FREE' : `AED ${order.delivery_fee.toFixed(2)}`}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>AED {order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        {item.product_image ? (
                          <img
                            src={item.product_image}
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
                        <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                        <p className="text-sm text-gray-500">SKU: {item.product_sku}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity} × AED {item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">AED {item.total.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}