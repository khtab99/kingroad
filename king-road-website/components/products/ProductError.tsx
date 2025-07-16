"use client";

import { AlertCircle, RefreshCw, PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";

interface ProductErrorProps {
  error: any;
  onRetry?: () => void;
  variant?: "full" | "inline" | "empty";
}

export function ProductError({ error, onRetry, variant = "full" }: ProductErrorProps) {
  const { language } = useStore();

  const getErrorMessage = () => {
    if (error?.message) {
      return error.message;
    }
    
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }

    return language === "ar" 
      ? "حدث خطأ أثناء تحميل المنتجات" 
      : "Error loading products";
  };

  if (variant === "inline") {
    return (
      <div className="flex items-center justify-center gap-2 p-4 text-red-600 bg-red-50 rounded-lg">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">{getErrorMessage()}</span>
        {onRetry && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRetry}
            className="text-red-600 hover:text-red-700 hover:bg-red-100"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }

  if (variant === "empty") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
        <PackageX className="w-12 h-12 text-red-400 mb-4 animate-bounce" />
        <h2 className="text-xl font-semibold mb-2">
          {language === "ar" ? "لا توجد منتجات" : "No Products Found"}
        </h2>
        <p className="text-md max-w-sm text-gray-400">
          {language === "ar"
            ? "لم نعثر على منتجات مطابقة للفئة المحددة"
            : "We couldn't find any products in this category."}
        </p>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="mt-4 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            {language === "ar" ? "إعادة المحاولة" : "Try Again"}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {language === "ar" ? "خطأ في التحميل" : "Loading Error"}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-sm">
        {getErrorMessage()}
      </p>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          {language === "ar" ? "إعادة المحاولة" : "Try Again"}
        </Button>
      )}
    </div>
  );
}