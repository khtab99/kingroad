"use client";

import { useState } from "react";
import { Menu, Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/store/useStore";
import translations from "@/data/translations.json";

export function ProductsHeader() {
  const { cartItems, language, toggleLanguage } = useStore();
  const t = translations[language];

  return (
    <header className="bg-gray-500 text-white sticky top-0 z-40">
      {/* Mobile Header */}
      <div className="flex items-center justify-between px-4 py-3 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-gray-600"
        >
          <Menu className="h-6 w-6" />
        </Button>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="text-white hover:bg-gray-600 text-sm font-medium"
          >
            {language === "en" ? "عربي" : "English"}
          </Button>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={language === "ar" ? "ابحث" : "Search"}
              className="pl-10 bg-white text-black border-none rounded-md text-sm w-32"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="relative text-white hover:bg-gray-600"
          >
            <ShoppingCart className="h-6 w-6" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {cartItems.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div
            className={`flex items-center justify-between ${
              language === "ar" ? "flex-row-reverse" : ""
            }`}
          >
            {/* Left Navigation */}
            <div
              className={`flex items-center gap-8 text-sm ${
                language === "ar" ? "flex-row-reverse" : ""
              }`}
            >
              <span className="cursor-pointer hover:text-gray-200 font-medium">
                {t.topNav.branches}
              </span>
              <span className="cursor-pointer hover:text-gray-200 font-medium">
                {t.topNav.whoAreWe}
              </span>
              <span className="cursor-pointer hover:text-gray-200 font-medium">
                {t.topNav.privacyPolicy}
              </span>
              <span className="cursor-pointer hover:text-gray-200 font-medium">
                {t.topNav.registration}
              </span>
            </div>

            {/* Right Section */}
            <div
              className={`flex items-center gap-6 ${
                language === "ar" ? "flex-row-reverse" : ""
              }`}
            >
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={language === "ar" ? "ابحث" : "Search"}
                  className="pl-10 bg-white text-black border-none rounded-md text-sm w-64"
                />
              </div>

              {/* Language Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="text-sm font-medium text-white hover:text-gray-200"
              >
                {language === "en" ? "عربي" : "English"}
              </Button>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <ShoppingCart className="h-6 w-6" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {cartItems.length}
                      </span>
                    )}
                  </div>

                  {/* Brand */}
                  <div className="text-xl font-bold">King Road</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
