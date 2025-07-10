'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  Package, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { guestApi } from '@/api/guest';
import Link from 'next/link';

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

export default function CheckoutSuccessPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const orderNumber = searchParams.get('order');
  const customerPhone = searchParams.get('phone');

  useEffect(() => {
    if (orderNumber && customerPhone) {
      loadOrderDetails();
    } else {
      setError('Missing order information');
      setLoading(false);
    }
  }, [orderNumber, customerPhone]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await guestApi.lookupOrder({
        order_number: orderNumber!,
        customer_phone: customerPhone!
      });

      if (response.status === 1) {
        setOrder(response.data);
      } else {
        throw new Error(response.message || 'Failed to load order details');
      }
    } catch (error: any) {
      console.error('Failed to load order:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load order details');
    } finally {
      setLoading(false);
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto p-6">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">
            Thank you for your order. We'll send you updates about your delivery.
          </p>
        </div>

        {/* Order Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order #{order.order_number}
                  </span>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    <Badge className={getPaymentStatusColor(order.payment_status)}>
                      {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Order Date</p>
                    <p className="font-medium">
                      {new Date(order.created_at).toLocaleDateString('en-AE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Payment Method</p>
                    <p className="font-medium">
                      {order.payment_method === 'cash_on_delivery' ? 'Cash on Delivery' : order.payment_method}
                    </p>
                  </div>
                </div>

                {order.customer_notes && (
                  <div>
                    <p className="text-gray-500 text-sm">Order Notes</p>
                    <p className="text-sm bg-gray-50 p-3 rounded">{order.customer_notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Phone className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-sm text-gray-600">{order.customer_phone}</p>
                  </div>
                </div>
                {order.customer_email && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Mail className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600">{order.customer_email}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delivery Address */}
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

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
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

                <Separator />

                {/* Next Steps */}
                <div className="space-y-3">
                  <h4 className="font-medium">What's Next?</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p>We'll confirm your order within 1 hour</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Your order will be prepared and shipped</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Delivery within 1-2 business days</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Actions */}
                <div className="space-y-3">
                  <Link href="/" className="block">
                    <Button className="w-full">Continue Shopping</Button>
                  </Link>
                  <Link href="/track-order" className="block">
                    <Button variant="outline" className="w-full">Track Your Order</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Important Information */}
        <Alert className="mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> Save your order number <strong>#{order.order_number}</strong> and 
            phone number for order tracking and customer support. You can track your order anytime using 
            these details.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}