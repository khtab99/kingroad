"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChevronRight, ChevronLeft, Mail, User, Phone, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function RegisterPage() {
  const { language } = useStore();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    country: "United Arab Emirates",
    phone: "",
    name: "",
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
    return (
      formData.country.trim() &&
      formData.phone.trim() &&
      formData.name.trim() &&
      formData.email.trim() &&
      formData.password.trim()
    );
  };

  const handleRegister = async () => {
    if (!isFormValid()) {
      toast.error(
        language === "ar" 
          ? "يرجى ملء جميع الحقول" 
          : "Please fill all fields"
      );
      return;
    }

    setIsLoading(true);
    
    // Simulate register API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success(
        language === "ar" 
          ? "تم إنشاء الحساب بنجاح" 
          : "Account created successfully"
      );
      router.push("/login");
    }, 1500);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

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
            {language === "ar" ? "إنشاء حساب" : "CREATE AN ACCOUNT"}
          </h1>

          <div></div>
        </div>

        {/* Register Form */}
        <div className="space-y-6">
          {/* Country Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
              {language === "ar" ? "البلد" : "Country"}
            </label>
            <div className="relative">
              <select
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-left bg-white appearance-none pr-10"
              >
                <option value="United Arab Emirates">United Arab Emirates</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="Kuwait">Kuwait</option>
                <option value="Qatar">Qatar</option>
                <option value="Bahrain">Bahrain</option>
                <option value="Oman">Oman</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Mobile Number Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
              {language === "ar" ? "رقم الهاتف" : "Mobile Number"}
            </label>
            <div className="relative">
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder={
                  language === "ar" 
                    ? "أدخل رقم هاتفك" 
                    : "Enter Your Mobile Number"
                }
                className="pl-16 text-left"
                dir="ltr"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm border-r border-gray-300 pr-2">
                +971
              </div>
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
              {language === "ar" ? "الاسم" : "Name"}
            </label>
            <div className="relative">
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder={
                  language === "ar" 
                    ? "أدخل اسمك" 
                    : "Enter Your Name"
                }
                className="pl-10 text-left"
                dir="ltr"
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

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
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder={
                language === "ar" 
                  ? "أدخل كلمة المرور" 
                  : "Enter Your Password"
              }
              className="text-left"
              dir="ltr"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleRegister}
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
                {language === "ar" ? "جاري الإنشاء..." : "Creating..."}
              </div>
            ) : (
              language === "ar" ? "تأكيد" : "SUBMIT"
            )}
          </Button>

          {/* Terms & Conditions */}
          <div className="text-center text-sm text-gray-600">
            {language === "ar" ? "بالتسجيل أنت توافق على" : "By registering you agree to our"}
            <br />
            <button className="text-gray-800 hover:text-gray-600 underline">
              {language === "ar" ? "الشروط والأحكام" : "Terms & Conditions"}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}