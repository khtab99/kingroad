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
    <div className="min-h-screen bg-white overflow-hidden">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <CategorySection />
        <FeaturedProducts limit={8} />
        <WhyChooseUsSection />
        <TestimonialsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}