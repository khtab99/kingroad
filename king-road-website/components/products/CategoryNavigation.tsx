"use client";

import { useGetCategoryById } from "@/api/category";
import { CategorySkeleton } from "@/components/category/CategorySkeleton";
import { CategoryError } from "@/components/category/CategoryError";
import { useStore } from "@/store/useStore";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect } from "react";

interface CategoryNavigationProps {
  categoryId: any;
  selectedCategory: string;
  onCategoryChange: any;
}

export function CategoryNavigation({
  categoryId,
  selectedCategory,
  onCategoryChange,
}: CategoryNavigationProps) {
  const { language } = useStore();

  const {
    categoryList: superCategory,
    categoryLoading,
    categoryError,
    revalidateCategory,
  } = useGetCategoryById(categoryId);

  // useEffect(() => {
  //   if (categoryId) {
  //     onCategoryChange(parseInt(categoryId));
  //     // Reset subcategories to "all" when category changes
  //   } else {
  //     // select the first category
  //     // onCategoryChange(superCategory?.children?.[0].id);
  //   }
  // }, [categoryId, onCategoryChange, superCategory]);

  const handleBackToHomePage = () => {
    window.location.href = "/";
  };

  if (categoryLoading) {
    return (
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <button className="p-1 hover:bg-gray-100 rounded">
                <Menu className="h-6 w-6 text-gray-600 visible md:invisible" />
              </button>
            </div>
            <div className="text-lg font-medium text-gray-600">
              {superCategory?.name_en}
            </div>
            <button
              className="p-1 hover:bg-gray-100 rounded"
              onClick={handleBackToHomePage}
            >
              {language === "ar" ? (
                <ChevronLeft className="h-6 w-6 text-gray-600" />
              ) : (
                <ChevronRight className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
          <CategorySkeleton count={5} variant="navigation" />
        </div>
      </div>
    );
  }

  if (categoryError) {
    return (
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <CategoryError
            error={categoryError}
            onRetry={revalidateCategory}
            variant="inline"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Year Range Header */}
        <div className="flex items-center justify-between py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button className="p-1 hover:bg-gray-100 rounded">
              <Menu className="h-6 w-6 text-gray-600 visible md:invisible" />
            </button>
          </div>

          <div className="text-lg font-medium text-gray-600">
            {superCategory?.name_en}
          </div>

          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={handleBackToHomePage}
          >
            {language === "ar" ? (
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            ) : (
              <ChevronRight className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Category Icons */}
        <div className="flex items-center justify-center gap-8 py-6 overflow-x-auto">
          {superCategory?.children?.map((categoryItem: any) => {
            const categoryName =
              language === "ar" ? categoryItem.name_ar : categoryItem.name_en;

            return (
              <button
                key={categoryItem.id}
                onClick={() => onCategoryChange(categoryItem.id)}
                className={`flex flex-col items-center gap-2 min-w-0 transition-all duration-200 ${
                  selectedCategory === categoryItem.id
                    ? "opacity-100 scale-105"
                    : "opacity-50 hover:opacity-90 hover:scale-102"
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full overflow-hidden border-2 bg-white p-2 transition-all duration-200 ${
                    selectedCategory === categoryItem.id
                      ? "border-red-600 shadow-lg"
                      : "border-gray-300 hover:border-red-400"
                  }`}
                >
                  {categoryItem?.image ? (
                    <Image
                      src={categoryItem.image}
                      alt={categoryName}
                      width={60}
                      height={60}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <Image
                      src="/assets/images/logo.png"
                      alt={categoryName}
                      width={60}
                      height={60}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                <span
                  className={`text-sm font-medium text-center transition-colors duration-200 ${
                    selectedCategory === categoryItem.id
                      ? "text-red-600"
                      : "text-gray-700 hover:text-red-500"
                  }`}
                >
                  {categoryName}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
