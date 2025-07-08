"use client";

import { useGetCategoryTree } from "@/api/category";
import { CategorySkeleton } from "@/components/category/CategorySkeleton";
import { CategoryError } from "@/components/category/CategoryError";
import { useStore } from "@/store/useStore";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

interface CategoryNavigationProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryNavigation({
  selectedCategory,
  onCategoryChange,
}: CategoryNavigationProps) {
  const { language } = useStore();
  const { category } = useParams();

  const {
    categoryTree,
    categoryTreeLoading,
    categoryTreeError,
    revalidateCategoryTree,
  } = useGetCategoryTree();

  const handleBackToHomePage = () => {
    window.location.href = "/";
  };

  if (categoryTreeLoading) {
    return (
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <button className="p-1 hover:bg-gray-100 rounded">
                <Menu className="h-6 w-6 text-gray-600 visible md:invisible" />
              </button>
            </div>
            <div className="text-lg font-medium text-gray-600">{category}</div>
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

  if (categoryTreeError) {
    return (
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <CategoryError 
            error={categoryTreeError} 
            onRetry={revalidateCategoryTree}
            variant="inline"
          />
        </div>
      </div>
    );
  }

  // Add "All" category to the beginning
  const allCategories = [
    {
      id: "all",
      name_ar: "الكل",
      name_en: "All",
      slug: "all",
      image: "https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg",
      sort_order: 0,
      is_active: true,
      created_at: "",
      updated_at: "",
    },
    ...categoryTree,
  ];
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

          <div className="text-lg font-medium text-gray-600">{category}</div>

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
          {allCategories.map((categoryItem) => {
            const categoryName = language === "ar" ? categoryItem.name_ar : categoryItem.name_en;
            
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
              <div className={`w-16 h-16 rounded-full overflow-hidden border-2 bg-white p-2 transition-all duration-200 ${
                selectedCategory === categoryItem.id
                  ? "border-red-600 shadow-lg"
                  : "border-gray-300 hover:border-red-400"
              }`}>
                {categoryItem.image ? (
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
              <span className={`text-sm font-medium text-center transition-colors duration-200 ${
                selectedCategory === categoryItem.id
                  ? "text-red-600"
                  : "text-gray-700 hover:text-red-500"
              }`}>
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