"use client";

import { useGetSuperCategory } from "@/api/category";
import { CategorySkeleton } from "./CategorySkeleton";
import { CategoryError } from "./CategoryError";
import { CategoryCard } from "./CategoryCard";
import { useStore } from "@/store/useStore";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CategoryListProps {
  onCategorySelect?: (categoryId: string) => void;
  variant?: "grid" | "list";
}

export function CategoryList({
  onCategorySelect,
  variant = "grid",
}: CategoryListProps) {
  const { language } = useStore();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    superCategoryList,
    superCategoryLoading,
    superCategoryError,
    revalidateSuperCategory,
  } = useGetSuperCategory({
    search: searchTerm || undefined,
    per_page: 20,
  });

  if (superCategoryLoading) {
    return <CategorySkeleton count={6} variant={variant} />;
  }

  if (superCategoryError) {
    return (
      <CategoryError
        error={superCategoryError}
        onRetry={revalidateSuperCategory}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={
            language === "ar" ? "البحث في الفئات..." : "Search categories..."
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 text-left"
          dir={language === "ar" ? "rtl" : "ltr"}
        />
      </div>

      {/* Categories Grid/List */}
      {superCategoryList.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {language === "ar" ? "لا توجد فئات" : "No categories found"}
          </p>
        </div>
      ) : (
        <div
          className={
            variant === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {superCategoryList.map((category: any) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={() => onCategorySelect?.(category.id)}
              variant={variant}
            />
          ))}
        </div>
      )}
    </div>
  );
}
