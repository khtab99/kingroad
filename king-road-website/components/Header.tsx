"use client";

import { useStore } from "@/store/useStore";
import { MobileMenu } from "./MobileMenu";
import { Logo } from "./logo";
import translations from "@/data/translations.json";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Menu, Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthModal } from "./auth/AuthModal";

import { AuthButton } from "./AuthButton";

function SearchInput({
  placeholder = "Search",
  className = "",
}: {
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        placeholder={placeholder}
        className="pl-10 bg-white border-gray-300 rounded-md text-sm w-full"
      />
    </div>
  );
}

function LanguageToggle() {
  const language = useStore((s) => s.language);
  const toggleLanguage = useStore((s) => s.toggleLanguage);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="text-sm font-medium text-gray-700 hover:text-gray-900"
    >
      {language === "en" ? "عربي" : "English"}
    </Button>
  );
}

function CartIcon({ count }: { count: number }) {
  return (
    <Link href="/cart" className="relative flex items-center justify-center">
      <ShoppingCart className="h-6 w-6 text-gray-700" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {count}
        </span>
      )}
    </Link>
  );
}

export function Header() {
  const { cartCount, language, isMenuOpen, setMenuOpen } = useStore();
  const t = translations[language];
  const dir = language === "ar" ? "rtl" : "ltr";

  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <>
      <header
        className="bg-gray-100 border-b border-gray-200 sticky top-0 z-40"
        dir={dir}
      >
        {/* Mobile */}
        <div className="flex items-center justify-between px-4 py-3 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(!isMenuOpen)}
            className="text-gray-700 hover:bg-gray-200"
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex-1 mx-4">
            <SearchInput placeholder={t.navigation.search} />
          </div>

          <CartIcon count={cartCount} />
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div
              className={`flex items-center justify-between ${
                dir === "rtl" ? "flex-row-reverse" : ""
              }`}
            >
              {/* Left Nav */}
              <nav
                className={`flex items-center gap-8 text-sm text-gray-700 ${
                  dir === "rtl" ? "flex-row-reverse" : ""
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
                <AuthButton setAuthModalOpen={setAuthModalOpen} />
              </nav>

              {/* Right Section */}
              <div
                className={`flex items-center gap-6 ${
                  dir === "rtl" ? "flex-row-reverse" : ""
                }`}
              >
                <SearchInput
                  placeholder={t.navigation.search}
                  className="w-64"
                />
                <LanguageToggle />
                <CartIcon count={cartCount} />
                <Logo />
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
