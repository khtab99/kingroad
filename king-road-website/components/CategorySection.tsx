"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import translations from "@/data/translations.json";
import { useGetSuperCategory } from "@/api/category";
import { Skeleton } from "./ui/skeleton";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function CategorySection() {
  const { language } = useStore();
  const t = translations[language];

  const {
    superCategoryList,
    superCategoryLoading,
    superCategoryError,
    revalidateSuperCategory,
  } = useGetSuperCategory();

  const filteredCategoriesWithNoParent = superCategoryList.map(
    (category: any) => {
      if (category.parent === null) {
        return category;
      }
    }
  );

  return (
    <section className="bg-white py-4 md:py-12 lg:py-20 p">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-4 md:mb-8 lg:mb-12">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
            {language === "ar" ? "تسوق حسب الفئة" : "Shop by Category"}
          </h2>
          <p className="text-sm md:text-lg lg:text-xl text-gray-600  mx-auto w-2/3">
            {language === "ar"
              ? "اكتشف مجموعتنا الواسعة من قطع غيار نيسان باترول الأصلية"
              : "Discover our wide range of original Nissan Patrol spare parts"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 md:gap-4 md:gap-6 mb-4 md:mb-8 ">
          {superCategoryLoading && (
            <>
              <Skeleton className="aspect-[4/3] w-full" />{" "}
              <Skeleton className="aspect-[4/3] w-full" />
            </>
          )}
          {filteredCategoriesWithNoParent.map(
            (category: any, index: number) => (
              <Link key={index} href={`/category/${category.id}`}>
                <div className="bg-white cursor-pointer hover:shadow-xl rounded-xl transition-all duration-300 border border-gray-200 group hover:-translate-y-2">
                  <div className="relative aspect-[4/3] overflow-hidden mb-4 rounded-t-xl">
                    <Image
                      src={category?.image ?? "/assets/images/hero.jpg"}
                      alt={category.name_en}
                      fill
                      className="object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="text-center p-2 pb-6 md:p-4 lg:p-6">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                      {language === "ar" ? category.name_ar : category.name_en}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed truncate">
                      {language === "ar"
                        ? category.description_ar
                        : category.description_en}
                    </p>
                  </div>
                </div>
              </Link>
            )
          )}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link href="/product">
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white px-16 py-6 text-lg rounded-full font-semibold w-3/4  md:w-auto shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              {language === "ar" ? "ابدأ الطلب" : "Start Ordering"}
              {language === "ar" ? (
                <ArrowLeft className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              ) : (
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              )}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
