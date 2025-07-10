"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GuestCheckoutForm from "@/components/checkout/GuestCheckoutForm";
import { cartApi } from "@/api/cart";
import { Loader2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CartItem {
  id: string;
  product_id: number;
  quantity: number;
  price: number;
  total: number;
  product: {
    id: number;
    name: string;
    name_en: string;
    name_ar: string;
    featured_image: string;
    sku: string;
    current_price: number;
    is_in_stock: boolean;
  };
}

interface CartTotal {
  subtotal: number;
  item_count: number;
  total: number;
}

export default function GuestCheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState<CartTotal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadCartData();
  }, []);

  const loadCartData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load cart items and total
      const [itemsResponse, totalResponse] = await Promise.all([
        cartApi.getCart(),
        cartApi.getCartTotal(),
      ]);

      // if (itemsResponse.status === 1 && totalResponse.status === 1) {
      //   const items = itemsResponse.data || [];
      //   const total = totalResponse.data;

      //   if (items.length === 0) {
      //     // Redirect to cart if empty
      //     router.push('/cart');
      //     return;
      //   }

      //   setCartItems(items);
      //   setCartTotal(total);
      // } else {
      //   throw new Error('Failed to load cart data');
      // }
    } catch (error: any) {
      console.error("Failed to load cart:", error);
      setError(error.message || "Failed to load cart data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Unable to Load Cart
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <Button onClick={loadCartData} variant="outline">
              Try Again
            </Button>
            <Link href="/cart">
              <Button>Go to Cart</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!cartTotal || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 mb-6">
            Add some items to your cart before checking out.
          </p>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <GuestCheckoutForm cartItems={cartItems} cartTotal={cartTotal} />
    </div>
  );
}
