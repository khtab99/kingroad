"use client";

import Image from "next/image";
import { Product } from "@/api/product";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Eye, ShoppingCartIcon } from "lucide-react";
import { toast } from "sonner";
import { useMemo, useState } from "react";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  variant?: "grid" | "list";
}

export function ProductCard({
  product,
  onAddToCart,
  onBuyNow,
  variant = "grid",
}: ProductCardProps) {
  const { language, addToCart } = useStore();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Track current cart quantity for this product
  const { cartItems } = useStore();
  const currentCartQuantity = useMemo(() => {
    const cartItem = cartItems.find((item) => item.id === product.id);
    return cartItem ? cartItem.quantity : 0;
  }, [cartItems, product.id]);

  // Calculate remaining inventory after considering cart
  const availableInventory = useMemo(() => {
    if (!product.track_inventory) return Infinity;
    return Math.max(0, product.inventory - currentCartQuantity);
  }, [product.inventory, product.track_inventory, currentCartQuantity]);

  // Check if product can be added to cart
  const canAddToCart = useMemo(() => {
    return product.is_in_stock && availableInventory > 0;
  }, [product.is_in_stock, availableInventory]);

  const productName = language === "ar" ? product.name_ar : product.name_en;
  const isOutOfStock = !product.is_in_stock;

  const handleAddToCart = async () => {
    if (isOutOfStock || !canAddToCart) {
      const message = isOutOfStock
        ? language === "ar"
          ? "المنتج غير متوفر"
          : "Product out of stock"
        : language === "ar"
        ? `لا يمكن إضافة المزيد. متبقي ${availableInventory} فقط`
        : `Cannot add more. Only ${availableInventory} left`;

      toast.error(message);
      return;
    }

    setIsAddingToCart(true);

    try {
      const cartItem = {
        id: product.id,
        name: productName,
        price: product.current_price,
        quantity: 1,
        image: product.featured_image,
      };

      addToCart(cartItem);

      if (onAddToCart) {
        onAddToCart(product);
      }

      toast.success(
        language === "ar"
          ? `تم إضافة ${productName} إلى السلة`
          : `${productName} added to cart`,
        {
          description:
            language === "ar"
              ? "يمكنك مراجعة السلة من الأعلى"
              : "You can review your cart from the top",
          duration: 3000,
        }
      );
    } catch (error) {
      toast.error(language === "ar" ? "حدث خطأ" : "Something went wrong");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock || !canAddToCart) {
      const message = isOutOfStock
        ? language === "ar"
          ? "المنتج غير متوفر"
          : "Product out of stock"
        : language === "ar"
        ? `لا يمكن إضافة المزيد. متبقي ${availableInventory} فقط`
        : `Cannot add more. Only ${availableInventory} left`;

      toast.error(message);
      return;
    }

    handleAddToCart();
    if (onBuyNow) {
      onBuyNow(product);
    }
  };

  if (variant === "list") {
    const cleanImageUrl = product?.featured_image?.includes(
      "assets/images/product/"
    )
      ? product.featured_image.replace("http://localhost:8000", "")
      : product?.featured_image || "/assets/images/product/1.jpg";
    return (
      <div className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
        {/* Product Image */}
        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
          <Image
            src={cleanImageUrl}
            alt={productName}
            fill
            className="object-contain"
          />

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {language === "ar" ? "نفد" : "Out"}
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-800 text-sm leading-relaxed mb-1 line-clamp-2">
            {productName}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-semibold text-gray-900">
              {Number(product.current_price)}{" "}
              {language === "ar" ? "د.إ" : "AED"}
            </span>
            {product.is_on_sale && product.sale_price && (
              <span className="text-sm text-gray-500 line-through">
                {product?.price} {language === "ar" ? "د.إ" : "AED"}
              </span>
            )}
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 mb-3">
            {product.is_on_sale && (
              <Badge variant="destructive" className="text-xs">
                -{product.discount_percentage}%
              </Badge>
            )}
            {product.is_featured && (
              <Badge variant="secondary" className="text-xs">
                {language === "ar" ? "مميز" : "Featured"}
              </Badge>
            )}
            <Badge
              variant={isOutOfStock ? "destructive" : "secondary"}
              className="text-xs"
            >
              {isOutOfStock
                ? language === "ar"
                  ? "نفد المخزون"
                  : "Out of Stock"
                : language === "ar"
                ? "متوفر"
                : "In Stock"}
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-red-300 text-white hover:bg-red-400"
              disabled={isOutOfStock}
              onClick={handleBuyNow}
            >
              {language === "ar" ? "اشتري الآن" : "Buy Now"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-red-600 text-white hover:bg-red-700"
              disabled={isOutOfStock || isAddingToCart}
              onClick={handleAddToCart}
            >
              {isAddingToCart ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  {language === "ar" ? "أضف" : "Add"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const cleanImageUrl = product?.featured_image?.includes(
    "assets/images/product/"
  )
    ? product.featured_image.replace("http://localhost:8000", "")
    : product?.featured_image || "/assets/images/product/1.jpg";

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 relative group hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="relative aspect-[4/3] bg-gray-100">
        <Image
          src={cleanImageUrl || "/assets/images/product/1.jpg"}
          alt={productName}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_on_sale && (
            <Badge variant="destructive" className="text-xs">
              -{product.discount_percentage}%
            </Badge>
          )}
          {product.is_featured && (
            <Badge variant="secondary" className="text-xs">
              {language === "ar" ? "مميز" : "Featured"}
            </Badge>
          )}
        </div>

        {/* Watermark Logo */}
        <div className="absolute top-4 right-4 bg-black/40 text-white px-2 py-1 text-sm rounded flex items-center gap-1">
          <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
            <Image
              src="/assets/images/logo.png"
              alt="King Road"
              width={12}
              height={12}
              className="object-contain"
            />
          </div>
          King Road
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-red-600/90 text-white px-4 py-2 rounded-lg font-medium text-lg">
              {language === "ar" ? "غير متوفر" : "Out of Stock"}
            </div>
          </div>
        )}

        {/* Low Stock Warning */}
        {!isOutOfStock && product.is_low_stock && (
          <div className="absolute bottom-2 right-2 bg-orange-500 text-white px-2 py-1 text-xs rounded">
            {language === "ar"
              ? `${availableInventory} متبقي`
              : `${availableInventory} left`}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-800 mb-2 text-sm leading-relaxed line-clamp-2">
          {productName}
        </h3>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              ({product.reviews_count})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">
              {Number(product.current_price)}{" "}
              {language === "ar" ? "د.إ" : "AED"}
            </span>
            {product.is_on_sale && product.sale_price && (
              <span className="text-sm text-gray-500 line-through">
                {product.price}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <Badge
            variant={
              isOutOfStock
                ? "destructive"
                : product.is_low_stock
                ? "secondary"
                : "outline"
            }
            className="text-xs"
          >
            {isOutOfStock
              ? language === "ar"
                ? "نفد المخزون"
                : "Out of Stock"
              : product.is_low_stock
              ? language === "ar"
                ? "كمية قليلة"
                : "Low Stock"
              : language === "ar"
              ? "متوفر"
              : "In Stock"}
          </Badge>
        </div>

        {/* Views */}
        {product.views > 0 && (
          <div className="flex items-center gap-1 mb-3 text-xs text-gray-500">
            <Eye className="h-3 w-3" />
            <span>
              {product.views} {language === "ar" ? "مشاهدة" : "views"}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
            disabled={isOutOfStock || !canAddToCart}
            onClick={handleBuyNow}
          >
            {language === "ar" ? "اشتري الآن" : "Buy Now +"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-red-600 text-white hover:bg-red-700 hover:text-white"
            disabled={isOutOfStock || !canAddToCart || isAddingToCart}
            onClick={handleAddToCart}
          >
            {isAddingToCart ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600" />
            ) : language === "ar" ? (
              availableInventory > 0 ? (
                <div className="flex items-center gap-1">
                  {" "}
                  <span>اضافة</span>
                  <ShoppingCartIcon className="h-4 w-4 " />
                </div>
              ) : (
                <span>نفذ المخزون</span>
              )
            ) : availableInventory > 0 ? (
              <div className="flex items-center gap-1">
                {" "}
                <ShoppingCartIcon className="h-4 w-4 " />
                <span>Add</span>
              </div>
            ) : (
              <span> Out of stock</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
