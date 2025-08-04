"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChevronRight, ChevronLeft, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const { language } = useStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid = () => {
    return formData.email.trim() && formData.password.trim();
  };

  const handleLogin = async () => {
    if (!isFormValid()) {
      toast.error(
        language === "ar" ? "يرجى ملء جميع الحقول" : "Please fill all fields"
      );
      return;
    }

    setIsLoading(true);

    // Simulate login API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success(
        language === "ar" ? "تم تسجيل الدخول بنجاح" : "Login successful"
      );
      router.push("/");
    }, 1500);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            {language === "ar" ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>

          <h1 className="text-lg font-medium text-gray-800">
            {language === "ar" ? "تسجيل الدخول" : "LOGIN"}
          </h1>

          <div></div>
        </div>

        {/* Subtitle */}
        <div className="text-center mb-8">
          <p className="text-gray-600">
            {language === "ar"
              ? "يرجى تسجيل الدخول إلى حسابك"
              : "Please login to your account"}
          </p>
        </div>

        {/* Login Form */}
        <div className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
              {language === "ar" ? "البريد الإلكتروني" : "Email"}
            </label>
            <div className="relative">
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder={
                  language === "ar"
                    ? "أدخل بريدك الإلكتروني"
                    : "Enter Your Email"
                }
                className="pl-10 text-left"
                dir="ltr"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
              {language === "ar" ? "كلمة المرور" : "Password"}
            </label>
            <div className="relative">
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder={
                  language === "ar" ? "أدخل كلمة المرور" : "Enter Your Password"
                }
                className="pl-10 text-left"
                dir="ltr"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            disabled={!isFormValid() || isLoading}
            className={`w-full py-3 text-lg font-medium rounded-md ${
              isFormValid() && !isLoading
                ? "bg-gray-600 hover:bg-gray-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {language === "ar" ? "جاري تسجيل الدخول..." : "Logging in..."}
              </div>
            ) : language === "ar" ? (
              "تسجيل الدخول"
            ) : (
              "LOGIN"
            )}
          </Button>

          {/* Forgot Password */}
          <div className="text-center">
            <button className="text-gray-600 hover:text-gray-800 text-sm">
              {language === "ar"
                ? "نسيت كلمة المرور؟"
                : "Forgot your password ?"}
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <span className="text-gray-600 text-sm">
              {language === "ar" ? "ليس لديك حساب؟" : "Don't have an account ?"}{" "}
            </span>
            <Link
              href="/register"
              className="text-gray-800 hover:text-gray-600 font-medium text-sm"
            >
              {language === "ar" ? "تسجيل" : "Register"}
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
