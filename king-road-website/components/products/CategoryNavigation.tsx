"use client";

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

  const categories = [
    {
      id: "accessories",
      nameAr: "ملحقات",
      nameEn: "Accessories",
      icon: "/assets/images/logo.png",
    },
    {
      id: "air-conditioning",
      nameAr: "جوض المكيفه",
      nameEn: "Air Condition",
      icon: "/assets/images/logo.png",
    },
    {
      id: "external",
      nameAr: "خارجيه",
      nameEn: "External",
      icon: "/assets/images/logo.png",
    },
    {
      id: "internal",
      nameAr: "داخليه",
      nameEn: "Internal",
      icon: "/assets/images/logo.png",
    },
    {
      id: "all",
      nameAr: "الكل",
      nameEn: "All",
      image: "https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg",
    },
  ];

  const handleBackToHomePage = () => {
    window.location.href = "/";
  };

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
          {categories.map((categoryItem) => (
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
                {categoryItem.icon ? (
                  <Image
                    src={categoryItem.icon}
                    alt={language === "ar" ? categoryItem.nameAr : categoryItem.nameEn}
                    width={60}
                    height={60}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Image
                    src={categoryItem.image!}
                    alt={language === "ar" ? categoryItem.nameAr : categoryItem.nameEn}
                    width={60}
                    height={60}
                    className="w-full h-full object-cover rounded-full"
                  />
                )}
              </div>
              <span className={`text-sm font-medium text-center transition-colors duration-200 ${
                selectedCategory === categoryItem.id
                  ? "text-red-600"
                  : "text-gray-700 hover:text-red-500"
              }`}>
                {language === "ar" ? categoryItem.nameAr : categoryItem.nameEn}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}