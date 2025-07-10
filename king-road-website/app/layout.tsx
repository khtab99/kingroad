import "./globals.css";
import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });
const cairo = Cairo({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "King Road - Car Spare Parts",
  description:
    "King Road Car Spare Parts in Umm Al Quwain, UAE - Classic Nissan Parts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico" />
      <body className={inter.className + " " + cairo.className}>
        {children}
        <Toaster />
        <SonnerToaster position="top-right" />
      </body>
    </html>
  );
}