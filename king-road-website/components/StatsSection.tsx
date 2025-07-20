"use client";

import { useStore } from "@/store/useStore";
import { Users, Package, Award, Clock } from "lucide-react";

export function StatsSection() {
  const { language } = useStore();

  const stats = [
    {
      icon: Package,
      value: "500+",
      labelAr: "منتج متوفر",
      labelEn: "Products Available",
    },
    {
      icon: Users,
      value: "1000+",
      labelAr: "عميل راضي",
      labelEn: "Happy Customers",
    },
    {
      icon: Award,
      value: "20+",
      labelAr: "سنة خبرة",
      labelEn: "Years Experience",
    },
    {
      icon: Clock,
      value: "24/7",
      labelAr: "دعم العملاء",
      labelEn: "Customer Support",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors duration-300">
                  <Icon className="h-8 w-8 text-red-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {language === "ar" ? stat.labelAr : stat.labelEn}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}