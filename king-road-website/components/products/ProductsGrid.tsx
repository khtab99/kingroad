"use client";

import { useGetProductsByCategory } from "@/api/product";
import { ProductSkeleton } from "./ProductSkeleton";
import { ProductError } from "./ProductError";
import { ProductCard } from "./ProductCard";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";

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
  const { language } = useStore();
  const router = useRouter();

  // Prepare filters for API call
  const filters = useMemo(() => {
    const apiFilters: any = {
      page: currentPage,
      per_page: 12,
    };

    // Category filter
    if (selectedCategory && selectedCategory !== "all") {
      apiFilters.category_id = selectedCategory;
    }

    // Subcategory filter
    if (selectedSubcategories.length > 0 && !selectedSubcategories.includes("all")) {
      apiFilters.subcategory_id = selectedSubcategories[0]; // Take first selected subcategory
    }

    // Sort filter
    switch (sortBy) {
      case "price-low":
        apiFilters.sort = "price";
        break;
      case "price-high":
        apiFilters.sort = "-price";
        break;
      case "name":
        apiFilters.sort = language === "ar" ? "name_ar" : "name_en";
        break;
      case "availability":
        apiFilters.sort = "-inventory";
        break;
      case "newest":
      default:
        apiFilters.sort = "-created_at";
        break;
    }

    return apiFilters;
  }, [selectedCategory, selectedSubcategories, sortBy, currentPage, language]);

  // Fetch products using the API
  const {
    productList,
    productLoading,
    productError,
    productEmpty,
    totalProducts,
    currentPage: apiCurrentPage,
    lastPage,
    revalidateProducts,
  } = useGetProductsByCategory(selectedCategory === "all" ? "" : selectedCategory, filters);

  const handleBuyNow = (product: any) => {
    router.push("/cart");
  };

  const handleLoadMore = () => {
    if (apiCurrentPage < lastPage) {
      onPageChange(apiCurrentPage + 1);
    }
  };

  // Loading state
  if (productLoading && currentPage === 1) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {language === "ar" ? "المنتجات" : "Products"}
          </h2>
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <ProductSkeleton count={6} variant="grid" />
      </div>
    );
  }

  // Error state
  if (productError) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {language === "ar" ? "المنتجات" : "Products"}
          </h2>
        </div>
        <ProductError 
          error={productError} 
          onRetry={revalidateProducts}
        />
      </div>
    );
  }

  // Empty state
  if (productEmpty) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {language === "ar" ? "المنتجات" : "Products"}
          </h2>
          <p className="text-gray-600 text-sm">
            0 {language === "ar" ? "منتج" : "products"}
          </p>
        </div>
        <ProductError 
          error={null} 
          onRetry={revalidateProducts}
          variant="empty"
        />
      </div>
    );
  };

  return (
    <div>
      {/* Products Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 capitalize">
          {selectedCategory === "all" 
            ? (language === "ar" ? "جميع المنتجات" : "All Products")
            : (language === "ar" ? "المنتجات" : "Products")
          }
        </h2>
        <p className="text-gray-600 text-sm">
          {totalProducts} {language === "ar" ? "منتج" : "products"}
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {productList.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onBuyNow={handleBuyNow}
            variant="grid"
          />
        ))}
      </div>

      {/* Loading more products */}
      {productLoading && currentPage > 1 && (
        <div className="mt-8">
          <ProductSkeleton count={2} variant="grid" />
        </div>
      )}

      {/* Load More Button */}
      {!productLoading && apiCurrentPage < lastPage && (
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={handleLoadMore}
            className="px-8 py-3 text-gray-600 border-gray-300 hover:bg-gray-50"
          >
            {language === "ar" ? "تحميل المزيد" : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
