"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Shield, Truck } from "lucide-react";

export function HeroSection() {
  const { language } = useStore();

  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-red-50 overflow-hidden ">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/assets/images/pattern.svg')] bg-repeat"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-4 md:py-12 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left hidden lg:block">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-800 text-sm font-medium mb-4">
                <Star className="h-4 w-4 mr-2" />
                {language === "ar" ? "الأفضل في الإمارات" : "Best in UAE"}
              </span>

              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="text-red-600">KING ROAD</span>
                <br />
                <span className="text-gray-700">
                  {language === "ar" ? "قطع غيار السيارات" : "Car Spare Parts"}
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {language === "ar"
                  ? "أفضل قطع الغيار الأصلية لسيارات نيسان باترول في أم القيوين. جودة عالية وأسعار منافسة."
                  : "Premium original spare parts for Nissan Patrol in Umm Al Quwain. High quality and competitive prices."}
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                <Shield className="h-8 w-8 text-red-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {language === "ar" ? "ضمان الجودة" : "Quality Assured"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === "ar" ? "قطع أصلية" : "Original Parts"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                <Truck className="h-8 w-8 text-red-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {language === "ar" ? "توصيل سريع" : "Fast Delivery"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === "ar" ? "خلال يومين" : "Within 2 Days"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                <Star className="h-8 w-8 text-red-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {language === "ar" ? "خبرة 20 سنة" : "20 Years Experience"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === "ar" ? "موثوق" : "Trusted"}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start ">
              <Link href="/category/all">
                <Button
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  {language === "ar" ? "تسوق الآن" : "Shop Now"}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link href="/track-order">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-gray-300 hover:border-red-600 hover:text-red-600 px-8 py-4 text-lg rounded-full transition-all duration-300"
                >
                  {language === "ar" ? "تتبع الطلب" : "Track Order"}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative w-full h-[300px] lg:h-[600px]">
              {/* Main Hero Image */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/assets/images/hero.jpg"
                  alt="Nissan Patrol Parts"
                  fill
                  className="object-contain scale-110"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-white/70 text-4xl md:text-8xl font-bold tracking-wider transform rotate-12">
                    {language === "ar" ? "كينج رود" : "KING ROAD"}
                  </div>
                </div>
              </div>

              {/* Floating Logo */}
              <div className="absolute -bottom-2 md:-bottom-6 -right-6 w-24 h-24 lg:w-32 lg:h-32 z-10">
                <div className="w-full h-full bg-white rounded-full shadow-xl p-4 border-4 border-red-100">
                  <Image
                    src="/assets/images/logo.png"
                    alt="King Road Logo"
                    fill
                    className="object-contain p-2"
                  />
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute top-6 -left-6 bg-white rounded-xl shadow-lg p-2 lg:p-4 border border-gray-100">
                <div className="text-center">
                  <div className="text-lg lg:text-2xl font-bold text-red-600">
                    500+
                  </div>
                  <div className="text-sm text-gray-600">
                    {language === "ar" ? "منتج" : "Products"}
                  </div>
                </div>
              </div>

              <div className="absolute bottom-5 md:bottom-20 -left-6 bg-white rounded-xl shadow-lg p-2 lg:p-4 border border-gray-100">
                <div className="text-center">
                  <div className="text-lg lg:text-2xl font-bold text-red-600">
                    1000+
                  </div>
                  <div className="text-sm text-gray-600">
                    {language === "ar" ? "عميل راضي" : "Happy Customers"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
