import "./globals.css";
import { AdminAuthProvider } from "@/contexts/admin-auth-context";
import type { Metadata } from "next";
import { Amiri, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LanguageProvider } from "@/components/providers/language-provider";
import { VendorAuthProvider } from "@/contexts/vendor-auth-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "kingroad Dashboard ",
  description: " dashboard for kingroad",
  keywords: ["vendor dashboard", "UAE", "e-commerce"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${amiri.variable} antialiased`}>
        <AdminAuthProvider>
          {children}
        </AdminAuthProvider>
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <VendorAuthProvider>
              {children}
              <Toaster />
            </VendorAuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
