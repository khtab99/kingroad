"use client";

import { useGetCategoryById } from "@/api/category";
import { CategorySkeleton } from "./CategorySkeleton";
import { CategoryError } from "./CategoryError";
import { useStore } from "@/store/useStore";

interface SubCategoryListProps {
  parentCategoryId: string | null;
  selectedSubcategories: string[];
  onSubcategoryChange: (subcategories: string[]) => void;
  variant?: "radio" | "checkbox";
}

export function SubCategoryList({
  parentCategoryId,
  selectedSubcategories,
  onSubcategoryChange,
  variant = "radio",
}: SubCategoryListProps) {
  const { language } = useStore();

  const { categoryList, categoryLoading, categoryError, revalidateCategory } =
    useGetCategoryById(parentCategoryId);

  const handleSubcategoryChange = (subcategoryId: string) => {
    if (variant === "radio") {
      // Single selection
      onSubcategoryChange([subcategoryId]);
    } else {
      // Multiple selection
      if (selectedSubcategories?.includes(subcategoryId)) {
        onSubcategoryChange(
          selectedSubcategories?.filter((id) => id !== subcategoryId)
        );
      } else {
        onSubcategoryChange([...selectedSubcategories, subcategoryId]);
      }
    }
  };

  if (categoryLoading) {
    return <CategorySkeleton count={4} variant="list" />;
  }

  if (categoryError) {
    return (
      <CategoryError
        error={categoryError}
        onRetry={revalidateCategory}
        variant="inline"
      />
    );
  }

  if (!categoryList?.children?.length && parentCategoryId !== null) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        {language === "ar"
          ? "لا توجد فئات فرعية"
          : "No subcategories available"}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Subcategories */}
      {categoryList?.children?.map((subcategory: any) => {
        const subcategoryName =
          language === "ar" ? subcategory.name_ar : subcategory.name_en;
        const isSelected = selectedSubcategories?.includes(subcategory.id);

        return (
          <label
            key={subcategory.id}
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
          >
            <input
              type={variant}
              name={variant === "radio" ? "subcategory" : undefined}
              checked={isSelected}
              onChange={() => handleSubcategoryChange(subcategory.id)}
              className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
            />
            <span className="text-gray-700 text-sm">
              {subcategoryName}
              {subcategory.products_count !== undefined && (
                <span className="text-gray-500 ml-1">
                  ({subcategory.products_count})
                </span>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
}
