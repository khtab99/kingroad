"use client";

import { useGetSaleProducts } from "@/api/product";
import { ProductSkeleton } from "./ProductSkeleton";
import { ProductError } from "./ProductError";
import { ProductCard } from "./ProductCard";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";

interface SaleProductsProps {
  limit?: number;
}

export function SaleProducts({ limit = 8 }: SaleProductsProps) {
  const { language } = useStore();
  const router = useRouter();

  const {
    saleProducts,
    saleProductsLoading,
    saleProductsError,
    revalidateSaleProducts,
  } = useGetSaleProducts(limit);

  const handleBuyNow = () => {
    router.push("/cart");
  };

  if (saleProductsLoading) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {language === "ar" ? "عروض خاصة" : "Special Offers"}
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

  if (saleProductsError) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {language === "ar" ? "عروض خاصة" : "Special Offers"}
          </h2>
          <ProductError 
            error={saleProductsError} 
            onRetry={revalidateSaleProducts}
            variant="inline"
          />
        </div>
      </section>
    );
  }

  if (!saleProducts.length) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {language === "ar" ? "عروض خاصة" : "Special Offers"}
          </h2>
          <p className="text-gray-600">
            {language === "ar" 
              ? "وفر أكثر مع عروضنا الحصرية"
              : "Save more with our exclusive deals"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {saleProducts.map((product) => (
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