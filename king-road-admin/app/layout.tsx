import './globals.css';
import type { Metadata } from 'next';
import { Amiri, Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { LanguageProvider } from '@/components/providers/language-provider';
import { VendorAuthProvider } from '@/contexts/vendor-auth-context';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const amiri = Amiri({ 
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Kora Vendor Dashboard - Sudanese Marketplace',
  description: 'Vendor dashboard for Kora - the trusted marketplace for Sudanese products in the UAE',
  keywords: ['Sudanese marketplace', 'vendor dashboard', 'UAE', 'e-commerce'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${amiri.variable} antialiased`}>
        <ThemeProvider
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