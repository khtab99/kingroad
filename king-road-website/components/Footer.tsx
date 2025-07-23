"use client";

import {
  Instagram,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Twitter,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import translations from "@/data/translations.json";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const { language } = useStore();
  const t = translations[language];

  const quickLinks = [
    { href: "/", labelAr: "الرئيسية", labelEn: "Home" },
    { href: "/product", labelAr: "المنتجات", labelEn: "Products" },
    { href: "/track-order", labelAr: "تتبع الطلب", labelEn: "Track Order" },
    { href: "/contact", labelAr: "اتصل بنا", labelEn: "Contact Us" },
  ];

  const categories = [
    {
      href: "/category/external",
      labelAr: "قطع خارجية",
      labelEn: "External Parts",
    },
    {
      href: "/category/internal",
      labelAr: "قطع داخلية",
      labelEn: "Internal Parts",
    },
    {
      href: "/category/air-conditioning",
      labelAr: "تكييف",
      labelEn: "Air Conditioning",
    },
    {
      href: "/category/accessories",
      labelAr: "ملحقات",
      labelEn: "Accessories",
    },
  ];

  const policies = [
    { href: "/privacy", labelAr: "سياسة الخصوصية", labelEn: "Privacy Policy" },
    {
      href: "/terms",
      labelAr: "الشروط والأحكام",
      labelEn: "Terms & Conditions",
    },
    { href: "/returns", labelAr: "سياسة الإرجاع", labelEn: "Return Policy" },
    { href: "/warranty", labelAr: "الضمان", labelEn: "Warranty" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-full p-2">
                <Image
                  src="/assets/images/logo.png"
                  alt="King Road Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-400">KING ROAD</h3>
                <p className="text-sm text-gray-400">
                  {language === "ar" ? "قطع غيار السيارات" : "Car Spare Parts"}
                </p>
              </div>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              {language === "ar"
                ? "متخصصون في قطع غيار نيسان باترول الأصلية في أم القيوين. نقدم أفضل الخدمات وأعلى جودة."
                : "Specialists in original Nissan Patrol spare parts in Umm Al Quwain. We provide the best services and highest quality."}
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-red-400" />
                <a
                  href="tel:+971501234567"
                  className="hover:text-red-400 transition-colors"
                  dir="ltr"
                >
                  +971 50 123 4567
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-red-400" />
                <a
                  href="mailto:info@kingroad.ae"
                  className="hover:text-red-400 transition-colors"
                >
                  info@kingroad.ae
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-red-400 mt-1" />
                <span className="text-gray-300">
                  {language === "ar"
                    ? "أم القيوين، الإمارات العربية المتحدة"
                    : "Umm Al Quwain, United Arab Emirates"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-red-400" />
                <span className="text-gray-300">
                  {language === "ar"
                    ? "السبت - الخميس: 8ص - 8م"
                    : "Sat - Thu: 8AM - 8PM"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-red-400">
              {language === "ar" ? "روابط سريعة" : "Quick Links"}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {language === "ar" ? link.labelAr : link.labelEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-red-400">
              {language === "ar" ? "الفئات" : "Categories"}
            </h4>
            <ul className="space-y-3">
              {categories.map((category, index) => (
                <li key={index}>
                  <Link
                    href={category.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {language === "ar" ? category.labelAr : category.labelEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-red-400">
              {language === "ar" ? "السياسات" : "Policies"}
            </h4>
            <ul className="space-y-3 mb-8">
              {policies.map((policy, index) => (
                <li key={index}>
                  <Link
                    href={policy.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {language === "ar" ? policy.labelAr : policy.labelEn}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Media */}
            <div>
              <h5 className="font-semibold mb-4 text-red-400">
                {language === "ar" ? "تابعنا" : "Follow Us"}
              </h5>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-300 group"
                >
                  <Instagram className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300 group"
                >
                  <Facebook className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </a>
                {/* <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors duration-300 group"
                >
                  <Twitter className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </a> */}
                <a
                  href="https://wa.me/971501234567"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-300 group"
                >
                  <Image
                    src="assets/icons/whatapp.svg"
                    alt="whatsapp"
                    height={24}
                    width={24}
                    className="h-5 w-5 group-hover:scale-110 transition-transform"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods & Trust Badges */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h5 className="font-semibold mb-3 text-red-400">
                {language === "ar"
                  ? "طرق الدفع المقبولة"
                  : "Accepted Payment Methods"}
              </h5>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <div className=" rounded-lg ">
                  <Image
                    src="/assets/icons/visa.svg"
                    alt="Visa"
                    width={40}
                    height={24}
                    className="object-contain"
                  />
                </div>
                <div className=" rounded-lg">
                  <Image
                    src="/assets/icons/apple.svg"
                    alt="Apple Pay"
                    width={40}
                    height={24}
                    className="object-contain"
                  />
                </div>
                {/* <div className="bg-gray-800 text-white rounded-lg px-3 py-2 text-sm font-medium">
                  {language === "ar" ? "الدفع عند التسليم" : "Cash on Delivery"}
                </div> */}
              </div>
            </div>

            <div className="text-center">
              <h5 className="font-semibold mb-3 text-red-400">
                {language === "ar" ? "ضمان الأمان" : "Security Guarantee"}
              </h5>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">✓</span>
                </div>
                <span>
                  {language === "ar"
                    ? "معاملات آمنة 100%"
                    : "100% Secure Transactions"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <div className="text-center md:text-left">
              <p>
                © 2025King Road{" "}
                {language === "ar"
                  ? "جميع الحقوق محفوظة"
                  : "All rights reserved"}
                .
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span>{language === "ar" ? "دعم من طرف" : "Powered by"}</span>
              <a href="https://lwalsoftware.ae/">
                {" "}
                <span className="font-semibold text-white hover:underline transition-colors hover:text-red-400">
                  Lwal Software
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
