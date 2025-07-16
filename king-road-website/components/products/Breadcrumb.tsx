"use client";

import { useStore } from "@/store/useStore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface BreadcrumbProps {
  category: string;
}

export function Breadcrumb({ category }: BreadcrumbProps) {
  const { language } = useStore();

  const categoryNames = {
    all: { ar: "الكل", en: "All" },
    external: { ar: "خارجيه", en: "External" },
    internal: { ar: "داخليه", en: "Internal" },
    "air-conditioning": { ar: "جوض المكيفه", en: "Air Condition" },
    accessories: { ar: "ملحقات", en: "Accessories" },
  };

  const currentCategoryName =
    categoryNames[category as keyof typeof categoryNames] || categoryNames.all;

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div
          className={`flex items-center gap-2 text-sm text-gray-600 ${
            language === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          <Link href="/" className="hover:text-gray-900">
            {language === "ar" ? "الرئيسية" : "Home"}
          </Link>

          {language === "ar" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}

          <span className="text-gray-900 font-medium">
            {language === "ar"
              ? currentCategoryName.ar
              : currentCategoryName.en}
          </span>

          {language === "ar" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}

          <span className="text-gray-900 font-medium">
            {language === "ar" ? "المنتجات" : "Products"}
          </span>
        </div>
      </div>
    </div>
  );
}
