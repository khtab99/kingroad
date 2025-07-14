import "./globals.css";
import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import { Toaster } from "sonner";

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
    <html>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={cairo.className}>
        {children}
        <Toaster position="top-center" richColors closeButton duration={3000} />
      </body>
    </html>
  );
}
