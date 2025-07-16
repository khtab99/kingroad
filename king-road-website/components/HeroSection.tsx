"use client";

import Image from "next/image";
import { useStore } from "@/store/useStore";

export function HeroSection() {
  const { language } = useStore();

  return (
    <section className="bg-background w-screen py-6   ">
      <div className="mx-auto relative">
        {/* Hero Images Grid */}
        <div className="grid grid-cols-1 gap-1 md:gap-4 relative ">
          <div className="relative w-screen h-[200px] md:h-[400px] xl:h-[600px]  overflow-hidden ">
            <Image
              src="/assets/images/hero.jpg"
              alt="Nissan Patrol Front View"
              fill
              className="object-contain p-8 md:p-12"
              priority
            />
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-white/50 text-4xl md:text-8xl font-bold tracking-wider transform rotate-12">
              {language === "ar" ? "كينج رود" : "KING ROAD"}
            </div>
          </div>

          {/* Logo */}

          {/* Brand Name */}
        </div>

        {/* <h1 className="text-2xl md:text-3xl font-bold text-red-700 mb-0 ">
            {"KING ROAD"}
          </h1> */}

        <Image
          src="/assets/images/logo.png"
          alt="Logo"
          width={300}
          height={300}
          className="shadow-lg absolute -bottom-6 right-6  md:right-10   w-16 h-16 md:w-28 md:h-28  lg:w-32 lg:h-32 xl:w-40 xl:h-40  rounded-full "
        ></Image>
      </div>
    </section>
  );
}
