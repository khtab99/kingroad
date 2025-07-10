"use client";

import Image from "next/image";
import { Product } from "@/api/product";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { addProductToCart } from "@/api/cart";
import { useToast } from "@/hooks/use-toast";

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
  const { toast: useToastHook } = useToast();

  const productName = language === "ar" ? product.name_ar : product.name_en;
  const isOutOfStock = !product.is_in_stock;

  const handleAddToCart = async () => {
    if (isOutOfStock) {
      useToastHook({
        title: "Out of Stock",
        description: "This product is currently out of stock.",
        variant: "destructive",
      });
      return;
    }

    setIsAddingToCart(true);

    try {
      await addToCart(product, 1);
      useToastHook({
        title: "Added to Cart",
        description: `${productName} has been added to your cart.`,
      });

      // Optional callback
      // onAddToCart?.(product);
    } catch (err: any) {
      // Log entire error for diagnostics
      console.error("Add to cart error:", err);

      useToastHook({
        title: "Failed to Add",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock) {
      toast.error(
        language === "ar" ? "المنتج غير متوفر" : "Product out of stock"
      );
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
            className="object-cover"
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
              {Number(product.current_price)?.toFixed(2)}{" "}
              {language === "ar" ? "د.إ" : "AED"}
            </span>
            {product.is_on_sale && product.sale_price && (
              <span className="text-sm text-gray-500 line-through">
                {product?.price?.toFixed(2)} {language === "ar" ? "د.إ" : "AED"}
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
              className="flex-1"
              disabled={isOutOfStock}
              onClick={handleBuyNow}
            >
              {language === "ar" ? "اشتري الآن" : "Buy Now"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              disabled={isOutOfStock || isAddingToCart}
              onClick={handleAddToCart}
            >
              {isAddingToCart ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  {product.is_in_stock ? (language === "ar" ? "أضف" : "Add") : (language === "ar" ? "نفد المخزون" : "Out of Stock")}
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
              ? `${product.inventory} متبقي`
              : `${product.inventory} left`}
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
              {Number(product.current_price)?.toFixed(2)}{" "}
              {language === "ar" ? "د.إ" : "AED"}
            </span>
            {product.is_on_sale && product.sale_price && (
              <span className="text-sm text-gray-500 line-through">
                {product?.price}
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
            className="flex-1"
            disabled={isOutOfStock}
            onClick={handleBuyNow}
          >
            {language === "ar" ? "اشتري الآن" : "Buy Now"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            disabled={isOutOfStock || isAddingToCart}
            onClick={handleAddToCart}
          >
            {isAddingToCart ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-1" />
                {product.is_in_stock ? (language === "ar" ? "+ أضف" : "+ Add") : (language === "ar" ? "نفد المخزون" : "Out of Stock")}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}