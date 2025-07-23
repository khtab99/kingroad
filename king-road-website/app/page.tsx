"use client";

import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CategorySection } from "@/components/CategorySection";
import { FeaturedProducts } from "@/components/products/FeaturedProducts";
import { Footer } from "@/components/Footer";
import { StatsSection } from "@/components/StatsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { WhyChooseUsSection } from "@/components/WhyChooseUsSection";
import { NewsletterSection } from "@/components/NewsletterSection";

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
