"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import translations from "@/data/translations.json";
import { useGetSuperCategory } from "@/api/category";
import { Skeleton } from "./ui/skeleton";

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
    <section className="bg-white py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8 ">
          {superCategoryLoading && (
            <>
              <Skeleton className="aspect-[4/3] w-full" />{" "}
              <Skeleton className="aspect-[4/3] w-full" />
            </>
          )}
          {filteredCategoriesWithNoParent.map(
            (category: any, index: number) => (
              <Link key={index} href={`/category/${category.id}`}>
                <div className="bg-white cursor-pointer hover:shadow-md rounded-md transition-shadow border border-gray-200">
                  <div className="relative aspect-[4/3] overflow-hidden mb-3 border-b border-gray-200">
                    <Image
                      src={category?.image ?? "/assets/images/hero.jpg"}
                      alt={category.name_en}
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="text-center pb-3">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-1">
                      {category.name_en}
                    </h3>
                    <p className="text-sm text-gray-500 mb-1">
                      {category.description_en}
                    </p>
                  </div>
                </div>
              </Link>
            )
          )}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link href="/category/all">
            <Button
              size="lg"
              className="bg-gray-600 hover:bg-gray-700 text-white px-16 py-6 text-lg rounded-sm font-medium w-full md:w-auto"
            >
              {language === "ar" ? "ابدأ الطلب" : "Start Ordering"}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
