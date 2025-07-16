"use client";

import { useGetSubCategories } from "@/api/category";
import { SubCategoryList } from "@/components/category/SubCategoryList";
import { useStore } from "@/store/useStore";

interface ProductsSidebarProps {
  selectedCategory: string;
  selectedSubcategories: string[];
  onSubcategoryChange: (subcategories: string[]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function ProductsSidebar({
  selectedCategory,
  selectedSubcategories,
  onSubcategoryChange,
  sortBy,
  onSortChange,
}: ProductsSidebarProps) {
  const { language } = useStore();


  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {language === "ar" ? "الفئات" : "Categories"}
      </h3>

      <SubCategoryList
        parentCategoryId={selectedCategory === "all" ? null : selectedCategory}
        selectedSubcategories={selectedSubcategories}
        onSubcategoryChange={onSubcategoryChange}
        variant="radio"
      />

      {/* Sort Options */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {language === "ar" ? "ترتيب حسب" : "Sort By"}
        </h3>

        <div className="space-y-3">
          {[
            { id: "newest", nameAr: "الأحدث", nameEn: "Newest" },
            {
              id: "price-low",
              nameAr: "السعر: من الأقل للأعلى",
              nameEn: "Price: Low to High",
            },
            {
              id: "price-high",
              nameAr: "السعر: من الأعلى للأقل",
              nameEn: "Price: High to Low",
            },
            { id: "name", nameAr: "الاسم", nameEn: "Name" },
            { id: "availability", nameAr: "التوفر", nameEn: "Availability" },
          ].map((option) => (
            <label
              key={option.id}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
            >
              <input
                type="radio"
                name="sort"
                value={option.id}
                checked={sortBy === option.id}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
              />
              <span className="text-gray-700 text-sm">
                {language === "ar" ? option.nameAr : option.nameEn}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {language === "ar" ? "نطاق السعر" : "Price Range"}
        </h3>

        <div className="space-y-3">
          {[
            { id: "0-100", nameAr: "0 - 100 د.إ", nameEn: "0 - 100 AED" },
            { id: "100-500", nameAr: "100 - 500 د.إ", nameEn: "100 - 500 AED" },
            {
              id: "500-1000",
              nameAr: "500 - 1000 د.إ",
              nameEn: "500 - 1000 AED",
            },
            { id: "1000+", nameAr: "1000+ د.إ", nameEn: "1000+ AED" },
          ].map((range) => (
            <label
              key={range.id}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
            >
              <input
                type="checkbox"
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-gray-700 text-sm">
                {language === "ar" ? range.nameAr : range.nameEn}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {language === "ar" ? "التوفر" : "Availability"}
        </h3>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
            <input
              type="checkbox"
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <span className="text-gray-700 text-sm">
              {language === "ar" ? "متوفر" : "In Stock"}
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
            <input
              type="checkbox"
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <span className="text-gray-700 text-sm">
              {language === "ar" ? "غير متوفر" : "Out of Stock"}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}