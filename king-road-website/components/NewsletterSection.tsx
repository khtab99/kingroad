"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Send, Gift } from "lucide-react";
import { toast } from "sonner";

export function NewsletterSection() {
  const { language } = useStore();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error(
        language === "ar" 
          ? "يرجى إدخال البريد الإلكتروني" 
          : "Please enter your email"
      );
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success(
        language === "ar"
          ? "تم الاشتراك بنجاح! ستحصل على خصم 10%"
          : "Successfully subscribed! You'll get 10% discount"
      );
      setEmail("");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section className="py-20 bg-gradient-to-r from-red-600 to-red-700 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/assets/images/pattern.svg')] bg-repeat"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center text-white">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Mail className="h-8 w-8 text-white" />
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              {language === "ar" 
                ? "اشترك في نشرتنا الإخبارية" 
                : "Subscribe to Our Newsletter"}
            </h2>
            
            <p className="text-xl text-red-100 max-w-2xl mx-auto mb-8">
              {language === "ar"
                ? "احصل على آخر العروض والمنتجات الجديدة مباشرة في بريدك الإلكتروني"
                : "Get the latest offers and new products directly in your email"}
            </p>

            {/* Benefits */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <Gift className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {language === "ar" ? "خصم 10%" : "10% Discount"}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <Mail className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {language === "ar" ? "عروض حصرية" : "Exclusive Offers"}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <Send className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {language === "ar" ? "منتجات جديدة" : "New Products"}
                </span>
              </div>
            </div>
          </div>

          {/* Newsletter Form */}
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
            <div className="flex gap-3">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  language === "ar" 
                    ? "أدخل بريدك الإلكتروني" 
                    : "Enter your email"
                }
                className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30 focus:border-white rounded-full"
                dir={language === "ar" ? "rtl" : "ltr"}
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-white text-red-600 hover:bg-gray-100 px-8 rounded-full font-semibold"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600" />
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    {language === "ar" ? "اشترك" : "Subscribe"}
                  </>
                )}
              </Button>
            </div>
            
            <p className="text-sm text-red-100 mt-4">
              {language === "ar"
                ? "لن نشارك بريدك الإلكتروني مع أي طرف ثالث"
                : "We won't share your email with any third party"}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}