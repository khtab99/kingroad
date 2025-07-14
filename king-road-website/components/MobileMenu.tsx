"use client";

import {
  X,
  Home,
  Truck,
  Phone,
  LogIn,
  Info,
  Shield,
  Globe,
  Instagram,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import translations from "@/data/translations.json";
import Image from "next/image";

export function MobileMenu() {
  const { isMenuOpen, setMenuOpen, language, toggleLanguage } = useStore();
  const t = translations[language];

  if (!isMenuOpen) return null;

  const menuItems = [
    { icon: Truck, label: t.navigation.orderStatus, href: "/order-status" },
    { icon: Home, label: t.navigation.menu, href: "/menu" },
    { icon: Phone, label: t.navigation.contactUs, href: "/contact" },
    { icon: LogIn, label: t.navigation.login, href: "/login" },
    { icon: Info, label: t.navigation.aboutUs, href: "/about" },
    { icon: Shield, label: t.navigation.privacyPolicy, href: "/privacy" },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setMenuOpen(false)}
      />

      {/* Menu Panel */}
      <div
        className={`absolute top-0 ${
          language === "ar" ? "right-0" : "left-0"
        } w-80 h-full bg-white shadow-xl animate-slide-in-${
          language === "ar" ? "right" : "left"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(false)}
              className="text-gray-600"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Logo Section */}

          <div className=" mx-auto  p-4 bg-white rounded-full">
            <Image
              src="/assets/images/logo.png"
              alt="Logo"
              width={150}
              height={150}
              className=" "
            ></Image>
          </div>

          {/* Menu Items */}
          <div className="flex-1 py-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`w-full flex items-center gap-4 px-6 py-4 text-gray-700 hover:bg-gray-50 transition-colors ${
                  language === "ar" ? "flex-row-reverse text-right" : ""
                }`}
                onClick={() => setMenuOpen(false)}
              >
                <item.icon className="h-5 w-5 text-gray-500" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className={`w-full flex items-center gap-4 px-6 py-4 text-gray-700 hover:bg-gray-50 transition-colors ${
                language === "ar" ? "flex-row-reverse text-right" : ""
              }`}
            >
              <Globe className="h-5 w-5 text-gray-500" />
              <span className="font-medium">
                {language === "ar" ? "عربي" : "Arabic"}
              </span>
            </button>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            {/* Social Icons */}
            <div className="flex justify-center gap-4 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <Instagram className="h-5 w-5 text-gray-600" />
              </div>
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
            </div>

            {/* Powered By */}
            <div className="text-center text-sm text-gray-600 mb-4">
              {language === "ar" ? "دعم من طرف" : "Powered By"}{" "}
              <span className="font-semibold text-gray-800">Lwal Software</span>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center justify-center space-x-4 mt-4 md:mt-0">
              <Image
                src="/assets/icons/visa.svg"
                alt="Visa"
                className="h-12 w-12 opacity-100 "
                width={32}
                height={32}
              />
              <Image
                src="/assets/icons/apple.svg"
                alt="Mastercard"
                className="h-12 w-12 opacity-100"
                width={32}
                height={32}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
