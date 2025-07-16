"use client";

import { useStore } from "@/store/useStore";
import translations from "@/data/translations.json";
import Image from "next/image";

export function BrandSection() {
  const { language } = useStore();
  const t = translations[language];

  return <section className="bg-white py-6 md:py-8"></section>;
}
