"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, User, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cartItems, cartTotal, user } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, [cartItems, router]);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart to continue</p>
          <Button onClick={() => router.push('/category/all')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Choose how you'd like to complete your order</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Guest Checkout */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Guest Checkout</CardTitle>
              <p className="text-sm text-gray-600">
                Quick checkout without creating an account
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Fast and simple</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>No account required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Track with order number</span>
                </div>
              </div>
              <Link href="/checkout/guest" className="block">
                <Button className="w-full">
                  Continue as Guest
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Account Checkout */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {user ? (
                  <User className="h-8 w-8 text-green-600" />
                ) : (
                  <UserPlus className="h-8 w-8 text-green-600" />
                )}
              </div>
              <CardTitle>
                {user ? 'Account Checkout' : 'Create Account & Checkout'}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {user 
                  ? 'Use your saved addresses and preferences' 
                  : 'Create an account for faster future orders'
                }
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Save addresses</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Order history</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Faster future checkouts</span>
                </div>
              </div>
              {user ? (
                <Link href="/checkout/account" className="block">
                  <Button className="w-full" variant="outline">
                    Continue with Account
                  </Button>
                </Link>
              ) : (
                <div className="space-y-2">
                  <Link href="/login?redirect=/checkout" className="block">
                    <Button className="w-full" variant="outline">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register?redirect=/checkout" className="block">
                    <Button className="w-full" variant="outline">
                      Create Account
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <Card className="max-w-md mx-auto mt-8">
          <CardHeader>
            <CardTitle className="text-center">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Items ({cartTotal.item_count})</span>
                <span>AED {cartTotal.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>AED {cartTotal.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}