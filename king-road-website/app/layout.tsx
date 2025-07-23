"use client";
import { Header } from "@/components/Header";
import "./globals.css";
import type { Metadata } from "next";
import { Amiri, Cairo, Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Footer } from "@/components/Footer";
import { useStore } from "@/store/useStore";

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cairo",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = useStore();
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>King Road</title>
      </head>
      <body
        className={`${amiri.variable} ${cairo.variable} ${inter.variable} font-sans antialiased`}
      >
        <div
          className="min-h-screen bg-gray-50 "
          style={{ direction: language === "ar" ? "rtl" : "ltr" }}
        >
          <Header />
          {children}
          <Footer />
        </div>
        <Toaster position="top-center" richColors closeButton duration={3000} />
      </body>
    </html>
  );
}
