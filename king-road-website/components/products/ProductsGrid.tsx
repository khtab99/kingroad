"use client";

import { useGetProductsByCategory } from "@/api/product";
import { ProductSkeleton } from "./ProductSkeleton";
import { ProductError } from "./ProductError";
import { ProductCard } from "./ProductCard";
import { useStore } from "@/store/useStore";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";

interface CategoryFilters {
  superCategoryId?: string;
  categoryId?: string;
  subCategoryId?: string;
}

interface ProductsGridProps {
  // Updated to support 3-level hierarchy
  categoryFilters: any;
  selectedCategories: {
    superCategory?: string;
    category?: string;
    subCategory?: string;
  };
  sortBy: string;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function ProductsGrid({
  categoryFilters,
  selectedCategories,
  sortBy,
  currentPage,
  onPageChange,
}: ProductsGridProps) {
  const { language } = useStore();
  const router = useRouter();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Prepare filters for API call with 3-level category support
  const filters = useMemo(() => {
    const apiFilters: any = {
      page: currentPage,
      per_page: 12,
    };

    // 3-Level Category filters - apply the most specific level available
    if (categoryFilters.subCategoryId) {
      apiFilters.sub_subcategory_id = categoryFilters.subCategoryId;
    } else if (categoryFilters.categoryId) {
      apiFilters.subcategory_id = categoryFilters.categoryId;
    } else if (categoryFilters.superCategoryId) {
      apiFilters.category_id = categoryFilters.superCategoryId;
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
  }, [categoryFilters, sortBy, currentPage, language]);

  // Determine which category ID to use for the API call
  const effectiveCategoryId = useMemo(() => {
    // Use the most specific category available
    return (
      categoryFilters.subCategoryId ||
      categoryFilters.categoryId ||
      categoryFilters.superCategoryId ||
      "all"
    );
  }, [categoryFilters]);

  // Fetch products using the updated API
  const {
    productList,
    productLoading,
    productError,
    productEmpty,
    totalProducts,
    currentPage: apiCurrentPage,
    lastPage,
    revalidateProducts,
  } = useGetProductsByCategory(effectiveCategoryId, filters);

  const handleBuyNow = (product: any) => {
    router.push("/cart");
  };

  const handleLoadMore = () => {
    if (apiCurrentPage < lastPage) {
      onPageChange(apiCurrentPage + 1);
    }
  };

  // Get display name for current category level
  const getCategoryDisplayName = () => {
    if (selectedCategories?.subCategory) {
      return selectedCategories?.subCategory;
    }
    if (selectedCategories?.category) {
      return selectedCategories?.category;
    }
    if (selectedCategories?.superCategory) {
      return selectedCategories?.superCategory;
    }
    return language === "ar" ? "جميع المنتجات" : "All Products";
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
        <ProductError error={productError} onRetry={revalidateProducts} />
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
  }

  return (
    <div>
      {/* Products Header */}
      <div className="flex items-center justify-between mb-4">
        {" "}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2 capitalize">
            {getCategoryDisplayName()}
          </h2>
          <p className="text-gray-600 text-sm">
            {totalProducts} {language === "ar" ? "منتج" : "products"}
          </p>

          {/* Category Breadcrumb */}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <div
        className={`grid ${
          viewMode === "list" ? "grid-cols-1 " : "grid-cols-2 "
        } md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 lg:gap-6`}
      >
        {productList.map((product: any) => (
          <ProductCard
            key={product.id}
            product={product}
            onBuyNow={handleBuyNow}
            variant={viewMode}
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
