"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  MapPin,
  Phone,
  Mail,
  User,
  CreditCard,
  Package,
} from "lucide-react";
import { GuestOrderData, guestApi } from "@/api/guest";
import { cartApi } from "@/api/cart";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

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

interface GuestCheckoutFormProps {
  cartItems: CartItem[];
  cartTotal: {
    subtotal: number;
    item_count: number;
    total: number;
  };
}

export default function GuestCheckoutForm({
  cartItems,
  cartTotal,
}: GuestCheckoutFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GuestOrderData>({
    defaultValues: {
      address_type: "house",
      city: "Umm Al Quwain",
      country: "United Arab Emirates",
      payment_method: "cash_on_delivery",
      delivery_fee: 0,
    },
  });

  const addressType = watch("address_type");

  const validateCartBeforeSubmit = async () => {
    try {
      const validation = await guestApi.validateCart();
      if (!validation.data.valid) {
        setValidationErrors(validation.data.errors);
        return false;
      }
      setValidationErrors([]);
      return true;
    } catch (error) {
      console.error("Cart validation failed:", error);
      toast({
        title: "Validation Error",
        description: "Failed to validate cart. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const onSubmit = async (data: GuestOrderData) => {
    setIsSubmitting(true);

    try {
      // Validate cart first
      const isCartValid = await validateCartBeforeSubmit();
      if (!isCartValid) {
        setIsSubmitting(false);
        return;
      }

      // Create guest order
      const response = await guestApi.createOrder(data);

      if (response.status === 1) {
        toast({
          title: "Order Placed Successfully!",
          description: `Your order #${response.data.order_number} has been placed.`,
        });

        // Redirect to order confirmation page
        router.push(
          `/checkout/success?order=${response.data.order_number}&phone=${data.customer_phone}`
        );
      } else {
        throw new Error(response.message || "Failed to create order");
      }
    } catch (error: any) {
      console.error("Order creation failed:", error);
      toast({
        title: "Order Failed",
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deliveryFee = 0; // Free delivery
  const finalTotal = cartTotal.subtotal + deliveryFee;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Guest Checkout</h1>
        <p className="text-gray-600 mt-2">
          Complete your order without creating an account
        </p>
      </div>

      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">Please fix the following issues:</p>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-sm">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer_name">Full Name *</Label>
                    <Input
                      id="customer_name"
                      {...register("customer_name", {
                        required: "Name is required",
                      })}
                      placeholder="Enter your full name"
                    />
                    {errors.customer_name && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.customer_name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="customer_phone">Phone Number *</Label>
                    <Input
                      id="customer_phone"
                      {...register("customer_phone", {
                        required: "Phone number is required",
                      })}
                      placeholder="+971 XX XXX XXXX"
                    />
                    {errors.customer_phone && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.customer_phone.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="customer_email">
                    Email Address (Optional)
                  </Label>
                  <Input
                    id="customer_email"
                    type="email"
                    {...register("customer_email")}
                    placeholder="your.email@example.com"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    We'll send order updates to this email
                  </p>
                </div>
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
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address_type">Address Type *</Label>
                  <Select
                    value={addressType}
                    onValueChange={(value) =>
                      setValue("address_type", value as any)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    {...register("street", {
                      required: "Street address is required",
                    })}
                    placeholder="Enter street address"
                  />
                  {errors.street && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.street.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addressType === "house" && (
                    <div>
                      <Label htmlFor="house_number">House Number</Label>
                      <Input
                        id="house_number"
                        {...register("house_number")}
                        placeholder="House number"
                      />
                    </div>
                  )}

                  {(addressType === "apartment" ||
                    addressType === "office") && (
                    <>
                      <div>
                        <Label htmlFor="building_number">Building Number</Label>
                        <Input
                          id="building_number"
                          {...register("building_number")}
                          placeholder="Building number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="floor">Floor</Label>
                        <Input
                          id="floor"
                          {...register("floor")}
                          placeholder="Floor number"
                        />
                      </div>
                    </>
                  )}

                  {addressType === "apartment" && (
                    <div>
                      <Label htmlFor="apartment_number">Apartment Number</Label>
                      <Input
                        id="apartment_number"
                        {...register("apartment_number")}
                        placeholder="Apartment number"
                      />
                    </div>
                  )}

                  {addressType === "office" && (
                    <div>
                      <Label htmlFor="office_number">Office Number</Label>
                      <Input
                        id="office_number"
                        {...register("office_number")}
                        placeholder="Office number"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" {...register("city")} placeholder="City" />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      {...register("country")}
                      placeholder="Country"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="additional_description">
                    Additional Description
                  </Label>
                  <Textarea
                    id="additional_description"
                    {...register("additional_description")}
                    placeholder="Landmarks, special instructions, etc."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="cash_on_delivery"
                      value="cash_on_delivery"
                      {...register("payment_method")}
                      className="h-4 w-4"
                    />
                    <Label
                      htmlFor="cash_on_delivery"
                      className="flex items-center gap-2"
                    >
                      <Package className="h-4 w-4" />
                      Cash on Delivery
                      <Badge variant="secondary">Recommended</Badge>
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">
                    Pay when your order is delivered
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Order Notes (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  {...register("customer_notes")}
                  placeholder="Any special instructions for your order..."
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Placing Order...
                </>
              ) : (
                `Place Order - AED ${finalTotal}`
              )}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cart Items */}
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={
                          item.product.featured_image ||
                          "/assets/images/product/placeholder.jpg"
                        }
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <Badge
                        variant="secondary"
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                      >
                        {item.quantity}
                      </Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        AED {item.price} each
                      </p>
                    </div>
                    <p className="text-sm font-medium">AED {item.total}</p>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({cartTotal.item_count} items)</span>
                  <span>AED {cartTotal.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span className="text-green-600">
                    {deliveryFee === 0 ? "FREE" : `AED ${deliveryFee}`}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>AED {finalTotal}</span>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">
                  Free Delivery
                </p>
                <p className="text-xs text-blue-600">
                  Estimated delivery: 1-2 business days
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
