"use client";

import { useStore } from "@/store/useStore";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

export function TestimonialsSection() {
  const { language } = useStore();

  const testimonials = [
    {
      nameAr: "أحمد محمد",
      nameEn: "Ahmed Mohammed",
      locationAr: "دبي، الإمارات",
      locationEn: "Dubai, UAE",
      reviewAr: "خدمة ممتازة وقطع غيار أصلية. حصلت على ما أحتاجه لسيارتي بسرعة وبجودة عالية.",
      reviewEn: "Excellent service and original spare parts. Got what I needed for my car quickly and with high quality.",
      rating: 5,
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
    },
    {
      nameAr: "سارة علي",
      nameEn: "Sara Ali",
      locationAr: "الشارقة، الإمارات",
      locationEn: "Sharjah, UAE",
      reviewAr: "أفضل محل لقطع غيار نيسان في المنطقة. الأسعار معقولة والخدمة سريعة.",
      reviewEn: "Best shop for Nissan spare parts in the region. Reasonable prices and fast service.",
      rating: 5,
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
    },
    {
      nameAr: "محمد خالد",
      nameEn: "Mohammed Khalid",
      locationAr: "أبوظبي، الإمارات",
      locationEn: "Abu Dhabi, UAE",
      reviewAr: "تعامل راقي وصدق في التعامل. أنصح الجميع بالتعامل مع كينج رود.",
      reviewEn: "Professional dealing and honesty. I recommend everyone to deal with King Road.",
      rating: 5,
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {language === "ar" ? "ماذا يقول عملاؤنا" : "What Our Customers Say"}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {language === "ar"
              ? "آراء عملائنا الكرام حول خدماتنا وجودة منتجاتنا"
              : "Our valued customers' opinions about our services and product quality"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-8 relative hover:shadow-lg transition-all duration-300 group hover:-translate-y-2"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <Quote className="h-4 w-4 text-red-600" />
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              {/* Review */}
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "{language === "ar" ? testimonial.reviewAr : testimonial.reviewEn}"
              </p>

              {/* Customer Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.image}
                    alt={language === "ar" ? testimonial.nameAr : testimonial.nameEn}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {language === "ar" ? testimonial.nameAr : testimonial.nameEn}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {language === "ar" ? testimonial.locationAr : testimonial.locationEn}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 bg-gray-50 rounded-full px-8 py-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-green-600" />
              <span className="font-semibold text-gray-900">
                {language === "ar" ? "موثوق" : "Trusted"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-500" />
              <span className="font-semibold text-gray-900">4.9/5</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">1000+</span>
              <span className="text-gray-600">
                {language === "ar" ? "مراجعة" : "Reviews"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}