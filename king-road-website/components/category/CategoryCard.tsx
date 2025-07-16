"use client";

import Image from "next/image";
import { Category } from "@/api/category";
import { useStore } from "@/store/useStore";
import { Package } from "lucide-react";

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
  variant?: "grid" | "list";
}

export function CategoryCard({ category, onClick, variant = "grid" }: CategoryCardProps) {
  const { language } = useStore();

  const categoryName = language === "ar" ? category.name_ar : category.name_en;
  const categoryDescription = language === "ar" ? category.description_ar : category.description_en;

  if (variant === "list") {
    return (
      <div
        onClick={onClick}
        className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          {category.image ? (
            <Image
              src={category.image}
              alt={categoryName}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-gray-800">{categoryName}</h3>
          {categoryDescription && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-1">
              {categoryDescription}
            </p>
          )}
          {category.products_count !== undefined && (
            <p className="text-xs text-gray-500 mt-1">
              {category.products_count} {language === "ar" ? "منتج" : "products"}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"
    >
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {category.image ? (
          <Image
            src={category.image}
            alt={categoryName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-gray-900 transition-colors">
          {categoryName}
        </h3>
        
        {category.products_count !== undefined && (
          <p className="text-sm text-gray-500 mb-2">
            {category.products_count} {language === "ar" ? "منتج" : "products"}
          </p>
        )}
        
        {categoryDescription && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {categoryDescription}
          </p>
        )}
      </div>
    </div>
  );
}