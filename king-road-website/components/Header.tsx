"use client";

import { useState } from "react";
import { Menu, Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/store/useStore";
import { MobileMenu } from "./MobileMenu";
import translations from "@/data/translations.json";
import Link from "next/link";
import { Logo } from "./logo";
import { useGetCartCount } from "@/api/cart";
import { useAuth, logout } from "@/api/auth";
import { AuthModal } from "./auth/AuthModal";

export function Header() {
  const { language, isMenuOpen, setMenuOpen } = useStore();
  const t = translations[language];
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">(
    "login"
  );

  // Get cart count from API
  const { cartCount } = useGetCartCount();

  // Get auth state
  const { isAuthenticated, user } = useAuth();

  const handleAuthClick = (tab: "login" | "register") => {
    setAuthModalTab(tab);
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success(
        language === "ar" ? "تم تسجيل الخروج بنجاح" : "Logged out successfully"
      );
    } catch (error) {
      toast.error(language === "ar" ? "فشل تسجيل الخروج" : "Logout failed");
    }
  };

  return (
    <>
      <header className="bg-gray-100 border-b border-gray-200 sticky top-0 z-40">
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-4 py-3 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(!isMenuOpen)}
            className="text-gray-700 hover:bg-gray-200"
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex items-center flex-1 mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t.navigation.search}
                className="w-full pl-10 bg-white border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          <Link href="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-700 hover:bg-gray-200"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div
              className={`flex items-center justify-between ${
                language === "ar" ? "flex-row-reverse" : ""
              }`}
            >
              {/* Left Navigation */}
              <div
                className={`flex items-center gap-8 text-sm text-gray-700 ${
                  language === "ar" ? "flex-row-reverse" : ""
                }`}
              >
                <span className="cursor-pointer hover:text-gray-900 font-medium">
                  {t.topNav.branches}
                </span>
                <span className="cursor-pointer hover:text-gray-900 font-medium">
                  {t.topNav.whoAreWe}
                </span>
                <span className="cursor-pointer hover:text-gray-900 font-medium">
                  {t.topNav.privacyPolicy}
                </span>
                {!isAuthenticated ? (
                  <span
                    onClick={() => handleAuthClick("register")}
                    className="cursor-pointer hover:text-gray-900 font-medium"
                  >
                    {t.topNav.registration}
                  </span>
                ) : (
                  <span className="text-gray-900 font-medium">
                    {language === "ar"
                      ? `مرحباً ${user?.name}`
                      : `Hello ${user?.name}`}
                  </span>
                )}
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
                    className="pl-10 bg-white border-gray-300 rounded-md text-sm w-64"
                  />
                </div>

                {/* Language Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => useStore.getState().toggleLanguage()}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  {language === "en" ? "عربي" : "English"}
                </Button>

                {/* Auth Buttons */}
                {!isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAuthClick("login")}
                      className="text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      {language === "ar" ? "دخول" : "Login"}
                    </Button>
                    {/* <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAuthClick("register")}
                      className="text-sm font-medium"
                    >
                      {language === "ar" ? "تسجيل" : "Register"}
                    </Button> */}
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    {language === "ar" ? "خروج" : "Logout"}
                  </Button>
                )}

                {/* Cart */}
                <Link href="/cart" className="flex items-center gap-2 relative">
                  <ShoppingCart className="h-5 w-5 text-gray-700 " />
                  {cartCount > 0 && (
                    <span className=" absolute -top-3 left-3 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Brand */}
                <Logo />
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authModalTab}
      />
    </>
  );
}
