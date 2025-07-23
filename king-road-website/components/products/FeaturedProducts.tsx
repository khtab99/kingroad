"use client";

import { useGetFeaturedProducts } from "@/api/product";
import { ProductSkeleton } from "./ProductSkeleton";
import { ProductError } from "./ProductError";
import { ProductCard } from "./ProductCard";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";

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

        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent className="-ml-4">
            {featuredProducts.map((product: any) => (
              <CarouselItem
                key={product.id}
                className="pl-4 basis-[80%] md:basis-1/2 lg:basis-1/4"
              >
                <ProductCard
                  key={product.id}
                  product={product}
                  onBuyNow={handleBuyNow}
                  variant="grid"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
