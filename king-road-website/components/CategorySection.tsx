"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import translations from "@/data/translations.json";

export function CategorySection() {
  const { language } = useStore();
  const t = translations[language];

  const categories = [
    {
      title: language === "ar" ? "خارجي" : "External",
      count: language === "ar" ? "52 منتج" : "52 Products",
      image: "/assets/images/category/category-1.jpg",
      years: language === "ar" ? "1988-1997" : "1988-1997",
      slug: "external",
    },
    {
      title: language === "ar" ? "أخرى" : "Others",
      count: language === "ar" ? "241 منتج" : "241 Products",
      image: "/assets/images/category/category-3.jpg",
      years: language === "ar" ? "1998-2024" : "1998-2024",
      slug: "others",
    },
  ];

  return (
    <section className="bg-white py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8 ">
          {categories.map((category, index) => (
            <Link key={index} href={`/category/all`}>
              <div className="bg-white cursor-pointer hover:shadow-md rounded-md transition-shadow border border-gray-200">
                <div className="relative aspect-[4/3] overflow-hidden mb-3 border-b border-gray-200">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="text-center pb-3">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-1">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">{category.count}</p>
                  <p className="text-sm text-gray-500">{category.years}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link href="/category/all">
            <Button
              size="lg"
              className="bg-gray-600 hover:bg-gray-700 text-white px-16 py-6 text-lg rounded-sm font-medium w-full md:w-auto"
            >
              {language === "ar" ? "ابدأ الطلب" : "Start Ordering"}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}