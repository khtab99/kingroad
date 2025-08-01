"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { CategoryNavigation } from "@/components/products/CategoryNavigation";
import { ProductsGrid } from "@/components/products/ProductsGrid";
import { ProductsSidebar } from "@/components/products/ProductsSidebar";
import { Breadcrumb } from "@/components/products/Breadcrumb";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function ProductsPage() {
  const params = useParams();
  const { language } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<any>();
  const [selectedSubcategories, setSelectedSubcategories] = useState<any>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const category = params.category as string;
  const categoryId = category;

  const categoryFilters = {
    superCategoryId: parseInt(categoryId),
    categoryId: selectedCategory,
    subCategoryId: selectedSubcategories,
  };

  const handleResetFilters = () => {
    setSelectedCategory(undefined);
    setSelectedSubcategories(null);
    setSortBy("newest");
    setCurrentPage(1);
  };

  return (
    <>
      <CategoryNavigation
        categoryId={categoryId}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Breadcrumb */}
      <div dir="ltr">
        <Breadcrumb category={selectedCategory} />
      </div>

      <div className="max-w-7xl mx-auto px-2 md:px-4 py-6">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="w-full flex items-center gap-2 justify-center"
              >
                <Filter className="h-4 w-4" />
                {language === "ar" ? "الفلاتر" : "Filters"}
              </Button>
            </SheetTrigger>
            <SheetContent
              side={language === "ar" ? "right" : "left"}
              className="w-80 overflow-y-auto"
            >
              <SheetHeader>
                <SheetTitle
                  className={language === "ar" ? "text-right" : "text-left"}
                >
                  {language === "ar" ? "الفلاتر" : "Filters"}
                </SheetTitle>
                <SheetDescription
                  className={language === "ar" ? "text-right" : "text-left"}
                >
                  {language === "ar"
                    ? "اختر الفلاتر لتصفية المنتجات"
                    : "Choose filters to refine your product search"}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <ProductsSidebar
                  selectedCategory={selectedCategory}
                  selectedSubcategories={selectedSubcategories}
                  onSubcategoryChange={setSelectedSubcategories}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  onResetFilters={handleResetFilters}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <ProductsSidebar
              selectedCategory={selectedCategory}
              selectedSubcategories={selectedSubcategories}
              onSubcategoryChange={setSelectedSubcategories}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <ProductsGrid
              categoryFilters={categoryFilters}
              selectedCategories={selectedCategory}
              sortBy={sortBy}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </>
  );
}
