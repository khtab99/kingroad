"use client";

import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CategorySection } from "@/components/CategorySection";
import { FeaturedProducts } from "@/components/products/FeaturedProducts";
import { SaleProducts } from "@/components/products/SaleProducts";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Header />
      <main>
        <HeroSection />
        <CategorySection />
        <FeaturedProducts limit={8} />
        {/* <SaleProducts limit={8} /> */}
      </main>
      <Footer />
    </div>
  );
}
