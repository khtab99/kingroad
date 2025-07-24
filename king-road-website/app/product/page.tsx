"use client";

import { useStore } from "@/store/useStore";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { useGetAllProducts } from "@/api/product";
import { ProductSkeleton } from "@/components/products/ProductSkeleton";

export default function AllProductsPage() {
  const { language } = useStore();
  const { productList, productLoading, productError } = useGetAllProducts();

  return (
    <>
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          {language === "ar" ? "جميع المنتجات" : "All Products"}
        </h1>

        {/* Loading State */}
        {productLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 m-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <ProductSkeleton key={index} variant="card" />
            ))}
          </div>
        )}
        {/* Error State */}
        {productError && (
          <div className="text-center py-20 text-red-500">
            {language === "ar"
              ? "حدث خطأ أثناء تحميل المنتجات"
              : "Failed to load products"}
          </div>
        )}

        {/* Empty State */}
        {!productLoading && !productError && productList.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            {language === "ar"
              ? "لا توجد منتجات متاحة حالياً"
              : "No products available."}
          </div>
        )}

        {/* Products Grid */}
        {!productLoading && !productError && productList.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList.map((product: any) => (
              <ProductCard key={product.id} product={product} variant="grid" />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
