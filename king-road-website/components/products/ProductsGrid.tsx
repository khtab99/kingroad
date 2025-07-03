"use client";

import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import products from "../../data/products.json";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { PackageX } from "lucide-react";

interface ProductsGridProps {
  selectedCategory: string;
  selectedSubcategories: string[];
  sortBy: string;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function ProductsGrid({
  selectedCategory,
  selectedSubcategories,
  sortBy,
  currentPage,
  onPageChange,
}: ProductsGridProps) {
  const { language, addToCart } = useStore();
  const router = useRouter();
  const [productInventory, setProductInventory] = useState<{
    [key: string]: number;
  }>({});

  // Initialize inventory from products data
  useEffect(() => {
    const inventory: { [key: string]: number } = {};
    products.forEach((product) => {
      inventory[product.id] = product.inventory;
    });
    setProductInventory(inventory);
  }, []);

  // Filter products based on category and subcategories
  const filteredProducts = products.filter((product) => {
    // Category filter
    if (selectedCategory !== "all" && product.category !== selectedCategory) {
      return false;
    }

    // Subcategory filter
    if (
      selectedSubcategories.length > 0 &&
      !selectedSubcategories.includes("all")
    ) {
      if (!selectedSubcategories.includes(product.subcategory)) {
        return false;
      }
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return language === "ar"
          ? a.nameAr.localeCompare(b.nameAr)
          : a.nameEn.localeCompare(b.nameEn);
      case "newest":
      default:
        return 0;
    }
  });

  const handleAddToCart = (product: any) => {
    const currentInventory = productInventory[product.id] || 0;
    if (currentInventory > 0) {
      // Add to cart
      addToCart({
        id: product.id,
        name: language === "ar" ? product.nameAr : product.nameEn,
        price: product.price,
        quantity: 1,
        image: product.image,
      });

      // Decrease inventory
      setProductInventory((prev) => ({
        ...prev,
        [product.id]: Math.max(0, currentInventory - 1),
      }));

      // Show success toast
      toast.success(
        language === "ar"
          ? `تم إضافة ${product.nameAr} إلى السلة`
          : `${product.nameEn} added to cart`,
        {
          description:
            language === "ar"
              ? "يمكنك مراجعة السلة من الأعلى"
              : "You can review your cart from the top",
          duration: 3000,
        }
      );
    } else {
      // Show error toast for out of stock
      toast.error(
        language === "ar" ? "المنتج غير متوفر" : "Product out of stock",
        {
          description:
            language === "ar"
              ? "هذا المنتج غير متوفر حالياً"
              : "This product is currently unavailable",
          duration: 3000,
        }
      );
    }
  };

  const handleBuyNow = (product: any) => {
    const currentInventory = productInventory[product.id] || 0;
    if (currentInventory > 0) {
      handleAddToCart(product);
      router.push("/cart");
    } else {
      toast.error(
        language === "ar" ? "المنتج غير متوفر" : "Product out of stock",
        {
          description:
            language === "ar"
              ? "هذا المنتج غير متوفر حالياً"
              : "This product is currently unavailable",
          duration: 3000,
        }
      );
    }
  };

  const isOutOfStock = (productId: string) => {
    return (productInventory[productId] || 0) <= 0;
  };

  return (
    <div>
      {/* Products Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {language === "ar" ? "الكل" : "All"}
        </h2>
        <p className="text-gray-600 text-sm">
          {sortedProducts.length} {language === "ar" ? "منتج" : "products"}
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedProducts?.map((product: any) => {
          const outOfStock = isOutOfStock(product.id);
          const currentInventory = productInventory[product.id] || 0;

          return (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden border border-gray-200 relative"
            >
              {/* Product Image */}
              <div className="relative aspect-[4/3] bg-gray-100">
                <Image
                  src={product.image}
                  alt={language === "ar" ? product.nameAr : product.nameEn}
                  fill
                  className="object-cover"
                />

                {/* Watermark Logo */}
                <div className="absolute top-4 left-4 bg-black/40 text-white px-2 py-1 text-sm rounded flex items-center gap-1">
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
                {outOfStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-red-600/50 text-white px-4 py-2 rounded-lg font-medium text-lg">
                      {language === "ar" ? "غير متوفر" : "Out of Stock"}
                    </div>
                  </div>
                )}

                {/* Inventory Count */}
                {!outOfStock && currentInventory <= 5 && (
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-2 py-1 text-xs rounded">
                    {language === "ar"
                      ? `${currentInventory} متبقي`
                      : `${currentInventory} left`}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-medium text-gray-800 mb-2 text-sm leading-relaxed">
                  {language === "ar" ? product.nameAr : product.nameEn}
                </h3>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-900">
                    {product.price.toFixed(2)}{" "}
                    {language === "ar" ? "د.إ" : "AED"}
                  </span>

                  {/* Stock Status */}
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      outOfStock
                        ? "bg-red-100 text-red-600"
                        : currentInventory <= 5
                        ? "bg-orange-100 text-orange-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {outOfStock
                      ? language === "ar"
                        ? "نفد المخزون"
                        : "Out of Stock"
                      : language === "ar"
                      ? "متوفر"
                      : "In Stock"}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex-1 border-gray-300 ${
                      outOfStock
                        ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                    disabled={outOfStock}
                    onClick={() => handleBuyNow(product)}
                  >
                    {language === "ar" ? "اشتري الآن" : "Buy Now"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex-1 border-gray-300 ${
                      outOfStock
                        ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                    disabled={outOfStock}
                    onClick={() => handleAddToCart(product)}
                  >
                    {language === "ar" ? "+ أضف" : "+ Add"}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More or Pagination */}
      {sortedProducts.length > 0 && (
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-3 text-gray-600 border-gray-300 hover:bg-gray-50"
          >
            {language === "ar" ? "تحميل المزيد" : "Load More"}
          </Button>
        </div>
      )}

      {/* No Products Message */}
      {sortedProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
          <PackageX className="w-12 h-12 text-red-400 mb-4 animate-bounce" />
          <h2 className="text-xl font-semibold mb-2">
            {language === "ar" ? "لا توجد منتجات" : "No Products Found"}
          </h2>
          <p className="text-md max-w-sm text-gray-400">
            {language === "ar"
              ? "لم نعثر على منتجات مطابقة للفئة المحددة"
              : "We couldn't find any products in this category."}
          </p>
        </div>
      )}
    </div>
  );
}
