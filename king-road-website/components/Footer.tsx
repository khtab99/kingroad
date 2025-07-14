"use client";

import { Instagram, MessageCircle } from "lucide-react";
import { useStore } from "@/store/useStore";
import translations from "@/data/translations.json";
import Image from "next/image";

export function Footer() {
  const { language } = useStore();
  const t = translations[language];

  const footerLinks = [
    t.footer.branches,
    t.footer.privacyPolicy,
    t.footer.whoAreWe,
    t.footer.orderTracking,
    t.footer.menu,
  ];

  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className=" w-16 h-16 md:w-28 md:h-28  lg:w-32 lg:h-32 xl:w-32 xl:h-32  p-4 rounded-full">
              <Image
                src="/assets/images/logo.png"
                alt="Logo"
                width={300}
                height={300}
                className=" "
              ></Image>
            </div>
          </div>

          {/* Navigation Links */}
          <div
            className={`flex flex-wrap justify-center gap-6 mb-8 text-sm ${
              language === "ar" ? "flex-row-reverse" : ""
            }`}
          >
            {footerLinks.map((link, index) => (
              <a
                key={index}
                href="#"
                className="text-gray-300 hover:text-white transition-colors cursor-pointer font-medium"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors cursor-pointer">
              <Instagram className="h-5 w-5" />
            </div>
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors cursor-pointer">
              <MessageCircle className="h-5 w-5" />
            </div>
          </div>

          {/* Powered By */}
          <div className="text-gray-400 text-sm mb-6">
            {language === "ar" ? "دعم من طرف" : "Powered By"}{" "}
            <span className="font-semibold text-white">Lwal software</span>
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
    </footer>
  );
}