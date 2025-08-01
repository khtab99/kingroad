"use client";

import {
  X,
  Home,
  Truck,
  Phone,
  LogIn,
  Info,
  Shield,
  Instagram,
  Package,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import translations from "@/data/translations.json";
import { AuthModal } from "./auth/AuthModal";
import { useState } from "react";
import { deleteToken, deleteUserData, getToken } from "@/util/storage";

export function MobileMenu() {
  const { isMenuOpen, setMenuOpen, language } = useStore();
  const t = translations[language];
  const token = getToken();

  const [authModalOpen, setAuthModalOpen] = useState(false);

  if (!isMenuOpen) return null;

  const isArabic = language === "ar";

  const handleLogout = () => {
    deleteToken();
    deleteUserData();
    window.location.reload();
  };

  const menuItems = [
    { icon: Home, label: t.navigation.menu, href: "/" },
    { icon: Package, label: t.navigation.products, href: "/product" },
    // { icon: Pro, label: t.navigation., href: "/login" },
    { icon: Truck, label: t.navigation.orderStatus, href: "/track-order" },
    { icon: Phone, label: t.navigation.contactUs, href: "/contact" },

    { icon: Info, label: t.navigation.aboutUs, href: "/about" },
    { icon: Shield, label: t.navigation.privacyPolicy, href: "/privacy" },
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 md:hidden">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setMenuOpen(false)}
        />

        {/* Sliding Menu Panel */}
        <div
          className={`absolute top-0 ${
            isArabic ? "right-0" : "left-0"
          } w-80 h-full bg-white shadow-xl transition-transform duration-300 ease-in-out animate-slide-in-${
            isArabic ? "right" : "left"
          }`}
          dir={isArabic ? "rtl" : "ltr"}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6 text-gray-600" />
              </Button>
            </div>

            {/* Logo */}
            <div className="flex justify-center py-6">
              <Image
                src="/assets/images/logo.png"
                alt="Logo"
                width={100}
                height={100}
                className="rounded-full"
              />
            </div>

            {/* Menu Items */}
            <nav className="flex-1 px-4">
              {menuItems.map(({ icon: Icon, label, href }, idx) => (
                <a
                  key={idx}
                  href={href}
                  className="flex items-center gap-4 w-full px-4 py-3 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">{label}</span>
                </a>
              ))}
              <div className="flex items-center gap-4 w-full px-4 py-3 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
                <LogIn className="h-5 w-5 text-gray-500" />
                {!token ? (
                  <span
                    className="font-medium"
                    onClick={() => setAuthModalOpen(true)}
                  >
                    {t.navigation.login}
                  </span>
                ) : (
                  <span className="font-medium" onClick={handleLogout}>
                    {t.navigation.logout}
                  </span>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
