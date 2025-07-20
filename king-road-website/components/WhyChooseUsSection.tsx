"use client";

import { useStore } from "@/store/useStore";
import { Shield, Truck, Headphones, Award, Clock, MapPin } from "lucide-react";
import Image from "next/image";

export function WhyChooseUsSection() {
  const { language } = useStore();

  const features = [
    {
      icon: Shield,
      titleAr: "ضمان الجودة",
      titleEn: "Quality Guarantee",
      descAr: "جميع قطع الغيار أصلية ومضمونة",
      descEn: "All spare parts are original and guaranteed",
    },
    {
      icon: Truck,
      titleAr: "توصيل سريع",
      titleEn: "Fast Delivery",
      descAr: "توصيل مجاني خلال يومين في الإمارات",
      descEn: "Free delivery within 2 days in UAE",
    },
    {
      icon: Headphones,
      titleAr: "دعم العملاء",
      titleEn: "Customer Support",
      descAr: "فريق دعم متخصص متاح 24/7",
      descEn: "Expert support team available 24/7",
    },
    {
      icon: Award,
      titleAr: "خبرة 20 سنة",
      titleEn: "20 Years Experience",
      descAr: "خبرة طويلة في قطع غيار نيسان",
      descEn: "Long experience in Nissan spare parts",
    },
    {
      icon: Clock,
      titleAr: "خدمة سريعة",
      titleEn: "Quick Service",
      descAr: "معالجة سريعة للطلبات والاستفسارات",
      descEn: "Quick processing of orders and inquiries",
    },
    {
      icon: MapPin,
      titleAr: "موقع مميز",
      titleEn: "Prime Location",
      descAr: "موقع استراتيجي في أم القيوين",
      descEn: "Strategic location in Umm Al Quwain",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {language === "ar" ? "لماذا تختار كينج رود؟" : "Why Choose King Road?"}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {language === "ar"
              ? "نحن نقدم أفضل قطع الغيار الأصلية مع خدمة عملاء استثنائية وضمان الجودة"
              : "We provide the best original spare parts with exceptional customer service and quality guarantee"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors duration-300">
                  <Icon className="h-8 w-8 text-red-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {language === "ar" ? feature.titleAr : feature.titleEn}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {language === "ar" ? feature.descAr : feature.descEn}
                </p>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === "ar" ? "هل تحتاج مساعدة؟" : "Need Help?"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {language === "ar"
                    ? "فريقنا المتخصص جاهز لمساعدتك في العثور على القطعة المناسبة"
                    : "Our expert team is ready to help you find the right part"}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a
                    href="tel:+971501234567"
                    className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    <Headphones className="h-5 w-5 mr-2" />
                    {language === "ar" ? "اتصل بنا" : "Call Us"}
                  </a>
                  <a
                    href="https://wa.me/971501234567"
                    className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                  >
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    {language === "ar" ? "واتساب" : "WhatsApp"}
                  </a>
                </div>
              </div>
              <div className="relative h-48 lg:h-64">
                <Image
                  src="/assets/images/logo.png"
                  alt="King Road Support"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}