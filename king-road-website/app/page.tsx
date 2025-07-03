"use client";

import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CategorySection } from "@/components/CategorySection";
import { DeliverySection } from "@/components/DeliverySection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Header />
      <main>
        <HeroSection />
        {/* <DeliverySection /> */}
        <CategorySection />
      </main>
      <Footer />
    </div>
  );
}
