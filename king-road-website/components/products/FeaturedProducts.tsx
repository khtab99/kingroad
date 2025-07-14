"use client";

import { useGetFeaturedProducts } from "@/api/product";
import { ProductSkeleton } from "./ProductSkeleton";
import { ProductError } from "./ProductError";
import { ProductCard } from "./ProductCard";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";

interface FeaturedProductsProps {
  limit?: number;
}

export function FeaturedProducts({ limit = 8 }: FeaturedProductsProps) {
  const { language } = useStore();
  const router = useRouter();

  const {
    featuredProducts,
    featuredProductsLoading,
    featuredProductsError,
    revalidateFeaturedProducts,
  } = useGetFeaturedProducts(limit);

  const handleBuyNow = () => {
    router.push("/cart");
  };

  if (featuredProductsLoading) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {language === "ar" ? "المنتجات المميزة" : "Featured Products"}
            </h2>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductSkeleton count={4} variant="card" />
          </div>
        </div>
      </section>
    );
  }

  if (featuredProductsError) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {language === "ar" ? "المنتجات المميزة" : "Featured Products"}
          </h2>
          <ProductError
            error={featuredProductsError}
            onRetry={revalidateFeaturedProducts}
            variant="inline"
          />
        </div>
      </section>
    );
  }

  if (!featuredProducts.length) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {language === "ar" ? "المنتجات المميزة" : "Featured Products"}
          </h2>
          <p className="text-gray-600">
            {language === "ar"
              ? "اكتشف أفضل منتجاتنا المختارة بعناية"
              : "Discover our carefully selected best products"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product: any) => (
            <ProductCard
              key={product.id}
              product={product}
              onBuyNow={handleBuyNow}
              variant="grid"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
