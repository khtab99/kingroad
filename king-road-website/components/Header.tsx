"use client";

import { useStore } from "@/store/useStore";
import { MobileMenu } from "./MobileMenu";
import { Logo } from "./logo";
import translations from "@/data/translations.json";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import {
  Menu,
  Search,
  ShoppingCart,
  Phone,
  MapPin,
  Clock,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthModal } from "./auth/AuthModal";
import { AuthButton } from "./AuthButton";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider } from "./ui/tooltip";

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
        className="pl-10 bg-white border-gray-300 rounded-full text-sm w-full focus:ring-2 focus:ring-red-500 focus:border-red-500"
      />
    </div>
  );
}

function LanguageToggle() {
  const language = useStore((s) => s.language);
  const toggleLanguage = useStore((s) => s.toggleLanguage);

  const handleToggleLanguage = () => {
    toggleLanguage();
    window.location.reload();
  };

  const nextLanguage = language === "en" ? "AR" : "EN";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipContent>{`Switch to ${nextLanguage}`}</TooltipContent>
        <button
          onClick={handleToggleLanguage}
          aria-label="Toggle language"
          className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-600 text-white hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
        >
          <Globe className="h-4 w-4" />
          <span className="text-xs font-medium uppercase">{nextLanguage}</span>
        </button>
      </Tooltip>
    </TooltipProvider>
  );
}

function CartIcon({ count }: { count: number }) {
  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center group"
    >
      <div className="p-2 rounded-full hover:bg-red-50 transition-colors">
        <ShoppingCart className="h-6 w-6 text-gray-700 group-hover:text-red-600" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
            {count}
          </span>
        )}
      </div>
    </Link>
  );
}

export function Header() {
  const { cartCount, language, isMenuOpen, setMenuOpen } = useStore();
  const t = translations[language];
  const dir = language === "ar" ? "rtl" : "ltr";
  const [isScrolled, setIsScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-2 hidden md:block  ">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between text-sm direction-ltr">
            <div className="flex items-center gap-6" dir="ltr">
              <div className="flex items-center gap-2 ">
                <Phone className="h-4 w-4" />
                <span>+971 50 123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Umm Al Quwain, UAE</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Mon - Sat: 8AM - 8PM</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span>Fixed delivery fee: AED 35 for all orders inside UAE</span>
              <LanguageToggle />
            </div>
          </div>
        </div>
      </div>

      <header
        className={`bg-white border-b border-gray-200 sticky top-0 z-40 transition-all duration-300 ${
          isScrolled ? "shadow-lg" : ""
        }`}
        dir={dir}
      >
        {/* Mobile */}
        <div className="flex items-center justify-between px-4 py-3 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(!isMenuOpen)}
            className="text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-full"
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="hidden md:block">
            {" "}
            <Logo />
          </div>
          <div className="lg:hidden flex-shrink-0">
            {" "}
            <Link href="/">
              <Image
                src="/assets/images/logo.png"
                alt="King Road Logo"
                width={55}
                height={55}
                className="object-contain p-2"
              />
            </Link>
          </div>

          <div className="flex items-center gap-2"></div>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <CartIcon count={cartCount} />
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div
              className={`flex items-center justify-between ${
                dir === "rtl" ? "flex-row-reverse" : ""
              }`}
            >
              {/* Logo */}
              <div className="flex-shrink-0" dir="ltr">
                <Logo />
              </div>

              {/* Navigation */}
              <nav
                className={`flex items-center gap-8 text-sm font-medium ${
                  dir === "rtl" ? "" : ""
                }`}
              >
                <Link
                  href="/"
                  className="text-gray-700 hover:text-red-600 transition-colors"
                >
                  {language === "ar" ? "الرئيسية" : "Home"}
                </Link>
                <Link
                  href="/product"
                  className="text-gray-700 hover:text-red-600 transition-colors"
                >
                  {language === "ar" ? "المنتجات" : "Products"}
                </Link>
                <span className="cursor-pointer text-gray-700 hover:text-red-600 transition-colors">
                  {t.topNav.branches}
                </span>
                <span className="cursor-pointer text-gray-700 hover:text-red-600 transition-colors">
                  {t.topNav.whoAreWe}
                </span>
                <Link
                  href="/track-order"
                  className="text-gray-700 hover:text-red-600 transition-colors"
                >
                  {language === "ar" ? "تتبع الطلب" : "Track Order"}
                </Link>
              </nav>

              {/* Right Section */}
              <div
                className={`flex items-center gap-4 ${
                  dir === "rtl" ? "flex-row-reverse" : ""
                }`}
              >
                <SearchInput
                  placeholder={t.navigation.search}
                  className="w-64"
                />
                <AuthButton setAuthModalOpen={setAuthModalOpen} />

                <CartIcon count={cartCount} />
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
