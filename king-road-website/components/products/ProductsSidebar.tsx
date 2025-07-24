"use client";

import { SubCategoryList } from "@/components/category/SubCategoryList";
import { useStore } from "@/store/useStore";

interface ProductsSidebarProps {
  selectedCategory: string;
  selectedSubcategories: string[];
  onSubcategoryChange: (subcategories: string[]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onResetFilters?: () => void; // Optional reset handler
}

const SORT_OPTIONS = [
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
];

export function ProductsSidebar({
  selectedCategory,
  selectedSubcategories,
  onSubcategoryChange,
  sortBy,
  onSortChange,
  onResetFilters,
}: ProductsSidebarProps) {
  const { language } = useStore();
  const isArabic = language === "ar";

  const renderSortOptions = () =>
    SORT_OPTIONS.map((option) => (
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
          className="w-4 h-4 text-red-600 focus:ring-red-500 accent-red-600"
        />
        <span className="text-gray-700 text-sm">
          {isArabic ? option.nameAr : option.nameEn}
        </span>
      </label>
    ));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {isArabic ? "الفئات" : "Categories"}
        </h3>

        <SubCategoryList
          parentCategoryId={selectedCategory}
          selectedSubcategories={selectedSubcategories}
          onSubcategoryChange={onSubcategoryChange}
          variant="radio"
        />
      </div>

      {/* Sort By Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {isArabic ? "ترتيب حسب" : "Sort By"}
        </h3>

        <div className="space-y-3">{renderSortOptions()}</div>
      </div>

      {/* Reset Filters Button */}
      {onResetFilters && (
        <div className="mt-6">
          <button
            onClick={onResetFilters}
            className="w-full text-sm font-medium text-gray-700 hover:text-red-600 border border-gray-300 hover:border-red-600 rounded px-4 py-2 transition-colors"
          >
            {isArabic ? "إعادة تعيين الفلاتر" : "Reset Filters"}
          </button>
        </div>
      )}
    </div>
  );
}
