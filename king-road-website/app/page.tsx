"use client";

import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CategorySection } from "@/components/CategorySection";
import { FeaturedProducts } from "@/components/products/FeaturedProducts";
import { StatsSection } from "@/components/StatsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { WhyChooseUsSection } from "@/components/WhyChooseUsSection";
import { useStore } from "@/store/useStore";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CategorySection />
      <FeaturedProducts limit={8} />
      <StatsSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      {/* <NewsletterSection /> */}
    </main>
  );
}
