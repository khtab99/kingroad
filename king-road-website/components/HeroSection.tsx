"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Shield, Truck, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { useGetSliderList } from "@/api/slider";
import { Skeleton } from "./ui/skeleton";
import { LoadingSpinner } from "./checkout/confirm/LoadingSpinner";

export function HeroSection() {
  const { language } = useStore();
  const router = useRouter();

  const { sliderList, sliderLoading, sliderError } = useGetSliderList();

  const features = [
    {
      icon: Shield,
      title: language === "ar" ? "ضمان الجودة" : "Quality Assured",
      subtitle: language === "ar" ? "قطع أصلية" : "Original Parts",
    },
    {
      icon: Truck,
      title: language === "ar" ? "توصيل سريع" : "Fast Delivery",
      subtitle: language === "ar" ? "خلال يومين" : "Within 2 Days",
    },
    {
      icon: Star,
      title: language === "ar" ? "خبرة 20 سنة" : "20 Years Experience",
      subtitle: language === "ar" ? "موثوق" : "Trusted",
    },
  ];

  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-red-50 overflow-hidden">
      <div className="relative max-w-7xl mx-auto  sm:px-6 py-0 md:py-8 lg:py-12">
        {/* Mobile Layout - Content on top of image */}
        <div className="block lg:hidden max-h-[40vh]  mx-auto">
          {sliderLoading && (
            <div className="w-full h-[40vh] ">
              <Skeleton className=" h-full w-full bg-black/10" />{" "}
              {/* <LoadingSpinner language={"ar"} /> */}
            </div>
          )}
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              bulletClass: "swiper-pagination-bullet !bg-red-600 ",
              bulletActiveClass: "swiper-pagination-bullet-active !bg-red-700",
            }}
            loop={true}
            className="relative rounded-sm  md:rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Slides Loading skeleton */}

            {sliderList.map((slide: any) => {
              const cleanImageUrl = slide?.image?.includes("assets/images/")
                ? slide.image.replace("http://localhost:8000", "")
                : slide?.image || "/assets/images/hero/1.jpg";

              return (
                <SwiperSlide key={slide.id}>
                  <div className="relative h-[30vh] ">
                    {/* Background Image */}
                    <Image
                      src={cleanImageUrl}
                      alt="Nissan Patrol Parts"
                      fill
                      className="object-contain"
                      priority={slide.id === 1}
                    />

                    {/* Overlay */}
                    {/* <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10"></div> */}

                    {/* Content Overlay */}
                    {(slide.title_ar || slide.title_en) && (
                      <div className="  absolute inset-0  flex flex-col justify-center items-center text-center m-12 rounded-md backdrop-blur-sm bg-gradient-to-b from-black/30 via-black/20 to-black/10 ">
                        {/* Title */}
                        <h1 className="text-2xl md:text-4xl font-bold text-white mb-1 leading-tight">
                          {/* <span className="text-red-400">KING ROAD</span> */}
                          <br />
                          <span className="text-white text-2xl">
                            {language === "ar"
                              ? slide.title_ar
                              : slide.title_en}
                          </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-md text-white/90 mb-8 leading-relaxed max-w-md">
                          {language === "ar"
                            ? slide.description_ar
                            : slide.description_en}
                        </p>
                      </div>
                    )}

                    {/* Floating Logo */}
                    <div className="absolute bottom-0 right-4 w-16 h-16 z-10">
                      <div className="w-full h-full bg-white rounded-full shadow-xl p-2 border-2 border-red-100">
                        <Image
                          src="/assets/images/logo.png"
                          alt="King Road Logo"
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* Desktop Layout - Side by side */}
        {sliderLoading && (
          <div className="w-full h-[70vh] lg:grid grid-cols-2 gap-12 items-center ">
            <Skeleton className=" h-full w-full bg-black/10" />{" "}
            <Skeleton className=" h-full w-full bg-black/10" />
            {/* <LoadingSpinner language={"ar"} /> */}
          </div>
        )}
        {sliderList.length > 0 && (
          <div className="hidden lg:grid grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div
              className={`${language === "ar" ? "text-right" : "text-left"}`}
            >
              <Swiper
                modules={[Autoplay]}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                loop={true}
                className="h-full"
              >
                {sliderList.map((slide: any) => (
                  <SwiperSlide key={slide.id}>
                    <div className="mb-6">
                      <span className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-800 text-sm font-medium mb-4">
                        <Star className="h-4 w-4 mr-2" />
                        {language === "ar"
                          ? "الأفضل في الإمارات"
                          : "Best in UAE"}
                      </span>

                      <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        <span className="text-red-600">KING ROAD</span>
                        <br />
                        <span className="text-gray-700">
                          {language === "ar" ? slide.title_ar : slide.title_en}
                        </span>
                      </h1>

                      <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        {language === "ar"
                          ? slide.description_ar
                          : slide.description_en}
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm"
                  >
                    <feature.icon className="h-8 w-8 text-red-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {feature.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-start">
                <Button
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                  onClick={() => router.push("/product")}
                >
                  {language === "ar" ? "تسوق الآن" : "Shop Now"}
                  {language === "ar" ? (
                    <ArrowLeft className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  ) : (
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </Button>

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

            {/* Right Content - Hero Image Slider */}
            <div className="relative">
              <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                effect="fade"
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                  bulletClass: "swiper-pagination-bullet !bg-red-600",
                  bulletActiveClass:
                    "swiper-pagination-bullet-active !bg-red-700",
                }}
                loop={true}
                className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl"
              >
                {sliderList.map((slide: any) => {
                  const cleanImageUrl = slide?.image?.includes("assets/images/")
                    ? slide.image.replace("http://localhost:8000", "")
                    : slide?.image || "/assets/images/hero/1.jpg";
                  return (
                    <SwiperSlide key={slide.id}>
                      <div className="relative w-full h-full">
                        <Image
                          src={cleanImageUrl}
                          alt="Nissan Patrol Parts"
                          fill
                          className="object-contain scale-110"
                          priority={slide.id === 1}
                        />
                        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div> */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="text-white/70 text-4xl md:text-8xl font-bold tracking-wider transform rotate-12">
                            {language === "ar" ? "كينج رود" : "KING ROAD"}
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>

              {/* Floating Logo */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 z-10">
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
              <div className="absolute top-6 -left-6 bg-white rounded-xl z-10 shadow-lg p-4 border border-gray-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">500+</div>
                  <div className="text-sm text-gray-600">
                    {language === "ar" ? "منتج" : "Products"}
                  </div>
                </div>
              </div>

              <div className="absolute bottom-20 -left-6 bg-white rounded-xl z-10 shadow-lg p-4 border border-gray-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">1000+</div>
                  <div className="text-sm text-gray-600">
                    {language === "ar" ? "عميل راضي" : "Happy Customers"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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
